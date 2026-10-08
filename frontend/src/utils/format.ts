export const formatCurrency = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
};
export const formatTime = (timeStr: string): string => timeStr;
export const formatDuration = (minutes: number): string => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export const cleanScreenDisplay = (format: string, screenName: string) => {
  if (!screenName) return screenName;
  const regex = new RegExp(`\\s*-\\s*${format}`, 'i');
  const cleaned = screenName.replace(regex, '').trim();
  return cleaned || screenName;
};
