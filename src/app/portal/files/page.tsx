import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "./files.module.css";
import FileUploadForm from "./FileUploadForm";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FileIcon, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { formatBytes } from "@/lib/utils";

export default async function UserFiles() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const files = await prisma.userFile.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Secure File Drop</h1>
          <p>Need to send us a document, photo, or screenshot? Upload it here securely.</p>
        </div>

        <section className={styles.uploadSection}>
          <FileUploadForm />
        </section>

        <section className={styles.filesList}>
          <h2>Your Uploaded Files</h2>
          {files.length === 0 ? (
            <p className={styles.empty}>You haven&apos;t uploaded any files yet.</p>
          ) : (
            <div className={styles.grid}>
              {files.map((file) => (
                <div key={file.id} className={styles.card}>
                  <div className={styles.fileInfo}>
                    <FileIcon className={styles.icon} />
                    <div className={styles.details}>
                      <span className={styles.name}>{file.name}</span>
                      <span className={styles.meta}>
                        {formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <a href={file.url} download className={styles.actionBtn} title="Download">
                      <Download size={18} />
                    </a>
                    {/* Delete button logic would go in a client component or form */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={{ marginTop: '2rem' }}>
          <Link href="/portal" className="btn btn-outline">Back to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
