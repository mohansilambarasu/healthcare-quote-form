# QA Test Report

## QA Approach

I manually tested the application throughout development, compared it against Figma, and retested affected flows after fixes. Checks covered navigation, validation, shared state, conditional inputs, Review, exports, and responsive layouts.

## Test Scenarios Executed

| Area | Checks completed |
| --- | --- |
| Navigation and state | Next validates, saves, and advances; Back preserves values without blocking navigation; Save stores current values without advancing. |
| Quote Request | Required fields, email/phone validation, and same-as-legal-entity behavior. |
| Header and progress | DNV User/DU updates to the saved name/initials; progress reflects current, completed, and future steps. |
| Facility Details | Primary and secondary selection flow, including the Secondary Facility Type label. |
| Leadership Contacts | Required CEO and invoicing contacts, optional Director of Quality, same-as-primary behavior, and billing address fields. |
| Site Information | Single/multiple site paths; CSV/XLS/XLSX selection, duplicate prevention, completed-file display, removal, and conditional Uploaded heading. |
| Services | Search, categories, predefined/custom services, duplicate protection, and prevention of accidental submission through Enter. |
| Standards and dates | Standards selection/chips, custom DatePicker, multiple date selection, and duplicate-date prevention. |
| Review and submission | Shared values, accordions, Edit/return flow, em dashes for blank optional contacts, required certification, and complete console payload. |
| Exports | CSV export and browser print-to-PDF flow. |
| Responsive and visual QA | Desktop and mobile widths of 425, 390, 375, and 320px; form layouts, Support Chat positioning, upload spacing, and Figma styling comparison. |

`npm run lint` and `npm run build` passed before final documentation.

## Resolved Issues and Refinements

| Issue or refinement | Resolution |
| --- | --- |
| Progress-state behavior | Current step uses partial fill, completed steps use full fill, and future steps remain inactive. |
| Secondary facility label | Clarified the second stage as Secondary Facility Type. |
| Upload excess height and empty Uploaded section | Removed unnecessary empty space and showed the heading only when files exist. |
| Mobile Support Chat overlap | Moved the control into document flow on mobile while keeping it fixed on desktop. |
| Accidental Enter submission | Prevented Enter in custom-service inputs from advancing the form. |
| Duplicate services and dates | Blocked duplicate custom/predefined services and duplicate dates. |
| Inconsistent optional Review values | Standardized blank optional contacts to an em dash. |
| Step 1 Figma colors | Corrected heading and helper-text colors with page-scoped styling. |
| Billing Address label consistency | Deliberately standardized labels to the shared form heading color. |
| Completed-file styling | Used normal text color for filename and size, keeping Preview in the action color. |
| CSS token cleanup | Replaced exact hardcoded matches with existing tokens while preserving computed values and visual behavior. |

## Scope and Limitations

Testing was manual; no automated regression suite or full cross-browser validation was completed.

File checks covered local selection and completed-file controls, not spreadsheet-content rendering or parsing. Remote upload and upload progress were outside the testable scope. Refresh persistence, email/chat integrations, and browser print limitations are documented in [README.md](README.md).

## Tools Used

- **Figma:** design analysis and visual comparison.
- **Chrome DevTools:** responsive checks, computed-style inspection, and console verification.
- **VS Code and Git:** source review, token verification, and change comparison.
- **ESLint and Vite:** static checks, local development, and production build verification.
- **AI assistant:** targeted implementation review, helper-function and CSS/token support, and documentation.