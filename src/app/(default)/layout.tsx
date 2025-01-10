import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Logo from "@/components/logo";
import { Menu } from "@/components/home/menu";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hvor",
  description: "Hvor sitter du?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex justify-between p-6 items-center">
          <Logo />
          <Menu />
        </div>

        {children}
      </body>
    </html>
  );
}
