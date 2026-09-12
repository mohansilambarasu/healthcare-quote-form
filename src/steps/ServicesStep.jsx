import { useFieldArray, useForm, useWatch } from "react-hook-form";

import DateListEditor from "../components/DateListEditor";
import { SERVICES, STANDARDS } from "../data/quoteOptions";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";

const MAX_THROMBOLYTIC_DATES = 25;
const MAX_THROMBECTOMY_DATES = 15;

function normalize(value = "") {
  return value.trim().toLowerCase();
}

export default function ServicesStep() {
  const { formData } = useFormContext();

  const { saveAndBack, saveAndContinue } = useStepNavigation({
    section: "servicesCertifications",
    previousPath: "/sites",
    nextPath: "/review",
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: formData.servicesCertifications,

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const {
    fields: customServiceFields,
    append: appendCustomService,
    remove: removeCustomService,
  } = useFieldArray({
    control,
    name: "customServices",
  });

  const thrombolyticDates =
    useWatch({
      control,
      name: "thrombolyticDates",
    }) ?? [];

  const thrombectomyDates =
    useWatch({
      control,
      name: "thrombectomyDates",
    }) ?? [];

  function validateCustomService(value, index) {
    const normalizedValue = normalize(value);

    if (!normalizedValue) {
      return "Enter a service name.";
    }

    const matchesPredefined = SERVICES.some(
      (service) => normalize(service.label) === normalizedValue,
    );

    if (matchesPredefined) {
      return "This service already exists.";
    }

    const customServices = getValues("customServices") ?? [];

    const duplicate = customServices.some(
      (service, serviceIndex) =>
        serviceIndex !== index && normalize(service?.name) === normalizedValue,
    );

    if (duplicate) {
      return "Custom service names must be unique.";
    }

    return true;
  }

  function addDate({ fieldName, date, maxDates }) {
    if (!date) {
      return false;
    }

    const dates = getValues(fieldName) ?? [];

    if (dates.includes(date)) {
      setError(fieldName, {
        type: "duplicate",
        message: "This date has already been added.",
      });

      return false;
    }

    if (dates.length >= maxDates) {
      setError(fieldName, {
        type: "max",
        message: `Maximum ${maxDates} dates allowed.`,
      });

      return false;
    }

    setValue(fieldName, [...dates, date], {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors(fieldName);

    return true;
  }

  function removeDate(fieldName, dateToRemove) {
    const dates = getValues(fieldName) ?? [];

    setValue(
      fieldName,
      dates.filter((date) => date !== dateToRemove),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    clearErrors(fieldName);
  }

  function handleBack() {
    saveAndBack(getValues());
  }

  function onSubmit(values) {
    const validCustomServices = (values.customServices ?? []).filter(
      (service) => service.name?.trim(),
    );

    const hasService =
      (values.selectedServices?.length ?? 0) > 0 ||
      validCustomServices.length > 0;

    if (!hasService) {
      setError("selectedServices", {
        type: "required",
        message: "Select or add at least one service.",
      });

      return;
    }

    const cleanedValues = {
      ...values,

      customServices: validCustomServices.map((service) => ({
        name: service.name.trim(),
      })),
    };

    saveAndContinue(cleanedValues);
  }

  return (
    <main>
      <h1>Services & Certifications</h1>

      <p>Step 5 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset>
          <legend>Services Requested</legend>

          {SERVICES.map((service) => (
            <label key={service.value}>
              <input
                type="checkbox"
                value={service.value}
                {...register("selectedServices")}
              />

              {service.label}
            </label>
          ))}

          {errors.selectedServices && (
            <p role="alert">{errors.selectedServices.message}</p>
          )}
        </fieldset>

        <section>
          <h2>Other Services</h2>

          <button
            type="button"
            onClick={() =>
              appendCustomService({
                name: "",
              })
            }
          >
            Add Custom Service
          </button>

          {customServiceFields.map((field, index) => (
            <div key={field.id}>
              <label htmlFor={`custom-service-${index}`}>Service Name</label>

              <input
                id={`custom-service-${index}`}
                {...register(`customServices.${index}.name`, {
                  validate: (value) => validateCustomService(value, index),
                })}
              />

              {errors.customServices?.[index]?.name && (
                <p role="alert">{errors.customServices[index].name.message}</p>
              )}

              <button type="button" onClick={() => removeCustomService(index)}>
                Remove
              </button>
            </div>
          ))}
        </section>

        <fieldset>
          <legend>Certification Standards</legend>

          {STANDARDS.map((standard) => (
            <label key={standard.value}>
              <input
                type="checkbox"
                value={standard.value}
                {...register("selectedStandards", {
                  validate: (values) =>
                    (values?.length ?? 0) > 0 ||
                    "Select at least one certification standard.",
                })}
              />

              {standard.label}
            </label>
          ))}

          {errors.selectedStandards && (
            <p role="alert">{errors.selectedStandards.message}</p>
          )}
        </fieldset>

        <section>
          <h2>Certification Dates</h2>

          <div>
            <label htmlFor="certificationExpirationDate">
              Certification Expiration Date
            </label>

            <input
              id="certificationExpirationDate"
              type="date"
              {...register("certificationExpirationDate")}
            />
          </div>

          <div>
            <label htmlFor="applicationDate">Application Date</label>

            <input
              id="applicationDate"
              type="date"
              {...register("applicationDate", {
                required: "Application Date is required.",
              })}
              aria-invalid={errors.applicationDate ? "true" : undefined}
              aria-describedby={
                errors.applicationDate ? "applicationDate-error" : undefined
              }
            />

            {errors.applicationDate && (
              <p id="applicationDate-error" role="alert">
                {errors.applicationDate.message}
              </p>
            )}
          </div>
        </section>

        <DateListEditor
          label="Thrombolytic Dates"
          dates={thrombolyticDates}
          maxDates={MAX_THROMBOLYTIC_DATES}
          error={errors.thrombolyticDates?.message}
          onAdd={(date) =>
            addDate({
              fieldName: "thrombolyticDates",
              date,
              maxDates: MAX_THROMBOLYTIC_DATES,
            })
          }
          onRemove={(date) => removeDate("thrombolyticDates", date)}
        />

        <DateListEditor
          label="Thrombectomy Dates"
          dates={thrombectomyDates}
          maxDates={MAX_THROMBECTOMY_DATES}
          error={errors.thrombectomyDates?.message}
          onAdd={(date) =>
            addDate({
              fieldName: "thrombectomyDates",
              date,
              maxDates: MAX_THROMBECTOMY_DATES,
            })
          }
          onRemove={(date) => removeDate("thrombectomyDates", date)}
        />

        <button type="button" onClick={handleBack}>
          Previous
        </button>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
