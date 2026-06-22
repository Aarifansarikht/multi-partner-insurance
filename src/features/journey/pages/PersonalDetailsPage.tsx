import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldSection } from "@/components/form/Field";
import { StepHeader, StepActions } from "@/features/journey/components/StepShell";
import { useAppDispatch } from "@/store/hooks";
import { useJourney } from "@/features/journey/selectors";
import { savePersonal } from "@/features/journey/journeySlice";
import { personalSchema, type PersonalInput } from "@/features/journey/schemas";
import { GENDER_OPTIONS, INDIAN_STATES } from "@/features/journey/constants";
import { ROUTES } from "@/lib/routes";

export default function PersonalDetailsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { personal, kyc } = useJourney();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInput>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: personal?.fullName ?? kyc?.fullName ?? "",
      email: personal?.email ?? "",
      gender: personal?.gender ?? undefined,
      addressLine1: personal?.addressLine1 ?? "",
      addressLine2: personal?.addressLine2 ?? "",
      city: personal?.city ?? "",
      state: personal?.state ?? "",
      pincode: personal?.pincode ?? "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(savePersonal(data));
    navigate(ROUTES.nominee);
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <StepHeader
        title="Personal details"
        description="Tell us about the person being insured. We’ll use this on your policy document."
      />

      <div className="space-y-8">
        <FieldSection title="About you">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Full name"
              required
              error={errors.fullName?.message}
            >
              <Input
                id="fullName"
                autoComplete="name"
                invalid={!!errors.fullName}
                aria-describedby="fullName-error"
                {...register("fullName")}
              />
            </Field>
            <Field
              id="email"
              label="Email address"
              required
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                invalid={!!errors.email}
                aria-describedby="email-error"
                {...register("email")}
              />
            </Field>
          </div>

          <Field id="gender" label="Gender" required error={errors.gender?.message}>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <RadioGroup
                  className="flex flex-wrap gap-2"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={`gender-${opt.value}`}
                      className="flex cursor-pointer items-center gap-2 rounded-sm border border-input bg-surface px-3 py-2 text-sm transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
                    >
                      <RadioGroupItem
                        id={`gender-${opt.value}`}
                        value={opt.value}
                      />
                      {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </Field>
        </FieldSection>

        <FieldSection title="Address">
          <Field
            id="addressLine1"
            label="Address line 1"
            required
            error={errors.addressLine1?.message}
          >
            <Input
              id="addressLine1"
              autoComplete="address-line1"
              placeholder="House / flat, street"
              invalid={!!errors.addressLine1}
              aria-describedby="addressLine1-error"
              {...register("addressLine1")}
            />
          </Field>
          <Field
            id="addressLine2"
            label="Address line 2"
            error={errors.addressLine2?.message}
            hint="Optional"
          >
            <Input
              id="addressLine2"
              autoComplete="address-line2"
              placeholder="Area, landmark"
              {...register("addressLine2")}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field
              id="city"
              label="City"
              required
              error={errors.city?.message}
            >
              <Input
                id="city"
                autoComplete="address-level2"
                invalid={!!errors.city}
                aria-describedby="city-error"
                {...register("city")}
              />
            </Field>
            <Field
              id="state"
              label="State"
              required
              error={errors.state?.message}
            >
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="state" aria-invalid={!!errors.state}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field
              id="pincode"
              label="PIN code"
              required
              error={errors.pincode?.message}
            >
              <Input
                id="pincode"
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                invalid={!!errors.pincode}
                aria-describedby="pincode-error"
                {...register("pincode")}
              />
            </Field>
          </div>
        </FieldSection>
      </div>

      <StepActions
        onBack={() => navigate(ROUTES.kyc)}
        submitting={isSubmitting}
      />
    </form>
  );
}
