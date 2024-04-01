"use client";
import api from "@/utils/api";
import { useEffect, useState } from "react";

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
      <div className="p-16 grid justify-center">
        <div className="row m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
          <h1 className="text-center">{params.department} Report</h1>
        </div>
        <div className="row max-w-screen-2xl mx-auto overflow-auto overscroll-contain">
          <table className="table max-h-screen w-full table-zebra table-pin-rows">
            <thead>
              <tr>
                <th colSpan={4}></th>
                <th colSpan={4} className="text-center">
                  Statistics
                </th>
              </tr>
              <tr>
                <th></th>
                <th>Last Log</th>
                <th>Before Last Log</th>
                <th>Difference</th>
                <th>Mean</th>
                <th>StdDev</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {showTable &&
                Object.keys(lastLog).map((key) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{lastLog[key]}</td>
                    <td>{beforeLastLog[key]}</td>
                    <td>{resultsOfRecentLogs[key]}</td>
                    <td>{results[key].Mean}</td>
                    <td>{results[key].stdDev}</td>
                    <td>{results[key].Min}</td>
                    <td>{results[key].Max}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
