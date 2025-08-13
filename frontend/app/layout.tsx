import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Wrapped Lite",
  description: "Discover your musical journey with personalized insights and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
