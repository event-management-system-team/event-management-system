export const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const cleanTime = timeStr.substring(0, 16).replace(' ', 'T');
    const isoString = `${cleanTime}:00+07:00[Asia/Ho_Chi_Minh]`;
    return window.Temporal.ZonedDateTime.from(isoString);
};