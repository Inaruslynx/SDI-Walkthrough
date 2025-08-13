"use client";

import { format } from "date-fns";
import { toast } from "react-toastify";
import { ChartData } from "chart.js";
import { getGraph } from "@/lib/api";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GraphData } from "@/types";
import DatePicker from "@/components/ui/DatePicker";


interface GraphFormProps {
  onDataFromChild: (data: ChartData<"line">) => void;
  walkthroughId: string;
  options: { _id: string; text: string }[];
}

export default function GraphForm({
  onDataFromChild,
  walkthroughId,
  options,
}: GraphFormProps) {
  const [selectedDataPoint, setSelectedDataPoint] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState<Date>();
  const [selectedToDate, setSelectedToDate] = useState<Date>();

  const graphFormMutation = useMutation({
    mutationFn: async () =>
      getGraph(
        walkthroughId,
        selectedDataPoint,
        selectedToDate?.toDateString(),
        selectedFromDate?.toDateString()
      ),
    onSuccess: (data: GraphData) => {
      toast.success("Successfully got graph data.");
      onDataFromChild({
        labels: data.labels,
        datasets: data.datasets.map((dataset) => ({
          data: dataset.data.map((value) => Number(value)),
        })),
      });
    },
    onError: (e) => {
      toast.error(`Failed to get graph data. ${e}`);
    },
  });

  async function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    graphFormMutation.mutate();
    // toast.success("Successfully got graph!");
    // try {
    //   // Make Axios POST request with input data
    //   // response should be [{date: Date, value: number}]
    //   //   console.log("form data:", Data);
    //   const response = await api.post("graph", {
    //     dataSelection: selectedDataPoint,
    //     fromDate: selectedFromDate,
    //     toDate: selectedToDate,
    //   });
    //   //   console.log("recieved data:", response);
    //   const labels: string[] = response.data.map((item) => item.date);
    //   const data: number[] = response.data.map((item) => item.value);

    //   // Set the results in state
    //   onDataFromChild({ labels, datasets: [{ data }] });
    // } catch (error) {
    //   console.error("Error fetching graph data:", error);
    // }
  }

  return (
    <div>
      <label className="form-control mx-2 max-w-md whitespace-nowrap">
        <div className="label">
          <span className="label-text">
            <strong>Value to graph: </strong>
          </span>
        </div>
        <select
          id="selectedDataPoint"
          className="select select-bordered m-2"
          onChange={(e) => setSelectedDataPoint(e.target.value)}
          value={selectedDataPoint}
        >
          <option value="" disabled>
            Datapoint
          </option>
          {options.map((datapoint) => (
            <option key={datapoint._id} value={datapoint._id}>
              {datapoint.text}
            </option>
          ))}
        </select>
      </label>
      <DatePicker
        value={selectedFromDate}
        className="inline-flex mx-2 items-center gap-2"
        onChange={(e) => setSelectedFromDate(e)}
      >
        From:{" "}
      </DatePicker>

      <DatePicker
        value={selectedToDate}
        className="inline-flex mx-2 items-center gap-2"
        onChange={(e) => setSelectedToDate(e)}
      >
        To:{" "}
      </DatePicker>

      <button className="btn btn-primary m-2 mb-3 self-end" onClick={onSubmit}>
        Graph
      </button>
    </div>
  );
}
