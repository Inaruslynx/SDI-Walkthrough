export default function Home() {
  return (
    <>
      <main className="px-12 bg-base-100 prose md:prose-lg text-base-content max-w-full">
        <div className="container">
          <h1>Welcome to SDI Walkthrough</h1>
          <p>
            This app should be pretty fleshed out, but bugs might still exist.
            Please let me know if you find any issues. I am utilizing new
            technology: Next.js and Nest.js.
          </p>
          <h3>TODO List:</h3>
          <ul className="px-6">
            <li>
              Use passport on Nest.js with azure-ad-oauth2 to authenticate. Not
              sure what sends user to Microsoft whether Next or Nest.
            </li>
            <li>
              <s>Use Nest.js Back-end for data.</s>
            </li>
            <li>
              <s>
                Change navbar based on available walkthroughs like Elec, Mech,
                and Ops.
              </s>
            </li>
            <li>
              <s>When navigating to walkthrough dynamically generate form.</s>
            </li>
            <li>
              <s>Departments can have multiple walkthroughs.</s>
            </li>
            <li>Forms will have form validation.</li>
            <li>Forms will show a small graph.</li>
            <li>
              <s>Graph page.</s>
            </li>
            <li>
              <s>Ability for admins to configure walkthroughs.</s>
            </li>
            <li>Admins can configure user accounts.</li>
            <li>
              Periodicity of walkthroughs:
              <ul>
                <li>Per Shift</li>
                <li>Daily</li>
                <li>
                  Weekly
                  <ul>
                    <li>1st Day</li>
                    <li>2nd Day</li>
                    <li>3rd Day</li>
                    <li>4th Day</li>
                  </ul>
                </li>
                <li>Bi-weekly</li>
                <li>Monthly</li>
              </ul>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
