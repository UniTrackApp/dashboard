import Image from 'next/image'
import { Suspense } from 'react'

import SidebarNavlinks from '~/components/sidebar-navlinks'
import SidebarUserButton from '~/components/sidebar-userbutton'
import { ModeToggle } from '~/components/theme-toggle'

export default function Sidebar() {
  return (
    <aside className="hidden h-screen justify-between border-r-[1px] border-border bg-background px-3 py-4 md:flex md:flex-col">
      <div>
        {/* Sidebar header - contains logo + account dropdown */}
        <div className="flex items-center gap-3 px-2">
          <Image src="/logo.png" width={26} height={26} alt="UniTrack" />
          <p className="text-2xl font-semibold text-foreground">UniTrack</p>

          {/* Account Dropdown - to logout (and manage profile later) */}
          <Suspense>
            <SidebarUserButton />
          </Suspense>
        </div>

        <Suspense>
          <SidebarNavlinks />
        </Suspense>
      </div>

      {/* Theme toggle - for dark & light mode */}
      <div className="flex items-center justify-center gap-4 rounded-lg p-2 text-sm">
        <Suspense>
          <ModeToggle />
        </Suspense>
      </div>
    </aside>
  )
}
