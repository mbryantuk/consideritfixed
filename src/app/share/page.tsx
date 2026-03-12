import Header from '@/components/Header';
import ShareScreenClient from './ShareScreenClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Screen Share | Consider IT Fixed',
  description: 'Secure, browser-based screen sharing for remote technical support. No downloads required.',
  robots: {
    index: false,
    follow: false
  }
};

export default function SharePage() {
  return (
    <>
      <Header />
      <ShareScreenClient />
    </>
  );
}