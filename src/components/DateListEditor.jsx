import { useId, useState } from "react";

export default function DateListEditor({
  label,
  dates,
  maxDates,
  error,
  onAdd,
  onRemove,
}) {
  const [pendingDate, setPendingDate] = useState("");

  const inputId = useId();
  const errorId = `${inputId}-error`;

  function handleAdd() {
    if (!pendingDate) {
      return;
    }

    const added = onAdd(pendingDate);

    if (added) {
      setPendingDate("");
    }
  }

  return (
    <section>
      <h2>{label}</h2>

      <input
        id={inputId}
        type="date"
        value={pendingDate}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => setPendingDate(event.target.value)}
      />

      <button type="button" onClick={handleAdd}>
        Add Date
      </button>

      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}

      <ul>
        {dates.map((date) => (
          <li key={date}>
            {date}

            <button type="button" onClick={() => onRemove(date)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p>
        {dates.length}/{maxDates}
      </p>
    </section>
  );
}
