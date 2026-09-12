import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import DateListEditor from "../components/DateListEditor";
import DatePicker from "../components/DatePicker";
import {
  SERVICE_CATEGORIES,
  SERVICE_TABS,
  SERVICES,
  STANDARDS,
  getOptionLabel,
} from "../data/quoteOptions";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";

const MAX_THROMBOLYTIC_DATES = 25;
const MAX_THROMBECTOMY_DATES = 15;

function normalize(value = "") {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function ServicesStep() {
  const [activeTab, setActiveTab] = useState("All Services");

  const [serviceSearch, setServiceSearch] = useState("");

  const { formData, saveSection } = useFormContext();

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
    setFocus,
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

  const selectedServices =
    useWatch({
      control,
      name: "selectedServices",
    }) ?? [];

  const selectedStandards =
    useWatch({
      control,
      name: "selectedStandards",
    }) ?? [];

  const customServices = useWatch({
    control,
    name: "customServices",
    defaultValue: [],
  });

  const certificationExpirationDate =
    useWatch({
      control,
      name: "certificationExpirationDate",
    }) ?? "";

  const applicationDate =
    useWatch({
      control,
      name: "applicationDate",
    }) ?? "";

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

  const visibleCategories = useMemo(() => {
    const search = normalize(serviceSearch);

    return SERVICE_CATEGORIES.map((category) => {
      const matchesTab =
        activeTab === "All Services" || category.tab === activeTab;

      if (!matchesTab) {
        return null;
      }

      const categoryMatches = normalize(category.title).includes(search);

      const matchingServices = categoryMatches
        ? category.services
        : category.services.filter((service) =>
            normalize(service.name).includes(search),
          );

      if (matchingServices.length === 0) {
        return null;
      }

      return {
        ...category,
        services: matchingServices,
      };
    }).filter(Boolean);
  }, [activeTab, serviceSearch]);

  const visibleCustomServices = useMemo(() => {
    if (activeTab !== "All Services") {
      return [];
    }

    const search = normalize(serviceSearch);

    return customServiceFields
      .map((field, index) => ({
        field,
        index,
        name: customServices[index]?.name ?? "",
      }))
      .filter(({ name }) => {
        if (!search) {
          return true;
        }

        return (
          normalize(name).includes(search) || "other service".includes(search)
        );
      });
  }, [activeTab, serviceSearch, customServiceFields, customServices]);

  function toggleService(serviceId) {
    const nextServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setValue("selectedServices", nextServices, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const hasCustomService = customServices.some((service) =>
      service?.name?.trim(),
    );

    if (nextServices.length > 0 || hasCustomService) {
      clearErrors("selectedServices");
    }
  }

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

    const currentCustomServices = getValues("customServices") ?? [];

    const duplicate = currentCustomServices.some(
      (service, serviceIndex) =>
        serviceIndex !== index && normalize(service?.name) === normalizedValue,
    );

    if (duplicate) {
      return "Custom service names must be unique.";
    }

    return true;
  }

  function handleCustomServiceChange(event) {
    if (event.target.value.trim()) {
      clearErrors("selectedServices");
    }
  }
  function addOtherService() {
    const currentServices = getValues("customServices") ?? [];

    const existingBlankIndex = currentServices.findIndex(
      (service) => !service.name?.trim(),
    );

    setActiveTab("All Services");
    setServiceSearch("");

    if (existingBlankIndex >= 0) {
      setFocus(`customServices.${existingBlankIndex}.name`);

      return;
    }

    const nextIndex = currentServices.length;

    appendCustomService(
      {
        name: "",
      },
      {
        focusName: `customServices.${nextIndex}.name`,
      },
    );
  }

  function handleRemoveCustomService(index) {
    removeCustomService(index);
  }

  function addStandard(value) {
    if (!value) {
      return;
    }

    if (selectedStandards.includes(value)) {
      return;
    }

    setValue("selectedStandards", [...selectedStandards, value], {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors("selectedStandards");
  }

  function removeStandard(value) {
    setValue(
      "selectedStandards",
      selectedStandards.filter((standard) => standard !== value),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  function setSingleDate(fieldName, value) {
    setValue(fieldName, value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors(fieldName);

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

  function handleSave() {
    saveSection("servicesCertifications", getValues());
  }

  function handleBack() {
    saveAndBack(getValues());
  }

  function onSubmit(values) {
    const cleanedCustomServices = (values.customServices ?? [])
      .map((service) => ({
        name: service.name?.trim() ?? "",
      }))
      .filter((service) => service.name);

    const savedServices = values.selectedServices ?? [];

    const savedStandards = values.selectedStandards ?? [];

    if (savedServices.length === 0 && cleanedCustomServices.length === 0) {
      setError("selectedServices", {
        type: "required",
        message: "Select or add at least one service.",
      });

      return;
    }

    if (savedStandards.length === 0) {
      setError("selectedStandards", {
        type: "required",
        message: "Select at least one standard.",
      });

      return;
    }

    if (!values.applicationDate) {
      setError("applicationDate", {
        type: "required",
        message: "Date of Application is required.",
      });

      return;
    }

    saveAndContinue({
      ...values,

      customServices: cleanedCustomServices,
    });
  }

  const noVisibleServices =
    visibleCategories.length === 0 && visibleCustomServices.length === 0;

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-card services__offering-card">
          <section className="services__section">
            <div className="services__heading">
              <h2>Service Offering</h2>

              <p>Primary Site Service offering</p>
            </div>

            <div
              className="services__tabs"
              role="tablist"
              aria-label="Service categories"
            >
              {SERVICE_TABS.map((tab) => (
                <button
                  key={tab}
                  className={
                    activeTab === tab
                      ? "services__tab services__tab--active"
                      : "services__tab"
                  }
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => {
                    setActiveTab(tab);

                    setServiceSearch("");
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="services__search">
              <input
                type="search"
                value={serviceSearch}
                placeholder="Search services..."
                aria-label="Search services by service or category"
                onChange={(event) => setServiceSearch(event.target.value)}
              />

              {serviceSearch ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setServiceSearch("")}
                >
                  ×
                </button>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="4.7"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />

                  <path
                    d="M10.5 10.5L14 14"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            {visibleCategories.length > 0 && (
              <div className="services__grid">
                {visibleCategories.map((category) => (
                  <section className="service-category" key={category.id}>
                    <h3>{category.title}</h3>

                    <div className="service-category__options">
                      {category.services.map((service) => (
                        <label key={service.id}>
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => toggleService(service.id)}
                          />

                          <span>{service.name}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {noVisibleServices && serviceSearch && (
              <div className="services__empty">
                <p>
                  No services found for "{serviceSearch}
                  ".
                </p>

                <button type="button" onClick={() => setServiceSearch("")}>
                  Clear search
                </button>
              </div>
            )}

            {noVisibleServices &&
              !serviceSearch &&
              activeTab !== "All Services" && (
                <div className="services__empty">
                  <p>No services available in this category.</p>
                </div>
              )}

            <button
              className="services__add-other"
              type="button"
              onClick={addOtherService}
            >
              + Add Other Service
            </button>

            {visibleCustomServices.length > 0 && (
              <div className="services__custom-list">
                {visibleCustomServices.map(({ field, index }) => {
                  const error = errors.customServices?.[index]?.name?.message;

                  return (
                    <section className="custom-service" key={field.id}>
                      <h3>Other Service</h3>

                      <div className="custom-service__row">
                        <input
                          id={`custom-service-${index}`}
                          type="text"
                          placeholder="Specify other service"
                          aria-invalid={error ? "true" : undefined}
                          {...register(`customServices.${index}.name`, {
                            validate: (value) =>
                              validateCustomService(value, index),

                            onChange: handleCustomServiceChange,
                          })}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                            }
                          }}
                        />

                        <button
                          type="button"
                          aria-label="Remove other service"
                          onClick={() => handleRemoveCustomService(index)}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 3L11 11"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M11 3L3 11"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {error && (
                        <p className="field-error" role="alert">
                          {error}
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {errors.selectedServices && (
              <p className="field-error services__selection-error" role="alert">
                {errors.selectedServices.message}
              </p>
            )}
          </section>
        </div>

        <div className="form-card services__standards-card">
          <section className="services__section">
            <h2 className="services__standards-title">Standards to Apply</h2>

            <select
              className="services__standard-select"
              value=""
              aria-label="Select standards"
              onChange={(event) => addStandard(event.target.value)}
            >
              <option value="">Select Standard(s)</option>

              {STANDARDS.map((standard) => (
                <option
                  key={standard.value}
                  value={standard.value}
                  disabled={selectedStandards.includes(standard.value)}
                >
                  {standard.label}
                </option>
              ))}
            </select>

            {selectedStandards.length > 0 && (
              <div className="services__standard-chips">
                {selectedStandards.map((standard) => (
                  <span className="standard-chip" key={standard}>
                    <span>{getOptionLabel(STANDARDS, standard)}</span>

                    <button
                      type="button"
                      aria-label={`Remove ${getOptionLabel(
                        STANDARDS,
                        standard,
                      )}`}
                      onClick={() => removeStandard(standard)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {errors.selectedStandards && (
              <p className="field-error" role="alert">
                {errors.selectedStandards.message}
              </p>
            )}

            <div className="services__single-dates">
              <div className="services__date-field">
                <label>Expiration Date of Current Stroke Certification</label>

                <DatePicker
                  id="certificationExpirationDate"
                  value={certificationExpirationDate}
                  ariaLabel="Expiration Date of Current Stroke Certification"
                  onConfirm={(date) =>
                    setSingleDate("certificationExpirationDate", date)
                  }
                />
              </div>

              <div className="services__date-field">
                <label>Date of Application</label>

                <DatePicker
                  id="applicationDate"
                  value={applicationDate}
                  ariaLabel="Date of Application"
                  hasError={Boolean(errors.applicationDate)}
                  onConfirm={(date) => setSingleDate("applicationDate", date)}
                />

                {errors.applicationDate && (
                  <p className="field-error" role="alert">
                    {errors.applicationDate.message}
                  </p>
                )}
              </div>
            </div>

            <DateListEditor
              label="Dates of last twenty-five thrombolytic administrations"
              dates={thrombolyticDates}
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
              label="Dates of last fifteen thrombectomies"
              dates={thrombectomyDates}
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
          </section>
        </div>

        <div className="form-actions form-actions--services">
          <button
            className="button button--md button--secondary"
            type="button"
            onClick={handleBack}
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
