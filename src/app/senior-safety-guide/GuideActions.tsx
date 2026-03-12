'use client';

export default function GuideActions() {
  return (
    <div style={{ marginTop: '20px' }}>
       <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print this Guide</button>
    </div>
  );
}
