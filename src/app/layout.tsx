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

import { ThemeProvider } from "@/components/theme-provider";

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
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <TRPCReactProvider headers={headers()}>
          <NextAuthSessionProvider session={session}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="min-h-screen">
                {children}
                <Analytics />
                <Toaster />
                <TailwindIndicator />
              </main>
            </ThemeProvider>
          </NextAuthSessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
