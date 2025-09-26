import { User } from "@/types";

type UserCardProps = {
  user: User;
  isSelected: boolean;
  onSelectUser: (user: User, isChecked: boolean) => void;
};

export default function UserCard({
  user,
  isSelected,
  onSelectUser,
}: UserCardProps) {
  return (
    <div
      key={user.clerkId}
      className="card bg-neutral text-neutral-content w-full shadow-xl m-4"
    >
      <div className="card-body w-full">
        <div className="grid grid-cols-7 gap-x-4 justify-between items-baseline">
          <input
            type="checkbox"
            className="checkbox"
            name=""
            id={user.clerkId}
            checked={isSelected}
            onChange={(e) => onSelectUser(user, e.target.checked)}
          />
          <h3 className="whitespace-nowrap">{user.firstName}</h3>
          <h3 className="whitespace-nowrap">{user.lastName}</h3>
          <h3 className="whitespace-nowrap">
            {typeof user.department === "object"
              ? user.department.name
              : "No department"}
          </h3>
          {user.assignedWalkthroughs && user.assignedWalkthroughs.length > 0 ? (
            <div className="grid grid-cols-1">
              {user.assignedWalkthroughs.map((walkthrough, index) => {
                if (typeof walkthrough === "object" && walkthrough !== null) {
                  return <h4 key={index}>{walkthrough.name}</h4>;
                } else {
                  return <h4 key={index}>{walkthrough}</h4>;
                }
              })}
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
          {user.enabled ? (
            <h3 className="text-green-500">Enabled</h3>
          ) : (
            <h3 className="text-red-500">Disabled</h3>
          )}
        </div>
      </div>
    </div>
  );
}
