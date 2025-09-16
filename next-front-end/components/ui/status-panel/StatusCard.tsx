"use client";

import { findPrev, getWalkthroughStatus } from "@/lib/api";
import {
  Log,
  PeriodicityOptions,
  Walkthrough,
  WalkthroughStatus,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type StatusCardProps = {
  walkthrough: Walkthrough;
  className?: string;
};

export default function StatusCard({
  walkthrough,
  className = "",
}: StatusCardProps) {
  const [walkthroughStatus, setWalkthroughStatus] = useState<
    WalkthroughStatus | undefined
  >();
  const walkthroughID = walkthrough._id;
  //   console.log("Rendering StatusCard for walkthrough:", walkthrough);

  const {
    isPending: isWalkthroughStatusPending,
    error: walkthroughStatusError,
    isSuccess: isWalkthroughStatusSuccess,
    data: queryWalkthroughStatus,
  } = useQuery<WalkthroughStatus | undefined>({
    queryKey: ["walkthroughStatus", { walkthroughID }],
    queryFn: () => getWalkthroughStatus(walkthroughID!),
    staleTime: 1000 * 60 * 5, // ms s min
    enabled: !!walkthroughID,
  });

  useEffect(() => {
    if (isWalkthroughStatusSuccess && queryWalkthroughStatus) {
      // console.log("Fetched last log for walkthrough", walkthrough._id, ":", queryLastLog.data);
      setWalkthroughStatus(queryWalkthroughStatus);
    }
  }, [queryWalkthroughStatus, isWalkthroughStatusSuccess]);

  if (isWalkthroughStatusPending) return <p>Loading...</p>;
  if (walkthroughStatusError)
    return <p>Error: {walkthroughStatusError.message}. Please try again.</p>;

  if (isWalkthroughStatusSuccess && walkthroughStatus) {
    return (
      <div className={`card ${className}`}>
        <div className="card-body">
          <h2 className="card-title">{walkthrough.name}</h2>
          <p>
            Next Due Date:{" "}
            {walkthrough.nextDueDate
              ? new Date(walkthrough.nextDueDate).toDateString()
              : "No next due date available"}
            <br />
            Periodicity:{" "}
            {walkthrough.periodicity
              ? walkthrough.periodicity
              : "No periodicity available"}
            <br />
            {walkthroughStatus.lastLog ? (
              <>
                Last Log:{" "}
                {walkthroughStatus.lastLog.date
                  ? new Date(walkthroughStatus.lastLog.date).toDateString()
                  : "No last log date available"}
              </>
            ) : (
              "No logs yet"
            )}
            {walkthroughStatus.lastLog?.user && (
              <>
                <br />
                User: {walkthroughStatus.lastLog.user.firstName}{" "}
                {walkthroughStatus.lastLog.user.lastName}
              </>
            )}
          </p>
          {walkthroughStatus.status === "on-time" && (
            <div className="badge badge-success">On Time</div>
          )}
          {walkthroughStatus.lastLog && walkthroughStatus.status === "late" && (
            <div className="badge badge-error">Late</div>
          )}
          {(!walkthroughStatus.lastLog ||
            walkthroughStatus.status === "not-started") && (
            <div className="badge badge-warning">Not Started</div>
          )}
        </div>
      </div>
    );
  }
}
