import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import NavBar from "@/components/nav-bar/nav-bar";
import UserListener from "@/components/UserListener";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

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
    <>
      <ClerkProvider /* appearance={{ baseTheme: dark }} */>
        <html data-theme="dark" lang="en" id="mainHtml">
          <body className="bg-base-100">
            <ToastContainer
              position="top-center"
              autoClose={2000}
              closeOnClick
              theme="colored"
            />
            <ReactQueryProvider>
              <div className="grid grid-rows-2 h-screen">
                <UserListener />
                <NavBar />
                <div className="row mt-32">{children}</div>
                <div className="row h-0"></div>
              </div>
            </ReactQueryProvider>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
