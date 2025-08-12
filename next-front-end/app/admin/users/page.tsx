"use client";
import { useQuery } from "@tanstack/react-query";
import { findAllUsers } from "@/lib/api";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { AxiosResponse } from "axios";
import UserCard from "./userCard";
import IconUsers from "@/components/ui/icons/users";
import SortBar from "./sortBar";
import FilterBar from "./filterBar";
import UserActions from "./userActions";
import React from "react";

// Define an array of sort categories
const SortCategoryArray = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "department", label: "Department" },
  { value: "walkthroughs", label: "Assigned Walkthroughs" },
  { value: "userLevel", label: "User Level" },
] as const;

// Use the array to create a union type
export type SortCategory = (typeof SortCategoryArray)[number]["value"];

// Define the sort status type based on SortCategory
export type SortStatus = {
  [K in SortCategory]: "asc" | "desc" | "none";
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortStatus, setSortStatus] = useState<SortStatus>({
    firstName: "none",
    lastName: "asc",
    department: "none",
    walkthroughs: "none",
    userLevel: "none",
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isMainChecked, setIsMainChecked] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const usersQuery = useQuery<AxiosResponse<User[]>, Error>({
    queryKey: ["users"],
    queryFn: () => findAllUsers(),
    staleTime: 1000 * 60 * 5, // ms s min
  });

  const handleToggleMainCheckbox = () => {
    setIsMainChecked(!isMainChecked);
    // Set all user IDs to `selectedUserIds` if checked, or clear if unchecked
    setSelectedUsers(!isMainChecked ? filteredUsers : []);
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
    setIsMainChecked(false); // Uncheck MainCheckBox if it was checked
  };

  const handleSelectUser = (user: User, isChecked: boolean) => {
    setSelectedUsers((prev) => {
      if (isChecked) {
        return [...prev, user];
      } else {
        return prev.filter(
          (selectedUser) => selectedUser.clerkId !== user.clerkId
        );
      }
    });
  };

  const handleSort = (category: SortCategory) => {
    // console.log("category:", category);
    setSortStatus((prevStatus) => {
      const newStatus: SortStatus = Object.keys(prevStatus).reduce(
        (acc, key) => {
          acc[key as keyof SortStatus] =
            key === category
              ? prevStatus[key as keyof SortStatus] === "asc"
                ? "desc"
                : "asc"
              : "none";
          return acc;
        },
        {} as SortStatus
      );
      // console.log("prevStatus:", prevStatus);
      // console.log("newStatus:", newStatus);

      const isAscending = newStatus[category] === "asc";

      const sortedUsers = [...users].sort((a, b) => {
        let compareA, compareB;
        switch (category) {
          case "firstName":
            compareA = a.firstName?.toLowerCase() || "";
            compareB = b.firstName?.toLowerCase() || "";
            break;
          case "lastName":
            compareA = a.lastName?.toLowerCase() || "";
            compareB = b.lastName?.toLowerCase() || "";
            break;
          case "department":
            const getDepartmentName = (
              dept: string | { name: string } | undefined
            ) =>
              typeof dept === "string"
                ? dept.toLowerCase()
                : dept?.name.toLowerCase() || "";

            compareA = getDepartmentName(a.department);
            compareB = getDepartmentName(b.department);
            break;
          case "walkthroughs":
            compareA = a.assignedWalkthroughs?.length || 0;
            compareB = b.assignedWalkthroughs?.length || 0;
            break;
          case "userLevel":
            compareA = a.admin ? 1 : 0;
            compareB = b.admin ? 1 : 0;
            break;
          default:
            return 0;
        }

        if (compareA < compareB) return isAscending ? -1 : 1;
        if (compareA > compareB) return isAscending ? 1 : -1;
        return 0;
      });
      // console.log("sortedUsers:", sortedUsers);
      setUsers(sortedUsers);

      return newStatus;
    });
  };

  useEffect(() => {
    if (usersQuery.isSuccess && usersQuery.data && usersQuery.data.data) {
      // console.log(usersQuery.isSuccess);
      // console.log(usersQuery.data.data);
      // Directly set the users from the query data
      setUsers(usersQuery.data.data);
    }
  }, [usersQuery.isSuccess, usersQuery.data]);

  // useEffect(() => {
  //   if (users.length > 0) {
  //     setFilteredUsers(users);
  //   }
  // }, [users]);

  return (
    <div className="mx-8 mb-4 p-8">
      <div className="mb-4 relative justify-center prose md:prose-lg max-w-full">
        <h1 className="text-center">Admin - User Control</h1>
      </div>

      <div className="w-full my-4 mx-8 pr-4 inline-flex">
        <div className="prose md:prose-lg w-32">
          <h3>
            {<IconUsers />}Users: {filteredUsers.length}
          </h3>
        </div>
        <FilterBar users={users} onFilter={setFilteredUsers} />
      </div>

      {selectedUsers.length > 0 && (
        <UserActions
          selectedUsers={selectedUsers}
          onClearSelection={handleClearSelection}
        />
      )}

      <SortBar
        sortStatus={sortStatus}
        onSort={handleSort}
        isMainChecked={isMainChecked}
        onToggleMainCheckbox={handleToggleMainCheckbox}
      />

      {usersQuery.isLoading ? (
        <div className="skeleton h-32 w-full"></div>
      ) : null}

      {usersQuery.isSuccess ? (
        <div>
          {filteredUsers.map((user: User) => (
            <UserCard
              key={user.clerkId}
              user={user}
              isSelected={selectedUsers.some(
                (selectedUser) => selectedUser.clerkId === user.clerkId
              )}
              onSelectUser={handleSelectUser}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
