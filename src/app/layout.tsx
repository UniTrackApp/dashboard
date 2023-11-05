import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Sidebar from "~/components/(dashboard)/sidebar";
import { NextAuthSessionProvider } from "~/components/SessionProvider";
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
      <body className={`font-sans ${inter.className} bg-blue-50`}>
        <NextAuthSessionProvider session={session}>
          <main className="mx-auto flex max-w-7xl divide-x">
            <Sidebar />
            {children}
          </main>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
