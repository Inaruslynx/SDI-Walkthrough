"use client";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  OrganizationSwitcher,
  useUser,
} from "@clerk/nextjs";
import NavLink from "./nav-link";
import NavDropdown from "./nav-dropdown";
import ThemeSelector from "./theme-selector/theme-selector";
import { findUser, getAllDepartments } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Department } from "@/types";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [Admin, setAdmin] = useState(false);
  const { user } = useUser();
  const departments = useQuery<AxiosResponse<Department[]>, Error>({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    staleTime: 1000 * 60 * 5, // ms * s * m
  });

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return findUser(user?.id as string);
    },
  });

  useEffect(() => {
    if (userQuery.isSuccess) {
      if (userQuery.data.data) {
        setAdmin(userQuery.data.data.admin || false);
      }
    }
  }, [userQuery.data]);

  return (
    <>
      <header className="row row-span-1 bg-base-300 z-40 container fixed top-0 max-w-full">
        <nav className="p-4 navbar bg-base-300">
          <div className="navbar-start">
            {/* Below is UI for small screens  */}
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink href="/">Home</NavLink>
                </li>
                {departments.isLoading && (
                  <div className="skeleton h-10 w-20 rounded-md"></div>
                )}
                {departments.data?.data?.map((department) => (
                  <details key={department.name} className="collapse">
                    <summary className="collapse-title">
                      {department.name}
                    </summary>
                    <div className="collapse-content">
                      <li>
                        <NavLink href={`/${department.name}/walkthrough/`}>
                          Walk-through
                        </NavLink>
                      </li>
                      <li>
                        <NavLink href={`/${department.name}/graph/`}>
                          Graph
                        </NavLink>
                      </li>
                      <li>
                        <NavLink href={`/${department.name}/report/`}>
                          Report
                        </NavLink>
                      </li>
                    </div>
                  </details>
                ))}
                {userQuery.isSuccess && Admin === true && (
                  <li>
                    <NavLink href="/admin/users/">User Control</NavLink>
                  </li>
                )}
              </ul>
            </div>

            {/* This is the UI for large screens */}
            <div className="hidden lg:flex">
              <NavLink button href="/">
                Home
              </NavLink>
              {departments.isLoading && (
                <>
                  <div className="skeleton m-2 px-4 py-2 w-20"></div>
                  <div className="skeleton m-2 px-4 py-2 w-20"></div>
                  <div className="skeleton m-2 px-4 py-2 w-20"></div>
                </>
              )}
              {departments.data?.data?.map((department) => (
                <NavDropdown name={department.name} key={department.name} />
              ))}
            </div>
            {/* TODO: Need to show or hide based on metadata for admin */}
            <SignedIn>
              {userQuery.isSuccess && Admin === true && (
                <li>
                  <NavLink button href="/admin/users/">
                    User Control
                  </NavLink>
                </li>
              )}
            </SignedIn>
          </div>
          <div className="flex-none navbar-end">
            <SignedIn>
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationPreview: "text-base-content",
                    userPreviewTextContainer: "text-base-content",
                    organizationSwitcherTriggerIcon: "stroke-base-content",
                    organizationSwitcherPopoverCard:
                      "bg-base-200 text-base-content",
                    organizationSwitcherPopoverActionButtonText:
                      "text-base-content",
                    organizationSwitcherPopoverActionButtonIcon:
                      "stroke-base-content",
                    organizationPreviewSecondaryIdentifier: "text-base-content",
                    organizationSwitcherPopoverFooter:
                      "text-base-content stroke-base-content",
                    organizationSwitcherPreviewButton: "text-base-content",
                  },
                }}
              />
              <div className="p-2">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonPopoverCard: "bg-base-200 text-base-content",
                      userButtonPopoverActionButtonText: "text-base-content",
                      userButtonPopoverActionButtonIcon: "stroke-base-content",
                      userPreviewSecondaryIdentifier: "text-base-content",
                      userButtonPopoverFooter:
                        "text-base-content stroke-base-content",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="px-4 mx-2 btn rounded-btn hover:btn-primary">
                <SignInButton />
              </div>
              <div className="px-4 mx-2 btn rounded-btn hover:btn-primary">
                <SignUpButton />
              </div>
            </SignedOut>
            <div className="hidden lg:contents">
              <ThemeSelector />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
