import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Function to merge Tailwind classes with clsx, useful for conditional CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get the first name from a full name, used across the app
export const getFirstName = (fullName: string | null | undefined) => {
  return fullName?.split(' ')[0]
}

// Function to create a timeout promise, used to test loading states
export const sleep = (seconds: number) => {
  const SECONDS_TO_MILLISECONDS_FACTOR = 1000
  return new Promise((resolve) =>
    setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS_FACTOR),
  )
}
