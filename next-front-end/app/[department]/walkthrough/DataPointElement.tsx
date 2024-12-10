"use client";

import { DataPoint } from "@/types";
import { useFormContext } from "react-hook-form";

interface DataPointProps {
  dataPoint: DataPoint;
  showText: boolean;
  setShowText: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DataPointElement({
  dataPoint,
  showText,
  setShowText,
}: DataPointProps) {
  const { register } = useFormContext();
  const onShowButtonClick = () => {
    setShowText((prevValue: boolean) => !prevValue);
  };
  return (
    <div className={dataPoint.type === "string" ? "w-full" : ""}>
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
            <input
              type="checkbox"
              className="checkbox checkbox-sm m-2"
              {...register(`${dataPoint._id}`)}
            />
            <span className="label-text">{dataPoint.text}</span>
          </div>
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
          Show {dataPoint.text} Log
        </button>
      )}
      {dataPoint.type === "string" && showText && (
        <div className="react-grid-item react-resizable mx-8">
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
  );
}
