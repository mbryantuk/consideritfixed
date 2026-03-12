import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import styles from "./feedback.module.css";
import Link from "next/link";

export const metadata = {
  title: "Leave Feedback | Consider IT Fixed",
};

async function submitFeedback(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const requestId = formData.get("requestId") as string;
  const text = formData.get("text") as string;
  const stars = parseInt(formData.get("stars") as string) || 5;

  if (!text) throw new Error("Please enter your feedback.");

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true }
  });

  if (!request || request.userId !== session.user.id) {
    throw new Error("Unauthorized.");
  }

  await prisma.testimonial.create({
    data: {
      author: request.user.name || "A Neighbor",
      location: request.user.address?.split(',').pop()?.trim() || "Felpham",
      text,
      stars,
      approved: false, // Feedback needs to be approved first
    }
  });

  redirect(`/portal/requests/${requestId}?success=feedback_submitted`);
}

export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const resolvedParams = await params;
  const request = await prisma.request.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!request || request.userId !== session.user.id) {
    redirect("/portal");
  }

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.card}>
          <h1>How did I do?</h1>
          <p>Your feedback helps me improve and helps your neighbors know they can trust <span className="notranslate">Consider IT Fixed</span>. Thank you for your support!</p>
          
          <form action={submitFeedback} className={styles.form}>
            <input type="hidden" name="requestId" value={request.id} />
            
            <div className={styles.inputGroup}>
              <label htmlFor="stars">Rating</label>
              <select id="stars" name="stars" defaultValue="5" className={styles.input}>
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Okay</option>
                <option value="1">1 Star - Poor</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="text">Your Comments</label>
              <textarea 
                id="text" 
                name="text" 
                rows={5} 
                required 
                placeholder="What did you think of the service?"
                className={styles.textarea}
              />
            </div>

            <div className={styles.actions}>
              <Link href={`/portal/requests/${request.id}`} className="btn btn-secondary">Cancel</Link>
              <button type="submit" className="btn btn-primary">Submit Feedback</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}