import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "PharmSphere Inventory & Order Management",
  description: "High-precision inventory and order management system",
};

import { NextAuthProvider } from "@/components/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
