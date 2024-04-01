import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider >
      <html data-theme="dark" lang="en" id="mainHtml">
        <body className="bg-base-100">
          <div className="grid grid-rows-2 h-screen">
            <NavBar />
            <div className="mt-16">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
