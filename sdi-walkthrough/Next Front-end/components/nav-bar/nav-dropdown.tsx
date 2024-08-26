"use client";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavDropdown({ name }: { name: string }) {
  const path: string = usePathname();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  // console.log("user:", user?.publicMetadata.role);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const canFillInWalkthrough = true;
  const orgAdmin = true;

  return (
    <div key={name} className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className={`btn m-2 px-4 py-2 ${path.includes(name) ? "btn-primary" : "hover:btn-primary"} rounded-btn`}
      >
        {name}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {canFillInWalkthrough && (
          <li>
            <NavLink href={`/${name}/walkthrough/`}>Walk-through</NavLink>
          </li>
        )}
        <li>
          <NavLink href={`/${name}/graph/`}>Graph</NavLink>
        </li>
        <li>
          <NavLink href={`/${name}/report/`}>Report</NavLink>
        </li>
        {orgAdmin && (
          <li>
            <span className="menu-dropdown-toggle" onClick={toggleDropdown}>
              Admin
            </span>
            <ul
              className={`menu-dropdown ${isDropdownVisible ? "menu-dropdown-show" : ""}`}
            >
              <li>
                <NavLink href={`/${name}/admin/users`}>Users</NavLink>
              </li>
              <li>
                <NavLink href={`/${name}/admin/walkthrough`}>
                  Walk-through
                </NavLink>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}

