"use client";

import Image from "next/image";
import Link from "next/link";

import { type Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

import { Home, Settings, UserCog } from "lucide-react";

import { cn } from "~/utils/shadcn";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";

import { usePathname } from "next/navigation";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <Home size={22} className="mr-2" />,
  },
  {
    name: "Manage",
    href: "/dashboard/manage",
    icon: <UserCog size={22} className="mr-2" />,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={22} className="mr-2" />,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar({ session }: { session?: Session | null }) {
  const path = usePathname();
  const { data: sessionData } = useSession();

  console.log("sessionData", sessionData);

  return (
    <>
      {/* Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 md:block">
        <div className="flex h-full flex-col justify-between overflow-y-auto bg-white px-3 py-4 dark:bg-neutral-900">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" width={36} height={36} alt="UniTrack" />
              <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                UniTrack
              </p>
            </div>

            {/* Nav Links */}
            <div className="mt-8 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "justify-start text-base",
                    path === link.href
                      ? "text-primary-500 dark:text-primary-400"
                      : "bg-transparent",
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Login / Logout Button */}
          <div>
            <LoginButton sessionData={sessionData} />
          </div>
        </div>
      </aside>
    </>
  );
}

function LoginButton({ sessionData }: { sessionData: Session | null }) {
  return (
    <div>
      {/* WHEN SIGNED OUT */}
      {!sessionData && (
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => signIn()}
        >
          Sign in
        </Button>
      )}

      {/* WHEN SIGNED IN */}
      {sessionData && (
        <div className="flex flex-row justify-between gap-4 p-2">
          <div className="flex flex-col overflow-auto">
            {sessionData && (
              <span className="text-md truncate">
                Hi, {sessionData.user?.name}
              </span>
            )}

            <Button
              className="h-4 justify-start pl-0 text-sm text-neutral-500"
              variant={"link"}
              size={"sm"}
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </div>

          <div className="">
            {sessionData?.user.image && (
              <Avatar className="ml-auto">
                <AvatarImage src={sessionData?.user?.image} />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
