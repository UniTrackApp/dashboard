'use client'

import { Button } from './ui/button'
import Modal from './ui/modal'

export default function RenderModal() {
  return (
    <Modal>
      <Modal.Button asChild>
        <Button>About</Button>
      </Modal.Button>
      <Modal.Content title="what">
        <div className="mt-4 space-y-3 text-gray-600">
          <p>This is a React app built with Radix UI!</p>
          <p>Technologies used:</p>
          <ul className="list-disc pl-4">
            <li>Radix UI Dialog</li>
            <li>Next.js</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
      </Modal.Content>
    </Modal>
  )
}
