import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import MarkdownEditor from "@/components/MarkdownEditor";
import styles from "./settings.module.css";
import Link from "next/link";
import { logAudit } from "@/lib/utils";
import { saveFileUpload } from "@/lib/upload";

export const metadata = {
  title: "Site Settings CMS | Admin",
};

async function updateSettings(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const entries = Array.from(formData.entries());
  
  // Track changes for audit
  const updatedKeys = [];

  for (const [key, value] of entries) {
    if (key.startsWith('$') || key.endsWith('File')) continue; // Skip internal Next.js fields and file inputs
    
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
    updatedKeys.push(key);
  }

  const aboutPictureFile = formData.get("aboutPictureFile") as File;
  if (aboutPictureFile && aboutPictureFile.size > 0) {
    const uploadedPath = await saveFileUpload(aboutPictureFile);
    if (uploadedPath) {
      await prisma.siteSetting.upsert({
        where: { key: "aboutPicture" },
        update: { value: uploadedPath },
        create: { key: "aboutPicture", value: uploadedPath }
      });
      updatedKeys.push("aboutPicture");
    }
  }

  const imageKeys = ["homeHeroImageFile", "serviceHeroImageFile", "aboutHeroImageFile"];
  for (const imageKey of imageKeys) {
    const file = formData.get(imageKey) as File;
    if (file && file.size > 0) {
      const uploadedPath = await saveFileUpload(file);
      if (uploadedPath) {
        const settingKey = imageKey.replace("File", "");
        await prisma.siteSetting.upsert({
          where: { key: settingKey },
          update: { value: uploadedPath },
          create: { key: settingKey, value: uploadedPath }
        });
        updatedKeys.push(settingKey);
      }
    }
  }

  // Handle checkboxes (if not present in formData, they are off)
  const checkboxes = ['showCalendar', 'holidayMode'];
  for (const cb of checkboxes) {
    if (!formData.has(cb)) {
      await prisma.siteSetting.upsert({
        where: { key: cb },
        update: { value: 'off' },
        create: { key: cb, value: 'off' }
      });
    }
  }

  await logAudit(session.user.id, "UPDATE_SITE_SETTINGS", "SiteSettings", "Config", { keys: updatedKeys });

  revalidatePath('/');
  revalidatePath('/admin/settings');
  redirect("/admin/settings?success=true");
}

export default async function AdminSettings(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const settingsList = await prisma.siteSetting.findMany();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = settingsList.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const success = searchParams.success === 'true';

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Site Configuration (CMS)</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        {success && (
          <div className={styles.successAlert}>
            Settings updated successfully! Changes are now live.
          </div>
        )}

        <form action={updateSettings} className={styles.form}>
          <div className={styles.grid}>
            <section className={styles.card}>
              <h2>Identity & Branding</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="siteName">Business Name</label>
                <input id="siteName" name="siteName" defaultValue={settings.siteName || "Consider IT Fixed"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="siteTagline">Slogan / Tagline</label>
                <input id="siteTagline" name="siteTagline" defaultValue={settings.siteTagline || "Friendly, Local Tech Support"} className={styles.input} />
              </div>
            </section>

            <section className={styles.card}>
              <h2>Contact Information</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="phoneNumber">Phone Number (Display)</label>
                <input id="phoneNumber" name="phoneNumber" defaultValue={settings.phoneNumber || "07419 738500"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phoneTel">Phone Number (Link - No Spaces)</label>
                <input id="phoneTel" name="phoneTel" defaultValue={settings.phoneTel || "07419738500"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="whatsappNumber">WhatsApp (intl format)</label>
                <input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsappNumber || "447419738500"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="contactEmail">Contact Email Address</label>
                <input type="email" id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail || "hello@consideritfixed.co.uk"} className={styles.input} />
              </div>
            </section>

            <section className={styles.card}>
              <h2>Page Background Images</h2>
              <p className={styles.note} style={{ marginBottom: '1rem' }}>Upload images to customize the hero backgrounds on various pages.</p>
              
              <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="homeHeroImageFile">Home Page Hero Image</label>
                <input type="file" id="homeHeroImageFile" name="homeHeroImageFile" accept="image/*" className={styles.input} style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }} />
                {settings.homeHeroImage && (
                  <p className={styles.note} style={{ marginTop: '0.5rem' }}>
                    Current image: <a href={settings.homeHeroImage} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View Image</a>
                  </p>
                )}
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="serviceHeroImageFile">Service Pages Hero Image</label>
                <input type="file" id="serviceHeroImageFile" name="serviceHeroImageFile" accept="image/*" className={styles.input} style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }} />
                {settings.serviceHeroImage && (
                  <p className={styles.note} style={{ marginTop: '0.5rem' }}>
                    Current image: <a href={settings.serviceHeroImage} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View Image</a>
                  </p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="aboutHeroImageFile">About Page Hero Background</label>
                <input type="file" id="aboutHeroImageFile" name="aboutHeroImageFile" accept="image/*" className={styles.input} style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }} />
                {settings.aboutHeroImage && (
                  <p className={styles.note} style={{ marginTop: '0.5rem' }}>
                    Current image: <a href={settings.aboutHeroImage} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View Image</a>
                  </p>
                )}
              </div>
            </section>

            <section className={styles.card}>
              <h2>Business Hours</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="hoursMonFri">Monday - Friday</label>
                <input id="hoursMonFri" name="hoursMonFri" defaultValue={settings.hoursMonFri || "09:00 - 17:30"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="hoursSat">Saturday</label>
                <input id="hoursSat" name="hoursSat" defaultValue={settings.hoursSat || "10:00 - 14:00"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="hoursSun">Sunday</label>
                <input id="hoursSun" name="hoursSun" defaultValue={settings.hoursSun || "Closed"} className={styles.input} />
              </div>
            </section>

            <section className={styles.card}>
              <h2>Operations & Availability</h2>
              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel} style={{ background: 'var(--alert-bg)', padding: '10px', borderRadius: '4px', border: '1px solid var(--alert-border)' }}>
                  <input type="checkbox" name="holidayMode" defaultChecked={settings.holidayMode === 'on'} />
                  <strong>Holiday Mode (Emergency Only)</strong>
                </label>
                <p className={styles.note}>When active, a banner appears and standard bookings may be disabled.</p>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="holidayMessage">Holiday Banner Message</label>
                <input id="holidayMessage" name="holidayMessage" defaultValue={settings.holidayMessage || "Away for 1 week. Emergency support only."} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="showCalendar" defaultChecked={settings.showCalendar === 'on'} />
                  Show &quot;Community Workshops&quot; section on homepage
                </label>
              </div>
            </section>

            <section className={styles.card}>
              <h2>Location & Presence</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="businessAddress">Footer Address</label>
                <textarea id="businessAddress" name="businessAddress" defaultValue={settings.businessAddress || "Felpham, Bognor Regis, West Sussex, PO22"} className={styles.textarea} rows={3} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="servingSince">Serving Since (Year)</label>
                <input id="servingSince" name="servingSince" defaultValue={settings.servingSince || "2010"} className={styles.input} />
              </div>
            </section>

            <section className={styles.card} style={{ gridColumn: '1 / -1' }}>
              <h2>About Me Content (Markdown)</h2>
              <p className={styles.note} style={{ marginBottom: '1rem' }}>This content appears on your specialized &quot;About Us&quot; page.</p>

              <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="aboutTitle">Hero Title</label>
                <input id="aboutTitle" name="aboutTitle" defaultValue={settings.aboutTitle || "Hi, I'm Matt"} className={styles.input} />
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="aboutSubtitle">Hero Subtitle</label>
                <input id="aboutSubtitle" name="aboutSubtitle" defaultValue={settings.aboutSubtitle || "Your friendly, local tech expert in Felpham and Bognor Regis."} className={styles.input} />
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="aboutPictureFile">Profile Picture (Upload Image)</label>
                <input type="file" id="aboutPictureFile" name="aboutPictureFile" accept="image/*" className={styles.input} style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }} />
                {settings.aboutPicture && (
                  <p className={styles.note} style={{ marginTop: '0.5rem' }}>
                    Current picture: <a href={settings.aboutPicture} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View Image</a>
                  </p>
                )}
              </div>

              <MarkdownEditor name="aboutContent" initialValue={settings.aboutContent || ""} />
            </section>

            <section className={styles.card}>
              <h2>Search Engine Optimization (SEO)</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="metaTitle">Home Meta Title</label>
                <input id="metaTitle" name="metaTitle" defaultValue={settings.metaTitle || "Consider IT Fixed | Friendly, Local Tech Support in Felpham"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="metaDescription">Home Meta Description</label>
                <textarea id="metaDescription" name="metaDescription" defaultValue={settings.metaDescription || "Reliable, jargon-free tech support, device setup, and home networking assistance in Felpham and Bognor Regis. No fix, no fee."} className={styles.textarea} rows={3} />
              </div>
            </section>

            <section className={styles.card}>
              <h2>External Links</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="calendlyUrl">Calendly Link</label>
                <input id="calendlyUrl" name="calendlyUrl" defaultValue={settings.calendlyUrl || "https://calendly.com/consideritfixed-support"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="facebookUrl">Facebook Page URL</label>
                <input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl || "https://facebook.com/consideritfixed"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="linkedinUrl">LinkedIn Profile URL</label>
                <input id="linkedinUrl" name="linkedinUrl" defaultValue={settings.linkedinUrl || "https://www.linkedin.com/in/matthew-bryant-3407061b/"} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="nextdoorUrl">Nextdoor Page URL</label>
                <input id="nextdoorUrl" name="nextdoorUrl" defaultValue={settings.nextdoorUrl || "https://nextdoor.co.uk/pages/consideritfixed-felpham"} className={styles.input} />
              </div>
            </section>
          </div>

          <div className={styles.actions}>
            <button type="submit" className="btn btn-primary">Save All Configuration</button>
          </div>
        </form>
      </main>
    </div>
  );
}