import type { Metadata } from "next";
import { Orbitron, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});


export const metadata: Metadata = {
  title: "Scoreva — Enter The Live Arena",
  description: "Real-time sports commentary platform with ultra low latency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${inter.variable} ${spaceMono.variable} antialiased`}
      >
  
        {children}
              <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#141D35",
      color: "#F3F6FF",
      border: "1px solid rgba(255,255,255,0.12)",
    },
  }}
/>
        <Footer/>
      </body>
    </html>
  );
}