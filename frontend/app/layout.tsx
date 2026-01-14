import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "AI-Powered RFP Management",
  description: "Create, send, and evaluate RFPs using AI"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {/* Global Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>

        {/* Global Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </body>
    </html>
  );
}
