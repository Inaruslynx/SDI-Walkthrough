"use client";
import React from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/utils/api";

const schema = z.object({
  dataSelection: z.string().min(1, { message: "Please select a data point." }),
  fromDate: z
    .date()
    .min(new Date("2023-12-01"), {
      message: "Please select a date after 2023-12-01.",
    })
    .max(new Date(), { message: "Please select a date before today." }),
  toDate: z
    .date()
    .min(new Date("2023-12-01"), {
      message: "Please select a date after 2023-12-01.",
    })
    .max(new Date(), { message: "Please select a date before today." }),
});

type FormData = z.infer<typeof schema>;

interface PostResponse {
  data: [{date: string, value: number}];
}

interface GraphData {
  labels: Date[];
  datasets: [
    {
      data: number[];
    },
  ];
}

export default function GraphForm({
  Options,
  fromDate,
  toDate,
  onDataFromChild,
}: {
  Options: string[];
  fromDate: Date;
  toDate: Date;
  onDataFromChild: (data: GraphData) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dataSelection: "",
      fromDate: fromDate,
      toDate: toDate,
    },
  });

  const GetGraph: SubmitHandler<FormData> = async (formData) => {
    try {
      // Make Axios POST request with input data
      // response should be [{date: Date, value: number}]
      console.log("form data:", formData);
      const response: PostResponse = await api.post(
        "http://fs3s-hotmilllog/HM_Walkthrough/api/graph",
        {
          dataSelection: formData.dataSelection,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        }
      );
      console.log("recieved data:", response);
      const labels: Date[] = response.data.map((item) => new Date(item.date));
      const data: number[] = response.data.map((item) => item.value);

      // Set the results in state
      onDataFromChild({ labels, datasets: [{ data }] });
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(GetGraph)}>
        <select
          {...register("dataSelection")}
          onChange={(e) => setValue("dataSelection", e.target.value)}
          title="datapoint"
          name="datapoint"
          id="datapoint"
        >
          {Options.map((datapoint) => (
            <option key={datapoint} value={datapoint}>
              {datapoint}
            </option>
          ))}
        </select>
        {errors.dataSelection && (
          <p className="text-red-500">{errors.dataSelection.message}</p>
        )}

        <label htmlFor="FromDate">From Date</label>
        <input
                  {...register("fromDate")}
                  onChange={(e) => setValue("fromDate", new Date(e.target.value))}
          title="FromDate"
          name="FromDate"
          type="date"
        />
        {errors.fromDate && (
          <p className="text-red-500">{errors.fromDate.message}</p>
        )}
        <label htmlFor="ToDate">To Date</label>
        <input
                  {...register("toDate")}
                  onChange={(e) => setValue("toDate", new Date(e.target.value))}
          title="ToDate"
          name="ToDate"
          type="date"
        />
        {errors.toDate && (
          <p className="text-red-500">{errors.toDate.message}</p>
        )}
        {/* Button to trigger the Axios POST request */}
        <button className="btn btn-primary" type="submit">
          Get Graph
        </button>
      </form>
    </>
  );
}
