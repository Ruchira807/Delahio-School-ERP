# Implementation Notes — Delahio School ERP

## Complaint-by-complaint investigation and fixes

### 1. Payment button inaccessible on the counter laptop

**Cause:** The original Fee Desk used an excessively wide table, while the student side panel did not provide a properly constrained, independently scrollable content area. Long payment histories could make the payment controls difficult to reach.

**Reproduction:** Open Fee Desk at the target laptop resolution of 1366 × 768. Open the record of Venkatanarasimharajuvaripeta Subramanium and inspect the payment panel.

**Changes made:**
- Simplified the Fee Desk table columns.
- Made the student side panel responsive.
- Added independent vertical scrolling to the panel content.
- Kept the payment controls in the panel footer.
- Corrected the payment preview to calculate the collected amount numerically instead of concatenating strings.

**Verification:** Opened the long-name student's record and checked the panel with 15 existing payment entries. Confirmed that the history could be viewed by scrolling and that the payment controls remained accessible.

### 2. Diya Nair showed different pending amounts

**Cause:** Fee calculations were inconsistent between modules. The scholarship calculation needed to apply to base tuition only, while late fines had to remain fully payable.

**Reproduction:** Compared Diya Nair's pending fee in Student Master and Fee Desk.

**Changes made:**
- Corrected the shared fee calculation.
- Applied the scholarship only to base tuition.
- Kept late fines outside the scholarship calculation.
- Standardised currency formatting to two decimal places.

**Verification:** Compared the amounts displayed by the two modules after the correction and checked the calculation against the accounting formula.

### 3. Kabir Menon's payment disappeared after refresh

**Cause:** The application uses in-memory server state. The payment flow must update the server-side student balance and payment history, not only the frontend state.

**Reproduction:** Recorded a payment, refreshed the browser while the server remained running, and checked the student's balance and payment records.

**Changes made:**
- Corrected the backend payment handling so successful collections update the student record and payment history.
- Kept the payment and receipt information in the server's in-memory state.

**Verification:** Recorded a payment and refreshed the browser. Confirmed that the updated student balance and receipt history remained available while the server process was running.

**Limitation:** This is intentionally not permanent database storage. Restarting the server or calling `POST /api/reset` restores the seed snapshot, as required by the assessment.

### 4. Receptionist could waive fines and apply discounts

**Cause:** Frontend-only visibility restrictions are insufficient. The backend must independently enforce permissions.

**Changes made:**
- Used the role matrix in `src/core/permissions.js`.
- Added backend permission checks for discounts, fine waivers and bulk reminders.
- Restricted fine-waiver and discount controls according to the active role.
- Prevented unauthorised API actions.

**Verification:** Tested the role-specific controls and backend authorization for restricted actions.

### 5. Select-all reminders affected all 40 students

**Cause:** The original selection logic operated on the complete student collection instead of the filtered list.

**Changes made:**
- Updated select-all to use `visibleRows`.
- Preserved selections outside the current filter when selecting or deselecting visible students.
- Made the selected state reflect the currently visible students.

**Verification:** Applied class filters and checked that select-all affected only the displayed students.

### 6. Riya Agarwal was overpaid but still accepted another payment

**Cause:** Negative pending balances were not being treated consistently as credits.

**Changes made:**
- Corrected the pending balance calculation.
- Displayed negative balances as student credits.
- Excluded credit balances from overdue/defaulter calculations.
- Disabled payment controls when no positive balance was due.
- Added backend validation to reject payments when nothing is due or when the payment exceeds the outstanding amount.

**Verification:** Checked Riya Agarwal's credit balance and attempted an additional payment through the API. The backend rejected the request with HTTP 400.

### 7. Fine waivers required a written reason

**Changes made:**
- Required a written reason before a fine waiver can be submitted.
- Rejected reasons shorter than five characters.
- Added the reason to the fine-waiver audit activity.
- Enforced the permission check on the backend.

**Verification:** Checked the reason validation and confirmed that successful waiver responses include an audit entry.

### 8. Split cash and UPI payments

**Initial investigation:** The application already supported cash and UPI amounts in the payment flow and displayed split-mode receipts in the Daybook. This was existing functionality, so it did not need to be rebuilt.

**Changes made:** Retained the existing split-payment workflow while working on the other fee and accounting corrections.

**Verification:** Checked the Daybook's Cash, UPI and Split filters and compared the displayed collection totals. The tested Daybook showed separate cash and UPI totals that added up to the overall collection.

### 9. Fee Desk redesign

**Cause:** The original table exposed too many columns and payment inputs at once, making it difficult to use at the counter.

**Changes made:**
- Reduced the table to student, class, parent, pending/credit, quick payment and action information.
- Retained search and class/status filters.
- Added a responsive student details panel.
- Made payment history independently scrollable.
- Kept payment controls accessible in the panel footer.

**Verification:** Tested the Fee Desk at the target laptop resolution and opened the student with 15 payment-history entries. Confirmed that the panel remained usable and the payment controls were accessible.

## 2. Accounting decisions

The implementation follows these rules:

1. Scholarships apply only to base tuition.
2. Late fines are not reduced by scholarships.
3. Amount due is calculated as:

   `round2(tuition × (1 − scholarshipPct / 100) + lateFine − paidAmount)`

4. Monetary values are displayed to two decimal places.
5. Negative pending amounts represent credits/refunds due to students, not overdue fees.
6. Students with zero or negative pending balances cannot make additional payments.
7. Payments greater than the amount due are rejected.
8. Exam eligibility is based on the corrected outstanding balance.
9. Daybook cash, UPI and receipt information is retained as the official collection record.
10. Role permissions are enforced using the existing role matrix and backend checks.

## 3. Additional findings

- The shared currency calculation needed to be consistent across Student Master and Fee Desk.
- A credit balance must not be counted as an overdue amount.
- Frontend permission checks alone cannot protect restricted backend operations.
- Payment previews must convert input strings to numbers before performing arithmetic.
- The Daybook and student payment history both need to remain consistent after a browser refresh.

## 4. What was intentionally not done

- No database was introduced. The required in-memory Express architecture was retained.
- No new external services were added.
- No student records or modules were removed to simplify the interface.
- Existing split-payment functionality was retained instead of unnecessarily rebuilding it.
- No permanent storage across server restarts was introduced because the assessment explicitly requires seed restoration on restart/reset.

## 5. Final verification

The following checks were performed locally:

- Production build using `npm run build`.
- Payment persistence after browser refresh while the server was running.
- Daybook Cash, UPI and Split filters.
- Daybook receipt and collection totals.
- Credit balance and overpayment rejection.
- Role-based controls.
- Fee Desk long-name student and 15-entry payment history.
- Git working tree and commit history.