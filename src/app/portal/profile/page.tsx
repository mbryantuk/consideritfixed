import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";
import styles from "./profile.module.css";
import Header from "@/components/Header";
import { z } from "zod";
import { logAudit } from "@/lib/utils";
import { encrypt, decrypt } from "@/lib/crypto";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  address: z.string().min(5, "Please provide a more complete address."),
  phone: z.string().min(10, "Please provide a valid phone number."),
  dob: z.string().optional(),
  preferredContactMethod: z.enum(["Email", "Phone", "WhatsApp"]),
  deviceTypes: z.string(),
  marketingConsent: z.boolean(),
});

export const metadata = {
  title: "Complete Your Profile | Consider IT Fixed",
};

async function saveProfile(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const rawData = {
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    dob: formData.get("dob"),
    preferredContactMethod: formData.get("preferredContactMethod"),
    deviceTypes: (formData.getAll("deviceTypes") as string[]).join(", "),
    marketingConsent: formData.get("marketingConsent") === "on",
  };

  const validatedData = profileSchema.safeParse(rawData);

  if (!validatedData.success) {
    throw new Error(validatedData.error.issues[0].message);
  }

  const { name, address, phone, dob, preferredContactMethod, deviceTypes, marketingConsent } = validatedData.data;

  // Attempt to extract postcode and get coordinates
  let latitude = null;
  let longitude = null;
  const postcodeMatch = address.match(/[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}/i);
  if (postcodeMatch) {
    const postcode = postcodeMatch[0];
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
      const data = await res.json();
      if (data.status === 200) {
        latitude = data.result.latitude;
        longitude = data.result.longitude;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error("Failed to fetch coordinates for postcode:", postcode);
    }
  }

  const oldUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (oldUser && oldUser.marketingConsent !== marketingConsent) {
    console.log(`[Marketing Sync] User ${session.user.email} changed consent to: ${marketingConsent}`);
    await logAudit(session.user.id, "UPDATE_MARKETING_CONSENT", "User", "Profile", { consent: marketingConsent });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name,
      address: encrypt(address),
      latitude,
      longitude,
      phone: encrypt(phone),
      dob: dob ? encrypt(dob) : null,
      deviceTypes,
      preferredContactMethod,
      marketingConsent,
      profileComplete: true
    }
  });

  redirect("/portal");
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  // Decrypt PII for the form fields
  const decryptedUser = user ? {
    ...user,
    address: user.address ? decrypt(user.address) : "",
    phone: user.phone ? decrypt(user.phone) : "",
    dob: user.dob ? decrypt(user.dob) : ""
  } : null;

  if (user?.profileComplete) {
    redirect("/portal");
  }

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.formCard}>
          <h1>Complete Your Profile</h1>
          <p className={styles.description}>
            Before you can log a request, we need a few details to ensure we can contact you and provide the best support.
          </p>

          <form action={saveProfile} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name *</label>
              <input id="name" name="name" type="text" required defaultValue={decryptedUser?.name || ""} className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input id="phone" name="phone" type="tel" required defaultValue={decryptedUser?.phone || ""} className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="address">Home Address *</label>
              <textarea id="address" name="address" rows={3} required defaultValue={decryptedUser?.address || ""} className={styles.textarea} placeholder="E.g. 123 High Street, Felpham, PO22 7XX" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="dob" className={styles.labelWithTooltip}>
                Date of Birth (Optional)
                <span className={styles.tooltipIcon} title="This helps us tailor our advice to your needs and automatically apply our local community discounts.">ⓘ</span>
              </label>
              <input id="dob" name="dob" type="date" defaultValue={decryptedUser?.dob || ""} className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="deviceTypes">What devices do you mainly use? (Optional)</label>
              <div className={styles.deviceCheckboxes}>
                {[
                  "Windows PC / Laptop",
                  "Apple Mac (MacBook, iMac)",
                  "Apple iPhone",
                  "Apple iPad",
                  "Android Phone",
                  "Android Tablet",
                  "Smart TV / Streaming Device",
                  "Smart Home (Alexa, Nest, etc.)",
                  "Gaming Consoles (PlayStation, Xbox, Nintendo)",
                  "Printer / Scanner"
                ].map((device) => (
                  <label key={device} className={styles.deviceLabel}>
                    <input
                      type="checkbox"
                      name="deviceTypes"
                      value={device}
                      defaultChecked={decryptedUser?.deviceTypes?.includes(device)}
                      className={styles.checkbox}
                    />
                    {device}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="preferredContactMethod">Preferred Contact Method</label>
              <select id="preferredContactMethod" name="preferredContactMethod" className={styles.input} defaultValue={decryptedUser?.preferredContactMethod || "Email"}>
                <option value="Email">Email</option>
                <option value="Phone">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
            
            <div className={styles.checkboxGroup}>
              <input id="marketingConsent" name="marketingConsent" type="checkbox" defaultChecked={decryptedUser?.marketingConsent || false} className={styles.checkbox} />
              <label htmlFor="marketingConsent">
                I agree to receive occasional emails with local tech tips and offers (you can opt out anytime).
              </label>
            </div>

            <button type="submit" className={`btn-primary ${styles.submitButton}`}>
              Save Profile & Continue
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
