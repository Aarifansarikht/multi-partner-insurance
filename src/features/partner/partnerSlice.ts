import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_PARTNER_ID, PARTNERS } from "./partners.config";
import { readPersisted } from "@/store/persistence";

export interface PartnerState {
  activePartnerId: string;
}

/** Resolve a valid starting partner from storage, falling back to default. */
export function getInitialPartnerState(): PartnerState {
  const persisted = readPersisted<PartnerState>("partner");
  const isValid =
    persisted && PARTNERS.some((p) => p.id === persisted.activePartnerId);
  return { activePartnerId: isValid ? persisted!.activePartnerId : DEFAULT_PARTNER_ID };
}

const partnerSlice = createSlice({
  name: "partner",
  initialState: getInitialPartnerState(),
  reducers: {
    setPartner(state, action: PayloadAction<string>) {
      if (PARTNERS.some((p) => p.id === action.payload)) {
        state.activePartnerId = action.payload;
      }
    },
  },
});

export const { setPartner } = partnerSlice.actions;
export default partnerSlice.reducer;
