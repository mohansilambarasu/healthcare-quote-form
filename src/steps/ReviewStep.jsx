import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormContext } from "../form/FormContext";

const LABELS = {
  "short-term-acute-care": "Short-Term Acute Care",

  "long-term-acute-care": "Long-Term Acute Care",

  "long-term-acute-care-ltac": "Long-Term Acute Care (LTAC)",

  "critical-access": "Critical Access",

  childrens: "Children's",

  "free-standing-psychiatric": "Free-Standing Psychiatric",

  other: "Other",

  single: "Single Location",
  multiple: "Multiple Locations",
  spreadsheet: "Spreadsheet Upload",

  "acute-stroke-ready-center": "Acute Stroke Ready Center",

  "primary-stroke-center": "Primary Stroke Center",

  "comprehensive-stroke-center": "Comprehensive Stroke Center",

  "hip-knee-replacement": "Hip & Knee Replacement",

  "cardiac-care": "Cardiac Care",

  "dnv-healthcare": "DNV Healthcare",

  "iso-9001": "ISO 9001",

  "niche-certification": "Niche Certification",
};

function displayValue(value) {
  if (value === "" || value === null || value === undefined) {
    return "Not provided";
  }

  return LABELS[value] ?? value;
}

function formatDate(value) {
  if (!value) {
    return "Not provided";
  }

  const [year, month, day] = value.split("-");

  return `${month}/${day}/${year}`;
}

export default function ReviewStep() {
  const navigate = useNavigate();

  const { formData, resetForm } = useFormContext();

  const [certified, setCertified] = useState(false);

  const [error, setError] = useState("");

  const {
    quoteRequest,
    facilityDetails,
    leadershipContacts,
    siteInformation,
    servicesCertifications,
  } = formData;

  function edit(route) {
    navigate(route, {
      state: {
        returnTo: "/review",
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!certified) {
      setError(
        "Please certify that the information is accurate and complete before submitting.",
      );

      return;
    }

    const finalPayload = {
      ...formData,

      reviewSubmit: {
        certified: true,
      },
    };

    console.log("Submitted Application:", finalPayload);
  }

  function startOver() {
    const confirmed = window.confirm(
      "Clear the entire application and start over?",
    );

    if (!confirmed) {
      return;
    }

    resetForm();
    navigate("/");
  }

  return (
    <main>
      <h1>Review & Submit</h1>

      <p>Step 6 of 6</p>

      <section>
        <h2>Quote Request</h2>

        <button type="button" onClick={() => edit("/")}>
          Edit
        </button>

        <p>Legal Entity: {displayValue(quoteRequest.legalEntityName)}</p>

        <p>DBA: {displayValue(quoteRequest.dbaName)}</p>

        <p>
          Primary Contact:{" "}
          {displayValue(
            `${quoteRequest.firstName} ${quoteRequest.lastName}`.trim(),
          )}
        </p>

        <p>Title: {displayValue(quoteRequest.title)}</p>

        <p>Work Phone: {displayValue(quoteRequest.workPhone)}</p>

        <p>Cell Phone: {displayValue(quoteRequest.cellPhone)}</p>

        <p>Email: {displayValue(quoteRequest.email)}</p>
      </section>

      <hr />

      <section>
        <h2>Facility Details</h2>

        <button type="button" onClick={() => edit("/facility")}>
          Edit
        </button>

        <p>Primary Facility: {displayValue(facilityDetails.facilityType)}</p>

        <p>
          Secondary Facility:{" "}
          {displayValue(facilityDetails.secondaryFacilityType)}
        </p>
      </section>

      <hr />

      <section>
        <h2>Leadership Contacts</h2>

        <button type="button" onClick={() => edit("/leadership")}>
          Edit
        </button>

        {[
          {
            label: "CEO",
            data: leadershipContacts.ceo,
          },
          {
            label: "Director of Quality",
            data: leadershipContacts.directorOfQuality,
          },
          {
            label: "Invoicing Contact",
            data: leadershipContacts.invoicingContact,
          },
        ].map(({ label, data }) => (
          <div key={label}>
            <h3>{label}</h3>

            <p>
              Name: {displayValue(`${data.firstName} ${data.lastName}`.trim())}
            </p>

            <p>Phone: {displayValue(data.phone)}</p>

            <p>Email: {displayValue(data.email)}</p>
          </div>
        ))}

        <h3>Billing Address</h3>

        <p>{leadershipContacts.billingAddress.streetAddress}</p>

        <p>
          {leadershipContacts.billingAddress.city},{" "}
          {leadershipContacts.billingAddress.state}{" "}
          {leadershipContacts.billingAddress.zipCode}
        </p>
      </section>

      <hr />

      <section>
        <h2>Site Information</h2>

        <button type="button" onClick={() => edit("/sites")}>
          Edit
        </button>

        <p>Location Type: {displayValue(siteInformation.locationType)}</p>

        {siteInformation.locationType === "multiple" && (
          <>
            <p>Upload Method: {displayValue(siteInformation.uploadMethod)}</p>

            <h3>Uploaded Files</h3>

            <ul>
              {siteInformation.uploadedFiles.map((file) => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                  {file.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <hr />

      <section>
        <h2>Services & Certifications</h2>

        <button type="button" onClick={() => edit("/services")}>
          Edit
        </button>

        <h3>Selected Services</h3>

        <ul>
          {servicesCertifications.selectedServices.map((service) => (
            <li key={service}>{displayValue(service)}</li>
          ))}

          {servicesCertifications.customServices.map((service, index) => (
            <li key={`${service.name}-${index}`}>{service.name}</li>
          ))}
        </ul>

        <h3>Certification Standards</h3>

        <ul>
          {servicesCertifications.selectedStandards.map((standard) => (
            <li key={standard}>{displayValue(standard)}</li>
          ))}
        </ul>

        <p>
          Certification Expiration Date:{" "}
          {formatDate(servicesCertifications.certificationExpirationDate)}
        </p>

        <p>
          Application Date: {formatDate(servicesCertifications.applicationDate)}
        </p>

        <h3>Thrombolytic Dates</h3>

        <ul>
          {servicesCertifications.thrombolyticDates.map((date) => (
            <li key={date}>{formatDate(date)}</li>
          ))}
        </ul>

        <h3>Thrombectomy Dates</h3>

        <ul>
          {servicesCertifications.thrombectomyDates.map((date) => (
            <li key={date}>{formatDate(date)}</li>
          ))}
        </ul>
      </section>

      <hr />

      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            checked={certified}
            onChange={(event) => {
              setCertified(event.target.checked);

              if (event.target.checked) {
                setError("");
              }
            }}
          />
          I certify that the information provided is accurate and complete.
        </label>

        {error && <p role="alert">{error}</p>}

        <div>
          <button type="button" onClick={() => navigate("/services")}>
            Previous
          </button>

          <button type="submit">Submit Application</button>

          <button type="button" onClick={startOver}>
            Start Over
          </button>
        </div>
      </form>
    </main>
  );
}
