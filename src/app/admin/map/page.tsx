import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";

export const metadata = {
  title: "Customer Map | Admin",
};

export default async function AdminMap() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const users = await prisma.user.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      name: true
    }
  });

  // Bognor Regis area bounding box (approx)
  // Lat: 50.77 to 50.82
  // Lng: -0.72 to -0.60
  const minLat = 50.77;
  const maxLat = 50.82;
  const minLng = -0.72;
  const maxLng = -0.60;

  const getPos = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Customer Distribution Map</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.card}>
          <h3>Service Hotspots (Bognor Regis & Felpham)</h3>
          <p className={styles.mutedText}>This map shows the approximate locations of registered customers based on their postcodes.</p>
          
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '2/1', 
            background: 'var(--bg-secondary)', 
            borderRadius: '12px', 
            marginTop: '20px',
            border: '1px solid var(--border-light)',
            overflow: 'hidden'
          }}>
            {/* Simple Grid/Map Background */}
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ opacity: 0.1 }}>
              <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="0.1" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.1" />
              <line x1="20" y1="0" x2="20" y2="50" stroke="currentColor" strokeWidth="0.1" />
              <line x1="40" y1="0" x2="40" y2="50" stroke="currentColor" strokeWidth="0.1" />
              <line x1="60" y1="0" x2="60" y2="50" stroke="currentColor" strokeWidth="0.1" />
              <line x1="80" y1="0" x2="80" y2="50" stroke="currentColor" strokeWidth="0.1" />
            </svg>

            {/* Landmarks */}
            <div style={{ position: 'absolute', top: '40%', left: '60%', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>FELPHAM</div>
            <div style={{ position: 'absolute', top: '60%', left: '40%', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>BOGNOR REGIS</div>
            <div style={{ position: 'absolute', top: '30%', left: '80%', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>ELMER</div>
            <div style={{ position: 'absolute', top: '70%', left: '20%', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>ALDWICK</div>

            {users.map(user => {
              const pos = getPos(user.latitude!, user.longitude!);
              return (
                <div 
                  key={user.id}
                  title={user.name || "Anonymous"}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: '8px',
                    height: '8px',
                    background: 'var(--secondary)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px var(--secondary)',
                    cursor: 'pointer'
                  }}
                />
              );
            })}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <p><strong>Total customers with mapped locations:</strong> {users.length}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
