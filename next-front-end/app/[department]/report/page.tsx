"use client";
import { getReport } from "@/lib/api";
import { useEffect, useState, use } from "react";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useQuery } from "@tanstack/react-query";
import { ItemOfConcernRecord, LogItem, ResultRecord } from "@/types";
import { DataPoint } from "../../../types/index";

type DiffType = {
  readonly [index: string]: {
    dataPoint: DataPoint;
    value: string;
  };
};

type ReportPageProps = {
  params: Promise<{ department: string }>;
};

export default function ReportPage(props: ReportPageProps) {
  const { department } = use(props.params);
  const [lastLog, setLastLog] = useState<LogItem[]>();
  const [beforeLastLog, setBeforeLastLog] = useState<LogItem[]>();
  const [results, setResults] = useState<ResultRecord>();
  const [differenceOfRecentLogs, setDifferenceOfRecentLogs] =
    useState<DiffType>();
  const [itemsOfConcern, setItemsOfConcern] = useState<ItemOfConcernRecord>();
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
      console.log("lastLog:", reportQuery.data.lastLog);
      setLastLog(reportQuery.data.lastLog);
    }
    if (reportQuery.data.beforeLastLog) {
      console.log("beforeLastLog:", reportQuery.data.beforeLastLog);
      setBeforeLastLog(reportQuery.data.beforeLastLog);
    }
    if (reportQuery.data.results) {
      console.log("results:", reportQuery.data.results);
      setResults(reportQuery.data.results);
    }
    if (reportQuery.data.differenceOfRecentLogs) {
      console.log(
        "differenceOfRecentLogs:",
        reportQuery.data.differenceOfRecentLogs
      );
      setDifferenceOfRecentLogs(reportQuery.data.differenceOfRecentLogs);
    }
    if (reportQuery.data.itemsOfConcern) {
      console.log("itemsOfConcern:", reportQuery.data.itemsOfConcern);
      setItemsOfConcern(reportQuery.data.itemsOfConcern);
    }
    // console.log("Finished fetching form data.");
  }, [reportQuery, selectedWalkthrough]);

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
        {itemsOfConcern && Object.keys(itemsOfConcern).length > 0 && (
          <div className="row max-w-(--breakpoint-2xl) mx-auto overflow-auto overscroll-contain">
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
                {Object.keys(itemsOfConcern).map((key) => {
                  // const [key, object] = item;
                  const { dataPoint, issues } = itemsOfConcern[key];

                  // Check if issues exists before mapping
                  if (!issues || issues.length === 0) {
                    return null; // Skip if no issues
                  }

                  return issues.map((issue, issueIndex) => (
                    <tr key={`${dataPoint._id}-${issueIndex}`}>
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

        {lastLog && (
          <div className="row max-w-(--breakpoint-2xl) mx-auto overflow-auto overscroll-contain">
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
                {lastLog.map((logItem) => (
                  <tr key={(logItem.dataPoint as DataPoint)._id}>
                    <th>{(logItem.dataPoint as DataPoint).text}</th>
                    <td>{logItem.value}</td>
                    <td>
                      {beforeLastLog && (logItem.dataPoint as DataPoint)._id
                        ? beforeLastLog.find(
                            (item) =>
                              (item.dataPoint as DataPoint)._id ===
                              (logItem.dataPoint as DataPoint)._id
                          )?.value || ""
                        : ""}
                    </td>
                    <td>
                      {differenceOfRecentLogs &&
                      (logItem.dataPoint as DataPoint)._id &&
                      differenceOfRecentLogs.hasOwnProperty(
                        (logItem.dataPoint as DataPoint)._id!
                      )
                        ? differenceOfRecentLogs[
                            (logItem.dataPoint as DataPoint)._id!
                          ].value
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      (logItem.dataPoint as DataPoint)._id &&
                      (logItem.dataPoint as DataPoint)._id! in results
                        ? results[(logItem.dataPoint as DataPoint)._id!].values
                            .mean
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      (logItem.dataPoint as DataPoint) &&
                      (logItem.dataPoint as DataPoint)._id! in results
                        ? results[(logItem.dataPoint as DataPoint)._id!].values
                            .stdDev
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      (logItem.dataPoint as DataPoint)._id &&
                      (logItem.dataPoint as DataPoint)._id! in results
                        ? results[(logItem.dataPoint as DataPoint)._id!].values
                            .min
                        : ""}
                    </td>
                    <td className="text-center">
                      {results &&
                      (logItem.dataPoint as DataPoint)._id &&
                      (logItem.dataPoint as DataPoint)._id! in results
                        ? results[(logItem.dataPoint as DataPoint)._id!].values
                            .max
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
