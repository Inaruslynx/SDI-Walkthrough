import { ChangeEventHandler, useEffect, useId, useRef, useState } from "react";

import { format, isValid, parse, set } from "date-fns";
import { DayPicker } from "react-day-picker";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  className,
}: DatePickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const headerId = useId();

  // Need month after all

  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Hold the input value in state
  const [inputValue, setInputValue] = useState("");

  // Hold the dialog visibility in state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to toggle the dialog visibility
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setInputValue(format(value, "MM/dd/yyyy"));
    }
  }, [value]);

  // Hook to handle the body scroll behavior and focus trapping.
  useEffect(() => {
    const handleBodyScroll = (isOpen: boolean) => {
      document.body.style.overflow = isOpen ? "hidden" : "";
    };
    if (!dialogRef.current) return;
    if (isDialogOpen) {
      handleBodyScroll(true);
      dialogRef.current.showModal();
    } else {
      handleBodyScroll(false);
      dialogRef.current.close();
    }
    return () => {
      handleBodyScroll(false);
    };
  }, [isDialogOpen]);

  const handleDayPickerSelect = (date?: Date) => {
    if (!date) {
      setInputValue("");
      setSelectedDate(undefined);
      onChange(undefined);
    } else {
      setSelectedDate(date);
      setInputValue(format(date, "MM/dd/yyyy"));
      onChange(date);
    }
    dialogRef.current?.close();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // keep the input value in sync

    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      onChange(parsedDate);
    } else {
      setSelectedDate(undefined);
      onChange(undefined);
    }
  };

  return (
    <div className={className}>
      <label htmlFor="date-input">
        <strong>Pick a Date: </strong>
      </label>
      <input
        className={"input"}
        id="date-input"
        type="text"
        value={inputValue}
        placeholder={"MM/dd/yyyy"}
        onChange={handleInputChange}
      />{" "}
      <button
        onClick={toggleDialog}
        aria-controls="dialog"
        aria-haspopup="dialog"
        aria-label="Open calendar to choose log date"
      >
        📆
      </button>
      {/*<p aria-live="assertive" aria-atomic="true">*/}
      {/*  {selectedDate !== undefined*/}
      {/*    ? selectedDate.toDateString()*/}
      {/*    : "Please type or pick a date"}*/}
      {/*</p>*/}
      <dialog
        role="dialog"
        ref={dialogRef}
        id={dialogId}
        aria-modal
        aria-labelledby={headerId}
        onClose={() => setIsDialogOpen(false)}
      >
        <DayPicker
          mode="single"
          required={false}
          selected={selectedDate}
          onSelect={handleDayPickerSelect}
          footer={
            selectedDate !== undefined &&
            `Selected: ${selectedDate.toDateString()}`
          }
        />
      </dialog>
    </div>
  );
}
