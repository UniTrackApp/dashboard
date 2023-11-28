import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get the first name from a full name, used across the app
export const getFirstName = (fullName: string | null | undefined) => {
  return fullName?.split(' ')[0]
}
