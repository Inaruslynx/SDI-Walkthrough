import { User } from "@/types";

export default function UserCard({ user }: { user: User }) {
  return (
    <div
      key={user.clerkId}
      className="card bg-neutral text-neutral-content w-11/12 shadow-xl m-4"
    >
      <div className="card-body !flex-grow !w-full">
        <div className="grid grid-rows-1 grid-flow-col gap-4 items-baseline">
          <input type="checkbox" className="checkbox" name="" id="" />
          <h3 className="whitespace-nowrap">
            {user.firstName} {user.lastName}
          </h3>
          <h3 className="whitespace-nowrap">
            {user.department?.name || "No department"}
          </h3>
          {user.assignedWalkthroughs && user.assignedWalkthroughs.length > 0 ? (
            <div className="grid grid-cols-1">
              {user.assignedWalkthroughs.map((walkthrough, index) => (
                <h4 key={index}>{walkthrough.name}</h4>
              ))}
            </div>
          ) : (
            <h3 className="whitespace-nowrap">No walkthroughs</h3>
          )}
          {/* <div className="grid grid-cols-1">
                    <h3>test</h3>
                    <h3>test</h3>
                    <h3>test</h3>
                  </div> */}
          {user.admin ? <h3>Admin</h3> : <h3>User</h3>}
        </div>
      </div>
    </div>
  );
}
