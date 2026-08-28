// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cairo } from 'next/font/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-cairo',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ثانوية شرعية",
  description: "نظام إدارة المدرسة الثانوية الشرعية",
  icons: {
    icon: '/images/mianIcon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
      style={{ fontFamily: cairo.style.fontFamily }}
    >
      <body className="min-h-full flex bg-white text-gray-900">

        {children}
      </body>
    </html>
  );
}