"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createUser, findUser } from "@/lib/api";
import { toast } from "react-toastify";
import { Theme, User } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";

export default function SignUpPageWrapper() {
  return (
    <Suspense fallback={<div>Creating user...</div>}>
      <SignUpPage />
    </Suspense>
  );
}

function SignUpPage() {
  const [isUserCreated, setIsUserCreated] = useState(false);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  //   console.log("In SignUpPage");
  //   console.log("user:", user);

  const userCheck = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      return await findUser(user?.id!);
    },
    enabled: !!user?.id,
  });

  // console.log("redirectUrl:", redirectUrl);

  // useMutation function that makes api post request to create user
  const { mutate: handleCreateNewUser } = useMutation({
    mutationFn: async (data: User) => {
      return await createUser(data);
    },
    onSuccess: () => {
      //   console.log("Successfully created new user");
      toast.success("Welcome to SDI Walkthrough!");
      const redirectUrl = searchParams.get("redirect_url");
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
    // console.log("usercheck:", userCheck.isError);
    // When user changes, check if user is defined then create new user
    if (
      user &&
      user.primaryEmailAddress &&
      !isUserCreated &&
      !userCheck?.data?.data._id
    ) {
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
      setIsUserCreated(true);
    } else {
      console.log("Didn't create user");
      console.log("user:", user);
    }
  }, [user, isUserCreated, userCheck]);

  return null;
}
