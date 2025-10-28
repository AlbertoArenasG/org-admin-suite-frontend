'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditMyProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/me/edit');
  }, [router]);

  return null;
}
