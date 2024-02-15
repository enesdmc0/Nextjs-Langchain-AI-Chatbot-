import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Enes Demirci",
    default: "Enes Demirci",
  },
  description: "Check out my smart portfolio website with a custom AI chatbot!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="mx-auto max-w-3xl px-3 py-10 ">{children}</main>
      </body>
    </html>
  );
}
