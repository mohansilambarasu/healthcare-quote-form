export const PRIMARY_FACILITY_TYPES = [
  {
    value: "short-term-acute-care",
    label: "Short-Term Acute Care",
  },
  {
    value: "long-term-acute-care",
    label: "Long-Term Acute Care",
  },
  {
    value: "critical-access",
    label: "Critical Access",
  },
  {
    value: "childrens",
    label: "Children's",
  },
  {
    value: "free-standing-psychiatric",
    label: "Free-Standing Psychiatric",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const SECONDARY_FACILITY_TYPES = [
  {
    value: "same-as-legal-entity",
    label: "Same as Legal Entity Name",
  },
  {
    value: "critical-access",
    label: "Critical Access",
  },
  {
    value: "childrens",
    label: "Children's",
  },
  {
    value: "long-term-acute-care-ltac",
    label: "Long-Term Acute Care (LTAC)",
  },
  {
    value: "free-standing-psychiatric",
    label: "Free-Standing Psychiatric",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const SERVICE_TABS = [
  "All Services",
  "Clinical",
  "Surgical",
  "Diagnostic",
  "Rehabilitation",
  "Specialty",
];

export const SERVICE_CATEGORIES = [
  {
    id: "emergency-critical-care",
    title: "Emergency & Critical Care",
    tab: "Clinical",
    services: [
      {
        id: "emergency-department",
        name: "Emergency Department",
      },
      {
        id: "neonatal-intensive-care-services",
        name: "Neonatal Intensive Care Services",
      },
      {
        id: "pediatric-intensive-care-services",
        name: "Pediatric Intensive Care Services",
      },
    ],
  },
  {
    id: "cardiac-services",
    title: "Cardiac Services",
    tab: "Surgical",
    services: [
      {
        id: "cardiac-catheterization-laboratory",
        name: "Cardiac Catheterization Laboratory",
      },
      {
        id: "open-heart",
        name: "Open Heart",
      },
    ],
  },
  {
    id: "diagnostic-services",
    title: "Diagnostic Services",
    tab: "Diagnostic",
    services: [
      {
        id: "magnetic-resonance-imaging-mri",
        name: "Magnetic Resonance Imaging (MRI)",
      },
      {
        id: "diagnostic-radioisotope-facility",
        name: "Diagnostic Radioisotope Facility",
      },
      {
        id: "lithotripsy",
        name: "Lithotripsy",
      },
    ],
  },
  {
    id: "rehabilitation-services",
    title: "Rehabilitation Services",
    tab: "Rehabilitation",
    services: [
      {
        id: "physical-rehabilitation-services",
        name: "Physical Rehabilitation Services",
      },
      {
        id: "physical-therapy",
        name: "Physical Therapy",
      },
      {
        id: "occupational-therapy",
        name: "Occupational Therapy",
      },
      {
        id: "speech-language-therapy",
        name: "Speech/Language Therapy",
      },
      {
        id: "audiology",
        name: "Audiology",
      },
    ],
  },
];

export const SERVICES = SERVICE_CATEGORIES.flatMap((category) =>
  category.services.map((service) => ({
    value: service.id,
    label: service.name,
  })),
);

export const STANDARDS = [
  {
    value: "emergency-department",
    label: "Emergency Department",
  },
  {
    value: "inpatient-acute-care",
    label: "Inpatient Acute Care",
  },
  {
    value: "general-anesthetizing-location",
    label: "General Anesthetizing Location",
  },
  {
    value: "diagnostic-services",
    label: "Diagnostic Services",
  },
  {
    value: "therapy-services",
    label: "Therapy Services",
  },
];

export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}
