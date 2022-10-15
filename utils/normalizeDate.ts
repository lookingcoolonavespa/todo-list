import { DateStr, MM, DD, YYYY } from '../types/types';

export default function normalizeDate(date: Date): DateStr {
  const year: YYYY = date.getFullYear().toString() as YYYY;

  const month = date.getMonth() + 1;
  let monthStr: MM = month.toString() as MM;
  if (monthStr.length === 1) monthStr = '0'.concat(monthStr) as MM;

  const day = date.getDate();
  let dayStr: DD = day.toString() as DD;
  if (dayStr.length === 1) dayStr = '0'.concat(dayStr) as DD;

  return `${year}-${monthStr}-${dayStr}`;
}
