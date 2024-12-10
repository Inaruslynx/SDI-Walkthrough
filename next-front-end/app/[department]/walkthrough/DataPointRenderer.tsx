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
}

const DataPointRenderer: React.FC<DataPointRendererProps> = ({
  data,
  draggable,
}: DataPointRendererProps) => {
  const [showText, setShowText] = useState(false);

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
    <ResponsiveGridLayout
      className="border"
      // items={data.length}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{
        lg: min([6, data.length]),
        md: min([4, data.length]),
        sm: min([3, data.length]),
        xs: min([2, data.length]),
        xxs: min([1, data.length]),
      }}
      width={1000}
      preventCollision={false}
      allowOverlap={false}
      autoSize={true}
      measureBeforeMount={false}
      isResizable={false}
      // isDraggable={draggable}
      isDraggable={false}
    >
      {data.map((dataPoint, index) => (
        <div
          className="object-center"
          key={dataPoint._id}
          data-grid={{
            x: index % min([6, data.length]),
            y: floor(index / min([6, data.length])),
            w: 1,
            h: showText ? 2 : 1,
          }}
        >
          <DataPointElement
            dataPoint={dataPoint}
            showText={showText}
            setShowText={setShowText}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DataPointRenderer;
