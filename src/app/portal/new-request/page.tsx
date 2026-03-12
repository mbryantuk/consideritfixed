import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateFriendlyId } from "@/lib/friendly-id";
import { saveFileUpload } from "@/lib/upload";
import styles from "./new-request.module.css";
import Header from "@/components/Header";
import NewRequestForm from "./NewRequestForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { sendTicketConfirmation, sendAdminNewTicketAlert } from "@/lib/mail";

export const metadata = {
  title: "Log a Request | Consider IT Fixed",
  description: "Submit a new tech support request.",
};

async function createRequest(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const availability = formData.get("availability") as string;
  const referralCode = formData.get("referralCode") as string;
  const attachmentFile = formData.get("attachmentFile") as File | null;

  if (!title || !description) {
    throw new Error("Please fill out all required fields.");
  }

  const attachmentUrl = await saveFileUpload(attachmentFile);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const friendlyId = await generateFriendlyId();

  const request = await prisma.request.create({
    data: {
      friendlyId,
      title,
      description,
      availability,
      referralCode,
      attachmentUrl,
      userId: session.user.id,
    },
  });

  // Send Email Notifications
  if (user?.email) {
    await sendTicketConfirmation(user.email, user.name || "Customer", title, request.id);
    await sendAdminNewTicketAlert(title, user.name || user.email, request.id);
  }

  redirect("/portal/new-request/success");
}

export default async function NewRequest() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user?.profileComplete) {
    redirect("/portal/profile");
  }

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} userName={user?.name} />

      <main className={styles.main}>
        <Breadcrumbs items={[{ label: 'New Support Request' }]} />
        <div className={styles.formCard}>
          <h1>How can we help you?</h1>
          <p className={styles.description}>
            Please describe your problem or the service you need below. We will review it and get back to you with advice or a quote shortly.
          </p>

          <NewRequestForm createRequestAction={createRequest} />
        </div>
      </main>
    </div>
  );
}