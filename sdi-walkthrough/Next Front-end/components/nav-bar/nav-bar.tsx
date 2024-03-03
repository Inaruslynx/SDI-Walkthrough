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
        <nav className="p-4 navbar bg-base-300">
          <div className="flex-1">
            <NavLink button href="/">Home</NavLink>
            {departments.map((department) => (
              <NavDropdown name={department.name} key={department.name} />
            ))}
          </div>
          <div className="flex-none">
            <ThemeSelector />
          </div>
        </nav>
      </header>
    </>
  );
}
