"use client";
import { getWalkthroughs } from "@/lib/api";
import { Walkthrough } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { use, useEffect, useState } from "react";
import StatusCard from "./StatusCard";

// Status panel needs to check if in department and grab walkthroughs for the department
// or if not in department, grab all walkthroughs
// This component will then analyze the status and display appropriate messages

type StatusPanelProps = {
  department: string;
  className?: string;
};

export default function StatusPanel({
  department,
  className = "",
}: StatusPanelProps) {
  const [walkthroughs, setWalkthroughs] = useState<Walkthrough[] | undefined>(
    undefined
  );

  const {
    isPending: isWalkthroughsPending,
    error: walkthroughsError,
    isSuccess: isWalkthroughsSuccess,
    data: queryWalkthroughs,
  } = useQuery<AxiosResponse<Walkthrough[]>, Error>({
    queryKey: ["walkthroughs", { department }],
    queryFn: () => getWalkthroughs(department),
    staleTime: 1000 * 60 * 5, // ms s min
  });

  useEffect(() => {
    if (isWalkthroughsSuccess && queryWalkthroughs) {
      // console.log("Fetched walkthroughs:", queryWalkthroughs.data);
      setWalkthroughs(queryWalkthroughs.data);
    }
  }, [queryWalkthroughs, isWalkthroughsSuccess]);

  if (isWalkthroughsPending) return <p>Loading...</p>;
  if (walkthroughsError)
    return <p>Error: {walkthroughsError.message}. Please try again.</p>;
  if (isWalkthroughsSuccess && walkthroughs) {
    // console.log("Fetched walkthroughs:", walkthroughs);
    return (
      <div className={`status-panel ${className}`}>
        {walkthroughs.map((walkthrough) => (
          <StatusCard
            key={walkthrough._id}
            walkthrough={walkthrough}
            className="bg-base-200 rounded-box m-4 card-border shadow-md"
          />
        ))}
      </div>
    );
  }
}
