'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function MobileNavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div>
        <button
          onClick={() => {
            setIsOpen(!isOpen)
            alert(
              "Message from Aryan: Hi, we don't have a mobile navbar yet. Please move around by changing the URL for now. Thanks.",
            )
          }}
        >
          <Menu className="m-4 h-8 w-8" />
        </button>
      </div>
    </>
  )
}
