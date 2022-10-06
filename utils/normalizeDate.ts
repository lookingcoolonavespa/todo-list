export default function normalizeDate(date: Date) {
  const year = date.getFullYear();

  const month = date.getMonth() + 1;
  let monthStr = month.toString();
  if (monthStr.length === 1) monthStr = '0'.concat(monthStr);

  const day = date.getDate();
  let dayStr = day.toString();
  if (dayStr.length === 1) dayStr = '0'.concat(dayStr);

  return `${year}-${monthStr}-${dayStr}`;
}
