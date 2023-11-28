'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export default function SidebarUserButton() {
  const { data: sessionData } = useSession() // used to display auth user info

  return (
    <>
      {/* Account Dropdown - to logout (and manage profile later) */}
      {sessionData?.user.image && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto">
              <Avatar className="ml-auto h-9 w-9">
                <AvatarImage src={sessionData?.user?.image} />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
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
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="flex">
                  <User size={18} className="mr-2" />
                  View profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="flex">
                  <Settings size={18} className="mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full cursor-pointer text-destructive"
                onClick={() => signOut()}
              >
                <LogOut size={18} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  )
}
