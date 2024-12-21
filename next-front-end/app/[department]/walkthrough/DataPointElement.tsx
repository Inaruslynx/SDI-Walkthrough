"use client";

import { DataPoint } from "@/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface DataPointProps {
  dataPoint: DataPoint;
  showText: boolean;
  setShowText: React.Dispatch<React.SetStateAction<boolean>>;
  walkthroughId: string;
  disabled: boolean
}

export default function DataPointElement({
  dataPoint,
  showText,
  setShowText,
  walkthroughId,
  disabled,
}: DataPointProps) {
  const { register, getValues } = useFormContext();

  // console.log("console.log on every render walkthroughId:", walkthroughId);

  // Handle saving to localStorage
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!walkthroughId || walkthroughId === "") {
      console.log("No walkthroughId:", walkthroughId);
      return;
    }
    const savedData = JSON.parse(localStorage.getItem(walkthroughId) || "{}");
    savedData[dataPoint._id!] = e.target.value;
    localStorage.setItem(walkthroughId, JSON.stringify(savedData));
  };

  useEffect(() => {
    if (disabled && getValues(`${dataPoint._id}`) ) {
      setShowText(true)
    }
  }, [disabled])

  // useEffect(() => {
  //   console.log("in dataPointElement walkthroughId on change:", walkthroughId);
  //   console.log("element type:", dataPoint.type);
  // }, [walkthroughId]);

  const onShowButtonClick = () => {
    setShowText((prevValue: boolean) => !prevValue);
  };

  if (walkthroughId !== "") {
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
              disabled={disabled}
              placeholder="Enter value"
              {...register(`${dataPoint._id}`)}
              onChange={handleChange}
            />
          </label>
        )}
        {dataPoint.type === "boolean" && (
          <label className="form-control cursor-pointer">
            <div className="label">
              <input
                type="checkbox"
                disabled={disabled}
                className="checkbox checkbox-sm m-2"
                {...register(`${dataPoint._id}`)}
                onChange={handleChange}
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
              disabled={disabled}
              {...register(`${dataPoint._id}`, { value: "" })}
              onChange={handleChange}
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
                disabled={disabled}
                {...register(`${dataPoint._id}`)}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}
