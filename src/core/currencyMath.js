
export const round2 = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function formatINR(value) {
  const amount = toNumber(value);
  const sign = amount < 0 ? '-' : '';

  return `${sign}₹${Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value) {
  const amount = toNumber(value);
  return `${amount > 0 ? '+' : ''}${Math.round(amount)}%`;
}

export function calculateStudentDues(student) {
  const tuition = toNumber(student.tuition);
  const lateFine = toNumber(student.lateFine);
  const paidAmount = toNumber(student.paidAmount);
  const scholarshipPct = toNumber(student.scholarshipPct);

  const tuitionAfterScholarship = round2(
    tuition * (1 - scholarshipPct / 100)
  );

  const pending = round2(
    tuitionAfterScholarship + lateFine - paidAmount
  );

  return {
    grossPayable: round2(tuition + lateFine),
    netPayable: pending,
    pending,
    isDefaulter: pending > 0,
    isCredit: pending < 0,
  };
}

export function collectionProgress(student) {
  const tuitionAfterScholarship =
    toNumber(student.tuition) *
    (1 - toNumber(student.scholarshipPct) / 100);

  const payable = round2(
    tuitionAfterScholarship + toNumber(student.lateFine)
  );

  if (payable <= 0) return 100;

  const { pending } = calculateStudentDues(student);

  return Math.min(
    100,
    Math.max(0, Math.round(((payable - pending) / payable) * 100))
  );
}
