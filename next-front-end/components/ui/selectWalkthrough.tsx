import { Walkthrough, Department } from "@/types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { getWalkthroughs, getAllDepartments } from "@/lib/api";
import React from "react";

export default function SelectWalkthrough({
  text,
  department,
  value,
  onChange,
  className,
}: {
  text: string;
  department?: string;
  value: string;
  onChange: (walkthrough: string) => void;
  className?: string;
}) {
  const [departmentUsed, setDepartmentUsed] = useState(false);

  useEffect(() => {
    if (department) {
      console.log("department:", department);
      setDepartmentUsed(true);
    } else {
      console.log("No department");
      setDepartmentUsed(false);
    }
  }, [department]);

  // Fetch all walkthroughs
  const walkthroughs = useQuery<AxiosResponse<Walkthrough[]>, Error>({
    queryKey: ["walkthrough", { department }],
    queryFn: () => getWalkthroughs(department),
    staleTime: 1000 * 60 * 5,
    enabled: departmentUsed,
  });

  // Get walkthroughs via departments
  const departments = useQuery<AxiosResponse<Department[]>, Error>({
    queryKey: ["departments"],
    queryFn: () => getAllDepartments(),
    staleTime: 1000 * 60 * 5,
    enabled: !departmentUsed,
  });

  useEffect(() => {
    if (walkthroughs.isSuccess) {
      console.log("walkthroughs:", walkthroughs.data?.data);
    }
  }, [walkthroughs.isSuccess, walkthroughs.data]);

  // useEffect(() => {
  //   if (departments.isSuccess) {
  //     console.log(departments.data.data);
  //   }
  // }, [departments]);

  return (
    <select
      className={`select ${className || ""}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option disabled value="">
        {text}
      </option>
      {departmentUsed
        ? walkthroughs.isSuccess &&
          Array.isArray(walkthroughs.data?.data) &&
          walkthroughs.data.data.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))
        : departments.isSuccess &&
          Array.isArray(departments.data?.data) &&
          departments.data.data.map((department) => (
            <React.Fragment key={department._id}>
              <option disabled key={department._id} value={department._id}>
                ----{department.name}----
              </option>
              {department.walkthroughs.map((walkthrough) => (
                <option key={walkthrough._id} value={walkthrough._id}>
                  {walkthrough.name}
                </option>
              ))}
            </React.Fragment>
          ))}
    </select>
  );
}
