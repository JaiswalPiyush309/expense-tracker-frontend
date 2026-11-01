import type { ProfileErrors, ProfileField, ProfileValues } from "./types";

export const BIO_MAX = 300;
export const NAME_MAX = 50;
export const DISPLAY_NAME_MAX = 40;
export const LOCATION_MAX = 80;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const INTERNATIONAL_POSTAL_RE = /^[A-Za-z0-9][A-Za-z0-9 -]{1,8}[A-Za-z0-9]$/;

function isValidCalendarDate(value: string) {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Order in which errors are focused and fields appear on screen. */
export const FIELD_ORDER: ProfileField[] = [
  "firstName",
  "lastName",
  "displayName",
  "email",
  "mobile",
  "dob",
  "gender",
  "country",
  "state",
  "city",
  "pincode",
  "bio",
];

/** Client-side validation for convenience. The server must validate again. */
export function validateProfile(
  v: ProfileValues,
  today: Date = new Date(),
): ProfileErrors {
  const e: ProfileErrors = {};

  const first = v.firstName.trim();
  if (!first) e.firstName = "Enter your first name.";
  else if (first.length > NAME_MAX)
    e.firstName = `Keep it under ${NAME_MAX} characters.`;

  const last = v.lastName.trim();
  if (!last) e.lastName = "Enter your last name.";
  else if (last.length > NAME_MAX)
    e.lastName = `Keep it under ${NAME_MAX} characters.`;

  const display = v.displayName.trim();
  if (!display) e.displayName = "Choose a display name.";
  else if (display.length > DISPLAY_NAME_MAX)
    e.displayName = `Keep it under ${DISPLAY_NAME_MAX} characters.`;

  const email = v.email.trim();
  if (!email) e.email = "Enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email))
    e.email = "Enter a valid email address.";

  const mobile = v.mobile.replace(/[\s()-]/g, "");
  if (!mobile) e.mobile = "Enter your mobile number.";
  else if (!/^\+?\d{10,14}$/.test(mobile))
    e.mobile = "Enter a valid number, e.g. +91 98765 43210.";

  if (!v.dob) e.dob = "Select your date of birth.";
  else if (!isValidCalendarDate(v.dob)) {
    e.dob = "Enter a valid date of birth.";
  } else {
    const [year, month, day] = v.dob.split("-").map(Number);
    const dobTime = Date.UTC(year, month - 1, day);
    const todayTime = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    if (year < 1900 || dobTime > todayTime) {
      e.dob = "Enter a valid date of birth.";
    }
  }

  if (!v.gender) e.gender = "Select an option.";
  if (!v.country) e.country = "Select your country.";
  const state = v.state.trim();
  if (!state) e.state = "Enter your state.";
  else if (state.length > LOCATION_MAX)
    e.state = `Keep it under ${LOCATION_MAX} characters.`;

  const city = v.city.trim();
  if (!city) e.city = "Enter your city.";
  else if (city.length > LOCATION_MAX)
    e.city = `Keep it under ${LOCATION_MAX} characters.`;

  const pin = v.pincode.trim();
  if (!pin) e.pincode = "Enter your PIN code.";
  else if (v.country === "IN" && !/^\d{6}$/.test(pin))
    e.pincode = "PIN code must be 6 digits.";
  else if (v.country !== "IN" && !INTERNATIONAL_POSTAL_RE.test(pin))
    e.pincode = "Enter a valid postal code.";

  if (v.bio.trim().length > BIO_MAX)
    e.bio = `Keep it under ${BIO_MAX} characters.`;

  return e;
}
