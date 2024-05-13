export default function Home() {
  return (
    <>
      <main className="px-12 bg-base-100 prose md:prose-lg text-base-content max-w-full">
        <div className="container">
          <h1>Welcome to SDI Walkthrough</h1>
          <p>
            This is a very early version of the new site. I am utilizing new
            technology: Next.js which is a server that uses React seamlessly on
            client and server.
          </p>
          <h3>TODO List:</h3>
          <ul className="px-6">
            <li>
              <s>Use Express Back-end for data.</s>
            </li>
            <li>
              <s>
                Change navbar based on available walkthroughs like Elec, Mech,
                and Ops. Can get data from Express.
              </s>
            </li>
            <li>When navigating to walkthrough dynamically generate form.</li>
            <li><s>Departments can have multiple walkthroughs.</s></li>
            <li>Forms will have form validation and show a small graph.</li>
            <li>
              <s>Graph page.</s>
            </li>
            <li>Ability for admins to configure walkthroughs.</li>
            <li>
              <s>
                Connect to Microsoft identities so users log in with Microsoft
                account. Either use Clerk or something on Express. (maybe)
              </s>
            </li>
            <li>
              <s>
                Leverage Microsoft identities to know what department a user is
                part of and if they are an admin. (maybe)
              </s>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
