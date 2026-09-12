import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import TextField from "../components/TextField";
import { useFormContext } from "../form/FormContext";
import { useStepNavigation } from "../form/useStepNavigation";
import {
  isValidEmail,
  isValidPhone,
  isValidZipCode,
} from "../validation/validators";

const CONTACTS = [
  {
    key: "ceo",
    label: "CEO",
    required: true,
  },
  {
    key: "directorOfQuality",
    label: "Director of Quality",
    required: false,
  },
  {
    key: "invoicingContact",
    label: "Invoicing Contact",
    required: true,
  },
];

const STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function LeadershipStep() {
  const { formData } = useFormContext();

  const { saveAndBack, saveAndContinue } = useStepNavigation({
    section: "leadershipContacts",
    previousPath: "/facility",
    nextPath: "/sites",
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: formData.leadershipContacts,

    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const watchedSameAsPrimary =
    useWatch({
      control,
      name: CONTACTS.map(({ key }) => `${key}.sameAsPrimary`),
    }) ?? [];

  const [
    ceoSameAsPrimary = false,
    directorSameAsPrimary = false,
    invoicingSameAsPrimary = false,
  ] = watchedSameAsPrimary;

  const sameAsPrimaryValues = [
    ceoSameAsPrimary,
    directorSameAsPrimary,
    invoicingSameAsPrimary,
  ];

  const primaryContact = {
    firstName: formData.quoteRequest.firstName,
    lastName: formData.quoteRequest.lastName,
    phone: formData.quoteRequest.workPhone,
    email: formData.quoteRequest.email,
  };

  function setContactValues(contactKey, values) {
    Object.entries(values).forEach(([field, value]) => {
      setValue(`${contactKey}.${field}`, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });
  }

  function copyPrimary(contactKey) {
    setContactValues(contactKey, primaryContact);
  }

  function clearContact(contactKey) {
    setContactValues(contactKey, {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });
  }

  useEffect(() => {
    const latestPrimaryContact = {
      firstName: formData.quoteRequest.firstName,
      lastName: formData.quoteRequest.lastName,
      phone: formData.quoteRequest.workPhone,
      email: formData.quoteRequest.email,
    };

    const watchedValues = [
      ceoSameAsPrimary,
      directorSameAsPrimary,
      invoicingSameAsPrimary,
    ];

    CONTACTS.forEach(({ key }, index) => {
      if (!watchedValues[index]) {
        return;
      }

      Object.entries(latestPrimaryContact).forEach(([field, value]) => {
        setValue(`${key}.${field}`, value, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });
    });
  }, [
    ceoSameAsPrimary,
    directorSameAsPrimary,
    invoicingSameAsPrimary,
    formData.quoteRequest.firstName,
    formData.quoteRequest.lastName,
    formData.quoteRequest.workPhone,
    formData.quoteRequest.email,
    setValue,
  ]);

  function contactHasValue(contactKey) {
    const contact = getValues(contactKey);

    return Boolean(
      contact.firstName?.trim() ||
      contact.lastName?.trim() ||
      contact.phone?.trim() ||
      contact.email?.trim(),
    );
  }

  function requiredForContact(contactKey, isRequired) {
    return isRequired || contactHasValue(contactKey);
  }

  function textRules(contactKey, label, required) {
    return {
      validate: (value) => {
        if (!requiredForContact(contactKey, required)) {
          return true;
        }

        return Boolean(value?.trim()) || `${label} is required.`;
      },
    };
  }

  function phoneRules(contactKey, required) {
    return {
      validate: (value) => {
        if (!requiredForContact(contactKey, required)) {
          return true;
        }

        if (!value?.trim()) {
          return "Phone is required.";
        }

        return isValidPhone(value) || "Enter a valid phone number.";
      },
    };
  }

  function emailRules(contactKey, required) {
    return {
      validate: (value) => {
        if (!requiredForContact(contactKey, required)) {
          return true;
        }

        if (!value?.trim()) {
          return "Email is required.";
        }

        return isValidEmail(value) || "Enter a valid email address.";
      },
    };
  }

  function handleBack() {
    saveAndBack(getValues());
  }

  function onSubmit(values) {
    saveAndContinue(values);
  }

  return (
    <main>
      <h1>Leadership Contacts</h1>

      <p>Step 3 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {CONTACTS.map(({ key, label, required }, index) => {
          const contactErrors = errors[key];

          const sameAsPrimary = Boolean(sameAsPrimaryValues[index]);

          return (
            <fieldset key={key}>
              <legend>
                {label}
                {!required && " (Optional)"}
              </legend>

              <label>
                <input
                  type="checkbox"
                  {...register(`${key}.sameAsPrimary`, {
                    onChange: (event) => {
                      if (event.target.checked) {
                        copyPrimary(key);
                      } else {
                        clearContact(key);
                      }
                    },
                  })}
                />
                Same as Primary Contact
              </label>

              <TextField
                id={`${key}-firstName`}
                label="First Name"
                error={contactErrors?.firstName?.message}
                inputProps={{
                  readOnly: sameAsPrimary,

                  ...register(
                    `${key}.firstName`,
                    textRules(key, "First Name", required),
                  ),
                }}
              />

              <TextField
                id={`${key}-lastName`}
                label="Last Name"
                error={contactErrors?.lastName?.message}
                inputProps={{
                  readOnly: sameAsPrimary,

                  ...register(
                    `${key}.lastName`,
                    textRules(key, "Last Name", required),
                  ),
                }}
              />

              <TextField
                id={`${key}-phone`}
                label="Phone"
                error={contactErrors?.phone?.message}
                inputProps={{
                  type: "tel",
                  readOnly: sameAsPrimary,

                  ...register(`${key}.phone`, phoneRules(key, required)),
                }}
              />

              <TextField
                id={`${key}-email`}
                label="Email"
                error={contactErrors?.email?.message}
                inputProps={{
                  type: "email",
                  readOnly: sameAsPrimary,

                  ...register(`${key}.email`, emailRules(key, required)),
                }}
              />
            </fieldset>
          );
        })}

        <fieldset>
          <legend>Billing Address</legend>

          <TextField
            id="streetAddress"
            label="Street Address"
            error={errors.billingAddress?.streetAddress?.message}
            inputProps={{
              ...register("billingAddress.streetAddress", {
                required: "Street Address is required.",
              }),
            }}
          />

          <TextField
            id="city"
            label="City"
            error={errors.billingAddress?.city?.message}
            inputProps={{
              ...register("billingAddress.city", {
                required: "City is required.",
              }),
            }}
          />

          <div>
            <label htmlFor="state">State</label>

            <select
              id="state"
              {...register("billingAddress.state", {
                required: "State is required.",
              })}
              aria-invalid={errors.billingAddress?.state ? "true" : undefined}
              aria-describedby={
                errors.billingAddress?.state ? "state-error" : undefined
              }
            >
              <option value="">Select state</option>

              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {errors.billingAddress?.state && (
              <p id="state-error" role="alert">
                {errors.billingAddress.state.message}
              </p>
            )}
          </div>

          <TextField
            id="zipCode"
            label="ZIP Code"
            error={errors.billingAddress?.zipCode?.message}
            inputProps={{
              inputMode: "numeric",

              ...register("billingAddress.zipCode", {
                required: "ZIP Code is required.",

                validate: (value) =>
                  isValidZipCode(value) || "Enter a valid ZIP Code.",
              }),
            }}
          />
        </fieldset>

        <button type="button" onClick={handleBack}>
          Previous
        </button>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
