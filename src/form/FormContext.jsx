import { createContext, useContext, useState } from "react";

const FormContext = createContext(null);

function createInitialFormData() {
  return {
    quoteRequest: {
      legalEntityName: "",
      dbaName: "",
      sameAsLegalEntity: false,

      firstName: "",
      lastName: "",
      title: "",

      workPhone: "",
      cellPhone: "",
      email: "",
    },

    facilityDetails: {
      facilityType: "",
      secondaryFacilityType: "",
    },

    leadershipContacts: {
      ceo: {
        sameAsPrimary: false,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      },

      directorOfQuality: {
        sameAsPrimary: false,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      },

      invoicingContact: {
        sameAsPrimary: false,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      },

      billingAddress: {
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },

    siteInformation: {
      locationType: "",
      uploadMethod: "",
      uploadedFiles: [],
    },

    servicesCertifications: {
      selectedServices: [],
      customServices: [],
      selectedStandards: [],

      certificationExpirationDate: "",
      applicationDate: "",

      thrombolyticDates: [],
      thrombectomyDates: [],
    },
  };
}

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(createInitialFormData);

  function saveSection(sectionName, values) {
    setFormData((currentData) => ({
      ...currentData,

      [sectionName]: {
        ...currentData[sectionName],
        ...values,
      },
    }));
  }

  function resetForm() {
    setFormData(createInitialFormData());
  }

  return (
    <FormContext.Provider
      value={{
        formData,
        saveSection,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used inside FormProvider");
  }

  return context;
}
