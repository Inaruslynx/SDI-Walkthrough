import Image from "next/image";

export default function Home() {
  return (
    <main className="p-12">
      <h1 className="text-3xl">Welcome to SDI Walkthrough</h1>
      <p>
        This is a very early version of the new site. I am utilizing new
        technology: Next.js which is a server that uses React seamlessly on
        client and server.
      </p>
      <h4 className="text-2xl">TODO List:</h4>
      <ul className="list-disc px-6">
        <li>Connect to database.</li>
        <li>
          Change navbar based on available walkthroughs like Elec, Mech, and
          Ops.
        </li>
        <li>When navigating to walkthrough dynamically generate form.</li>
        <li>Ability for admins to configure walkthroughs.</li>
        <li>
          Connect to Microsoft identities so users log in with Microsoft
          account.
        </li>
        <li>
          Leverage Microsoft identities to know who admins are and what
          department they are part of.
        </li>
        <li>Add Graphing</li>
      </ul>
    </main>
  );
}
