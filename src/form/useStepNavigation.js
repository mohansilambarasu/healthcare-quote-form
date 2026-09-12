import { useLocation, useNavigate } from "react-router-dom";

import { useFormContext } from "./FormContext";

export function useStepNavigation({ section, previousPath, nextPath }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { saveSection } = useFormContext();

  const returnTo = location.state?.returnTo;

  function saveAndBack(values) {
    saveSection(section, values);

    if (previousPath) {
      navigate(previousPath);
    }
  }

  function saveAndContinue(values) {
    saveSection(section, values);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    if (nextPath) {
      navigate(nextPath);
    }
  }

  return {
    saveAndBack,
    saveAndContinue,
  };
}
