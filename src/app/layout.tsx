import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drag Race Tracker",
  description: "Track your progress through all Drag Race franchises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50 }}>
          <AuthButton />
        </div>
        {children}
      </body>
    </html>
  );
}
