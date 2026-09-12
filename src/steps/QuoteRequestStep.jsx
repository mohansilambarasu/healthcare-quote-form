import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import TextField from "../components/TextField";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";
import { isValidEmail, isValidPhone } from "../validation/validators";

export default function QuoteRequestStep() {
  const { formData, saveSection } = useFormContext();

  const { saveAndContinue } = useStepNavigation({
    section: "quoteRequest",
    nextPath: "/facility",
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
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

  function handleSave() {
    saveSection("quoteRequest", getValues());
  }

  /*
    The standalone assessment has no
    dashboard/parent application route.

    For now Exit preserves the user's
    current data. Once an actual exit
    destination exists, navigation can
    be added here without changing the
    form architecture.
  */
  function handleExit() {
    handleSave();
  }

  function handleVerificationRequest() {
    console.info("Verification email requested:", getValues("email"));
  }

  function onSubmit(values) {
    saveAndContinue(values);
  }

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-card quote-request__card">
          <section className="form-section">
            <div className="form-section__header">
              <h2 className="form-section__title">
                Identify Healthcare Organization
              </h2>
            </div>

            <div className="form-section__content">
              <TextField
                id="legalEntityName"
                label="Legal Entity Name"
                required
                error={errors.legalEntityName?.message}
                inputProps={{
                  ...register("legalEntityName", {
                    required: "Legal Entity Name is required.",
                  }),
                }}
              />

              <div className="quote-request__dba">
                <TextField
                  id="dbaName"
                  label="Doing Business As (d/b/a) Name"
                  required
                  error={errors.dbaName?.message}
                  inputProps={{
                    readOnly: sameAsLegalEntity,

                    ...register("dbaName", {
                      required: "Doing Business As is required.",
                    }),
                  }}
                />

                <label className="checkbox-field">
                  <input
                    className="checkbox-field__input"
                    type="checkbox"
                    {...register("sameAsLegalEntity", {
                      onChange: handleSameAsChange,
                    })}
                  />

                  <span className="checkbox-field__label">
                    Same as Legal Entity Name
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section__header">
              <h2 className="form-section__title">
                Primary Contact Information
              </h2>

              <p className="form-section__description">
                Primary contact receives all DNV Healthcare official
                communications
              </p>
            </div>

            <div className="form-section__content">
              <div className="form-row form-row--2">
                <TextField
                  id="firstName"
                  label="First Name"
                  required
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
                  required
                  error={errors.lastName?.message}
                  inputProps={{
                    autoComplete: "family-name",

                    ...register("lastName", {
                      required: "Last Name is required.",
                    }),
                  }}
                />
              </div>

              <TextField
                id="title"
                label="Title"
                required
                error={errors.title?.message}
                inputProps={{
                  ...register("title", {
                    required: "Title is required.",
                  }),
                }}
              />

              <div className="form-row form-row--2">
                <TextField
                  id="workPhone"
                  label="Work Phone"
                  required
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
              </div>

              <div className="quote-request__email">
                <TextField
                  id="email"
                  label="Email"
                  required
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

                <div className="quote-request__verification">
                  <button
                    className="button button--sm button--secondary"
                    type="button"
                    onClick={handleVerificationRequest}
                  >
                    Send Verification Email
                  </button>

                  <span className="verification-status">Not verified</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="form-actions form-actions--quote">
          <button
            className="button button--md button--secondary"
            type="button"
            onClick={handleExit}
          >
            Exit
          </button>

          <div className="form-actions__right">
            <button
              className="button button--md button--primary"
              type="button"
              onClick={handleSave}
            >
              Save
            </button>

            <button className="button button--md button--primary" type="submit">
              Continue
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
