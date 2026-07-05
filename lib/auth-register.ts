import type { AppRegisterModel } from "@/lib/api/client";

function createRegistrationPassword() {
  return `${crypto.randomUUID().replace(/-/g, "")}Aa1`;
}

export type RegistrationFormValues = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referral?: string;
};

export function buildRegisterPayload(
  form: RegistrationFormValues,
  phoneNumber: string,
): AppRegisterModel {
  const email = form.email.trim();

  const payload: AppRegisterModel = {
    name: form.name.trim(),
    surname: form.lastName.trim(),
    phoneNumber,
    emailAddress: email || `${phoneNumber}@users.whalert.net`,
    password: createRegistrationPassword(),
  };

  const referral = form.referral?.trim();
  if (referral) {
    payload.referalCode = referral;
  }

  return payload;
}
