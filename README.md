# Delahio School ERP

A single-service school ERP for a mid-sized Indian school: student master, fee desk
collections, daybook reporting and an activity log. Express serves the JSON API and
the compiled React frontend from the same process, so the whole app deploys as one
web service.

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18, Vite 5, TailwindCSS 3, lucide-react |
| Backend | Node.js 20, Express 4 |
| Data | In-memory state hydrated from `server/seedData.json` |
| Deploy | Single Render web service (`render.yaml`) |

Data is intentionally **in-memory**: every restart (or `POST /api/reset`) restores the
40 seeded student records, today's daybook and the activity log. That keeps the sandbox
safe to hand around without a database.

## Quick start

```bash
npm install
npm run build     # compiles the Vite frontend into dist/
npm start         # Express on http://localhost:3000
```

For frontend work with hot reload, run the API and Vite side by side:

```bash
npm run dev:api   # terminal 1, Express on :3000
npm run dev       # terminal 2, Vite on :5173 (proxies /api to :3000)
```

Requirements: Node.js 20+ and npm 10+.

## Modules

| Route (tab) | File | Purpose |
| --- | --- | --- |
| Student Master | `src/modules/01-student-master/StudentDirectory.jsx` | Directory, scholarships, exam eligibility |
| Fee Desk | `src/modules/02-fee-desk/FeeDesk.jsx` | Counter collections, fines, discounts, bulk reminders |
| Daybook & Reports | `src/modules/03-ledger-reports/DaybookLedger.jsx` | Today's cash/UPI split, receipts, defaulters |
| Activity | `src/modules/04-audit-log/AuditDrawer.jsx` | Session audit trail drawer |

Shared logic lives in `src/core/`: `currencyMath.js` (money helpers and dues),
`permissions.js` (role matrix), `api.js` (fetch wrapper) and `auditLogger.js`
(client-side audit helper).

The top navigation switches between three operating roles: `ADMIN`, `ACCOUNTANT` and
`RECEPTIONIST`. The matrix in `src/core/permissions.js` describes what each role may do.

## API

All routes are JSON and mounted under `/api`.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness probe |
| `GET` | `/api/bootstrap` | Full snapshot: school, students, daybook, audit log |
| `POST` | `/api/fees/pay` | Record a cash/UPI collection and issue a receipt |
| `POST` | `/api/fees/waive-fine` | Clear the late fine on a student |
| `POST` | `/api/fees/bulk-remind` | Queue fee reminders for a set of student IDs |
| `POST` | `/api/audit` | Append an activity log entry |
| `POST` | `/api/reset` | Restore the seed snapshot |

Example:

```bash
curl -X POST http://localhost:3000/api/fees/pay \
  -H 'Content-Type: application/json' \
  -d '{"studentId":"STU-2025-013","cash":2000,"upi":1500,"role":"ADMIN"}'
```

## Seed data

`server/seedData.json` holds 40 students across Classes 8, 9, 10 and 12 with tuition,
scholarship percentage, late fine, amount paid, payment history, guardian contact,
address and exam eligibility. It also carries a small daybook and audit trail so the
reports are not empty on first load.
