import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { readPersisted } from "@/store/persistence";
import type {
  JourneySelection,
  KycData,
  NomineeData,
  PaymentResult,
  PersonalData,
} from "./types";

export interface JourneyState {
  selection: JourneySelection | null;
  kyc: KycData | null;
  personal: PersonalData | null;
  nominee: NomineeData | null;
  reviewed: boolean;
  payment: PaymentResult | null;
}

export const emptyJourney: JourneyState = {
  selection: null,
  kyc: null,
  personal: null,
  nominee: null,
  reviewed: false,
  payment: null,
};

/** Rehydrate an in-progress journey so a mid-flow refresh resumes seamlessly. */
export function getInitialJourneyState(): JourneyState {
  return readPersisted<JourneyState>("journey") ?? emptyJourney;
}

const journeySlice = createSlice({
  name: "journey",
  initialState: getInitialJourneyState(),
  reducers: {
    /**
     * Begin a purchase. Always starts from a clean slate so a new journey never
     * inherits data from a previous plan or a completed purchase.
     */
    startJourney(_state, action: PayloadAction<JourneySelection>) {
      return { ...emptyJourney, selection: action.payload };
    },
    saveKyc(state, action: PayloadAction<KycData>) {
      state.kyc = action.payload;
    },
    savePersonal(state, action: PayloadAction<PersonalData>) {
      state.personal = action.payload;
    },
    saveNominee(state, action: PayloadAction<NomineeData>) {
      state.nominee = action.payload;
      // Editing nominee invalidates a prior review confirmation.
      state.reviewed = false;
    },
    confirmReview(state) {
      state.reviewed = true;
    },
    setPayment(state, action: PayloadAction<PaymentResult>) {
      state.payment = action.payload;
    },
    resetJourney() {
      return emptyJourney;
    },
  },
});

export const {
  startJourney,
  saveKyc,
  savePersonal,
  saveNominee,
  confirmReview,
  setPayment,
  resetJourney,
} = journeySlice.actions;

export default journeySlice.reducer;
