import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateTotal(itemIds: string[], itemsData: Record<string, any>): number {
  return itemIds.reduce((total, id) => {
    const item = itemsData[id]
    return total + (item?.price || 0)
  }, 0)
}
