'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/me');
  }, [router]);

  return null;
}
