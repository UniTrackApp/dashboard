'use client'

import {
  BookCheck,
  CheckCircle,
  History,
  Home,
  LibraryBig,
  Presentation,
  Settings,
  UserCog,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const links = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: <Home size={18} />,
    wipStatus: false,
  },
  {
    name: 'Students',
    href: '/dashboard/students',
    icon: <Users size={18} />,
    wipStatus: false,
  },
  {
    name: 'Records',
    href: '/dashboard/records',
    icon: <CheckCircle size={18} />,
    wipStatus: false,
  },
  {
    name: 'Enrollments',
    href: '/dashboard/enrollments',
    icon: <BookCheck size={18} />,
    wipStatus: false,
  },
  {
    name: 'Lectures',
    href: '/dashboard/lectures',
    icon: <Presentation size={18} />,
    wipStatus: false,
  },
  {
    name: 'Modules',
    href: '/dashboard/modules',
    icon: <LibraryBig size={18} />,
    wipStatus: false,
  },
  // {
  //   name: 'Manage',
  //   href: '/dashboard/manage',
  //   icon: <UserCog size={18} />,
  //   wipStatus: true,
  // },
  // {
  //   name: 'Logs',
  //   href: '/dashboard/logs',
  //   icon: <History size={18} />,
  //   wipStatus: true,
  // },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={18} />,
    wipStatus: false,
  },
]

export default function SidebarNavlins() {
  const pathname = usePathname() // used to highlight the current page in the sidebar

  return (
    <>
      {/* Nav links - with badges for WIP status */}
      <div className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'flex justify-start gap-2 text-base font-normal',
              pathname === link.href
                ? 'bg-neutral-50 dark:bg-neutral-700'
                : 'bg-transparent',
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
    </>
  )
}
