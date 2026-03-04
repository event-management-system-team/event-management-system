import { format } from 'date-fns';

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Format: "Oct 12, 14:30"
    return format(date, 'MMM dd, HH:mm');
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return dateString;
  }
};