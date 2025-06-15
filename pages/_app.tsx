// pages/_app.tsx - Next.js App Component
// Global app configuration and styling
// Version: 1.0.0

import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../src/styles/dashboard.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Scout Analytics Dashboard - TBWA AI Platform</title>
        <meta name="description" content="AI-powered retail intelligence platform for the Philippines market" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Scout Analytics Dashboard" />
        <meta property="og:description" content="AI-powered retail intelligence platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://scout-mvp.vercel.app" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scout Analytics Dashboard" />
        <meta name="twitter:description" content="AI-powered retail intelligence platform" />
        
        {/* Performance and SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}