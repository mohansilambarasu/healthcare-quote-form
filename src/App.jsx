import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useFormContext } from "./form/FormContext";

import FacilityDetailsStep from "./steps/FacilityDetailsStep";
import LeadershipStep from "./steps/LeadershipStep";
import QuoteRequestStep from "./steps/QuoteRequestStep";
import ReviewStep from "./steps/ReviewStep";
import ServicesStep from "./steps/ServicesStep";
import SiteInformationStep from "./steps/SiteInformationStep";

const STEPS = [
  {
    path: "/",
    title: "New DNV Quote Request",
    label: "DNV Quote Request",
  },
  {
    path: "/facility",
    title: "Facility Details",
    label: "Facility Details",
  },
  {
    path: "/leadership",
    title: "Leadership Contacts",
    label: "Leadership Contacts",
  },
  {
    path: "/sites",
    title: "Site Information",
    label: "Site Information",
  },
  {
    path: "/services",
    title: "Services & Certifications",
    label: "Services & Certifications",
  },
  {
    path: "/review",
    title: "Review & Submit",
    label: "Review & Submit",
  },
];

export default function App() {
  const location = useLocation();

  const { formData } = useFormContext();

  const activeStepIndex = STEPS.findIndex(
    (step) => step.path === location.pathname,
  );

  const safeStepIndex = activeStepIndex >= 0 ? activeStepIndex : 0;

  const activeStep = STEPS[safeStepIndex];

  useEffect(() => {
    document.title = `${activeStep.title} | DNV Healthcare`;
  }, [activeStep.title]);

  const firstName = formData.quoteRequest.firstName;

  const lastName = formData.quoteRequest.lastName;

  const fullName = `${firstName} ${lastName}`.trim() || "DNV User";

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "DU";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">DNV Healthcare</div>

        <div className="app-header__profile">
          <div className="app-header__avatar" aria-hidden="true">
            {initials}
          </div>
          <span className="app-header__profile-name">{fullName}</span>
        </div>
      </header>

      <div className="form-page">
        <div className="form-container">
          <div className="step-header">
            <div className="step-header__top">
              <h1 className="step-header__title">{activeStep.title}</h1>

              <p className="step-header__count">
                Step {safeStepIndex + 1} of {STEPS.length}
              </p>
            </div>

            <div
              className="step-progress"
              aria-label="Application progress"
              role="list"
            >
              {STEPS.map((step, index) => {
                const isComplete = index < safeStepIndex;

                const isActive = index === safeStepIndex;

                const classNames = [
                  "step-progress__item",
                  isComplete ? "step-progress__item--complete" : "",
                  isActive ? "step-progress__item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={step.path}
                    className={classNames}
                    role="listitem"
                    aria-current={isActive ? "step" : undefined}
                  >
                    <div className="step-progress__track">
                      <div className="step-progress__fill" />
                    </div>

                    <span className="step-progress__label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Routes>
            <Route path="/" element={<QuoteRequestStep />} />

            <Route path="/facility" element={<FacilityDetailsStep />} />

            <Route path="/leadership" element={<LeadershipStep />} />

            <Route path="/sites" element={<SiteInformationStep />} />

            <Route path="/services" element={<ServicesStep />} />

            <Route path="/review" element={<ReviewStep />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      <button className="support-chat-button" type="button">
        Support Chat
      </button>
    </div>
  );
}
