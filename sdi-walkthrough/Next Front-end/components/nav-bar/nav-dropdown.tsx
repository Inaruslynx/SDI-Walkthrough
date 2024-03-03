"use client";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";

export default function NavDropdown({ name }: { name: string }) {
  const path: string = usePathname();

  return (
    <div key={name} className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className={`btn m-2 px-4 py-2 rounded-md ${path.includes(name) ? "btn-primary" : ""}`}
      >
        {name}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <NavLink href={`/${name}/walkthrough/`}>Walk-through</NavLink>
        </li>
        <li>
          <NavLink href={`/${name}/graph/`}>Graph</NavLink>
        </li>
        <li>
          <NavLink href={`/${name}/report/`}>Report</NavLink>
        </li>
      </ul>
    </div>
  );
}
