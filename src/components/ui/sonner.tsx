import { Toaster as Sonner } from "sonner";
import { useAppSelector } from "@/store/hooks";

/**
 * Toaster wired to the active theme mode. Toast surfaces use the same semantic
 * tokens as the rest of the app so notifications stay on-brand across partners.
 */
export function Toaster() {
  const mode = useAppSelector((s) => s.theme.mode);
  return (
    <Sonner
      theme={mode}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-sm !border !border-border !bg-surface !text-surface-foreground !shadow-lg",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-sm",
          cancelButton: "!bg-muted !text-muted-foreground !rounded-sm",
          success: "!text-success",
          error: "!text-destructive",
        },
      }}
    />
  );
}
