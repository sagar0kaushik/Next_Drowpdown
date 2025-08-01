import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Location Picker App",
  description: "Next.js app for multi-location dropdowns",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
