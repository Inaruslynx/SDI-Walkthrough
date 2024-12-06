"use client";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { updateUser } from "@/lib/api"; // Your backend API call
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";

export default function UserListener() {
    const clerkInstance = useClerk();
    
    const { mutate: handleUpdateUser } = useMutation({
      mutationFn: async (data: User) => {
        return updateUser(data.clerkId, data);
      },
      onSuccess: () => {
        console.log("Profile updated successfully");
      },
      onError: () => {
        console.error("Error updating profile");
      },
    })
  useEffect(() => {
    const handleUserChange = (e) => {
    //   console.log(e);
      if (e.user) {
        const user = clerkInstance.user;
        const updatedAt = new Date(e.user.updatedAt).getTime();
        const now = Date.now();
        if (user && now - updatedAt <= 2000) {
          console.log("User changed:", user);
          const updatedUser = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          };

          handleUpdateUser(updatedUser)
        }
      }
    };

    const unsubscribeCallback = clerkInstance.addListener(handleUserChange);

    return () => {
      unsubscribeCallback();
    };
  }, []);

  return null;
}
