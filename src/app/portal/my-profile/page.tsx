import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./profile-edit.module.css";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProfileFormClient from "./ProfileFormClient";

export const metadata = {
  title: "My Profile | Consider IT Fixed",
};

async function updateProfile(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const dob = formData.get("dob") as string;
  const preferredContactMethod = formData.get("preferredContactMethod") as string;
  
  const deviceTypesArray = formData.getAll("deviceTypes") as string[];
  const deviceTypes = deviceTypesArray.join(", ");
  
  const marketingConsent = formData.get("marketingConsent") === "on";

  if (!name || !address || !phone) {
    throw new Error("Please fill out your Name, Address, and Phone Number.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name,
      address,
      phone,
      dob,
      deviceTypes,
      preferredContactMethod,
      marketingConsent
    }
  });

  revalidatePath('/portal/my-profile');
  redirect("/portal?success=profile_updated");
}

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} userName={user?.name} />

      <main className={styles.main}>
        <Breadcrumbs items={[{ label: 'My Profile' }]} />
        <div className={styles.formCard}>
          <h1>My Profile Settings</h1>
          <p className={styles.description}>
            Update your personal details and communication preferences below.
          </p>

          <ProfileFormClient user={user} updateProfileAction={updateProfile} />
        </div>
      </main>
    </div>
  );
}