'use client';
import { useFormStatus } from "react-dom";

export function SubmitButton({ 
  children, 
  className = "btn btn-secondary", 
  style = {} 
}: { 
  children: React.ReactNode, 
  className?: string, 
  style?: React.CSSProperties 
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} style={style}>
      {pending ? "Sending..." : children}
    </button>
  );
}