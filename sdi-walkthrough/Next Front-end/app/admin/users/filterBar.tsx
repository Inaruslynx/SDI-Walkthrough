import React, { useState } from "react";
import { User } from "@/types";

type Props = {
  users: User[];
  onFilter: (filteredUsers: User[]) => void;
};

export default function FilterBar({ users, onFilter }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Filter users based on search query
    const filteredUsers = users.filter((user) => {
      const queryLower = query.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(queryLower) ||
        user.lastName?.toLowerCase().includes(queryLower) ||
        user.email.toLowerCase().includes(queryLower) ||
        user.department?.name.toLowerCase().includes(queryLower) ||
        (user.assignedWalkthroughs?.length &&
          user.assignedWalkthroughs.some((walkthrough) =>
            walkthrough.name.toLowerCase().includes(queryLower)
          )) ||
        (user.admin ? "admin" : "").includes(queryLower) ||
        (user.type ? user.type.toLowerCase().includes(queryLower) : false)
      );
    });

    // Pass filtered users back to the parent component
    onFilter(filteredUsers);
  };

  return (
    <div className="bg-neutral flex inline-flex w-full">
      <div className="flex inline-flex items-baseline m-2 w-full">
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            Filter
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {SortCategoryArray.map(({ value, label }) => (
              <li key={value}>
                <a>{label}</a>
              </li>
            ))}
          </ul>
        </div> */}
        <input
          type="text"
          placeholder="Search..."
          name="filterSearch"
          id="filterSearch"
          className="input input-bordered w-full m-2"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchQuery ? (
          <button
            className="btn btn-error m-2 px-8"
            onClick={() => handleSearch("")}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
