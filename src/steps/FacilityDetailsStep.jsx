import { useForm } from "react-hook-form";

import {
  PRIMARY_FACILITY_TYPES,
  SECONDARY_FACILITY_TYPES,
} from "../data/quoteOptions";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";

export default function FacilityDetailsStep() {
  const { formData } = useFormContext();

  const { saveAndBack, saveAndContinue } = useStepNavigation({
    section: "facilityDetails",
    previousPath: "/",
    nextPath: "/leadership",
  });

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

  function handleBack() {
    saveAndBack(getValues());
  }

  function onSubmit(values) {
    saveAndContinue(values);
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
