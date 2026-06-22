import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/form/Field";
import { StepHeader, StepActions } from "@/features/journey/components/StepShell";
import { useAppDispatch } from "@/store/hooks";
import { useJourney } from "@/features/journey/selectors";
import { saveKyc } from "@/features/journey/journeySlice";
import { kycSchema, type KycInput } from "@/features/journey/schemas";
import { ROUTES } from "@/lib/routes";

const CURRENT_YEAR = new Date().getFullYear();

export default function KycPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { kyc } = useJourney();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<KycInput>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      panNumber: kyc?.panNumber ?? "",
      fullName: kyc?.fullName ?? "",
      dateOfBirth: kyc?.dateOfBirth ?? "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(saveKyc(data));
    navigate(ROUTES.personal);
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <StepHeader
        title="Identity verification"
        description="We need a few identity details to issue your policy. Your information is encrypted and used only for this application."
      />

      <div className="space-y-5">
        <Field
          id="panNumber"
          label="PAN number"
          required
          error={errors.panNumber?.message}
          hint="Format: ABCDE1234F"
        >
          <Input
            id="panNumber"
            autoComplete="off"
            maxLength={10}
            placeholder="ABCDE1234F"
            className="uppercase tracking-widest"
            invalid={!!errors.panNumber}
            aria-describedby="panNumber-error panNumber-hint"
            {...register("panNumber")}
          />
        </Field>

        <Field
          id="fullName"
          label="Full name (as on PAN)"
          required
          error={errors.fullName?.message}
        >
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="e.g. Aarav Sharma"
            invalid={!!errors.fullName}
            aria-describedby="fullName-error"
            {...register("fullName")}
          />
        </Field>

        <Field
          id="dateOfBirth"
          label="Date of birth"
          required
          error={errors.dateOfBirth?.message}
        >
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DatePicker
                id="dateOfBirth"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!errors.dateOfBirth}
                placeholder="Select date of birth"
                fromYear={CURRENT_YEAR - 100}
                toYear={CURRENT_YEAR}
              />
            )}
          />
        </Field>
      </div>

      <StepActions submitting={isSubmitting} />
    </form>
  );
}
