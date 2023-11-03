import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "UniTrack",
  description: "Welcome to UniTrack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.className}`}>{children}</body>
    </html>
  );
}
