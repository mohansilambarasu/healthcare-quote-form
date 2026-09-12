import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormContext } from "../form/FormContext";

const PRIMARY_FACILITY_TYPES = [
  {
    value: "short-term-acute-care",
    label: "Short-Term Acute Care",
  },
  {
    value: "long-term-acute-care",
    label: "Long-Term Acute Care",
  },
  {
    value: "critical-access",
    label: "Critical Access",
  },
  {
    value: "childrens",
    label: "Children's",
  },
  {
    value: "free-standing-psychiatric",
    label: "Free-Standing Psychiatric",
  },
  {
    value: "other",
    label: "Other",
  },
];

const SECONDARY_FACILITY_TYPES = [
  {
    value: "same-as-legal-entity",
    label: "Same as Legal Entity Name",
  },
  {
    value: "critical-access",
    label: "Critical Access",
  },
  {
    value: "childrens",
    label: "Children's",
  },
  {
    value: "long-term-acute-care-ltac",
    label: "Long-Term Acute Care (LTAC)",
  },
  {
    value: "free-standing-psychiatric",
    label: "Free-Standing Psychiatric",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function FacilityDetailsStep() {
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, saveSection } = useFormContext();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: formData.facilityDetails,

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const returnTo = location.state?.returnTo;

  function handleBack() {
    saveSection("facilityDetails", getValues());

    navigate("/");
  }

  function onSubmit(values) {
    saveSection("facilityDetails", values);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    // Step 3 will replace this destination
    // as soon as Leadership Contacts is added.
    navigate("/leadership");
  }

  return (
    <main>
      <h1>Facility Details</h1>

      <p>Step 2 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset>
          <legend>Primary Facility Type</legend>

          {PRIMARY_FACILITY_TYPES.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                value={option.value}
                {...register("facilityType", {
                  required: "Select a primary facility type.",
                })}
              />

              {option.label}
            </label>
          ))}

          {errors.facilityType && (
            <p role="alert">{errors.facilityType.message}</p>
          )}
        </fieldset>

        <fieldset>
          <legend>Secondary Facility Type</legend>

          {SECONDARY_FACILITY_TYPES.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                value={option.value}
                {...register("secondaryFacilityType", {
                  required: "Select a secondary facility type.",
                })}
              />

              {option.label}
            </label>
          ))}

          {errors.secondaryFacilityType && (
            <p role="alert">{errors.secondaryFacilityType.message}</p>
          )}
        </fieldset>

        <button type="button" onClick={handleBack}>
          Previous
        </button>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
