"use client";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AxiosResponse } from "axios";
import type { WalkthroughsResponse } from "@/types";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";

type Log = {
  [key: string]: Number;
};

type MathResults = {
  [key: string]: {
    Mean: Number;
    stdDev: Number;
    Min: Number;
    Max: Number;
  };
};

type ReportResponse = AxiosResponse<{
  lastLog: Log;
  beforeLastLog: Log;
  results: MathResults;
  resultsOfRecentLogs: Log;
}>;

export default function ReportPage({
  params,
}: {
  params: { department: string };
}) {
  const [lastLog, setLastLog] = useState<Log>({});
  const [beforeLastLog, setBeforeLastLog] = useState<Log>({});
  const [results, setResults] = useState<MathResults>({});
  const [resultsOfRecentLogs, setResultsOfRecentLogs] = useState<Log>({});
  const [showTable, setShowTable] = useState(false);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");
  const [walkthroughs, setWalkthroughs] = useState<string[]>([
    "Select a Walkthrough",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log("Fetching Walkthroughs in department");
      if (selectedWalkthrough === "") {
        return;
      }
      try {
        const response: ReportResponse = await api.get("report", {
          params: {
            walkthrough: selectedWalkthrough,
          },
        });
        setLastLog(response.data.lastLog);
        setBeforeLastLog(response.data.beforeLastLog);
        setResults(response.data.results);
        setResultsOfRecentLogs(response.data.resultsOfRecentLogs);
        setShowTable(true);
        // console.log("Finished fetching form data.");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedWalkthrough]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log("Fetching report data.");
      try {
        const response: WalkthroughsResponse = await api.get(`walkthrough`, {
          params: {
            department: params.department,
          },
        });
        // console.log("useEffect ran for getting walkthroughs");
        // console.log("recieved data:", response.data);
        setWalkthroughs([...walkthroughs, ...response.data.walkthroughs]);
        console.log(...walkthroughs, ...response.data.walkthroughs);
        console.log(walkthroughs.length);
        // console.log("Finished fetching form data.");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.department]);

  return (
    <>
      <div className="px-8 grid justify-center">
        <div className="row mb-8 relative justify-center prose md:prose-lg max-w-full container">
          <h1 className="text-center">{params.department} Report</h1>
        </div>
        <div className="row flex m-2 p-2 justify-center container">
          <SelectWalkthrough
            walkthroughs={walkthroughs}
            defaultSelection={walkthroughs[0]}
            disabledSelection={walkthroughs[0]}
            onChange={setSelectedWalkthrough}
          />
        </div>
        <div className="row max-w-screen-2xl mx-auto overflow-auto overscroll-contain">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4}></TableHead>
                <TableHead className="text-center" colSpan={4}>
                  Statistics
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Last Log</TableHead>
                <TableHead>Before Last Log</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Mean</TableHead>
                <TableHead>StdDev</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(lastLog).map((key) => (
                <TableRow key={key}>
                  <TableCell className="font-bold">{key}</TableCell>
                  <TableCell>
                    {key in lastLog ? lastLog[key].toString() : ""}
                  </TableCell>
                  <TableCell>
                    {key in beforeLastLog ? beforeLastLog[key].toString() : ""}
                  </TableCell>
                  <TableCell>
                    {key in resultsOfRecentLogs
                      ? resultsOfRecentLogs[key].toString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {key in results ? results[key].Mean.toString() : ""}
                  </TableCell>
                  <TableCell>
                    {key in results ? results[key].stdDev.toString() : ""}
                  </TableCell>
                  <TableCell>
                    {key in results ? results[key].Min.toString() : ""}
                  </TableCell>
                  <TableCell>
                    {key in results ? results[key].Max.toString() : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
