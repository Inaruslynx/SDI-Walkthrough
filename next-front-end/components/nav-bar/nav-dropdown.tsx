"use client";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

export default function NavDropdown({ name }: { name: string }) {
  const path: string = usePathname();
  const { orgSlug } = useAuth();
  const { user } = useUser();
  // console.log("user:", user?.publicMetadata.role);

  const orgAdmin = orgSlug === `${name.toLowerCase()}-admins`;
  // console.log("orgAdmin:", orgAdmin);
  const canFillInWalkthrough =
    user?.publicMetadata.role === `org:${name.toLowerCase()}` || orgAdmin;
  // console.log("canFillInWalkthrough:", canFillInWalkthrough);

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
        className="dropdown-content z-1 menu p-2 shadow-sm bg-base-100 rounded-box w-52"
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
            <NavLink href={`/${name}/admin/walkthrough`}>
              Walk-through Admin Control
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}
