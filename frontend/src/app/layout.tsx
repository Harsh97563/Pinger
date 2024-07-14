import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pinger",
  description: "Just ping people!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-emerald-950 ${inter.className}`}>
        {children}
        <Toaster expand={true} className=" rounded-lg" position="bottom-right" closeButton />
        </body>
    </html>
  );
}
