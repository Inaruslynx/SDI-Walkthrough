"use client";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useEffect, useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Area } from "@/types";
import { findArea, getWalkthrough } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughRenderer from "./WalkthroughRenderer";
import WalkthroughScrollSpy from "@/components/ui/WalkthroughScrollSpy";
import DatePicker from "@/components/ui/DatePicker";
import "react-day-picker/style.css";

export default function WalkthroughPage(props: {
  params: Promise<{ department: string }>;
}) {
  const { department } = use(props.params);

  const [edit, setEdit] = useState(false);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");
  const [walkthroughData, setWalkthroughData] = useState<Area[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loadedLog, setLoadedLog] = useState(""); // holds log ID if user loaded prev log

  // Fetch the selected Walkthrough
  const selectedWalkthroughQuery = useQuery<Area[]>({
    queryKey: ["walkthrough", { id: selectedWalkthrough }],
    queryFn: () => masterGetWalkthrough(selectedWalkthrough),
    staleTime: 1000 * 60 * 5,
    enabled:
      selectedWalkthrough !== "" &&
      selectedWalkthrough !== "Select a Walkthrough",
  });

  const masterGetWalkthrough = async (
    walkthroughId: string,
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
        }),
      )
    ).filter((area) => area !== null);
    return allAreas;
  };

  useEffect(() => {
    if (selectedWalkthroughQuery.isSuccess && selectedWalkthroughQuery.data) {
      setWalkthroughData(selectedWalkthroughQuery.data);
    }
  }, [selectedWalkthroughQuery.isSuccess, selectedWalkthroughQuery.data]);

  return (
    <div className="px-8 pb-4">
      <div className="row m-4 p-4 relative justify-center prose md:prose-lg max-w-full container">
        <h1 className="text-center">{department} Walkthrough</h1>
      </div>
      <div className="inline-flex">
        <SelectWalkthrough
          text={"Select a Walkthrough"}
          department={department}
          value={selectedWalkthrough}
          onChange={setSelectedWalkthrough}
          className={"select-bordered m-2"}
        />
        {selectedWalkthrough !== "" && (
          <>
            <button className="btn btn-primary m-2 ml-40">Previous Log</button>
            <DatePicker
              className={"m-2"}
              onChange={(e) => setSelectedDate(e)}
            />
            <button className="btn btn-primary m-2">Load Date</button>
            <button className="btn btn-primary m-2">Next Log</button>
            <div className="form-control m-2 w-32 ml-40">
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
      - buttons and date picker to go through past logs
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
                />
              </>
            </ScrollArea>
          </div>
        )}
    </div>
  );
}
