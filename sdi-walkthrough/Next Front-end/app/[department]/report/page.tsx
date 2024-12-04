"use client";
import { getReport } from "@/lib/api";
import { useEffect, useState, use } from "react";
import type { AxiosResponse } from "axios";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useQuery } from "@tanstack/react-query";

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

export default function ReportPage(props: {
  params: Promise<{ department: string }>;
}) {
  const { department } = use(props.params);
  const [lastLog, setLastLog] = useState<Log>({});
  const [beforeLastLog, setBeforeLastLog] = useState<Log>({});
  const [results, setResults] = useState<MathResults>({});
  const [resultsOfRecentLogs, setResultsOfRecentLogs] = useState<Log>({});
  const [showTable, setShowTable] = useState(false);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");

  const reportQuery = useQuery({
    queryKey: ["report"],
    queryFn: async () => getReport(selectedWalkthrough),
    enabled: selectedWalkthrough !== "",
  });

  useEffect(() => {
    // console.log("Fetching Walkthroughs in department");
    if (selectedWalkthrough === "" || !reportQuery.isSuccess) {
      return;
    }
    setLastLog(reportQuery.data);
    setBeforeLastLog(reportQuery.beforeLastLog);
    setResults(reportQuery.results);
    setResultsOfRecentLogs(reportQuery.resultsOfRecentLogs);
    setShowTable(true);
    // console.log("Finished fetching form data.");
  }, [reportQuery]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // console.log("Fetching report data.");
  //     try {
  //       const response: WalkthroughsResponse = await api.get(`walkthrough`, {
  //         params: {
  //           department: params.department,
  //         },
  //       });
  //       // console.log("useEffect ran for getting walkthroughs");
  //       // console.log("recieved data:", response.data);
  //       setWalkthroughs([...walkthroughs, ...response.data.walkthroughs]);
  //       console.log(...walkthroughs, ...response.data.walkthroughs);
  //       console.log(walkthroughs.length);
  //       // console.log("Finished fetching form data.");
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [department]);

  return (
    <>
      <div className="px-8 grid justify-center">
        <div className="row mb-8 relative justify-center prose md:prose-lg max-w-full container">
          <h1 className="text-center">{department} Report</h1>
        </div>
        <div className="row flex m-2 p-2 justify-center container">
          <SelectWalkthrough
            text={"Select a Walkthrough"}
            department={department}
            value={selectedWalkthrough}
            onChange={setSelectedWalkthrough}
            className="selected-bordered"
          />
        </div>
        <div className="row max-w-screen-2xl mx-auto overflow-auto overscroll-contain">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th colSpan={4}></th>
                <th className="text-center bg-base-200" colSpan={4}>
                  Statistics
                </th>
              </tr>
              <tr>
                <th></th>
                <th>Last Log</th>
                <th>Before Last Log</th>
                <th>Difference</th>
                <th className="text-center">Mean</th>
                <th className="text-center">StdDev</th>
                <th className="text-center">Min</th>
                <th className="text-center">Max</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(lastLog).map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{key in lastLog ? lastLog[key].toString() : ""}</td>
                  <td>
                    {key in beforeLastLog ? beforeLastLog[key].toString() : ""}
                  </td>
                  <td>{key in results ? results[key].toString() : ""}</td>
                  <td className="text-center">
                    {key in results ? results[key].Mean.toString() : ""}
                  </td>
                  <td className="text-center">
                    {key in results ? results[key].stdDev.toString() : ""}
                  </td>
                  <td className="text-center">
                    {key in results ? results[key].Min.toString() : ""}
                  </td>
                  <td className="text-center">
                    {key in results ? results[key].Max.toString() : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <Table>
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
          </Table> */}
        </div>
      </div>
    </>
  );
}
