import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Department, User } from "@/types";
import { useUpdateUserMutation } from "./mutations";
import { getAllDepartments } from "@/lib/api";
import { AxiosResponse } from "axios";
import SelectWalkthrough from "@/components/ui/SelectWalkthrough";

type UserActionsProps = {
  selectedUsers: User[];
  onClearSelection: () => void;
};

type WalkthroughCount = {
  walkthrough: string;
  count: number;
  name: string;
};

function allHaveSameProperty<T>(
  array: T[],
  keyPath: (keyof T | string)[]
): boolean {
  if (array.length === 0) return true;

  // Helper function to get the nested property value
  const getValue = (obj: any, path: (keyof T | string)[]) => {
    return path.reduce((value, key) => (value ? value[key] : undefined), obj);
  };

  const firstValue = getValue(array[0], keyPath);

  return array.every((item) => getValue(item, keyPath) === firstValue);
}

function getDepartment(users: User[]): string {
  if (!users[0].department) return "";
  return typeof users[0].department === "string"
    ? users[0].department
    : (users[0].department._id ?? "");
}

function countWalkthroughs(users: User[]): WalkthroughCount[] {
  const countMap: Record<string, { name: string; count: number }> = {};

  users.forEach((user) => {
    user.assignedWalkthroughs?.forEach((walkthrough) => {
      const id =
        typeof walkthrough === "string" ? walkthrough : walkthrough._id;
      const name = typeof walkthrough === "string" ? "" : walkthrough.name;
      if (id) {
        if (!countMap[id]) {
          countMap[id] = { name, count: 1 };
        } else {
          countMap[id].count += 1;
        }
      }
    });
  });

  return Object.entries(countMap).map(([walkthrough, { name, count }]) => ({
    walkthrough,
    name,
    count,
  }));
}

export default function UserActions({
  selectedUsers,
  onClearSelection,
}: UserActionsProps) {
  const [assignDepartment, setAssignDepartment] = useState("");
  const [assignWalkthrough, setAssignWalkthrough] = useState("");
  const [removeWalkthrough, setRemoveWalkthrough] = useState("");
  const [usersDepartment, setUsersDepartment] = useState("");
  const [isAssignWalkthroughValid, setIsAssignWalkthroughValid] =
    useState(true);
  const [validRemoveWalkthroughs, setValidRemoveWalkthroughs] =
    useState<{ _id: string; name: string }[]>();

  const departments = useQuery<AxiosResponse<Department[]>, Error>({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    staleTime: 1000 * 60 * 5, // ms * s * m
  });

  const handleUpdateUserMutation = useUpdateUserMutation();

  const handleUpdateUsers = () => {
    if (selectedUsers.length === 0) return;
    let updatedUsers: User[] = [];

    if (assignDepartment !== "") {
      // Modify users by forEach
      selectedUsers.forEach((user) => {
        user.department = assignDepartment;
        // console.log(user);
        updatedUsers.push(user);
      });
      setAssignDepartment("");
    }

    if (assignWalkthrough !== "") {
      selectedUsers.forEach((user) => {
        console.log("user:", user);

        // Normalize assignedWalkthroughs to an array of strings for comparison
        const walkthroughIds = Array.isArray(user.assignedWalkthroughs)
          ? user.assignedWalkthroughs.map((w) =>
              typeof w === "string" ? w : w._id
            )
          : [];

        if (!walkthroughIds.includes(assignWalkthrough)) {
          // Add the new walkthrough
          (user.assignedWalkthroughs as string[]).push(assignWalkthrough);
        }

        updatedUsers.push(user);
      });
      setAssignWalkthrough("");
    }

    if (removeWalkthrough !== "") {
      selectedUsers.forEach((user) => {
        if (Array.isArray(user.assignedWalkthroughs)) {
          user.assignedWalkthroughs = user.assignedWalkthroughs
            .map((walkthrough) =>
              typeof walkthrough === "string" ? walkthrough : walkthrough._id
            )
            .filter(
              (walkthroughId): walkthroughId is string =>
                walkthroughId !== undefined &&
                walkthroughId !== removeWalkthrough
            );
        }
        updatedUsers.push(user);
      });
      setRemoveWalkthrough("");
    }
    // send updated users
    if (updatedUsers.length === 0) return;
    console.log("updateUsers:", updatedUsers);
    updatedUsers.forEach((user) => {
      handleUpdateUserMutation.mutateAsync(user);
    });
  };

  // useEffect(() => {
  //   if (walkthroughs.isSuccess) {
  //     console.log(walkthroughs.data.data);
  //   }
  // }, [walkthroughs.data]);

  useEffect(() => {
    if (selectedUsers.length === 0) return;
    console.log("selectedUsers:", selectedUsers);
    const walkthroughs = countWalkthroughs(selectedUsers);

    // Filter walkthroughs where count matches the number of selectedUsers and keep name
    const validWalkthroughs = walkthroughs
      .filter((w) => w.count === selectedUsers.length)
      .map((w) => ({ _id: w.walkthrough, name: w.name }));

    setValidRemoveWalkthroughs(validWalkthroughs);

    if (allHaveSameProperty(selectedUsers, ["department", "name"])) {
      setIsAssignWalkthroughValid(true);
      setUsersDepartment(getDepartment(selectedUsers));
    } else {
      setIsAssignWalkthroughValid(false);
      setUsersDepartment("");
    }
  }, [selectedUsers]);

  return (
    <>
      <div className="card flex animate-grow-down justify-between items-baseline bg-accent p-4 rounded-xl shadow-sm m-4 w-full">
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
              <SelectWalkthrough
                text={"Assign Walkthrough"}
                department={
                  usersDepartment !== "" ? usersDepartment : undefined
                }
                value={assignWalkthrough}
                onChange={setAssignWalkthrough}
                className={`select-ghost text-accent-content ${!isAssignWalkthroughValid ? "select-error" : ""}`}
              />
              {!isAssignWalkthroughValid ? (
                <div className="label">
                  <span className="label-text-alt text-accent-content">
                    Not all the users are in the same Department
                  </span>
                </div>
              ) : null}
            </label>
            <label className="form-control text-accent-content m-2">
              <select
                name="removeWalkthroughSelector"
                id="removeWalkthroughSelector"
                value={removeWalkthrough}
                onChange={(e) => setRemoveWalkthrough(e.target.value)}
                className={`select select-ghost text-accent-content ${
                  selectedUsers.length > 0 &&
                  validRemoveWalkthroughs?.length === 0
                    ? "select-error"
                    : ""
                }`}
              >
                <option value="" disabled hidden>
                  Remove Walkthrough
                </option>
                {selectedUsers.length > 0 &&
                  validRemoveWalkthroughs &&
                  validRemoveWalkthroughs?.length !== 0 &&
                  validRemoveWalkthroughs.map((walkthrough) => (
                    <option key={walkthrough._id} value={walkthrough._id}>
                      {walkthrough.name}
                    </option>
                  ))}
              </select>
              {selectedUsers.length > 0 &&
              validRemoveWalkthroughs?.length === 0 ? (
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
