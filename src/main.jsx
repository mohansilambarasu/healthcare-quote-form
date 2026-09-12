import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { FormProvider } from "./form/FormContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FormProvider>
        <App />
      </FormProvider>
    </BrowserRouter>
  </StrictMode>,
);
