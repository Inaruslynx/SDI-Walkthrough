"use client";
import { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ChartData } from "chart.js";
import Graph from "./graph";
import GraphForm from "./form";
import {
  findAllLogs,
  findArea,
  getWalkthrough,
  getWalkthroughs,
} from "@/lib/api";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { AxiosResponse } from "axios";
import { Area, DataPoint, Walkthrough } from "@/types";

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

export default function GraphPage(props: {
  params: Promise<{ department: string }>;
}) {
  const { department } = use(props.params);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");
  const [walkthroughData, setWalkthroughData] = useState<Area[]>([]);
  const [Results, setResults] = useState<ChartData<"line">>();
  const [ShowGraph, setShowGraph] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [Options, setOptions] = useState<{ _id: string; text: string }[]>([]);

  // Fetch all walkthroughs for department
  // const walkthroughs = useQuery<AxiosResponse<Walkthrough[]>, Error>({
  //   queryKey: ["walkthrough", { department }],
  //   queryFn: () => getWalkthroughs(department),
  //   staleTime: 1000 * 60 * 5,
  // });

  // Fetch the selected Walkthrough
  const selectedWalkthroughQuery = useQuery<Area[]>({
    queryKey: ["walkthrough", { id: selectedWalkthrough }],
    queryFn: () => masterGetWalkthrough(selectedWalkthrough),
    staleTime: 1000 * 60 * 5,
    enabled: selectedWalkthrough !== "",
  });

  const masterGetWalkthrough = async (
    walkthroughId: string
  ): Promise<Area[]> => {
    const response = await getWalkthrough(walkthroughId);
    // console.log("response:", response.data.data);
    if (response?.data?.data) {
      const results = await fetchWalkthroughAreas(response.data.data as Area[]);
      console.log("results:", results);
      return results;
    } else {
      return [];
    }
  };

  const fetchWalkthroughAreas = async (areas: Area[]): Promise<Area[]> => {
    const allAreas: Area[] = (
      await Promise.all(
        areas.map(async (area: Area) => {
          if (!area._id) return null;
          const response = await findArea(area._id);
          const areaData = response.data;

          if (areaData.areas && areaData.areas.length > 0) {
            const subAreas = await fetchWalkthroughAreas(areaData.areas);
            areaData.areas = subAreas;
          }

          return areaData;
        })
      )
    ).filter((area) => area !== null);
    return allAreas;
  };

  useEffect(() => {
    setShowForm(false);
    if (selectedWalkthroughQuery.isSuccess && selectedWalkthroughQuery.data) {
      setWalkthroughData(selectedWalkthroughQuery.data);
    }
  }, [selectedWalkthroughQuery.isSuccess, selectedWalkthroughQuery.data]);

  function collectAllDataPoints(areas: Area[]): DataPoint[] {
    const allDataPoints: DataPoint[] = [];

    function traverse(area: Area) {
      // Collect dataPoints from the current area
      allDataPoints.push(...area.dataPoints);

      // Recursively process sub-areas if they exist
      if (area.areas) {
        area.areas.forEach(traverse);
      }
    }

    // Start traversal for all top-level areas
    areas.forEach(traverse);

    return allDataPoints;
  }

  function extractOptions(
    dataPoints: DataPoint[]
  ): { _id: string; text: string }[] {
    return dataPoints.map((dp) => ({ _id: dp._id ?? "", text: dp.text }));
  }

  useEffect(() => {
    if (walkthroughData) {
      const dataPointsInWalkthrough = collectAllDataPoints(walkthroughData);
      setOptions(extractOptions(dataPointsInWalkthrough));
      setShowForm(true);
    }
  }, [walkthroughData]);

  // const graphDataQuery = useQuery({
  //   queryKey: ["logs"],
  //   queryFn: () => findAllLogs(selectedWalkthrough),
  //   enabled: selectedWalkthrough !== "",
  // });

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
            {department} Graph
          </h1>
        </div>
        <div className="inline-flex items-baseline">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Walkthrough</span>
            </div>
            <SelectWalkthrough
              className="select-bordered align-end m-2"
              text="Select a Walkthrough"
              value={selectedWalkthrough}
              department={department}
              onChange={setSelectedWalkthrough}
            />
          </label>

          {showForm && selectedWalkthrough !== "" && (
            <div className="mb-8 pb-4 row">
              <GraphForm
                onDataFromChild={handleDataFromChild}
                walkthroughId={selectedWalkthrough}
                options={Options}
              />
            </div>
          )}
        </div>
      </div>
      {ShowGraph && Results && (
        <div className="container w-full lg:mt-4 lg:pt-2 relative z-0">
          <Graph data={Results} />
        </div>
      )}
    </div>
  );
}
