import React, { useEffect, useState } from "react";
import { Area } from "@/types";
import WalkthroughAreaCard from "./WalkthroughAreaCard";
import WalkthroughDataCard from "./WalkthroughDataCard";

interface WalkthroughRendererProps {
  selectedWalkthrough: string;
  areas: Area[];
  onAddArea: (parentArea?: Area) => void;
  onAddDataPoint: (parentArea: Area) => void;
  onDeleteUnsavedDatapoint: (index: number, parentArea: string) => void;
}

// Function to initialize or merge visibility state
const initializeOrMergeVisibility = (
  areas: Area[],
  currentVisibility: Record<string, boolean> = {}
) => {
  const visibility = { ...currentVisibility };

  const updateVisibility = (areasList: Area[]) => {
    areasList.forEach((area) => {
      if (area._id && visibility[area._id] === undefined) {
        visibility[area._id] = true; // Add new areas with default visibility
      }
      if (area.areas) updateVisibility(area.areas); // Recursively update sub-areas
    });
  };

  updateVisibility(areas);
  return visibility;
};

const WalkthroughRenderer: React.FC<WalkthroughRendererProps> = ({
  selectedWalkthrough,
  areas,
  onAddArea,
  onAddDataPoint,
  onDeleteUnsavedDatapoint,
}) => {
  // console.log("areas in renderer:", areas);
  const [visibleAreas, setVisibleAreas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setVisibleAreas((prev) => initializeOrMergeVisibility(areas, prev));
  }, [areas]);

  const toggleVisibility = (areaId: string) => {
    setVisibleAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  const renderAreas = (
    areas: Area[],
    indent = false,
    passDownName: string = ""
  ): React.ReactNode => {
    return areas.map((area, index) => {
      const isVisible = visibleAreas[area._id!] ?? true;
      // Update passDownName for nested areas
      const currentPassDownName = passDownName
        ? passDownName + " :: " + area.name
        : area.name;
      // console.log("passDownName:", currentPassDownName);
      return (
        <div className={indent ? "ml-20" : ""} key={index}>
          <WalkthroughAreaCard
            key={index}
            selectedWalkthrough={selectedWalkthrough}
            area={area}
            onAddArea={onAddArea}
            onAddDataPoint={onAddDataPoint}
            onToggleVisibility={() => toggleVisibility(area._id!)}
            isVisible={isVisible}
          />
          {/* <h3>{index} after new card</h3> */}
          {/* Wrap dataPoints in a div with className="ml-20" if there are any */}
          {isVisible && area?.dataPoints?.length > 0 && (
            <div className="ml-20">
              {area.dataPoints.map((dataPoint, index) => (
                <WalkthroughDataCard
                  key={index}
                  namePassDown={currentPassDownName}
                  selectedWalkthrough={selectedWalkthrough}
                  dataPoint={dataPoint}
                  parentArea={area._id!}
                  onDeleteClick={() =>
                    onDeleteUnsavedDatapoint(index, area._id!)
                  }
                />
              ))}
            </div>
          )}
          {/* <h1>Hi</h1> */}
          {isVisible &&
            area?.areas?.length > 0 &&
            renderAreas(area.areas, true, currentPassDownName)}
          {/* <h1>Hi 2</h1> */}
        </div>
      );
    });
  };

  return <div>{selectedWalkthrough && renderAreas(areas)}</div>;
};

export default WalkthroughRenderer;
