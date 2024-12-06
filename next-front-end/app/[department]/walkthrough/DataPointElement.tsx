import { DataPoint } from "@/types";
import { Responsive, WidthProvider } from "react-grid-layout";
import { min, floor } from "mathjs";
import { useState } from "react";
import "./styles.css";
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DataPointProps {
  data: DataPoint[];
  draggable: boolean;
}

const DataPointElement: React.FC<DataPointProps> = ({
  data,
  draggable,
}: DataPointProps) => {
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
              zodType = zodType.min(dataPoint.min);
            }
            if (dataPoint.max !== undefined) {
              zodType = zodType.max(dataPoint.max);
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

  const { register } = useFormContext();
  // const { field, fieldState } = useController(hookProps);

  const onShowButtonClick = () => {
    setShowText((prevValue: boolean) => !prevValue);
  };

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
          {dataPoint.type === "number" && (
            <label className="form-control">
              <div className="label">
                <span className="label-text">{dataPoint.text}</span>
              </div>
              <input
                className={`w-11/12 input input-bordered input-primary`}
                type="number"
                step="any"
                placeholder="Enter value"
                {...register(`${dataPoint._id}`)}
              />
            </label>
          )}
          {dataPoint.type === "boolean" && (
            <label className="form-control cursor-pointer">
              <div className="label">
                <span className="label-text">{dataPoint.text}</span>
              </div>
              <input
                type="checkbox"
                className="checkbox"
                {...register(`${dataPoint._id}`)}
              />
            </label>
          )}
          {dataPoint.type === "choice" && (
            <label className="form-control cursor-pointer">
              <div className="label">
                <label className="label-text">{dataPoint.text}</label>
              </div>
              <select
                className="select select-primary"
                {...register(`${dataPoint._id}`, { value: "" })}
              >
                <option disabled value={""}>
                  Please select one
                </option>
                {dataPoint.choices?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          )}
          {dataPoint.type === "string" && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onShowButtonClick()}
            >
              Show log
            </button>
          )}
          {dataPoint.type === "string" && showText && (
            <div className="react-grid-item react-resizable min-w-fit mx-8">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">{dataPoint.text}</span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Log status"
                  {...register(`${dataPoint._id}`)}
                ></textarea>
              </label>
            </div>
          )}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DataPointElement;
