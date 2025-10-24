import DataPointElement from "./DataPointElement";
import { DataPoint } from "@/types";
import { Responsive, WidthProvider } from "react-grid-layout";
import { min, floor } from "mathjs";
import { useState } from "react";
import "./styles.css";
import React from "react";
import { z } from "zod";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DataPointRendererProps {
  data: DataPoint[];
  draggable: boolean;
  walkthroughId: string;
  border?: boolean;
  formDisabled: boolean;
}

const getOptimalColumns = (count: number) => {
  if (count <= 2) return count; // 1–2 → same
  if (count <= 4) return count; // 3–4 → same
  if (count <= 6) return 3; // 5–6 → 3 columns
  if (count <= 8) return 4; // 7–8 → 4 columns
  if (count <= 10) return 5; // 9–10 → 5 columns
  return 6; // 11+ → max 6
};

const DataPointRenderer: React.FC<DataPointRendererProps> = ({
  data,
  walkthroughId,
  draggable,
  border = false,
  formDisabled,
}: DataPointRendererProps) => {
  const [showTextMap, setShowTextMap] = useState<Record<string, boolean>>({});

  // Group data by type
  const numbersAndChoices = data.filter(
    (dp) => dp.type === "number" || dp.type === "choice"
  );
  const booleans = data.filter((dp) => dp.type === "boolean");
  const strings = data.filter((dp) => dp.type === "string");

  // Calculate columns dynamically for numbers and choices
  const hasNumberType = numbersAndChoices.length > 0;
  const columns = hasNumberType
    ? {
        lg: getOptimalColumns(numbersAndChoices.length),
        md: min(getOptimalColumns(numbersAndChoices.length - 1), 4),
        sm: min(getOptimalColumns(numbersAndChoices.length - 2), 3),
        xs: min(getOptimalColumns(numbersAndChoices.length - 3), 2),
        xxs: 1,
      }
    : {
        lg: 1,
        md: 1,
        sm: 1,
        xs: 1,
        xxs: 1,
      };

  // Toggle showText for a specific dataPoint
  const toggleShowText = (id: string, type: string) => {
    if (type !== "string") return;
    setShowTextMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // useEffect(() => {
  //   console.log("in dataPointRenderer walkthroughId:", walkthroughId);
  // }, [walkthroughId]);

  // Dynamically build Zod schema based on data array
  const dataPointSchema = z.object(
    data.reduce((schema, dataPoint) => {
      let zodType;

      switch (dataPoint.type) {
        case "number":
          zodType = z.number().optional();
          if (dataPoint.min !== undefined || dataPoint.max !== undefined) {
            zodType = zodType.unwrap();
            if (dataPoint.min !== undefined) {
              zodType = zodType.min(Number(dataPoint.min));
            }
            if (dataPoint.max !== undefined) {
              zodType = zodType.max(Number(dataPoint.max));
            }
          }
          break;

        case "boolean":
          zodType = z.boolean().optional();
          break;

        case "string":
          zodType = z.string().optional();
          /* if (dataPoint.choices) {
            zodType = z.enum(dataPoint.choices);
          } */
          break;

        case "choice":
          zodType = z.string().optional();
          break;

        default:
          zodType = z.any(); // Fallback for unexpected types
      }

      return { ...schema, [dataPoint._id || dataPoint.text]: zodType };
    }, {})
  );

  // useEffect(() => {
  //   console.log("columns:", min([12, data.length]));
  // }, []);

  return (
    <>
      {walkthroughId !== "" && (
        <ResponsiveGridLayout
          className={`w-full ${border ? "border" : ""}`}
          // items={data.length}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={columns}
          width={1000}
          preventCollision={false}
          allowOverlap={false}
          autoSize={true}
          measureBeforeMount={false}
          isResizable={false}
          // isDraggable={draggable}
          isDraggable={false}
        >
          {/* Numbers and Choices */}
          {numbersAndChoices.map((dataPoint, index) => (
            <div
              className="flex items-center justify-center object-center"
              key={dataPoint._id}
              data-grid={{
                x: index % (columns.lg || 1),
                y: floor(index / (columns.lg || 1)),
                w: 1,
                h: showTextMap[dataPoint._id!] ? 2 : 1,
              }}
            >
              <DataPointElement
                dataPoint={dataPoint}
                showText={!!showTextMap[dataPoint._id!]}
                setShowText={() =>
                  toggleShowText(dataPoint._id!, dataPoint.type)
                }
                walkthroughId={walkthroughId}
                disabled={formDisabled}
              />
            </div>
          ))}

          {/* Booleans */}
          {booleans.map((dataPoint, index) => (
            <div
              className="flex items-center justify-center object-center"
              key={dataPoint._id}
              data-grid={{
                x: 0,
                y: numbersAndChoices.length + index,
                w: columns.lg || 1,
                h: showTextMap[dataPoint._id!] ? 2 : 1,
              }}
            >
              <DataPointElement
                dataPoint={dataPoint}
                showText={!!showTextMap[dataPoint._id!]}
                setShowText={() =>
                  toggleShowText(dataPoint._id!, dataPoint.type)
                }
                walkthroughId={walkthroughId}
                disabled={formDisabled}
              />
            </div>
          ))}

          {/* Strings */}
          {strings.map((dataPoint, index) => (
            <div
              className="flex items-center justify-center object-center"
              key={dataPoint._id}
              data-grid={{
                x: 0,
                y: numbersAndChoices.length + booleans.length + index,
                w: columns.lg || 1,
                h: showTextMap[dataPoint._id!] ? 2 : 1,
              }}
            >
              <DataPointElement
                dataPoint={dataPoint}
                showText={!!showTextMap[dataPoint._id!]}
                setShowText={() =>
                  toggleShowText(dataPoint._id!, dataPoint.type)
                }
                walkthroughId={walkthroughId}
                disabled={formDisabled}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </>
  );
};

export default DataPointRenderer;
