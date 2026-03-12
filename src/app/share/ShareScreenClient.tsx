'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './share.module.css';
import { MonitorUp, ShieldCheck, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PeerType = any;

export default function ShareScreenClient() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'requesting' | 'waiting' | 'connected'>('idle');
  const [error, setError] = useState('');
  
  const peerRef = useRef<PeerType>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<PeerType>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => stopSharing();
  }, []);

  const startSharing = async () => {
    try {
      setStatus('requesting');
      setError('');
      
      // 1. Request Screen Access
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: 'always' } as MediaTrackConstraints, 
        audio: false 
      });
      streamRef.current = stream;
      
      // Handle native browser "Stop sharing" button
      stream.getVideoTracks()[0].onended = () => {
        stopSharing();
      };

      // 2. Initialize PeerJS dynamically (client side only)
      const PeerModule = (await import('peerjs')).default;
      
      const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
      const sessionCode = generateCode();
      
      const peer = new PeerModule(`cif-${sessionCode}`, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ]
        }
      });
      peerRef.current = peer;

      peer.on('open', (id: string) => {
        console.log('Customer Peer registered:', id);
        setCode(sessionCode);
        setStatus('waiting');
      });

      // 3. Listen for incoming connection from Admin
      peer.on('call', (call: PeerType) => {
        console.log('Receiving incoming call from technician...');
        callRef.current = call;
        call.answer(streamRef.current!); // Answer with the screen stream
        setStatus('connected');
        
        call.on('close', () => stopSharing());
      });

      peer.on('error', (err: any) => {
         console.error('Customer Peer error:', err);
         setError(`Connection error [${err.type}]: ${err.message}`);
         stopSharing();
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Could not access screen: ' + err.message + '. Please ensure you grant permission.');
      } else {
        setError('Could not access screen.');
      }
      setStatus('idle');
    }
  };

  const stopSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setCode('');
    setStatus('idle');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <MonitorUp size={64} className={styles.icon} />
        <h1 className={styles.title}>Live Screen Share</h1>
        
        {status === 'idle' && (
          <>
            <p className={styles.description}>
              Share your screen securely with your technician right in your browser. 
              No software downloads required. You will be able to see exactly what we see, and you can stop sharing at any time.
            </p>
            <button onClick={startSharing} className="btn btn-accent" style={{ width: '100%', fontSize: '1.25rem', padding: '20px' }}>
              Share My Screen
            </button>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={20} />
              <span>100% View-Only. We cannot control your mouse.</span>
            </div>
          </>
        )}

        {status === 'requesting' && (
          <div style={{ padding: '2rem 0' }}>
            <Loader2 size={48} className={`animate-spin ${styles.icon}`} style={{ margin: '0 auto' }} />
            <h3>Waiting for permission...</h3>
            <p className={styles.description}>Please select what you want to share in the browser popup.</p>
          </div>
        )}

        {(status === 'waiting' || status === 'connected') && (
          <>
            <div className={styles.pinDisplay}>
              <span className={styles.pinLabel}>Your Secure Support Code</span>
              <div className={styles.pinCode}>{code.substring(0,3)} {code.substring(3,6)}</div>
            </div>
            
            {status === 'waiting' ? (
              <div className={`${styles.status} ${styles.waiting}`}>
                <Loader2 size={24} className="animate-spin" />
                <span>Waiting for technician to connect...</span>
              </div>
            ) : (
              <div className={`${styles.status} ${styles.connected}`}>
                <CheckCircle size={24} />
                <span>Technician is now viewing your screen.</span>
              </div>
            )}

            <button onClick={stopSharing} className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }}>
              Stop Sharing
            </button>
          </>
        )}

        {error && (
          <div className={styles.errorMsg}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontWeight: 'bold' }}>
              <XCircle size={20} />
              Error
            </div>
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <Link href="/remote-support" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Looking to download AnyDesk or TeamViewer instead?
          </Link>
        </div>
      </div>
    </div>
  );
}