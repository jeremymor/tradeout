import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel"
});

export const metadata: Metadata = {
  title: "TradeOut - Retro Trade Guessing Game",
  description: "Guess the country by its export treemap in this retro Apple-styled game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} font-pixel antialiased`}>
        {children}
      </body>
    </html>
  );
}
