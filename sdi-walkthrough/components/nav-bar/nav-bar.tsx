import Link from "next/link";
import NavLink from "./nav-link";

export default function NavBar() {
  // At some point I need to check a database and generate links based on that ie. Electrical, Mechanical, and Operations
  return (
    <>
      <header>
        <nav className="p-4 flex justify-between">
          <ul>
            <li>
              <NavLink href="/">Home</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
