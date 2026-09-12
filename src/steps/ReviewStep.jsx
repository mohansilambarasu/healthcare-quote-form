import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PRIMARY_FACILITY_TYPES,
  SECONDARY_FACILITY_TYPES,
  SERVICES,
  STANDARDS,
  getOptionLabel,
} from "../data/quoteOptions";
import { useFormContext } from "../form/FormContext";

import "../styles/review.css";

const SITE_LABELS = {
  single: "Single Location",
  multiple: "Multiple Locations",
  spreadsheet: "Spreadsheet Upload",
  upload: "File Upload",
  "file-upload": "File Upload",
};

function displayText(value) {
  if (value === "" || value === null || value === undefined) {
    return "Not provided";
  }

  return value;
}

function displayOption(options, value) {
  if (!value) {
    return "Not provided";
  }

  return getOptionLabel(options, value);
}

function displaySiteValue(value) {
  if (!value) {
    return "Not provided";
  }

  return SITE_LABELS[value] ?? value;
}

function formatDate(value) {
  if (!value) {
    return "Not provided";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${month}/${day}/${year}`;
}

function formatPhone(value) {
  if (!value) {
    return "Not provided";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length !== 10) {
    return value;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function buildAddress(address) {
  if (!address) {
    return "Not provided";
  }

  const cityStateZip = [address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(" ");

  return (
    [address.streetAddress, cityStateZip].filter(Boolean).join(", ") ||
    "Not provided"
  );
}

function ReviewSection({ title, onEdit, children }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="review-section">
      <div className="review-section__header">
        <button
          className="review-section__toggle"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <svg
            className={
              open
                ? "review-section__chevron review-section__chevron--open"
                : "review-section__chevron"
            }
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2L7 7L12 2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>{title}</span>
        </button>

        <button className="review-section__edit" type="button" onClick={onEdit}>
          Edit
        </button>
      </div>

      {open && <div className="review-section__body">{children}</div>}
    </section>
  );
}

function ReviewRow({ label, children, className = "" }) {
  return (
    <div className={["review-row", className].filter(Boolean).join(" ")}>
      <div className="review-row__label">{label}</div>

      <div className="review-row__value">{children}</div>
    </div>
  );
}

function ContactPanel({
  firstName,
  lastName,
  title,
  workPhone,
  cellPhone,
  phone,
  email,
  billingAddress,
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const primaryPhone = workPhone || phone;

  const hasContact =
    firstName?.trim() ||
    lastName?.trim() ||
    title?.trim() ||
    workPhone?.trim() ||
    cellPhone?.trim() ||
    phone?.trim() ||
    email?.trim();

  if (!hasContact) {
    return <div className="review-contact review-contact--empty">—</div>;
  }

  return (
    <div className="review-contact">
      <strong>{displayText(fullName)}</strong>

      {title && <span>{title}</span>}

      {(primaryPhone || cellPhone) && (
        <span>
          {primaryPhone && (
            <>
              {workPhone ? "Work" : "Phone"}: {formatPhone(primaryPhone)}
            </>
          )}

          {primaryPhone && cellPhone && <> | </>}

          {cellPhone && <>Cell: {formatPhone(cellPhone)}</>}
        </span>
      )}

      {email && <span>Email: {email}</span>}

      {billingAddress && (
        <span>Billing Address: {buildAddress(billingAddress)}</span>
      )}
    </div>
  );
}

export default function ReviewStep() {
  const navigate = useNavigate();

  const { formData } = useFormContext();

  const [certified, setCertified] = useState(false);

  const [error, setError] = useState("");

  const {
    quoteRequest,
    facilityDetails,
    leadershipContacts,
    siteInformation,
    servicesCertifications,
  } = formData;

  const resolvedDba = quoteRequest.sameAsLegalEntity
    ? quoteRequest.legalEntityName
    : quoteRequest.dbaName;

  function resolveContact(contact) {
    if (!contact?.sameAsPrimary) {
      return contact;
    }

    return {
      ...contact,
      firstName: quoteRequest.firstName,
      lastName: quoteRequest.lastName,
      phone: quoteRequest.workPhone || quoteRequest.cellPhone,
      email: quoteRequest.email,
    };
  }

  const ceo = resolveContact(leadershipContacts.ceo);

  const directorOfQuality = resolveContact(
    leadershipContacts.directorOfQuality,
  );

  const invoicingContact = resolveContact(leadershipContacts.invoicingContact);

  const serviceLabels = [
    ...servicesCertifications.selectedServices.map((service) =>
      getOptionLabel(SERVICES, service),
    ),

    ...servicesCertifications.customServices
      .map((service) => service.name?.trim())
      .filter(Boolean),
  ];

  const standardLabels = servicesCertifications.selectedStandards.map(
    (standard) => getOptionLabel(STANDARDS, standard),
  );

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

  function downloadPdf() {
    window.print();
  }

  function exportCsv() {
    const rows = [
      ["Section", "Field", "Value"],
      ["Basic Information", "Legal Entity Name", quoteRequest.legalEntityName],
      ["Basic Information", "DBA Name", resolvedDba],
      [
        "Basic Information",
        "Primary Contact",
        `${quoteRequest.firstName} ${quoteRequest.lastName}`.trim(),
      ],
      [
        "Facility Details",
        "Facility Type",
        displayOption(PRIMARY_FACILITY_TYPES, facilityDetails.facilityType),
      ],
      [
        "Facility Details",
        "Secondary Facility Type",
        displayOption(
          SECONDARY_FACILITY_TYPES,
          facilityDetails.secondaryFacilityType,
        ),
      ],
      [
        "Site Information",
        "Site Configuration",
        displaySiteValue(siteInformation.locationType),
      ],
      [
        "Services & Certifications",
        "Services Provided",
        serviceLabels.join("; "),
      ],
      [
        "Services & Certifications",
        "Standards to Apply",
        standardLabels.join("; "),
      ],
      [
        "Services & Certifications",
        "Date of Application",
        formatDate(servicesCertifications.applicationDate),
      ],
      [
        "Services & Certifications",
        "Certification Expiration Date",
        formatDate(servicesCertifications.certificationExpirationDate),
      ],
      [
        "Services & Certifications",
        "Thrombolytic Dates",
        servicesCertifications.thrombolyticDates.map(formatDate).join("; "),
      ],
      [
        "Services & Certifications",
        "Thrombectomy Dates",
        servicesCertifications.thrombectomyDates.map(formatDate).join("; "),
      ],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const stringValue = String(value ?? "");

            return `"${stringValue.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "dnv-healthcare-quote.csv";

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="review-step">
      <div className="review-card">
        <h2 className="review-card__title">Hospital Information</h2>

        <ReviewSection title="Basic Information" onEdit={() => edit("/")}>
          <ReviewRow label="Legal Entity Name">
            {displayText(quoteRequest.legalEntityName)}
          </ReviewRow>

          <ReviewRow label="d/b/a Name">{displayText(resolvedDba)}</ReviewRow>

          <ReviewRow
            label="Primary Contact"
            className="review-row--panel review-row--primary-contact"
          >
            <ContactPanel
              firstName={quoteRequest.firstName}
              lastName={quoteRequest.lastName}
              title={quoteRequest.title}
              workPhone={quoteRequest.workPhone}
              cellPhone={quoteRequest.cellPhone}
              email={quoteRequest.email}
            />
          </ReviewRow>
        </ReviewSection>

        <ReviewSection
          title="Facility Details"
          onEdit={() => edit("/facility")}
        >
          <ReviewRow label="Facility Type">
            {displayOption(
              PRIMARY_FACILITY_TYPES,
              facilityDetails.facilityType,
            )}
          </ReviewRow>

          <ReviewRow label="Secondary Facility Type">
            {displayOption(
              SECONDARY_FACILITY_TYPES,
              facilityDetails.secondaryFacilityType,
            )}
          </ReviewRow>
        </ReviewSection>

        <ReviewSection
          title="Leadership Contacts"
          onEdit={() => edit("/leadership")}
        >
          <ReviewRow label="CEO" className="review-row--panel">
            <ContactPanel
              firstName={ceo.firstName}
              lastName={ceo.lastName}
              phone={ceo.phone}
              email={ceo.email}
            />
          </ReviewRow>

          <ReviewRow label="Director of Quality" className="review-row--panel">
            <ContactPanel
              firstName={directorOfQuality.firstName}
              lastName={directorOfQuality.lastName}
              phone={directorOfQuality.phone}
              email={directorOfQuality.email}
            />
          </ReviewRow>

          <ReviewRow label="Invoicing Contact" className="review-row--panel">
            <ContactPanel
              firstName={invoicingContact.firstName}
              lastName={invoicingContact.lastName}
              phone={invoicingContact.phone}
              email={invoicingContact.email}
              billingAddress={leadershipContacts.billingAddress}
            />
          </ReviewRow>
        </ReviewSection>

        <ReviewSection title="Site Information" onEdit={() => edit("/sites")}>
          <ReviewRow label="Site Configuration">
            {displaySiteValue(siteInformation.locationType)}
          </ReviewRow>

          {siteInformation.locationType === "multiple" && (
            <>
              <ReviewRow label="Input Method">
                {displaySiteValue(siteInformation.uploadMethod)}
              </ReviewRow>

              {siteInformation.uploadedFiles?.length > 0 && (
                <ReviewRow label="Uploaded Files" className="review-row--panel">
                  <div className="review-files">
                    {siteInformation.uploadedFiles.map((file, index) => (
                      <div
                        className="review-file"
                        key={`${file.name}-${file.size}-${index}`}
                      >
                        <strong>{file.name}</strong>
                      </div>
                    ))}
                  </div>
                </ReviewRow>
              )}
            </>
          )}
        </ReviewSection>

        <ReviewSection
          title="Services & Certifications"
          onEdit={() => edit("/services")}
        >
          <ReviewRow label="Services Provided">
            <div className="review-chips">
              {serviceLabels.map((service, index) => (
                <span className="review-chip" key={`${service}-${index}`}>
                  {service}
                </span>
              ))}
            </div>
          </ReviewRow>

          <ReviewRow label="Standards to Apply">
            <div className="review-chips">
              {standardLabels.map((standard) => (
                <span
                  className="review-chip review-chip--standard"
                  key={standard}
                >
                  {standard}
                </span>
              ))}
            </div>
          </ReviewRow>

          <ReviewRow label="Date of Application">
            {formatDate(servicesCertifications.applicationDate)}
          </ReviewRow>

          <ReviewRow label="Expiration Date of Current Stroke Certification">
            {formatDate(servicesCertifications.certificationExpirationDate)}
          </ReviewRow>

          <ReviewRow label="Dates of last twenty-five thrombolytic administrations">
            <div className="review-date-list">
              {servicesCertifications.thrombolyticDates.length > 0
                ? servicesCertifications.thrombolyticDates
                    .map(formatDate)
                    .join(", ")
                : "Not provided"}
            </div>
          </ReviewRow>

          <ReviewRow label="Dates of last fifteen thrombectomies">
            <div className="review-date-list">
              {servicesCertifications.thrombectomyDates.length > 0
                ? servicesCertifications.thrombectomyDates
                    .map(formatDate)
                    .join(", ")
                : "Not provided"}
            </div>
          </ReviewRow>
        </ReviewSection>

        <form
          id="review-submit-form"
          className="review-submit"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2>Ready to Submit?</h2>

          <label className="review-submit__certification">
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

            <span>
              I certify that all information provided is accurate and complete
              to the best of my knowledge
            </span>
          </label>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <p className="review-submit__description">
            By submitting this form, you agree to our terms and conditions. DNV
            will review your application and contact you within 2-3 business
            days.
          </p>

          <div className="review-submit__exports">
            <button
              className="review-export-button"
              type="button"
              onClick={downloadPdf}
            >
              Download as PDF
            </button>

            <button
              className="review-export-button"
              type="button"
              onClick={exportCsv}
            >
              Export to CSV
            </button>
          </div>
        </form>
      </div>

      <div className="form-actions review-actions">
        <button
          className="button button--md button--secondary"
          type="button"
          onClick={() => navigate("/services")}
        >
          Previous
        </button>

        <button
          className="button button--md button--primary review-actions__submit"
          type="submit"
          form="review-submit-form"
        >
          Submit Application
        </button>
      </div>
    </main>
  );
}
