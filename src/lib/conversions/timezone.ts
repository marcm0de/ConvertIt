export const timezones = [
  { id: 'UTC', label: 'UTC', offset: 0 },
  { id: 'America/New_York', label: 'New York (EST/EDT)', offset: -5 },
  { id: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: -6 },
  { id: 'America/Denver', label: 'Denver (MST/MDT)', offset: -7 },
  { id: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: -8 },
  { id: 'Europe/London', label: 'London (GMT/BST)', offset: 0 },
  { id: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 1 },
  { id: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 1 },
  { id: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { id: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: 5.5 },
  { id: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
  { id: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { id: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 10 },
  { id: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 12 },
];

export function convertTimezone(date: Date, fromTz: string, toTz: string): Date {
  const fromStr = date.toLocaleString('en-US', { timeZone: fromTz });
  const toStr = date.toLocaleString('en-US', { timeZone: toTz });
  const fromDate = new Date(fromStr);
  const toDate = new Date(toStr);
  const diff = toDate.getTime() - fromDate.getTime();
  return new Date(date.getTime() + diff);
}

export function getTimeInZone(tz: string): string {
  return new Date().toLocaleString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function getDateInZone(tz: string): string {
  return new Date().toLocaleDateString('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
