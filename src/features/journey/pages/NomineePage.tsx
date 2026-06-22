import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/form/Field";
import { StepHeader, StepActions } from "@/features/journey/components/StepShell";
import { useAppDispatch } from "@/store/hooks";
import { useJourney } from "@/features/journey/selectors";
import { saveNominee } from "@/features/journey/journeySlice";
import { nomineeSchema, type NomineeInput } from "@/features/journey/schemas";
import { RELATION_OPTIONS } from "@/features/journey/constants";
import { ROUTES } from "@/lib/routes";

export default function NomineePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { nominee } = useJourney();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NomineeInput>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: {
      fullName: nominee?.fullName ?? "",
      relation: nominee?.relation ?? undefined,
      dateOfBirth: nominee?.dateOfBirth ?? "",
      sharePercentage: nominee?.sharePercentage ?? 100,
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(saveNominee(data));
    navigate(ROUTES.review);
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <StepHeader
        title="Nominee details"
        description="Your nominee receives the policy benefit. You can add a single nominee here."
      />

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            id="nomineeName"
            label="Nominee’s full name"
            required
            error={errors.fullName?.message}
          >
            <Input
              id="nomineeName"
              autoComplete="off"
              invalid={!!errors.fullName}
              aria-describedby="nomineeName-error"
              {...register("fullName")}
            />
          </Field>

          <Field
            id="relation"
            label="Relationship"
            required
            error={errors.relation?.message}
          >
            <Controller
              control={control}
              name="relation"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="relation" aria-invalid={!!errors.relation}>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATION_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            id="nomineeDob"
            label="Date of birth"
            required
            error={errors.dateOfBirth?.message}
          >
            <Input
              id="nomineeDob"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              invalid={!!errors.dateOfBirth}
              aria-describedby="nomineeDob-error"
              {...register("dateOfBirth")}
            />
          </Field>

          <Field
            id="share"
            label="Benefit share"
            required
            error={errors.sharePercentage?.message}
            hint="Percentage of the benefit for this nominee"
          >
            <div className="relative">
              <Input
                id="share"
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                className="pr-8"
                invalid={!!errors.sharePercentage}
                aria-describedby="share-error share-hint"
                {...register("sharePercentage", { valueAsNumber: true })}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </Field>
        </div>
      </div>

      <StepActions
        onBack={() => navigate(ROUTES.personal)}
        submitting={isSubmitting}
      />
    </form>
  );
}
