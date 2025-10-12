"use client";
import SelectWalkthrough from "@/components/ui/SelectWalkthrough";
import { useEffect, useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Area, Log } from "@/types";
import {
  findArea,
  findLog,
  findNext,
  findPrev,
  getWalkthrough,
} from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughRenderer from "./WalkthroughRenderer";
import WalkthroughScrollSpy from "@/components/ui/WalkthroughScrollSpy";
import DatePicker from "@/components/ui/DatePicker";
import "react-day-picker/style.css";
import { useUser } from "@clerk/nextjs";

export default function WalkthroughPage(props: {
  params: Promise<{ department: string }>;
}) {
  const { department } = use(props.params);
  const { user } = useUser();

  const [edit, setEdit] = useState(false);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");
  const [walkthroughData, setWalkthroughData] = useState<Area[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loadedLog, setLoadedLog] = useState<string | undefined>(undefined); // holds log ID if user loaded prev log
  const [logAction, setLogAction] = useState<
    "prev" | "next" | "date" | undefined
  >(undefined);
  const [formDisabled, setFormDisabled] = useState(false);

  // Fetch the selected Walkthrough
  const selectedWalkthroughQuery = useQuery<Area[]>({
    queryKey: ["walkthrough", { id: selectedWalkthrough }],
    queryFn: () => masterGetWalkthrough(selectedWalkthrough),
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled:
      selectedWalkthrough !== "" &&
      selectedWalkthrough !== "Select a Walkthrough",
  });

  const logQuery = useQuery<Log | undefined>({
    queryKey: [
      "log",
      logAction,
      selectedDate,
      { walkthrough: selectedWalkthrough },
    ],
    queryFn: () => masterGetLog(logAction),
    enabled: !!selectedWalkthrough && !!logAction,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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

  async function masterGetLog(
    action: "prev" | "next" | "date" | undefined
  ): Promise<Log | undefined> {
    switch (action) {
      case "prev": {
        if (loadedLog) {
          return await findPrev(loadedLog);
        } else {
          return await findPrev(undefined, selectedWalkthrough);
        }
      }
      case "next": {
        if (loadedLog) {
          return await findNext(loadedLog);
        } else {
          return await findNext(undefined, selectedWalkthrough);
        }
      }
      case "date": {
        if (selectedDate) {
          return await findLog(selectedWalkthrough, selectedDate.toISOString());
        }
        break;
      }
    }
  }

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

  function loadPreviousLog() {
    setLogAction("prev");
  }

  function loadNextLog() {
    setLogAction("next");
  }

  function loadDateLog() {
    if (!selectedDate) return;
    setLogAction("date");
  }

  useEffect(() => {
    if (selectedWalkthroughQuery.isSuccess && selectedWalkthroughQuery.data) {
      setWalkthroughData(selectedWalkthroughQuery.data);
    }
  }, [selectedWalkthroughQuery.isSuccess, selectedWalkthroughQuery.data]);

  useEffect(() => {
    setLogAction(undefined);
    if (logQuery.isSuccess && logQuery.data && logQuery.data._id) {
      setLoadedLog(logQuery.data._id);
      setSelectedDate(new Date(logQuery.data.date!));
      console.log("logQuery.data.user:", logQuery.data.user?.clerkId);
      console.log("user?.id:", user?.id);
      if (logQuery.data.user?.clerkId !== user?.id) {
        setFormDisabled(true);
      } else {
        setFormDisabled(false);
      }
    }
  }, [logQuery.isSuccess, logQuery.data, user?.id]);

  return (
    <div className="px-8 pb-4">
      <div className="row m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">{department} Walkthrough</h1>
      </div>
      <div className="inline-flex w-full">
        <SelectWalkthrough
          text={"Select a Walkthrough"}
          department={department}
          value={selectedWalkthrough}
          onChange={setSelectedWalkthrough}
          className={"select-bordered m-2"}
        />
        {selectedWalkthrough !== "" && (
          <>
            <div className="inline-flex w-full justify-around mx-4">
              <button
                disabled={logQuery.isLoading}
                onClick={loadPreviousLog}
                className="btn btn-primary m-2"
              >
                Previous Log
              </button>
              <div className="flex items-center">
                <DatePicker
                  value={selectedDate}
                  className={"m-2 flex items-center gap-2"}
                  onChange={(e) => setSelectedDate(e)}
                >
                  Pick a Date:{" "}
                </DatePicker>
                <button
                  className={`btn btn-primary m-2`}
                  onClick={loadDateLog}
                  disabled={logQuery.isLoading || !selectedDate}
                >
                  Load Date
                </button>
              </div>
              <button
                disabled={logQuery.isLoading}
                onClick={loadNextLog}
                className="btn btn-primary m-2"
              >
                Next Log
              </button>
            </div>
            <div className="form-control m-2 w-40">
              <label className="label cursor-pointer">
                <span className="label-text">Re-order</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={edit}
                  disabled
                  onChange={(e) => setEdit(e.target.checked)}
                />
              </label>
            </div>
          </>
        )}
      </div>
      {/* 
      TODO 
      - edit button so that the user can reorganize walkthrough
      */}
      {selectedWalkthrough !== "" &&
        selectedWalkthroughQuery.isSuccess &&
        walkthroughData && (
          <div className="m-0 w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-1 md:col-span-2">
              <WalkthroughScrollSpy Data={walkthroughData} />
            </div>
            <ScrollArea
              id="scroll-area"
              className="border min-h-screen mt-4 col-span-1 md:col-span-10"
            >
              <>
                <WalkthroughRenderer
                  data={walkthroughData}
                  selectedWalkthrough={selectedWalkthrough}
                  loadedLog={loadedLog}
                  edit={edit}
                  logData={logQuery.data?.data}
                  formDisabled={formDisabled}
                />
              </>
            </ScrollArea>
          </div>
        )}
    </div>
  );
}
