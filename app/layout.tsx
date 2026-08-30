import type { Metadata } from "next";
import { Inter, Oswald, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WINTER ARC BUDDY.",
  description: "Your friend is watching. Show up. Prove it. Don't lose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${spaceMono.variable} h-full antialiased bg-wab-offwhite text-wab-black`}
    >
      <body className="min-h-full flex flex-col font-sans border-x border-wab-black max-w-7xl mx-auto relative">
        <div className="absolute inset-0 grid-bg pointer-events-none -z-10 opacity-50" />
        {children}
      </body>
    </html>
  );
}
