"use client";
import { getReport } from "@/lib/api";
import { useEffect, useState, use } from "react";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useQuery } from "@tanstack/react-query";
import { ItemOfConcern, LogItem, Result } from "@/types";
import { DataPoint } from "../../../types/index";

export default function ReportPage(props: {
  params: Promise<{ department: string }>;
}) {
  const { department } = use(props.params);
  const [lastLog, setLastLog] = useState<LogItem[]>();
  const [beforeLastLog, setBeforeLastLog] = useState<LogItem[]>();
  const [results, setResults] = useState<Result[]>();
  const [differenceOfRecentLogs, setDifferenceOfRecentLogs] =
    useState<Record<string, number>[]>();
  const [itemsOfConcern, setItemsOfConcern] = useState<ItemOfConcern[]>();
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");

  const reportQuery = useQuery({
    queryKey: ["report", selectedWalkthrough],
    queryFn: async () => {
      return getReport(selectedWalkthrough);
    },
    enabled: !!selectedWalkthrough,
  });

  useEffect(() => {
    // console.log("Fetching Walkthroughs in department");
    if (selectedWalkthrough === "" || !reportQuery.isSuccess) {
      return;
    }
    if (reportQuery.data.lastLog) {
      setLastLog(reportQuery.data.lastLog);
    }
    if (reportQuery.data.beforeLastLog) {
      setBeforeLastLog(reportQuery.data.beforeLastLog);
    }
    if (reportQuery.data.results) {
      setResults(reportQuery.data.results);
    }
    if (reportQuery.data.differenceOfRecentLogs) {
      setDifferenceOfRecentLogs(reportQuery.data.differenceOfRecentLogs);
    }
    if (reportQuery.data.itemsOfConcern) {
      setItemsOfConcern(reportQuery.data.itemsOfConcern);
    }
    // console.log("Finished fetching form data.");
  }, [reportQuery]);

  // useEffect(() => {
  //   if (selectedWalkthrough !== "") {
  //     reportQuery.refetch();
  //   }
  // }, [selectedWalkthrough]);

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
        {/* Items of Concern */}
        {itemsOfConcern && itemsOfConcern.length > 0 && (
          <div className="row max-w-screen-2xl mx-auto overflow-auto overscroll-contain">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th colSpan={2}>Items of Concern</th>
                </tr>
                <tr>
                  <th></th>
                  <th>Issue</th>
                  <th>Value</th>
                  <th>StdDev</th>
                  <th>Min</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(itemsOfConcern).map(([key, item]) => {
                  const { dataPoint, issues } = item;

                  // Check if issues exists before mapping
                  if (!issues || issues.length === 0) {
                    return null; // Skip if no issues
                  }

                  return issues.map((issue, index) => (
                    <tr key={`${key}-${index}`}>
                      <th>{(dataPoint as DataPoint).text}</th>
                      <td>{issue.type}</td>
                      <td>{issue.value}</td>
                      <td>{issue.threshold || ""}</td>{" "}
                      <td>{issue.range?.Min || ""}</td>
                      <td>{issue.range?.Max || ""}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Main Report */}
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
              {lastLog &&
                lastLog.map((logItem) => (
                  <tr key={logItem.dataPoint._id}>
                    <th>{logItem.dataPoint.text}</th>
                    <td>{logItem.value.toString()}</td>
                    <td>
                      {beforeLastLog && logItem.dataPoint._id
                        ? beforeLastLog.find(
                            (item) =>
                              item.dataPoint._id === logItem.dataPoint._id
                          )?.value || ""
                        : ""}
                    </td>
                    <td>
                      {differenceOfRecentLogs &&
                      logItem.dataPoint._id &&
                      logItem.dataPoint._id in differenceOfRecentLogs
                        ? differenceOfRecentLogs[
                            String(logItem.dataPoint._id)
                          ].toString()
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      logItem.dataPoint._id &&
                      logItem.dataPoint._id in results
                        ? results[String(logItem.dataPoint._id)].mean.toString()
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      logItem.dataPoint._id &&
                      logItem.dataPoint._id in results
                        ? results[
                            String(logItem.dataPoint._id)
                          ].stdDev.toString()
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      logItem.dataPoint._id &&
                      logItem.dataPoint._id in results
                        ? results[String(logItem.dataPoint._id)].min.toString()
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      logItem.dataPoint._id &&
                      logItem.dataPoint._id in results
                        ? results[String(logItem.dataPoint._id)].max.toString()
                        : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
