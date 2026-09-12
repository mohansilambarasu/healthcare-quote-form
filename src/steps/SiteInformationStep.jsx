import { Controller, useForm, useWatch } from "react-hook-form";

import OptionCard from "../components/OptionCard";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

function isAcceptedFile(file) {
  const name = file.name.toLowerCase();

  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
}

function isDuplicateFile(file, files) {
  return files.some(
    (existing) =>
      existing.name === file.name &&
      existing.size === file.size &&
      existing.lastModified === file.lastModified,
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export default function SiteInformationStep() {
  const { formData, saveSection } = useFormContext();

  const { saveAndBack, saveAndContinue } = useStepNavigation({
    section: "siteInformation",
    previousPath: "/leadership",
    nextPath: "/services",
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
    defaultValues: formData.siteInformation,

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const locationType =
    useWatch({
      control,
      name: "locationType",
    }) ?? "";

  const uploadMethod =
    useWatch({
      control,
      name: "uploadMethod",
    }) ?? "";

  function handleLocationChange(event) {
    if (event.target.value === "single") {
      setValue("uploadMethod", "");

      setValue("uploadedFiles", []);

      clearErrors(["uploadMethod", "uploadedFiles"]);
    }
  }

  function processFiles(selectedFiles, currentFiles, onChange) {
    const files = Array.from(selectedFiles ?? []);

    const invalidFile = files.find((file) => !isAcceptedFile(file));

    if (invalidFile) {
      setError("uploadedFiles", {
        type: "fileType",
        message: "Only CSV, XLS, and XLSX files are allowed.",
      });

      return;
    }

    const nextFiles = [...currentFiles];

    files.forEach((file) => {
      if (!isDuplicateFile(file, nextFiles)) {
        nextFiles.push(file);
      }
    });

    onChange(nextFiles);

    clearErrors("uploadedFiles");
  }

  function handleFileInput(event, currentFiles, onChange) {
    processFiles(event.target.files, currentFiles, onChange);

    event.target.value = "";
  }

  function handleDrop(event, currentFiles, onChange) {
    event.preventDefault();

    processFiles(event.dataTransfer.files, currentFiles, onChange);
  }

  function removeFile(fileIndex, files, onChange) {
    onChange(files.filter((_, index) => index !== fileIndex));
  }

  function previewFile(file) {
    const url = URL.createObjectURL(file);

    window.open(url, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  }

  function downloadTemplate() {
    const csv = [
      "facilityName,address,city,state,zipCode",
      "Example Hospital,123 Main Street,Fairfax,VA,22030",
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "site-template.csv";

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function handleSave() {
    saveSection("siteInformation", getValues());
  }

  function handleBack() {
    saveAndBack(getValues());
  }

  function onSubmit(values) {
    if (values.locationType === "multiple" && !values.uploadMethod) {
      setError("uploadMethod", {
        type: "required",
        message: "Select an upload method.",
      });

      return;
    }

    if (values.locationType === "multiple" && !values.uploadedFiles?.length) {
      setError("uploadedFiles", {
        type: "required",
        message: "Upload at least one site file.",
      });

      return;
    }

    saveAndContinue(values);
  }

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-card site-information__card">
          <section className="site-information__location-section">
            <h2 className="site-information__heading">
              Do you have multiple sites or locations?
            </h2>

            <div className="site-information__location-options">
              <OptionCard
                title="Single Location"
                description="We operate from one facility only"
                selected={locationType === "single"}
                inputProps={{
                  value: "single",

                  ...register("locationType", {
                    required: "Select a location type.",

                    onChange: handleLocationChange,
                  }),
                }}
              />

              <OptionCard
                title="Multiple Locations"
                description="We have multiple facilities or practice locations"
                selected={locationType === "multiple"}
                inputProps={{
                  value: "multiple",

                  ...register("locationType", {
                    required: "Select a location type.",

                    onChange: handleLocationChange,
                  }),
                }}
              />
            </div>

            {errors.locationType && (
              <p className="field-error" role="alert">
                {errors.locationType.message}
              </p>
            )}
          </section>

          {locationType === "multiple" && (
            <section className="site-information__add-section">
              <h2 className="site-information__heading">
                How would you like to add your site information?
              </h2>

              <OptionCard
                className="option-card--upload-method"
                title="Upload CSV / Excel"
                description="Upload a spreadsheet with all site information"
                selected={uploadMethod === "spreadsheet"}
                inputProps={{
                  value: "spreadsheet",

                  ...register("uploadMethod"),
                }}
              />

              {errors.uploadMethod && (
                <p className="field-error" role="alert">
                  {errors.uploadMethod.message}
                </p>
              )}

              {uploadMethod === "spreadsheet" && (
                <Controller
                  name="uploadedFiles"
                  control={control}
                  render={({ field }) => {
                    const files = field.value ?? [];

                    return (
                      <div className="site-upload-panel">
                        <div
                          className="site-upload-dropzone"
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) =>
                            handleDrop(event, files, field.onChange)
                          }
                        >
                          <svg
                            className="site-upload-dropzone__icon"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M20 28V13M20 13L14 19M20 13L26 19"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            <path
                              d="M11.5 29.5H10C5.6 29.5 3 26.6 3 22.9C3 19.5 5.2 16.8 8.4 16.3C9.4 11 13.6 7.5 18.8 7.5C24.2 7.5 28.7 11.5 29.3 16.9C33.6 17.2 37 20.4 37 24.4C37 28.7 33.5 31.5 29 31.5H28"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>

                          <p className="site-upload-dropzone__title">
                            Upload Site Information
                          </p>

                          <p className="site-upload-dropzone__description">
                            Drag and drop your CSV or Excel file here, or click
                            to select
                          </p>

                          <label className="button button--sm button--primary site-upload-dropzone__select">
                            Select file
                            <input
                              className="site-upload-dropzone__input"
                              type="file"
                              multiple
                              accept=".csv,.xls,.xlsx"
                              onChange={(event) =>
                                handleFileInput(event, files, field.onChange)
                              }
                            />
                          </label>

                          <button
                            className="site-upload-dropzone__template"
                            type="button"
                            onClick={downloadTemplate}
                          >
                            Download CSV Template
                          </button>
                        </div>

                        <div className="site-upload-files">
                          {files.length > 0 && (
                            <h3 className="site-upload-files__title">
                              Uploaded
                            </h3>
                          )}

                          <div
                            className={[
                              "site-upload-files__list",
                              files.length === 0
                                ? "site-upload-files__list--empty"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {files.map((file, index) => (
                              <div
                                className="uploaded-file"
                                key={`${file.name}-${file.size}-${file.lastModified}`}
                              >
                                <div className="uploaded-file__main">
                                  <svg
                                    className="uploaded-file__icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M6.5 2.75H14.5L19.5 7.75V20.25C19.5 20.8023 19.0523 21.25 18.5 21.25H6.5C5.94772 21.25 5.5 20.8023 5.5 20.25V3.75C5.5 3.19772 5.94772 2.75 6.5 2.75Z"
                                      stroke="currentColor"
                                      strokeWidth="1.38"
                                      strokeLinejoin="round"
                                    />

                                    <path
                                      d="M14.5 2.75V7.75H19.5"
                                      stroke="currentColor"
                                      strokeWidth="1.38"
                                      strokeLinejoin="round"
                                    />

                                    <path
                                      d="M8.5 12H16.5"
                                      stroke="currentColor"
                                      strokeWidth="1.38"
                                      strokeLinecap="round"
                                    />

                                    <path
                                      d="M8.5 15.5H16.5"
                                      stroke="currentColor"
                                      strokeWidth="1.38"
                                      strokeLinecap="round"
                                    />
                                  </svg>

                                  <div className="uploaded-file__content">
                                    <span className="uploaded-file__name">
                                      {file.name}
                                    </span>

                                    <span
                                      className="uploaded-file__separator"
                                      aria-hidden="true"
                                    >
                                      •
                                    </span>

                                    <button
                                      className="uploaded-file__preview"
                                      type="button"
                                      onClick={() => previewFile(file)}
                                    >
                                      Preview
                                    </button>
                                  </div>
                                </div>

                                <span className="uploaded-file__size">
                                  {formatFileSize(file.size)}
                                </span>

                                <button
                                  className="uploaded-file__remove"
                                  type="button"
                                  aria-label={`Remove ${file.name}`}
                                  onClick={() =>
                                    removeFile(index, files, field.onChange)
                                  }
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
                                      strokeWidth="1.6"
                                      strokeLinecap="round"
                                    />

                                    <path
                                      d="M11 3L3 11"
                                      stroke="currentColor"
                                      strokeWidth="1.6"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          {errors.uploadedFiles && (
                            <p className="field-error" role="alert">
                              {errors.uploadedFiles.message}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              )}
            </section>
          )}
        </div>

        <div className="form-actions form-actions--site">
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
