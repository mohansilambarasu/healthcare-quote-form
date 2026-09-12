import { Navigate, Route, Routes } from "react-router-dom";

import FacilityDetailsStep from "./steps/FacilityDetailsStep";
import LeadershipStep from "./steps/LeadershipStep";
import QuoteRequestStep from "./steps/QuoteRequestStep";
import ReviewStep from "./steps/ReviewStep";
import ServicesStep from "./steps/ServicesStep";
import SiteInformationStep from "./steps/SiteInformationStep";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuoteRequestStep />} />

      <Route path="/facility" element={<FacilityDetailsStep />} />

      <Route path="/leadership" element={<LeadershipStep />} />

      <Route path="/sites" element={<SiteInformationStep />} />

      <Route path="/services" element={<ServicesStep />} />

      <Route path="/review" element={<ReviewStep />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
