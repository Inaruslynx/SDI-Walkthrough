"use client";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type Response = {
  data: {
    lastLog: Log;
    beforeLastLog: Log;
    results: MathResults;
    resultsOfRecentLogs: Log;
  };
};

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

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching report data.");
      try {
        const response: Response = await api.get(
          `http://fs3s-hotmilllog/HM_Walkthrough/api/report`,
          {
            params: {
              dataSelection: params.department,
            },
          }
        );
        console.log("useEffect ran for getting report");
        console.log("recieved data:", response.data);
        setLastLog(response.data.lastLog);
        setBeforeLastLog(response.data.beforeLastLog);
        setResults(response.data.results);
        setResultsOfRecentLogs(response.data.resultsOfRecentLogs);
        setShowTable(true);
        console.log("Finished fetching form data.");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.department]);

  return (
    <>
      <div className="p-8 grid justify-center">
        <div className="row m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
          <h1 className="text-center">{params.department} Report</h1>
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
