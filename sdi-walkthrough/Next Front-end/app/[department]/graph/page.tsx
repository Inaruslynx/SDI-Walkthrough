"use client";
import { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ChartData } from "chart.js";
import Graph from "./graph";
import GraphForm from "./form";
import api, { findAllLogs, getWalkthroughs } from "@/lib/api";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { AxiosResponse } from "axios";
import { Walkthroughs } from "@/types";

interface Response {
  data: {
    dataPoints: string[];
    fromDate: string;
    toDate: string;
  };
}

interface FetchData {
  options: string[];
  fromDate: string;
  toDate: string;
}

export default function GraphPage(
  props: {
    params: Promise<{ department: string }>;
    }
) {
  const params = use(props.params);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState(
    "Select a Walkthrough"
  );
  const [Results, setResults] = useState<ChartData<"line">>();
  const [ShowGraph, setShowGraph] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [Options, setOptions] = useState<string[]>([]);
  const [FromDate, setFromDate] = useState<string>(new Date().toDateString());
  const [ToDate, setToDate] = useState<string>(new Date().toDateString());

  // Fetch all walkthroughs for department
  const walkthroughs = useQuery<AxiosResponse<Walkthroughs>, Error>({
    queryKey: ["walkthrough", { department: params.department }],
    queryFn: () => getWalkthroughs(params.department),
    staleTime: 1000 * 60 * 5,
  });

  const graphDataQuery = useQuery({
    queryKey: ["logs"],
    queryFn: () => findAllLogs(selectedWalkthrough),
    enable: selectedWalkthrough !== "Select a Walkthrough",
  })

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log("Fetching form initial data.");
  //     try {
  //       const response: Response = await api.get(`graph`, {
  //         params: {
  //           walkthrough: params.department,
  //         },
  //       });
  //       // console.log("useEffect ran for Form initial load");
  //       // console.log("recieved data:", response.data);
  //       setOptions(response.data.dataPoints);
  //       setFromDate(response.data.fromDate);
  //       setToDate(response.data.toDate);
  //       setShowForm(true);
  //       // console.log("Finished fetching form data.");
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [params.department]);

  const handleDataFromChild = (data: ChartData<"line">) => {
    setResults(data);
    setShowGraph(true);
  };

  // Title at top, selector for data point, from date input, to date input
  return (
    <div className="px-16">
      <div className="grid prose md:prose-lg max-w-full container items-center justify-center justify-items-center content-center place-content-center">
        <div className="row">
          <h1 className="justify-self-center self-center place-self-center">
            {params.department} Graph
          </h1>
        </div>
        <SelectWalkthrough
            className="align-end m-2"
            selectedWalkthrough={selectedWalkthrough}
            walkthroughs={walkthroughs.data?.data?.walkthroughs}
            onChange={setSelectedWalkthrough}
          />

        {showForm && (
          <div className="mb-8 pb-4 row">
            <GraphForm
              onDataFromChild={handleDataFromChild}
              options={Options}
              fromDate={FromDate}
              toDate={ToDate}
            />
          </div>
        )}
      </div>
      {ShowGraph && Results && (
        <div className="container w-full lg:mt-4 lg:pt-2 relative z-0">
          <Graph data={Results} />
        </div>
      )}
    </div>
  );
}
