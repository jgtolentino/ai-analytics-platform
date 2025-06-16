// Scout Analytics v3.3.0 - Direct Dashboard Access (No Landing Page)
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function HomePage() {
  useEffect(() => {
    // Immediate redirect to dashboard - bypasses landing page completely
    window.location.replace('/dashboard');
  }, []);

  // Fallback redirect if useEffect doesn't work
  redirect('/dashboard');

  return null; // Never renders
}