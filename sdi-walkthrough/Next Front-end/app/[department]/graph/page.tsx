"use client";
import { useState, useEffect } from "react";
import Graph from "./graph";
import GraphForm from "./form";
import api from "@/utils/api";

interface Response {
  data: {
    dataPoints: string[];
    fromDate: string;
    toDate: string;
  };
}

interface GraphData {
  labels: Date[];
  datasets: 
    [{
      data: number[];
    }];
}

export default function GraphPage({
  params,
}: {
  params: { department: string };
}) {
  const [Results, setResults] = useState<GraphData | null>(null);
  const [ShowGraph, setShowGraph] = useState(false);
  const [Options, setOptions] = useState<string[]>([]);
  const [FromDate, setFromDate] = useState<Date>(new Date());
  const [ToDate, setToDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Response = await api.get(
          `http://fs3s-hotmilllog/HM_Walkthrough/api/graph`,
          {
            params: {
              dataSelection: params.department,
            },
          }
        );
        console.log("recieved data:", response.data)
        setOptions(response.data.dataPoints);
        setFromDate(new Date(response.data.fromDate));
        setToDate(new Date(response.data.toDate));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.department]); // Run the effect whenever params.department changes

  const handleDataFromChild = (data: GraphData) => {
    setResults(data);
    setShowGraph(true);
  };

  // Title at top, selector for data point, from date input, to date input
  return (
    <div className="p-16">
      <h1>{params.department} Graph</h1>
      <GraphForm
        onDataFromChild={handleDataFromChild}
        Options={Options}
        fromDate={FromDate}
        toDate={ToDate}
      />
      {ShowGraph && Results && <Graph data={Results} />}
    </div>
  );
}
