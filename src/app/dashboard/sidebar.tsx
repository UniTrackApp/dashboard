"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signIn, signOut, useSession } from "next-auth/react";

import {
  BookCheck,
  CheckCircle,
  History,
  Home,
  LibraryBig,
  LogOut,
  Presentation,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

import { ModeToggle } from "~/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { cn } from "~/utils/shadcn";

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
    name: "Records",
    href: "/dashboard/records",
    icon: <CheckCircle size={18} />,
    wipStatus: false,
  },
  {
    name: "Enrollments",
    href: "/dashboard/enrollments",
    icon: <BookCheck size={18} />,
    wipStatus: true,
  },
  {
    name: "Lectures",
    href: "/dashboard/lectures",
    icon: <Presentation size={18} />,
    wipStatus: true,
  },
  {
    name: "Modules",
    href: "/dashboard/modules",
    icon: <LibraryBig size={18} />,
    wipStatus: true,
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

export default function Sidebar() {
  const pathname = usePathname(); // used to highlight the current page in the sidebar
  const { data: sessionData } = useSession(); // used to display auth user info

  return (
    <aside className="hidden h-screen justify-between bg-white px-3 py-4 dark:bg-neutral-900 md:flex md:flex-col">
      <div>
        {/* Sidebar header - contains logo + account dropdown */}
        <div className="flex items-center gap-3 px-2">
          <Image src="/logo.png" width={26} height={26} alt="UniTrack" />
          <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            UniTrack
          </p>

          {/* Account Dropdown - to logout (and manage profile later) */}
          {sessionData?.user.image && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  <Avatar className="ml-auto">
                    <AvatarImage src={sessionData?.user?.image} />
                    <AvatarFallback>DP</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 bg-neutral-900"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <p className="truncate text-base text-foreground">
                        {sessionData.user?.name}
                      </p>
                      <p className="truncate font-normal text-muted-foreground">
                        {sessionData.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="w-full cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut size={18} className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Nav links - with badges for WIP status */}
        <div className="mt-8 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "flex justify-start gap-2 text-base font-normal",
                pathname === link.href
                  ? "bg-neutral-50 dark:bg-neutral-700"
                  : "bg-transparent",
              )}
            >
              {link.icon}
              {link.name}
              {link.wipStatus && (
                <Badge
                  variant="warning"
                  className="ml-auto text-xs dark:bg-yellow-300 dark:text-yellow-900"
                >
                  WIP
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Login button - to be removed later once we redirect logged out users automatically */}
      {!sessionData && (
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => signIn()}
        >
          Sign in
        </Button>
      )}

      {/* Theme toggle - for dark & light mode */}
      <div className="flex items-center justify-center gap-4 rounded-lg bg-neutral-50 p-2 text-sm dark:bg-neutral-800/50">
        <p className="font-medium">Toggle Theme</p>
        <ModeToggle />
      </div>
    </aside>
  );
}
