import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-gradient-to-b from-neutral-950 to-neutral-900 text-white antialiased selection:bg-violet-600 selection:text-white">
        <Navbar />
        <div className="container flex w-full flex-col items-center justify-center gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-7xl">
              Welcome to UniTrack
            </h1>
            <p className="text-center text-lg text-neutral-300 sm:text-xl">
              An open-source student monitoring system for modern universities.
            </p>
          </div>

          <Link href="/dashboard" className={`${buttonVariants()} gap-2`}>
            View Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
        <Footer />
      </main>
    </>
  );
}

function Navbar() {
  return (
    <>
      <nav className="flex w-full justify-between p-6">
        <Image
          src={"/logo.png"}
          width={40}
          height={40}
          className=""
          alt="UniTrack Logo"
        />

        <Button variant={"secondary"}>Sign in</Button>
      </nav>
    </>
  );
}

function Footer() {
  return (
    <>
      <footer className="mb-4 text-neutral-300">
        Built with &lt;3 by{" "}
        <Link
          referrerPolicy="no-referrer"
          target="_blank"
          className="underline-offset-4 hover:underline"
          href="https://github.com/aryanprince"
        >
          Aryan
        </Link>
        {", "}
        <Link
          referrerPolicy="no-referrer"
          target="_blank"
          className="underline-offset-4 hover:underline"
          href="https://github.com/aryanprince"
        >
          Andrea
        </Link>
        {" and "}
        <Link
          referrerPolicy="no-referrer"
          target="_blank"
          className="underline-offset-4 hover:underline"
          href="https://github.com/aryanprince"
        >
          Lewis
        </Link>
      </footer>
    </>
  );
}
