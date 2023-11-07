import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { NextAuthSessionProvider } from "~/components/SessionProvider";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";
import { TRPCReactProvider } from "./trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "UniTrack",
  description: "Welcome to UniTrack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // console.log("session", session);

  return (
    <html lang="en">
      <body className={`font-sans antialiased ${inter.className}`}>
        <TRPCReactProvider headers={headers()}>
          <NextAuthSessionProvider session={session}>
            <main className="mx-auto max-w-7xl">
              {children}
              <Analytics />
              <Toaster />
              <TailwindIndicator />
            </main>
          </NextAuthSessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
