# AI Usage Log — Delahio School ERP

AI tools were used as a development assistant for investigation, debugging, implementation guidance and testing. Suggestions were reviewed and verified locally before being accepted.

## Moment 1 — Investigating fee calculation inconsistencies

**What I asked:** How should the fee calculation be corrected when Student Master and Fee Desk show different pending amounts?

**What the AI said:** Use one consistent calculation across modules. Scholarships should reduce base tuition only, late fines should remain unaffected, and all monetary calculations should be rounded to two decimal places.

**What I did:** Reviewed the existing calculation logic, updated the relevant fee calculations and compared the amounts displayed by both modules. I also checked the result against the accounting formula.

**Result:** Corrected the inconsistent fee calculation and currency formatting.

## Moment 2 — Preventing overpayments and handling credits

**What I asked:** How should the system handle a student whose payments exceed the fee due?

**What the AI said:** A negative pending balance should represent a credit, not an overdue amount. The frontend should show the credit, and the backend should reject additional payments.

**What I did:** Implemented the credit display and payment restrictions, then tested the backend payment endpoint with an overpaid student.

**Result:** The backend rejected the additional payment with HTTP 400.

## Moment 3 — Enforcing permissions and fine-waiver reasons

**What I asked:** How can the system prevent receptionists from applying discounts or waiving fines, even if they try to call the API directly?

**What the AI said:** Permissions must be checked in both the frontend and backend. Fine waivers should require a reason and record that reason in the audit activity.

**What I did:** Updated the role checks, backend authorization and fine-waiver workflow. Tested restricted actions using the available roles.

**Result:** Added permission enforcement and reason-based fine-waiver auditing.

## Moment 4 — Debugging the Fee Desk redesign

**What I asked:** How can the Fee Desk be simplified while keeping the payment panel usable at 1366 × 768?

**What the AI said:** Reduce the table columns, make the side panel responsive, allow its content to scroll independently and keep the payment controls accessible.

**What I did:** Applied the layout changes and tested the long-name student with 15 payment entries.

**Incomplete AI suggestion and how I caught it:** During a table-column replacement, an old `return base.filter(...)` section was left behind even though the `base` variable had been removed. The application displayed a white page. I inspected the browser console, found `ReferenceError: base is not defined`, removed the obsolete code and rebuilt the project.

**Result:** The Fee Desk loaded correctly after the correction, and the redesigned panel passed the long-history test.

## Moment 5 — Daybook and persistence verification

**What I asked:** How should I verify that payments, receipts and collection totals remain consistent?

**What the AI said:** Test payment persistence after browser refresh, compare cash and UPI totals, inspect the payment-mode filters and test a student with a long payment history.

**What I did:** Ran the tests locally with the Express server running. Refreshed the browser, checked the Daybook filters and opened the student with 15 payment entries.

**Result:** All three checks worked as expected.

## Reflection

AI suggestions were treated as guidance rather than automatically accepted solutions. I used build output, browser-console errors, API responses and manual application testing to identify incomplete suggestions and verify the changes.
