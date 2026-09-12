import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormContext } from "../form/FormContext";

import { isValidPhone } from "../validation/validators";

export default function QuoteRequestStep() {
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, saveSection } = useFormContext();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: formData.quoteRequest,

    mode: "onSubmit",
    reValidateMode: "onChange",

    shouldFocusError: true,
  });

  const legalEntityName =
    useWatch({
      control,
      name: "legalEntityName",
    }) ?? "";

  const sameAsLegalEntity =
    useWatch({
      control,
      name: "sameAsLegalEntity",
    }) ?? false;

  const returnTo = location.state?.returnTo;

  useEffect(() => {
    if (!sameAsLegalEntity) {
      return;
    }

    setValue("dbaName", legalEntityName, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [legalEntityName, sameAsLegalEntity, setValue]);

  function handleSameAsChange(event) {
    const checked = event.target.checked;

    setValue("dbaName", checked ? legalEntityName : "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onSubmit(values) {
    saveSection("quoteRequest", values);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/facility");
  }

  return (
    <main>
      <h1>New DNV Quote Request</h1>

      <p>Step 1 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section>
          <h2>Organization Information</h2>

          <div>
            <label htmlFor="legalEntityName">Legal Entity Name</label>

            <input
              id="legalEntityName"
              {...register("legalEntityName", {
                required: "Legal Entity Name is required.",
              })}
            />

            {errors.legalEntityName && (
              <p role="alert">{errors.legalEntityName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dbaName">Doing Business As</label>

            <input
              id="dbaName"
              readOnly={sameAsLegalEntity}
              {...register("dbaName", {
                required: "Doing Business As is required.",
              })}
            />

            {errors.dbaName && <p role="alert">{errors.dbaName.message}</p>}
          </div>

          <label>
            <input
              type="checkbox"
              {...register("sameAsLegalEntity", {
                onChange: handleSameAsChange,
              })}
            />
            Same as Legal Entity Name
          </label>
        </section>

        <section>
          <h2>Primary Contact</h2>

          <div>
            <label htmlFor="firstName">First Name</label>

            <input
              id="firstName"
              autoComplete="given-name"
              {...register("firstName", {
                required: "First Name is required.",
              })}
            />

            {errors.firstName && <p role="alert">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName">Last Name</label>

            <input
              id="lastName"
              autoComplete="family-name"
              {...register("lastName", {
                required: "Last Name is required.",
              })}
            />

            {errors.lastName && <p role="alert">{errors.lastName.message}</p>}
          </div>

          <div>
            <label htmlFor="title">Title</label>

            <input
              id="title"
              {...register("title", {
                required: "Title is required.",
              })}
            />

            {errors.title && <p role="alert">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="workPhone">Work Phone</label>

            <input
              id="workPhone"
              type="tel"
              autoComplete="tel"
              {...register("workPhone", {
                required: "Work Phone is required.",

                validate: (value) =>
                  isValidPhone(value) || "Enter a valid phone number.",
              })}
            />

            {errors.workPhone && <p role="alert">{errors.workPhone.message}</p>}
          </div>

          <div>
            <label htmlFor="cellPhone">Cell Phone</label>

            <input
              id="cellPhone"
              type="tel"
              autoComplete="tel"
              {...register("cellPhone", {
                validate: (value) =>
                  !value ||
                  isValidPhone(value) ||
                  "Enter a valid phone number.",
              })}
            />

            {errors.cellPhone && <p role="alert">{errors.cellPhone.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required.",

                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>
        </section>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
