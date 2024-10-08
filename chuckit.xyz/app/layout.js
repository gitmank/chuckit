import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
  title: "chuckit.xyz - throw files around the world",
  description: "instant links and nearby share app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
