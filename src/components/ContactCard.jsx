import { useId } from "react";

export default function ContactCard({
  title,
  action,
  children,
  className = "",
}) {
  const titleId = useId();

  const classes = ["contact-card", className].filter(Boolean).join(" ");

  return (
    <section className={classes} aria-labelledby={titleId}>
      <h3 id={titleId} className="contact-card__title">
        {title}
      </h3>

      {action}

      <div className="contact-card__fields">{children}</div>
    </section>
  );
}
