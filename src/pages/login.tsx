import Link from "next/link";

import { signIn } from "next-auth/react";

import { ChevronLeft, Github } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils/shadcn";

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Login with GitHub to enter your dashboard
          </p>
        </div>
        <Button onClick={() => signIn("github")} variant={"secondary"}>
          <Github size={18} className="mr-2" />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
