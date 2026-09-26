import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Management System",
  description: "ERP-style business management project",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
