# Bug Triage — Delahio School ERP

## 1. Diya Nair — Inconsistent pending fee

**Priority:** High  
**Status:** Reproduced

**Steps to reproduce:**
1. Open Student Master.
2. Search for Diya Nair.
3. Note the pending amount.
4. Open Fee Desk and locate the same student.
5. Compare the pending amounts.

**Observed:** Student Master displays ₹15,000, while Fee Desk displays ₹10,500.

**Expected:** Both modules should display the same pending amount.

**Likely cause:** The two modules use different fee calculation logic. The shared calculation in `src/core/currencyMath.js` appears to apply the scholarship incorrectly. Fee Desk has a separate calculation in `src/modules/02-fee-desk/FeeDesk.jsx`.

## 2. Payment disappears after refresh

**Priority:** Critical  
**Status:** Reproduced

**Steps to reproduce:**
1. Open Fee Desk as Admin.
2. Locate the long-name student Venkatanarasimharajuvaripeta Subramanium.
3. Make a payment of ₹20,400.
4. Confirm that a receipt is generated and pending becomes ₹0.
5. Refresh the page.

**Observed:** After refreshing, the pending amount returns to ₹20,400.

**Expected:** The payment and updated student balance should remain available after refreshing the page.

**Likely cause:** The payment flow updates the displayed state, but the student's paid amount or payment history is not being persisted correctly by the backend. Investigate `server/index.js` and the payment flow in `src/modules/02-fee-desk/FeeDesk.jsx`.


## 3. Receptionist fine-waiver and discount controls

**Priority:** High  
**Status:** Partially reproduced — backend authorization not verified

**Steps to reproduce:**
1. Select the Receptionist role.
2. Open Fee Desk.
3. Inspect the fine-waiver and discount controls.

**Observed:** Fine-waiver and discount controls are visible to the Receptionist. Their effect on payment has not been verified.

**Expected:** Unauthorized roles should not be able to apply fine waivers or discounts. Restrictions must be enforced by both the frontend and backend.

**Likely cause:** Role-based permission checks may be missing or incomplete in the UI and/or backend. Investigate `src/core/permissions.js`, `FeeDesk.jsx`, and the relevant API handlers in `server/index.js`.

## 4. Class-filtered select-all reminders

**Priority:** High  
**Status:** Reproduced

**Steps to reproduce:**
1. Open Fee Desk.
2. Apply the Class 12 filter.
3. Observe the displayed student names.
4. Click the select-all checkbox.
5. Check the Selected count.

**Observed:** The displayed student names change according to the selected class, but the selection count remains 40. Selecting all while viewing Class 12 or Class 10 still selects all 40 students.

**Expected:** Select-all should select only the students currently visible after applying the filters.

**Likely cause:** The `toggleAll()` function in `src/modules/02-fee-desk/FeeDesk.jsx` uses the complete `students` array instead of the filtered `visibleRows` array.

## 5. Additional observations

- The long-name student's payment action was reachable and a receipt was generated. The payment did not persist after refresh.
- The Fee Desk already displays SPLIT payment receipts in Daybook. Existing split-payment functionality should be inspected before making changes.
- Student Master previously displayed a negative pending amount for an overpaid student. The credit display and payment rejection behavior still need verification.

## Initial implementation priorities

1. Fix the shared fee calculation and consistent two-decimal currency formatting.
2. Fix backend payment persistence and payment validation.
3. Enforce role-based permissions and require a reason for fine waivers.
4. Fix filtered select-all behavior.
5. Redesign Fee Desk for a compact, usable layout without removing existing functionality.
6. Verify existing split-payment support and test all changes.
