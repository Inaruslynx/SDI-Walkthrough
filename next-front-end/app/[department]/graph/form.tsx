"use client";

import { format } from "date-fns";
import { toast } from "react-toastify";
import { ChartData } from "chart.js";
import { getGraph } from "@/lib/api";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GraphData } from "@/types";

// const FormSchema = z.object({
//   dataSelection: z.string().min(1, { message: "Please select a data point." }),
//   fromDatePicker: z.date(),
//   toDatePicker: z.date(),
// });

// type PostResponse = AxiosResponse<
//   [
//     {
//       date: string;
//       value: number;
//     },
//   ]
// >;

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
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     dataSelection: "",
  //     fromDatePicker: new Date(fromDate),
  //     toDatePicker: new Date(toDate),
  //   },
  // });
  //   console.log("fromDate:", fromDate);
  //   console.log("toDate:", toDate);

  const graphFormMutation = useMutation({
    mutationFn: async () =>
      getGraph(
        walkthroughId,
        selectedDataPoint,
        selectedToDate,
        selectedFromDate
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
    <div className="inline-flex items-baseline">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Value to graph</span>
        </div>
        <select
          className="select select-bordered m-2"
          onChange={(e) => setSelectedDataPoint(e.target.value)}
          value={selectedDataPoint}
        >
          <option value="" disabled>
            Pick one
          </option>
          {options.map((datapoint) => (
            <option key={datapoint._id} value={datapoint._id}>
              {datapoint.text}
            </option>
          ))}
        </select>
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">From</span>
        </div>
        <input
          className="m-2 bg-base-100 text-base-100-content"
          type="date"
          value={selectedFromDate}
          onChange={(e) => setSelectedFromDate(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">To</span>
        </div>
        <input
          className="m-2 bg-base-100 text-base-100-content"
          type="date"
          value={selectedToDate}
          onChange={(e) => setSelectedToDate(e.target.value)}
        />
      </label>
      <button className="btn btn-primary m-2 mb-3 self-end" onClick={onSubmit}>
        Graph
      </button>
    </div>
  );
}
