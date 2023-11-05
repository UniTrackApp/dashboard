"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { type Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

import { History, Home, Settings, UserCog, Users } from "lucide-react";
import { cn } from "~/utils/shadcn";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button, buttonVariants } from "../../components/ui/button";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <Home size={18} />,
    wipStatus: false,
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: <Users size={18} />,
    wipStatus: false,
  },
  {
    name: "Manage",
    href: "/dashboard/manage",
    icon: <UserCog size={18} />,
    wipStatus: true,
  },
  {
    name: "Logs",
    href: "/dashboard/logs",
    icon: <History size={18} />,
    wipStatus: true,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={18} />,
    wipStatus: true,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar({ session }: { session?: Session | null }) {
  const pathname = usePathname();
  const { data: sessionData } = useSession();

  console.log("sessionData", sessionData);

  return (
    <>
      {/* Sidebar */}
      <aside className="hidden h-screen justify-between bg-white px-3 py-4 dark:bg-neutral-900 md:flex md:flex-col">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <Image src="/logo.png" width={26} height={26} alt="UniTrack" />
            <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
              UniTrack
            </p>
          </div>

          {/* Nav Links */}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "flex justify-start gap-2 text-base font-normal",
                  pathname === link.href ? "bg-neutral-50" : "bg-transparent",
                )}
              >
                {link.icon}
                {link.name}
                {link.wipStatus && (
                  <Badge variant="warning" className="text-xs">
                    WIP
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Login / Logout Button */}
        <LoginButton sessionData={sessionData} />
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
        <div className="flex flex-row justify-between gap-4">
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
