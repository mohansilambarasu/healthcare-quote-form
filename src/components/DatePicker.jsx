import { useEffect, useRef, useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function toISODate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  return `${month}/${day}/${year}`;
}

export default function DatePicker({
  id,
  value = "",
  onConfirm,
  placeholder = "mm/dd/yyyy",
  ariaLabel,
  hasError = false,
  disabledDates = [],
}) {
  const rootRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [pendingValue, setPendingValue] = useState(value);

  const initialDate = parseDate(value) ?? new Date();

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  useEffect(() => {
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setPendingValue(value);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        setPendingValue(value);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [value]);

  function openCalendar() {
    const startingDate = parseDate(value) ?? new Date();

    setVisibleMonth(
      new Date(startingDate.getFullYear(), startingDate.getMonth(), 1),
    );

    setPendingValue(value);

    setOpen(true);
  }

  function changeMonth(amount) {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  }

  function handleCancel() {
    setPendingValue(value);

    setOpen(false);
  }

  function handleConfirm() {
    if (!pendingValue) {
      return;
    }

    const accepted = onConfirm(pendingValue);

    if (accepted !== false) {
      setOpen(false);
    }
  }

  const year = visibleMonth.getFullYear();

  const month = visibleMonth.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array.from({
      length: firstWeekday,
    }).map(() => null),

    ...Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => index + 1,
    ),
  ];

  return (
    <div className="date-picker" ref={rootRef}>
      <button
        id={id}
        className={[
          "date-picker__trigger",
          hasError ? "date-picker__trigger--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openCalendar())}
      >
        <span
          className={value ? "date-picker__value" : "date-picker__placeholder"}
        >
          {value ? formatDate(value) : placeholder}
        </span>

        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="4.5"
            width="14"
            height="12"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />

          <path
            d="M6 2.5V6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          <path
            d="M14 2.5V6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          <path d="M3 8H17" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <div
          className="date-picker__popover"
          role="dialog"
          aria-label={ariaLabel}
        >
          <div className="date-picker__header">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
            >
              ‹
            </button>

            <strong>
              {MONTHS[month]} {year}
            </strong>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
            >
              ›
            </button>
          </div>

          <div className="date-picker__weekdays">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="date-picker__days">
            {cells.map((day, index) => {
              if (!day) {
                return <span key={`empty-${index}`} />;
              }

              const date = new Date(year, month, day);

              const iso = toISODate(date);

              const selected = pendingValue === iso;

              const disabled = disabledDates.includes(iso);

              return (
                <button
                  key={iso}
                  className={
                    selected
                      ? "date-picker__day date-picker__day--selected"
                      : "date-picker__day"
                  }
                  type="button"
                  disabled={disabled}
                  onClick={() => setPendingValue(iso)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="date-picker__actions">
            <button
              className="date-picker__cancel"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="date-picker__confirm"
              type="button"
              disabled={!pendingValue}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
