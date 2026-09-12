import DatePicker from "./DatePicker";

function formatDate(value) {
  const [year, month, day] = value.split("-");

  return `${month}/${day}/${year}`;
}

export default function DateListEditor({
  label,
  dates,
  error,
  onAdd,
  onRemove,
}) {
  return (
    <div className="multi-date-field">
      <label className="multi-date-field__label">{label}</label>

      <DatePicker
        value=""
        placeholder="mm/dd/yyyy"
        ariaLabel={label}
        disabledDates={dates}
        hasError={Boolean(error)}
        onConfirm={(date) => onAdd(date)}
      />

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      {dates.length > 0 && (
        <div className="multi-date-field__chips">
          {dates.map((date) => (
            <span className="date-chip" key={date}>
              <span>{formatDate(date)}</span>

              <button
                type="button"
                aria-label={`Remove ${formatDate(date)}`}
                onClick={() => onRemove(date)}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2L8 8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 2L2 8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
