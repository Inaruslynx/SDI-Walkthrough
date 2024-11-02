import React from "react";
import { Area } from "@/types";
import WalkthroughAreaCard from "./WalkthroughAreaCard";
import WalkthroughDataCard from "./WalkthroughDataCard";

interface WalkthroughRendererProps {
  selectedWalkthrough: string;
  areas: Area[];
  onAddArea: (parentAreaName?: string[]) => void;
  onAddDataPoint: (parentAreaName: string[]) => void;
  onDeleteUnsavedDatapoint: (index: number, parentArea: string) => void;
}

const WalkthroughRenderer: React.FC<WalkthroughRendererProps> = ({
  selectedWalkthrough,
  areas,
  onAddArea,
  onAddDataPoint,
  onDeleteUnsavedDatapoint,
}) => {
  if (selectedWalkthrough === "Select a Walkthrough") {
    return null;
  }
  // console.log("areas in renderer:", areas);

  const renderAreas = (areas: Area[], indent = false): React.ReactNode => {
    return areas.map((area, index) => (
      <div className={indent ? "ml-20" : ""} key={index}>
        <WalkthroughAreaCard
          selectedWalkthrough={selectedWalkthrough}
          area={area}
          onAddArea={onAddArea}
          onAddDataPoint={onAddDataPoint}
        />
        {/* <h3>{index} after new card</h3> */}
        {/* Wrap dataPoints in a div with className="ml-20" if there are any */}
        {area?.dataPoints?.length > 0 && (
          <div className="ml-20">
            {area.dataPoints.map((dataPoint, index) => (
              <WalkthroughDataCard
                key={index}
                selectedWalkthrough={selectedWalkthrough}
                dataPoint={dataPoint}
                parentArea={area._id!}
                onDeleteClick={() => onDeleteUnsavedDatapoint(index, area._id!)}
              />
            ))}
          </div>
        )}
        {/* <h1>Hi</h1> */}
        {area?.areas?.length > 0 && renderAreas(area.areas, true)}
        {/* <h1>Hi 2</h1> */}
      </div>
    ));
  };

  return <div>{renderAreas(areas)}</div>;
};

export default WalkthroughRenderer;
