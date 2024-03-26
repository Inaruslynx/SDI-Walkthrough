import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import NavLink from "./nav-link";
import NavDropdown from "./nav-dropdown";
import ThemeSelector from "./theme-selector/theme-selector";

interface Department {
  name: string;
}

async function getData() {
  const URL = process.env.API_URL + "departments";
  // console.log(URL);
  const response = await fetch(URL);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const responseData = await response.arrayBuffer();
  const data = new TextDecoder().decode(responseData);
  // console.log(data);
  const parsedData: Array<{ name: string }> = JSON.parse(data).map(
    (item: { name: string }) => {
      // console.log(item.name);
      return { name: item.name };
    }
  );
  // console.log(parsedData);

  return parsedData;
}

export default async function NavBar() {
  const data = await getData();
  const departments: Department[] = data;
  // At some point I need to check a database and generate links based on that ie. Electrical, Mechanical, and Operations
  return (
    <>
      <header className="bg-base-300 container fixed top-0 max-w-full">
        <nav className="p-4 navbar bg-base-300 z-10">
          <div className="navbar-start">
            {/* Below is UI for small screens  */}
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
                {departments.map((department) => (
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
              </ul>
            </div>

            {/* This is the UI for large screens */}
            <div className="hidden lg:flex">
              <NavLink button href="/">
                Home
              </NavLink>
              {departments.map((department) => (
                <NavDropdown name={department.name} key={department.name} />
              ))}
            </div>
          </div>
          <div className="flex-none navbar-end">
            <SignedIn>
              <UserButton />
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
