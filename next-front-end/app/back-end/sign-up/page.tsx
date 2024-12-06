"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createUser } from "@/lib/api";
import { toast } from "react-toastify";
import { Theme, User } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export default function SignUpPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  //   console.log("In SignUpPage");
  //   console.log("user:", user);

  const redirectUrl = searchParams.get("redirect_url");
  // console.log("redirectUrl:", redirectUrl);

  // useMutation function that makes api post request to create user
  const { mutate: handleCreateNewUser } = useMutation({
    mutationFn: async (data: User) => {
      return createUser(data);
    },
    onSuccess: () => {
      //   console.log("Successfully created new user");
      toast.success("Welcome to SDI Walkthrough!");
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    },
    onError: () => {
      console.log("Failed to create new user");
      toast.error("New account not added to Database.");
      router.push("/sign-up/[[...sign-up]]");
    },
  });

  useEffect(() => {
    // When user changes, check if user is defined then create new user
    if (user && user.primaryEmailAddress) {
      //   console.log("Inside creating a new user");
      const data: User = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        assignedWalkthroughs: [],
        admin: false,
        type: Theme.DARK,
      };
      //   console.log("userDocument:", data);

      handleCreateNewUser(data);
    } else {
      console.log("Didn't create user");
      console.log("user:", user);
    }
  }, [user]);
}
