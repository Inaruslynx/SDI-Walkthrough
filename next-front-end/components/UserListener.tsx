"use client";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { createUser, findUser, updateUser } from "@/lib/api"; // Your backend API call
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import { Resources } from "@clerk/types";

export default function UserListener() {
  const clerkInstance = useClerk();

  const { mutate: handleUpdateUser } = useMutation({
    mutationFn: async (data: User) => {
      return updateUser(data.clerkId, data);
    },
    onSuccess: () => {
      console.log("Profile updated successfully");
    },
    onError: (e) => {
      console.error("Error updating profile: ", e);
<<<<<<< HEAD
=======
    },
  });

  const { mutate: handleCreateUser } = useMutation({
    mutationFn: async (data: User) => {
      return createUser(data);
    },
    onSuccess: () => {
      console.log("Profile created successfully");
    },
    onError: (e) => {
      console.error("Error creating profile: ", e);
>>>>>>> b4c46e61970fb7fa4849b07c2d96b7f4c514ff28
    },
  });

  useEffect(() => {
    const handleUserChange = async (r: Resources) => {
      console.log("User change detected", r);
      if (r.user) {
        const user = r.user;
        const theme = localStorage.getItem("theme");
        const dataPackage = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName ? user.firstName : undefined,
          lastName: user.lastName ? user.lastName : undefined,
        };
        const dbUser = await findUser(user.id);
        if (!dbUser.data) {
          console.log("User not found, creating...");
          handleCreateUser(dataPackage);
          return;
        }
        if (isUserDifferent(dbUser.data, dataPackage)) {
          console.log("User data has changed, updating...");
          handleUpdateUser(dataPackage);
        }
      }
    };

    const unsubscribeCallback = clerkInstance.addListener(handleUserChange);

    return () => {
      console.log("Unsubscribing from Clerk user changes");
      unsubscribeCallback();
    };
  }, []);

  return null;
}
function isUserDifferent(data: User, dataPackage: User): boolean {
  if (data.email !== dataPackage.email) return true;
  if (data.firstName !== dataPackage.firstName) return true;
  if (data.lastName !== dataPackage.lastName) return true;
  return false;
}
