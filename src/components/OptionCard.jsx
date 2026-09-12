export default function OptionCard({
  title,
  description,
  selected = false,
  inputProps = {},
  className = "",
}) {
  const classes = [
    "option-card",
    selected ? "option-card--selected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      <input className="option-card__input" type="radio" {...inputProps} />

      <span className="option-card__content">
        <span className="option-card__title">{title}</span>

        <span className="option-card__description">{description}</span>
      </span>
    </label>
  );
}
