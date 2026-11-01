import { CircleCheck, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { fieldId, type ProfileForm } from "../hooks/useProfileForm";
import { BIO_MAX } from "../validation";
import type { ProfileField, SelectOption } from "../types";

interface IdentityFormProps {
  form: ProfileForm;
  genderOptions: SelectOption[];
  countryOptions: SelectOption[];
  /** Starts your email-change flow (the email field itself is read-only). */
  onChangeEmail?: () => void;
  /** Show the "OTP Verified" tag next to the mobile number. */
  mobileVerified?: boolean;
}

export function IdentityForm({
  form,
  genderOptions,
  countryOptions,
  onChangeEmail,
  mobileVerified = false,
}: IdentityFormProps) {
  const { bind, errorOf, values } = form;
  // Shared bits for <Field>: id + error text for a given field.
  const f = (name: ProfileField) => ({
    htmlFor: fieldId(name),
    error: errorOf(name),
  });

  return (
    <Card className="p-5 sm:p-6">
      <CardHeader
        title="Identity & Legal Profile"
        description="Update your registered name, communication handle, and contact points."
        actions={
          <UserRound aria-hidden="true" className="h-5 w-5 text-muted" />
        }
      />

      <form
        className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2"
        noValidate
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          void form.submit();
        }}
      >
        <Field label="First name" {...f("firstName")}>
          <Input autoComplete="given-name" {...bind("firstName")} />
        </Field>
        <Field label="Last name" {...f("lastName")}>
          <Input autoComplete="family-name" {...bind("lastName")} />
        </Field>

        <Field label="Public display name" {...f("displayName")}>
          <Input autoComplete="nickname" {...bind("displayName")} />
        </Field>
        <Field
          label="Primary email"
          {...f("email")}
          labelRight={
            onChangeEmail && (
              <button
                type="button"
                onClick={onChangeEmail}
                className="rounded text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Change Email
              </button>
            )
          }
        >
          <Input
            type="email"
            readOnly
            autoComplete="email"
            id={fieldId("email")}
            name="email"
            value={values.email}
            inputClassName="pr-24"
            trailing={
              <Badge tone="good" className="text-[11px]">
                Primary
              </Badge>
            }
          />
        </Field>

        <Field
          label="Mobile number"
          {...f("mobile")}
          labelRight={
            mobileVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-good">
                <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" />
                OTP Verified
              </span>
            )
          }
        >
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...bind("mobile")}
          />
        </Field>
        <Field label="Date of birth" {...f("dob")}>
          <Input type="date" autoComplete="bday" {...bind("dob")} />
        </Field>

        <Field label="Gender" {...f("gender")}>
          <Select
            className="w-full"
            selectClassName="text-sm font-normal"
            {...bind("gender")}
          >
            {genderOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Country of residence" {...f("country")}>
          <Select
            className="w-full"
            selectClassName="text-sm font-normal"
            autoComplete="country"
            {...bind("country")}
          >
            {countryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-3">
          <Field label="State / UT" {...f("state")}>
            <Input autoComplete="address-level1" {...bind("state")} />
          </Field>
          <Field label="City" {...f("city")}>
            <Input autoComplete="address-level2" {...bind("city")} />
          </Field>
          <Field label="Postal / PIN code" {...f("pincode")}>
            <Input
              inputMode="numeric"
              autoComplete="postal-code"
              {...bind("pincode")}
            />
          </Field>
        </div>

        <Field
          label="Bio & financial purpose"
          className="sm:col-span-2"
          {...f("bio")}
          hint={
            <span className="tabular-nums">
              {values.bio.length} / {BIO_MAX}
            </span>
          }
        >
          <Textarea rows={3} {...bind("bio")} />
        </Field>

        {/* Lets Enter submit the form from a text field. */}
        <button type="submit" className="sr-only" tabIndex={-1}>
          Save
        </button>
      </form>
    </Card>
  );
}
