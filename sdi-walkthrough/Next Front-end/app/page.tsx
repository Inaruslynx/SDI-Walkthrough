import Image from "next/image";

export default function Home() {
  return (
    <main className="p-12 bg-base-100 prose md:prose-lg text-base-content max-w-full">
      <div className="container">
        <h1>Welcome to SDI Walkthrough</h1>
        <p>
          This is a very early version of the new site. I am utilizing new
          technology: Next.js which is a server that uses React seamlessly on
          client and server.
        </p>
        <h3>TODO List:</h3>
        <ul className="px-6">
          <li>Use Express Back-end for data.</li>
          <li>
            Change navbar based on available walkthroughs like Elec, Mech, and
            Ops. Can get data from Express.
          </li>
          <li>When navigating to walkthrough dynamically generate form.</li>
          <li>
            Forms will have form validation and show average and last entry.
          </li>
          <li>Ability for admins to configure walkthroughs.</li>
          <li>
            Connect to Microsoft identities so users log in with Microsoft
            account. Either use Clerk or something on Express.
          </li>
          <li>
            Leverage Microsoft identities to know what department a user is part
            of and if they are an admin.
          </li>
          <li>Add Graphing</li>
        </ul>
      </div>
    </main>
  );
}
