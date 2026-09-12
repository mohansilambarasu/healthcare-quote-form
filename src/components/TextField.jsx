export default function TextField({
  id,
  label,
  error,
  required = false,
  inputProps = {},
}) {
  const errorId = `${id}-error`;

  const describedBy =
    [inputProps["aria-describedby"], error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const inputClassName = ["form-field__input", inputProps.className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}

        {required && (
          <span className="form-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        {...inputProps}
        id={id}
        className={inputClassName}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
      />

      {error && (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
