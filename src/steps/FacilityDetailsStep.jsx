import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  PRIMARY_FACILITY_TYPES,
  SECONDARY_FACILITY_TYPES,
} from "../data/quoteOptions";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";

export default function FacilityDetailsStep() {
  const [stage, setStage] = useState(1);

  const { formData, saveSection } = useFormContext();

  const { saveAndBack, saveAndContinue } = useStepNavigation({
    section: "facilityDetails",
    previousPath: "/",
    nextPath: "/leadership",
  });

  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: formData.facilityDetails,

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const isPrimaryStage = stage === 1;

  const options = isPrimaryStage
    ? PRIMARY_FACILITY_TYPES
    : SECONDARY_FACILITY_TYPES;

  const fieldName = isPrimaryStage ? "facilityType" : "secondaryFacilityType";

  const error = isPrimaryStage
    ? errors.facilityType
    : errors.secondaryFacilityType;

  function handleSave() {
    saveSection("facilityDetails", getValues());
  }

  function handlePrevious() {
    const values = getValues();

    if (stage === 2) {
      saveSection("facilityDetails", values);

      setStage(1);
      return;
    }

    saveAndBack(values);
  }

  async function handleContinue() {
    const isValid = await trigger(fieldName, {
      shouldFocus: true,
    });

    if (!isValid) {
      return;
    }

    const values = getValues();

    if (stage === 1) {
      saveSection("facilityDetails", values);

      setStage(2);
      return;
    }

    saveAndContinue(values);
  }

  function handleSubmit(event) {
    event.preventDefault();

    handleContinue();
  }

  return (
    <main>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-card facility-details__card">
          <section className="form-section">
            <div className="form-section__header">
              <h2 className="form-section__title">
                Facility and Organization Type
              </h2>
            </div>

            <div className="form-section__content">
              <fieldset className="radio-group facility-details__radio-group">
                <legend className="radio-group__legend">
                  Facility Type
                  <span className="form-field__required" aria-hidden="true">
                    *
                  </span>
                </legend>

                <div className="radio-group__options">
                  {options.map((option) => (
                    <label className="radio-group__option" key={option.value}>
                      <input
                        className="radio-group__input"
                        type="radio"
                        value={option.value}
                        {...register(fieldName, {
                          required: "Select a facility type.",
                        })}
                      />

                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {error && (
                  <p className="field-error" role="alert">
                    {error.message}
                  </p>
                )}
              </fieldset>
            </div>
          </section>
        </div>

        <div className="form-actions form-actions--facility">
          <button
            className="button button--md button--secondary"
            type="button"
            onClick={handlePrevious}
          >
            Previous
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
