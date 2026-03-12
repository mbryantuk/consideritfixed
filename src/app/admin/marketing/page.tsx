import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";
import MarkdownEditor from "@/components/MarkdownEditor";
import { logAudit } from "@/lib/utils";
import { Resend } from "resend";

export const metadata = {
  title: "Bulk Marketing | Admin",
};

async function sendBulkEmail(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  const recipients = await prisma.user.findMany({
    where: { marketingConsent: true },
    select: { email: true }
  });

  if (recipients.length === 0) return;

  console.log(`[Marketing] Sending bulk email "${subject}" to ${recipients.length} users.`);

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    const FROM_EMAIL = process.env.EMAIL_FROM || "Consider IT Fixed <onboarding@resend.dev>";

    // In a real production app, you'd use a background job or batching
    // For now, we'll send to all (Resend handles moderate volume well)
    for (const user of recipients) {
      if (user.email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: subject,
          html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                  ${content.replace(/\n/g, '<br/>')}
                  <hr style="margin-top: 2rem; border: 0; border-top: 1px solid #eee;" />
                  <p style="font-size: 0.8rem; color: #666;">
                    You are receiving this because you opted in to tech tips from Consider IT Fixed. 
                    <a href="https://consideritfixed.uk/portal/profile">Unsubscribe here</a>
                  </p>
                </div>`,
        });
      }
    }
  }

  await logAudit(session.user.id, "SEND_BULK_EMAIL", "User", "Marketing", { subject, count: recipients.length });
  
  redirect("/admin/marketing?success=true");
}

export default async function AdminMarketing(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const optInCount = await prisma.user.count({
    where: { marketingConsent: true }
  });

  const success = searchParams.success === 'true';

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Local Tech Alerts (Bulk Email)</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        {success && (
          <div className={styles.successAlert}>
            Bulk email has been queued for delivery!
          </div>
        )}

        <section className={styles.requestsSection}>
          <div className={styles.card}>
            <h3>Compose Message</h3>
            <p>Your message will be sent to <strong>{optInCount}</strong> subscribers.</p>
            
            <form action={sendBulkEmail} className={styles.form} style={{ marginTop: '20px' }}>
              <div className={styles.inputGroup}>
                <label htmlFor="subject">Email Subject</label>
                <input id="subject" name="subject" required placeholder="e.g. SCAM ALERT: Watch out for fake TV Licensing emails" className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Email Content (Basic HTML supported)</label>
                <MarkdownEditor name="content" initialValue="" />
              </div>

              <div className={styles.actions} style={{ marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" onSubmit={(e) => { if(!confirm(`Send this to ${optInCount} users?`)) e.preventDefault(); }}>
                  🚀 Blast to All Subscribers
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
