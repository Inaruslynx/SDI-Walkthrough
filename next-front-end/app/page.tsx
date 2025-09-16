import StatusPanel from "@/components/ui/status-panel/StatusPanel";

export default function Home() {
  return (
    <>
      <h1 className="text-5xl mb-8 justify-self-center self-center place-self-center text-center">
        <b>Welcome to SDI Walkthrough</b>
      </h1>
      <main className="px-12 bg-base-100 prose md:prose-lg text-base-content min-w-full">
        <StatusPanel className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      </main>
    </>
  );
}

{
  /* <h3>TODO List:</h3>
          <ul className="px-6">
            <li>Fix all of the Walkthrough requests.</li>
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
                  Weekly (Shift)
                  <ul>
                    <li>1st Day</li>
                    <li>2nd Day</li>
                    <li>3rd Day</li>
                    <li>4th Day</li>
                  </ul>
                </li>
                <li>
                  Weekly
                  <ul>
                    <li>Sunday</li>
                    <li>Monday</li>
                    <li>Tuesday</li>
                    <li>Wednesday</li>
                    <li>Thursday</li>
                    <li>Friday</li>
                    <li>Saturday</li>
                  </ul>
                </li>
                <li>Bi-weekly</li>
                <li>Monthly</li>
                <li>As needed</li>
              </ul>
            </li>
          </ul> */
}
