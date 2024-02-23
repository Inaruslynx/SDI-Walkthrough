import Link from "next/link";
import NavLink from "./nav-link";
import ThemeSelector from "./theme-selector/theme-selector";

export default function NavBar() {
  // At some point I need to check a database and generate links based on that ie. Electrical, Mechanical, and Operations
  return (
    <>
      <header className="bg-base-300 container fixed top-0 max-w-full">
        <nav className="p-4 navbar bg-base-300">
          <div className="flex-1">
            <NavLink href="/">Home</NavLink>
          </div>
          <div className="flex-none">
            <ThemeSelector />
          </div>
        </nav>
      </header>
    </>
  );
}
