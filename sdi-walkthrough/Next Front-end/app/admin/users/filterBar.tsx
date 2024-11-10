import React, { useEffect, useState } from "react";
import { User } from "@/types";

type Props = {
  users: User[];
  onFilter: (filteredUsers: User[]) => void;
};

export default function FilterBar({ users, onFilter }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const queryLower = searchQuery.toLowerCase();
    // console.log("users:", users);

    // Filter users based on search query
    const filteredUsers = users.filter((user) => {
      return (
        user.firstName?.toLowerCase().includes(queryLower) ||
        user.lastName?.toLowerCase().includes(queryLower) ||
        user.email.toLowerCase().includes(queryLower) ||
        user.department?.name.toLowerCase().includes(queryLower) ||
        (user.assignedWalkthroughs?.length &&
          user.assignedWalkthroughs.some((walkthrough) =>
            walkthrough.name.toLowerCase().includes(queryLower),
          )) ||
        (user.admin ? "admin" : "").includes(queryLower) ||
        (user.type ? user.type.toLowerCase().includes(queryLower) : false)
      );
    });

    // Pass filtered users back to the parent component
    onFilter(filteredUsers);
  };

  useEffect(() => {
    handleSearch();
  }, [users, searchQuery]);

  return (
    <div className="bg-neutral flex inline-flex w-full">
      <div className="flex inline-flex items-baseline m-2 w-full">
        <input
          type="text"
          placeholder="Search..."
          name="filterSearch"
          id="filterSearch"
          className="input input-bordered w-full m-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            className="btn btn-error m-2 px-8"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
