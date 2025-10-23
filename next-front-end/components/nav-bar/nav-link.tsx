"use client";

import { Route } from "next";
// Import necessary types from Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  button?: boolean;
  scrollSpy?: boolean;
  id?: string;
}

export default function NavLink({
  href,
  children,
  className,
  button,
  scrollSpy,
  id,
}: NavLinkProps) {
  const path = usePathname();

  const onPress = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = window.document.getElementById(
      e.currentTarget.href.split("#")[1]
    );
    if (target) {
      var headerOffset = 120;
      var elementPosition = target.getBoundingClientRect().top;
      var offsetPosition = elementPosition - headerOffset;
      // console.log("elementPosition:", elementPosition);
      // console.log("offsetPosition:", offsetPosition);

      window.scrollBy({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (button) {
    return (
      <Link
        href={href as Route}
        className={`btn m-2 px-4 py-2 ${path === href ? "btn-primary" : "hover:btn-primary"} rounded-btn ${className}`}
      >
        {children}
      </Link>
    );
  }
  if (scrollSpy) {
    return (
      <Link
        className={className}
        key={id + "1"}
        data-to-scrollspy-id={id}
        onClick={(e) => onPress(e)}
        href={href as Route}
      >
        {children}
      </Link>
    );
  }
  return <Link href={href as Route}>{children}</Link>;
}
