"use client";

// Import necessary types from Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  button?: boolean;
}

export default function NavLink({ href, children, button }: NavLinkProps) {
  const path = usePathname();

  if (button) {
    return (
      <Link
        href={href}
        className={`btn m-2 px-4 py-2 ${path === href ? "btn-primary" : "hover:btn-primary"} rounded-btn`}
      >
        {children}
      </Link>
    );
  }
  return <Link href={href}>{children}</Link>;
}
