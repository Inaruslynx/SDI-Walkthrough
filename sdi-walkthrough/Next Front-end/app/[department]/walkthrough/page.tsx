"use client";
import SelectWalkthrough from "@/components/ui/selectWalkthrough";
import { useEffect, useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, Walkthroughs } from "@/types";
import { AxiosResponse } from "axios";
import { findArea, getWalkthrough, getWalkthroughs } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalkthroughRenderer from "./WalkthroughRenderer";
import WalkthroughScrollSpy from "@/components/ui/WalkthroughScrollSpy";

export default function WalkthroughPage(props: {
  params: Promise<{ department: string }>;
}) {
  const { department } = use(props.params);
  const [selectedWalkthrough, setSelectedWalkthrough] = useState("");
  const [walkthroughData, setWalkthroughData] = useState<Area[]>([]);
  const [loadedLog, setLoadedLog] = useState(""); // holds log ID if user loaded prev log

  const walkthroughs = useQuery<AxiosResponse<Walkthroughs>, Error>({
    queryKey: ["walkthrough", { department: department }],
    queryFn: () => getWalkthroughs(department),
    staleTime: 1000 * 60 * 60, // ms s min
  });

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
    if (response) {
      const results = await fetchWalkthroughAreas(response.data.data);
      console.log("results:", results);
      return results;
    } else {
      return [];
    }
  };

  const fetchWalkthroughAreas = async (areas: Area[]): Promise<Area[]> => {
    const allAreas: Area[] = await Promise.all(
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
    );

    // Filter out any null values
    return allAreas.filter((area) => area !== null);
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
      <SelectWalkthrough
        text={"Select a Walkthrough"}
        department={department}
        value={selectedWalkthrough}
        onChange={setSelectedWalkthrough}
        className={"select-bordered"}
      />
      {/* 
      TODO 
      - use a renderer to go through selectedWalkthroughQuery results and show walkthrough
      - buttons and data picker to go through past logs
      - have a navigation spy to help navigate the walkthrough will need to be based on areas
      so an area will create a branch on the navspy with all it's children
      */}
      {selectedWalkthrough !== "Select a Walkthrough" &&
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
                />
              </>
            </ScrollArea>
          </div>
        )}
    </div>
  );
}
