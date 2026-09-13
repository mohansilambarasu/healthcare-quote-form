# DNV Healthcare Quote Request

Hi, I'm Mohan, a frontend engineer passionate about building frontend applications. Thank you for the opportunity to work on this assessment.

I built a six-step quote-request frontend from the provided Figma, focusing on reusable components, predictable form behavior, and responsive layouts.

## Run Locally

Prerequisites: Node.js and npm.

From the project root:

npm install
npm run dev

Open the local URL printed by Vite.

Additional commands:

- `npm run lint` — run ESLint checks.
- `npm run build` — create the production build.
- `npm run preview` — preview the production build after building.

## Tech Stack

- React and JavaScript
- React Router
- React Hook Form
- Context API and useState
- Vite, plain CSS, and ESLint

No UI component framework was used.

## Development Approach

The application follows six steps:

1. DNV Quote Request
2. Facility Details
3. Leadership Contacts
4. Site Information
5. Services & Certifications
6. Review & Submit

I established the functional flow first, extracted reusable patterns into TextField, ContactCard, OptionCard, DatePicker, and DateListEditor, then refined the styling against Figma using shared CSS tokens.

React Router controls step navigation. Context owns shared in-session form data, while React Hook Form manages active field state and validation. Each step keeps its specific rules.

Next validates and saves before advancing; Back saves without blocking navigation. Save stores current values without advancing. Review derives directly from shared state and supports editing a section and returning to Review.

Meaningful enhancements include a dynamic user header, route-based progress, conditional site details, duplicate protection for services and dates, clearer optional Review values, and responsive layout refinements.

Review supports CSV export and browser print-to-PDF. Final submission requires certification and logs the complete payload to the browser console.

## Ownership and AI Usage

I analyzed the Figma and made the component, styling, state, routing, validation, and UX decisions. I used AI for targeted syntax help, helper functions, implementation alternatives and review, CSS/token review, and documentation. I reviewed and integrated the changes, compared the UI against Figma, and manually tested the flow repeatedly.

## Assumptions and Known Limitations

- **Save:** Data stays in client-side app state and resets on a full browser refresh; no backend or database persistence is connected.
- **Email and chat:** The interfaces are implemented, but no email verification service or Support Chat provider/API is connected.
- **Files:** CSV/XLS/XLSX files are selected locally and retained for review, without remote upload or parsing into site records. The completed file-selection state is implemented; the intermediate upload-progress state shown in Figma is not implemented because no upload endpoint or progress API was provided.
- **PDF:** Export uses browser print-to-PDF. Pagination, margins, headers, and footers depend on browser settings.

See [QA_Test_Report.md](QA_Test_Report.md) for test coverage and resolved issues.