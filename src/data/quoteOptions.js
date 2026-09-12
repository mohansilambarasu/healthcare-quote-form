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

export const SERVICES = [
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

export const STANDARDS = [
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

export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}
