import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const log = (...args: unknown[]): void => {
  console.log("LOGGER: ", ...args);
};
