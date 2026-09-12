export default function TextField({ id, label, error, inputProps = {} }) {
  const errorId = `${id}-error`;

  const describedBy =
    [inputProps["aria-describedby"], error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id}>{label}</label>

      <input
        {...inputProps}
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
      />

      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
