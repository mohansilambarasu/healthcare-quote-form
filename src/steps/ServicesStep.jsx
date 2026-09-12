import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormContext } from "../form/FormContext";

const SERVICES = [
  {
    value: "acute-stroke-ready-center",
    label: "Acute Stroke Ready Center",
  },
  {
    value: "primary-stroke-center",
    label: "Primary Stroke Center",
  },
  {
    value: "comprehensive-stroke-center",
    label: "Comprehensive Stroke Center",
  },
  {
    value: "hip-knee-replacement",
    label: "Hip & Knee Replacement",
  },
  {
    value: "cardiac-care",
    label: "Cardiac Care",
  },
];

const STANDARDS = [
  {
    value: "dnv-healthcare",
    label: "DNV Healthcare",
  },
  {
    value: "iso-9001",
    label: "ISO 9001",
  },
  {
    value: "niche-certification",
    label: "Niche Certification",
  },
];

const MAX_THROMBOLYTIC_DATES = 25;
const MAX_THROMBECTOMY_DATES = 15;

function normalize(value = "") {
  return value.trim().toLowerCase();
}

export default function ServicesStep() {
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, saveSection } = useFormContext();

  const [pendingThrombolyticDate, setPendingThrombolyticDate] = useState("");

  const [pendingThrombectomyDate, setPendingThrombectomyDate] = useState("");

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

  const returnTo = location.state?.returnTo;

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

  function addDate({ fieldName, pendingDate, maxDates, clearPendingDate }) {
    if (!pendingDate) {
      return;
    }

    const dates = getValues(fieldName) ?? [];

    if (dates.includes(pendingDate)) {
      setError(fieldName, {
        type: "duplicate",
        message: "This date has already been added.",
      });

      return;
    }

    if (dates.length >= maxDates) {
      setError(fieldName, {
        type: "max",
        message: `Maximum ${maxDates} dates allowed.`,
      });

      return;
    }

    setValue(fieldName, [...dates, pendingDate], {
      shouldDirty: true,
    });

    clearErrors(fieldName);
    clearPendingDate("");
  }

  function removeDate(fieldName, dateToRemove) {
    const dates = getValues(fieldName) ?? [];

    setValue(
      fieldName,
      dates.filter((date) => date !== dateToRemove),
      {
        shouldDirty: true,
      },
    );

    clearErrors(fieldName);
  }

  function handleBack() {
    saveSection("servicesCertifications", getValues());

    navigate("/sites");
  }

  function onSubmit(values) {
    const validCustomServices = values.customServices.filter((service) =>
      service.name?.trim(),
    );

    const hasService =
      values.selectedServices.length > 0 || validCustomServices.length > 0;

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

    saveSection("servicesCertifications", cleanedValues);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/review");
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
                    values.length > 0 ||
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
            />

            {errors.applicationDate && (
              <p role="alert">{errors.applicationDate.message}</p>
            )}
          </div>
        </section>

        <section>
          <h2>Thrombolytic Dates</h2>

          <input
            type="date"
            value={pendingThrombolyticDate}
            onChange={(event) => setPendingThrombolyticDate(event.target.value)}
          />

          <button
            type="button"
            onClick={() =>
              addDate({
                fieldName: "thrombolyticDates",

                pendingDate: pendingThrombolyticDate,

                maxDates: MAX_THROMBOLYTIC_DATES,

                clearPendingDate: setPendingThrombolyticDate,
              })
            }
          >
            Add Date
          </button>

          {errors.thrombolyticDates && (
            <p role="alert">{errors.thrombolyticDates.message}</p>
          )}

          <ul>
            {thrombolyticDates.map((date) => (
              <li key={date}>
                {date}

                <button
                  type="button"
                  onClick={() => removeDate("thrombolyticDates", date)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <p>
            {thrombolyticDates.length}/{MAX_THROMBOLYTIC_DATES}
          </p>
        </section>

        <section>
          <h2>Thrombectomy Dates</h2>

          <input
            type="date"
            value={pendingThrombectomyDate}
            onChange={(event) => setPendingThrombectomyDate(event.target.value)}
          />

          <button
            type="button"
            onClick={() =>
              addDate({
                fieldName: "thrombectomyDates",

                pendingDate: pendingThrombectomyDate,

                maxDates: MAX_THROMBECTOMY_DATES,

                clearPendingDate: setPendingThrombectomyDate,
              })
            }
          >
            Add Date
          </button>

          {errors.thrombectomyDates && (
            <p role="alert">{errors.thrombectomyDates.message}</p>
          )}

          <ul>
            {thrombectomyDates.map((date) => (
              <li key={date}>
                {date}

                <button
                  type="button"
                  onClick={() => removeDate("thrombectomyDates", date)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <p>
            {thrombectomyDates.length}/{MAX_THROMBECTOMY_DATES}
          </p>
        </section>

        <button type="button" onClick={handleBack}>
          Previous
        </button>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
