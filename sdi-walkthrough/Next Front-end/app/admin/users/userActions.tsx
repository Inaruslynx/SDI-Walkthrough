import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Department, Walkthrough } from "@/types";
import { updateUserMutation } from "./mutations";
import { getDepartmentData, getWalkthroughs } from "@/lib/api";
import { AxiosResponse } from "axios";

type UserActionsProps = {
  selectedUsers: User[];
  onClearSelection: () => void;
};

export default function UserActions({
  selectedUsers,
  onClearSelection,
}: UserActionsProps) {
  const [assignDepartment, setAssignDepartment] = useState("");
  const [assignWalkthrough, setAssignWalkthrough] = useState("");
  const [removeWalkthrough, setRemoveWalkthrough] = useState("");
  const [isAssignWalkthroughValid, setIsAssignWalkthroughValid] =
    useState(true);
  const [isRemoveWalkthroughValid, setIsRemoveWalkthroughValid] =
    useState(true);

  const departments = useQuery<AxiosResponse<Department[]>, Error>({
    queryKey: ["departments"],
    queryFn: getDepartmentData,
    staleTime: 1000 * 60 * 5, // ms * s * m
  });

  const walkthroughs = useQuery<AxiosResponse<Walkthrough[]>, Error>({
    queryKey: ["walkthrough"],
    queryFn: () => getWalkthroughs(),
    staleTime: 1000 * 60 * 60, // ms s min
  });

  const useUpdateUserMutation = updateUserMutation;

  const handleUpdateUsers = () => {
    const updatedUsers: User[] = selectedUsers;
    if (assignDepartment !== "") {
      // Modify users by forEach
    }
    if (assignWalkthrough !== "") {
      // Modify users by forEach
    }
    if (removeWalkthrough !== "") {
      // Modify users by forEach
    }
    // send updated users
    updatedUsers.forEach((user) => {
      useUpdateUserMutation.mutate(user);
    });
  };

  useEffect(() => {
    if (walkthroughs.isSuccess) {
      console.log(walkthroughs.data.data);
    }
  }, [walkthroughs.data]);

  return (
    <>
      <div className="card flex animate-growDown justify-between items-baseline bg-accent p-4 rounded-xl shadow m-4 w-full">
        <div className="card-body w-full">
          <div className="inline-flex items-baseline">
            <select
              name="departmentSelector"
              id="departmentSelector"
              value={assignDepartment}
              onChange={(e) => setAssignDepartment(e.target.value)}
              className="select select-ghost text-accent-content m-2"
            >
              <option value="" disabled hidden>
                Assign Department
              </option>
              {departments.isSuccess &&
                departments.data.data &&
                departments.data.data.map((department: Department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
            </select>
            <label className="form-control text-accent-content m-2">
              <select
                name="assignWalkthroughSelector"
                id="assignWalkthroughSelector"
                className={`select select-ghost text-accent-content ${!isAssignWalkthroughValid ? "select-error" : ""}`}
              >
                <option value="" disabled hidden>
                  Assign Walkthrough
                </option>
              </select>
              {!isAssignWalkthroughValid ? (
                <div className="label">
                  <span className="label-text-alt text-accent-content">
                    Not all of the users are in the same Department
                  </span>
                </div>
              ) : null}
            </label>
            <label className="form-control text-accent-content m-2">
              <select
                name="removeWalkthroughSelector"
                id="removeWalkthroughSelector"
                className={`select select-ghost text-accent-content ${
                  !isRemoveWalkthroughValid ? "select-error" : ""
                }`}
              >
                <option value="" disabled hidden>
                  Remove Walkthrough
                </option>
              </select>
              {!isRemoveWalkthroughValid ? (
                <div className="label">
                  <span className="label-text-alt text-accent-content">
                    Not all the users have the selected Walkthrough
                  </span>
                </div>
              ) : null}
            </label>
            <button
              className="btn btn-primary m-2"
              onClick={() => handleUpdateUsers()}
            >
              Submit
            </button>
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn btn-danger justify-self-end"
              onClick={onClearSelection}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
