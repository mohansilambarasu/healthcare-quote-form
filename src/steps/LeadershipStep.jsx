import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormContext } from "../form/FormContext";
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
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, saveSection } = useFormContext();

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

  const sameAsPrimaryValues = useWatch({
    control,
    name: CONTACTS.map(({ key }) => `${key}.sameAsPrimary`),
  });

  const returnTo = location.state?.returnTo;

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
    CONTACTS.forEach(({ key }, index) => {
      if (sameAsPrimaryValues?.[index]) {
        copyPrimary(key);
      }
    });
  }, [
    formData.quoteRequest.firstName,
    formData.quoteRequest.lastName,
    formData.quoteRequest.workPhone,
    formData.quoteRequest.email,
    ...sameAsPrimaryValues,
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
    saveSection("leadershipContacts", getValues());

    navigate("/facility");
  }

  function onSubmit(values) {
    saveSection("leadershipContacts", values);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/sites");
  }

  return (
    <main>
      <h1>Leadership Contacts</h1>

      <p>Step 3 of 6</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {CONTACTS.map(({ key, label, required }, index) => {
          const contactErrors = errors[key];

          const sameAsPrimary = Boolean(sameAsPrimaryValues?.[index]);

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

              <div>
                <label htmlFor={`${key}-firstName`}>First Name</label>

                <input
                  id={`${key}-firstName`}
                  readOnly={sameAsPrimary}
                  {...register(
                    `${key}.firstName`,
                    textRules(key, "First Name", required),
                  )}
                />

                {contactErrors?.firstName && (
                  <p role="alert">{contactErrors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor={`${key}-lastName`}>Last Name</label>

                <input
                  id={`${key}-lastName`}
                  readOnly={sameAsPrimary}
                  {...register(
                    `${key}.lastName`,
                    textRules(key, "Last Name", required),
                  )}
                />

                {contactErrors?.lastName && (
                  <p role="alert">{contactErrors.lastName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor={`${key}-phone`}>Phone</label>

                <input
                  id={`${key}-phone`}
                  type="tel"
                  readOnly={sameAsPrimary}
                  {...register(`${key}.phone`, phoneRules(key, required))}
                />

                {contactErrors?.phone && (
                  <p role="alert">{contactErrors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor={`${key}-email`}>Email</label>

                <input
                  id={`${key}-email`}
                  type="email"
                  readOnly={sameAsPrimary}
                  {...register(`${key}.email`, emailRules(key, required))}
                />

                {contactErrors?.email && (
                  <p role="alert">{contactErrors.email.message}</p>
                )}
              </div>
            </fieldset>
          );
        })}

        <fieldset>
          <legend>Billing Address</legend>

          <div>
            <label htmlFor="streetAddress">Street Address</label>

            <input
              id="streetAddress"
              {...register("billingAddress.streetAddress", {
                required: "Street Address is required.",
              })}
            />

            {errors.billingAddress?.streetAddress && (
              <p role="alert">{errors.billingAddress.streetAddress.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city">City</label>

            <input
              id="city"
              {...register("billingAddress.city", {
                required: "City is required.",
              })}
            />

            {errors.billingAddress?.city && (
              <p role="alert">{errors.billingAddress.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state">State</label>

            <select
              id="state"
              {...register("billingAddress.state", {
                required: "State is required.",
              })}
            >
              <option value="">Select state</option>

              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {errors.billingAddress?.state && (
              <p role="alert">{errors.billingAddress.state.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode">ZIP Code</label>

            <input
              id="zipCode"
              inputMode="numeric"
              {...register("billingAddress.zipCode", {
                required: "ZIP Code is required.",

                validate: (value) =>
                  isValidZipCode(value) || "Enter a valid ZIP Code.",
              })}
            />

            {errors.billingAddress?.zipCode && (
              <p role="alert">{errors.billingAddress.zipCode.message}</p>
            )}
          </div>
        </fieldset>

        <button type="button" onClick={handleBack}>
          Previous
        </button>

        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
