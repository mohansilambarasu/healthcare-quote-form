import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import TextField from "../components/TextField";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";
import { isValidEmail, isValidPhone } from "../validation/validators";

export default function QuoteRequestStep() {
  const { formData } = useFormContext();

  const { saveAndContinue } = useStepNavigation({
    section: "quoteRequest",
    nextPath: "/facility",
  });

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
    saveAndContinue(values);
  }

  return (
    <main>
      <h1>New DNV Quote Request</h1>

      <p>Step 1 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section>
          <h2>Organization Information</h2>

          <TextField
            id="legalEntityName"
            label="Legal Entity Name"
            error={errors.legalEntityName?.message}
            inputProps={{
              ...register("legalEntityName", {
                required: "Legal Entity Name is required.",
              }),
            }}
          />

          <TextField
            id="dbaName"
            label="Doing Business As"
            error={errors.dbaName?.message}
            inputProps={{
              readOnly: sameAsLegalEntity,

              ...register("dbaName", {
                required: "Doing Business As is required.",
              }),
            }}
          />

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

          <TextField
            id="firstName"
            label="First Name"
            error={errors.firstName?.message}
            inputProps={{
              autoComplete: "given-name",

              ...register("firstName", {
                required: "First Name is required.",
              }),
            }}
          />

          <TextField
            id="lastName"
            label="Last Name"
            error={errors.lastName?.message}
            inputProps={{
              autoComplete: "family-name",

              ...register("lastName", {
                required: "Last Name is required.",
              }),
            }}
          />

          <TextField
            id="title"
            label="Title"
            error={errors.title?.message}
            inputProps={{
              ...register("title", {
                required: "Title is required.",
              }),
            }}
          />

          <TextField
            id="workPhone"
            label="Work Phone"
            error={errors.workPhone?.message}
            inputProps={{
              type: "tel",
              autoComplete: "tel",

              ...register("workPhone", {
                required: "Work Phone is required.",

                validate: (value) =>
                  isValidPhone(value) || "Enter a valid phone number.",
              }),
            }}
          />

          <TextField
            id="cellPhone"
            label="Cell Phone"
            error={errors.cellPhone?.message}
            inputProps={{
              type: "tel",
              autoComplete: "tel",

              ...register("cellPhone", {
                validate: (value) =>
                  !value ||
                  isValidPhone(value) ||
                  "Enter a valid phone number.",
              }),
            }}
          />

          <TextField
            id="email"
            label="Email"
            error={errors.email?.message}
            inputProps={{
              type: "email",
              autoComplete: "email",

              ...register("email", {
                required: "Email is required.",

                validate: (value) =>
                  isValidEmail(value) || "Enter a valid email address.",
              }),
            }}
          />
        </section>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
