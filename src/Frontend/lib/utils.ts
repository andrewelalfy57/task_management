import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// object check
export function isObjectNotEmpty(obj: any): boolean {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  return Object.keys(obj).length > 0;
}
export const formatDate = (date: string | number | Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};



export function getWords(inputString: string): string {
  const stringWithoutSpaces = inputString.replace(/\s/g, "");

  return stringWithoutSpaces.substring(0, 3);
}

