import type { Metadata } from "next";
import NavBar from "@/components/nav-bar/nav-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDI Walkthrough",
  description: "A walkthrough app for all SDI divisions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="dark" lang="en">
      <body className="bg-base-100">
        <NavBar />
        <div className="mt-16">{children}</div>
      </body>
    </html>
  );
}
