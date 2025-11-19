const SUBMISSION_STORAGE_KEY = 'worker-recent-submissions';
export const SUBMISSION_STORAGE_EVENT = 'worker-recent-submissions-updated';

const DATE_FORMAT_OPTIONS = { month: 'short', day: '2-digit', year: 'numeric' };

const formatDisplayDate = (value) => {
  if (!value) {
    return new Date().toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
};

const formatDisplayTime = (value) => {
  if (!value) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Handles times stored as "HH:MM" without a date portion.
  const date = new Date(`1970-01-01T${value}`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getStoredSubmissions = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(SUBMISSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read submissions from localStorage', error);
    return [];
  }
};

export const appendSubmissionRecord = ({
  type,
  date,
  time,
  status = 'pending',
  supervisor = 'Awaiting Review',
  feedback = '',
  details = {},
}) => {
  if (typeof window === 'undefined' || !type) {
    return;
  }

  const now = new Date();
  const normalizedRecord = {
    id: `submission-${now.getTime()}`,
    type,
    date: formatDisplayDate(date),
    time: formatDisplayTime(time),
    status,
    supervisor,
    feedback,
    details,
  };

  const existing = getStoredSubmissions();
  const updated = [normalizedRecord, ...existing].slice(0, 25);

  try {
    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SUBMISSION_STORAGE_EVENT, { detail: normalizedRecord }));
  } catch (error) {
    console.error('Failed to store submission record', error);
  }

  return normalizedRecord;
};

export { SUBMISSION_STORAGE_KEY };

