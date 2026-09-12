import { Controller, useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormContext } from "../form/FormContext";

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

export default function SiteInformationStep() {
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, saveSection } = useFormContext();

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

  const locationType = useWatch({
    control,
    name: "locationType",
  });

  const uploadMethod = useWatch({
    control,
    name: "uploadMethod",
  });

  const returnTo = location.state?.returnTo;

  function handleLocationChange(event) {
    if (event.target.value === "single") {
      setValue("uploadMethod", "");

      setValue("uploadedFiles", []);

      clearErrors(["uploadMethod", "uploadedFiles"]);
    }
  }

  function handleFiles(event, currentFiles, onChange) {
    const selectedFiles = Array.from(event.target.files ?? []);

    const invalidFile = selectedFiles.find((file) => !isAcceptedFile(file));

    if (invalidFile) {
      setError("uploadedFiles", {
        type: "fileType",
        message: "Only CSV, XLS, and XLSX files are allowed.",
      });

      event.target.value = "";
      return;
    }

    const nextFiles = [...currentFiles];

    selectedFiles.forEach((file) => {
      if (!isDuplicateFile(file, nextFiles)) {
        nextFiles.push(file);
      }
    });

    onChange(nextFiles);

    clearErrors("uploadedFiles");

    event.target.value = "";
  }

  function removeFile(fileIndex, files, onChange) {
    onChange(files.filter((_, index) => index !== fileIndex));
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

    link.click();

    URL.revokeObjectURL(url);
  }

  function handleBack() {
    saveSection("siteInformation", getValues());

    navigate("/leadership");
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

    saveSection("siteInformation", values);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/services");
  }

  return (
    <main>
      <h1>Site Information</h1>

      <p>Step 4 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset>
          <legend>Location Type</legend>

          <label>
            <input
              type="radio"
              value="single"
              {...register("locationType", {
                required: "Select a location type.",

                onChange: handleLocationChange,
              })}
            />
            Single Location
          </label>

          <label>
            <input
              type="radio"
              value="multiple"
              {...register("locationType", {
                required: "Select a location type.",

                onChange: handleLocationChange,
              })}
            />
            Multiple Locations
          </label>

          {errors.locationType && (
            <p role="alert">{errors.locationType.message}</p>
          )}
        </fieldset>

        {locationType === "multiple" && (
          <fieldset>
            <legend>Upload Method</legend>

            <label>
              <input
                type="radio"
                value="spreadsheet"
                {...register("uploadMethod")}
              />
              Spreadsheet Upload
            </label>

            {errors.uploadMethod && (
              <p role="alert">{errors.uploadMethod.message}</p>
            )}
          </fieldset>
        )}

        {locationType === "multiple" && uploadMethod === "spreadsheet" && (
          <section>
            <h2>Site File Upload</h2>

            <p>Accepted formats: CSV, XLS, XLSX.</p>

            <button type="button" onClick={downloadTemplate}>
              Download CSV Template
            </button>

            <Controller
              name="uploadedFiles"
              control={control}
              render={({ field }) => {
                const files = field.value ?? [];

                return (
                  <>
                    <div>
                      <label htmlFor="siteFiles">Upload Site Files</label>

                      <input
                        id="siteFiles"
                        type="file"
                        multiple
                        accept=".csv,.xls,.xlsx"
                        onChange={(event) =>
                          handleFiles(event, files, field.onChange)
                        }
                      />
                    </div>

                    {files.length > 0 && (
                      <ul>
                        {files.map((file, index) => (
                          <li
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                          >
                            {file.name}
                            {" — "}
                            {Math.ceil(file.size / 1024)} KB
                            <button
                              type="button"
                              onClick={() =>
                                removeFile(index, files, field.onChange)
                              }
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                );
              }}
            />

            {errors.uploadedFiles && (
              <p role="alert">{errors.uploadedFiles.message}</p>
            )}
          </section>
        )}

        <button type="button" onClick={handleBack}>
          Previous
        </button>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
