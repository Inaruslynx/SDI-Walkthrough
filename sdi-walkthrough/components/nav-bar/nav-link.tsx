"use client";

// Import necessary types from Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const path = usePathname();

  return (
    <Link href={href} className={path === href ? "text-blue-500" : ""}>
      {children}
    </Link>
  );
}
