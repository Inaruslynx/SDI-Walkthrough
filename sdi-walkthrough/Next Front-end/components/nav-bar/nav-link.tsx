"use client";

// Import necessary types from Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  button?: boolean;
  scrollSpy?: boolean;
  id?: string;
}

export default function NavLink({
  href,
  children,
  button,
  scrollSpy,
  id,
}: NavLinkProps) {
  const path = usePathname();

  const onPress = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = window.document.getElementById(
      e.currentTarget.href.split("#")[1],
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
        href={href}
        className={`btn m-2 px-4 py-2 ${path === href ? "btn-primary" : "hover:btn-primary"} rounded-btn`}
      >
        {children}
      </Link>
    );
  }
  if (scrollSpy) {
    return (
      <Link
        className={""}
        key={id + "1"}
        data-to-scrollspy-id={id}
        onClick={(e) => onPress(e)}
        href={href}
      >
        {children}
      </Link>
    );
  }
  return <Link href={href}>{children}</Link>;
}
