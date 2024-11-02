"use client";
import { useQuery } from "@tanstack/react-query";
import { findAllUsers, getWalkthroughs } from "@/lib/api";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { AxiosResponse } from "axios";
import UserCard from "./userCard";
import IconUsers from "@/components/ui/icons/users";

export default function UsersPage({
  params,
}: {
  params: { department: string };
}) {
  const [users, setUsers] = useState<User[]>([]);

  const usersQuery = useQuery<AxiosResponse<User[]>, Error>({
    queryKey: ["users"],
    queryFn: () => findAllUsers(),
    staleTime: 1000 * 60 * 5, // ms s min
  });

  useEffect(() => {
    if (usersQuery.isSuccess && usersQuery.data) {
      // console.log(usersQuery.isSuccess);
      // console.log(usersQuery.data.data);
      setUsers((prevUsers: User[]) => {
        const newUsers = usersQuery.data!.data;
        // Merge existing users with new users, ensuring no duplicates by user ID
        const mergedUsers = [...prevUsers];
        newUsers.forEach((newUser) => {
          const existingUser = mergedUsers.find(
            (user) => user.clerkId === newUser.clerkId
          );
          if (!existingUser) {
            mergedUsers.push(newUser);
          }
        });
        return mergedUsers;
      });
    }
  }, [usersQuery.isSuccess, usersQuery.data]);

  return (
    <div className="px-8 pb-4">
      <div className="mb-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">Admin - User Control</h1>
      </div>
      <div className="my-4 mx-8 prose md:prose-lg m-2">
        <h3>
          {<IconUsers />}Users: {users.length}
        </h3>
      </div>
      {usersQuery.isLoading ? (
        <div className="skeleton h-32 w-11/12"></div>
      ) : null}
      {usersQuery.isSuccess ? (
        <div className="m-4">
          {users.map((user: User) => (
            <UserCard key={user.clerkId} user={user} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
