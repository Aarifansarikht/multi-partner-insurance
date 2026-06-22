import { useAppSelector } from "@/store/hooks";
import { getPartner } from "./partners.config";

/** The currently active partner object. */
export function useActivePartner() {
  const id = useAppSelector((s) => s.partner.activePartnerId);
  return getPartner(id);
}
