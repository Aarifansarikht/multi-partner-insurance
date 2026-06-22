import type { Plan } from "@/types/plan";

/**
 * Mock catalog.
 *
 * Shaped exactly as a real `/plans` API response would be so swapping in a
 * backend later is a one-line change in the API layer. Cover amounts are in
 * rupees; `ratePerLakh` is the annual premium per ₹1,00,000 of cover.
 */
export const PLANS: Plan[] = [
  {
    id: "term-secure-shield",
    slug: "secure-shield-term",
    name: "Secure Shield Term Plan",
    category: "Term Life",
    tagline: "High cover, low premium pure-protection life insurance.",
    description:
      "A no-frills term plan that pays your family a lump sum if something happens to you during the policy term. Maximise cover while keeping premiums affordable, with optional add-ons for critical illness and accidental death.",
    featured: true,
    popular: true,
    coverMin: 2500000,
    coverMax: 50000000,
    coverStep: 2500000,
    coverDefault: 10000000,
    ratePerLakh: 62,
    terms: [10, 15, 20, 25, 30],
    highlights: [
      {
        title: "Cover up to ₹5 Cr",
        description: "Protect your family’s future with a high sum assured.",
      },
      {
        title: "Tax benefits",
        description: "Premiums qualify under Section 80C of the Income Tax Act.",
      },
      {
        title: "98.6% claims settled",
        description: "One of the highest settlement ratios in the category.",
      },
    ],
    coverage: [
      {
        label: "Death benefit",
        detail: "Full sum assured paid to nominee",
        included: true,
      },
      {
        label: "Terminal illness",
        detail: "Accelerated payout on diagnosis",
        included: true,
      },
      {
        label: "Accidental death rider",
        detail: "Optional additional cover",
        included: true,
      },
      {
        label: "Maturity / survival benefit",
        detail: "Pure protection — no maturity value",
        included: false,
      },
    ],
    benefits: [
      "Level premium locked for the entire term",
      "Option to pay yearly, half-yearly or monthly",
      "Increase cover at key life stages",
      "30-day free look period",
    ],
    exclusions: [
      "Death by suicide within the first 12 months",
      "Pre-existing conditions not disclosed at purchase",
    ],
    claimSettlementRatio: 98.6,
    rating: 4.7,
    reviewCount: 3120,
  },
  {
    id: "health-care-plus",
    slug: "care-plus-health",
    name: "Care Plus Health Insurance",
    category: "Health",
    tagline: "Comprehensive family health cover with cashless hospitals.",
    description:
      "A family-floater health plan covering hospitalisation, day-care procedures and pre/post-hospitalisation expenses with access to a wide cashless network. Designed to shield your savings from rising medical costs.",
    featured: true,
    popular: true,
    coverMin: 500000,
    coverMax: 10000000,
    coverStep: 500000,
    coverDefault: 1000000,
    ratePerLakh: 480,
    terms: [1, 2, 3],
    highlights: [
      {
        title: "10,000+ cashless hospitals",
        description: "Get treated without paying upfront at network hospitals.",
      },
      {
        title: "No room-rent capping",
        description: "Choose any room category up to the sum insured.",
      },
      {
        title: "Annual health check-up",
        description: "Complimentary preventive check-up every policy year.",
      },
    ],
    coverage: [
      {
        label: "In-patient hospitalisation",
        detail: "Up to sum insured",
        included: true,
      },
      {
        label: "Pre & post hospitalisation",
        detail: "60 and 90 days respectively",
        included: true,
      },
      {
        label: "Day-care procedures",
        detail: "All listed day-care treatments",
        included: true,
      },
      {
        label: "Maternity cover",
        detail: "Available as an add-on",
        included: false,
      },
    ],
    benefits: [
      "Family-floater across up to 6 members",
      "Cumulative no-claim bonus up to 100%",
      "Restoration of sum insured once a year",
      "Tax benefits under Section 80D",
    ],
    exclusions: [
      "Cosmetic or aesthetic treatments",
      "Pre-existing diseases during the initial waiting period",
    ],
    claimSettlementRatio: 96.2,
    rating: 4.5,
    reviewCount: 2480,
  },
  {
    id: "motor-drive-safe",
    slug: "drive-safe-motor",
    name: "DriveSafe Car Insurance",
    category: "Motor",
    tagline: "Comprehensive car cover with zero-depreciation add-on.",
    description:
      "Comprehensive motor insurance protecting against own-damage and third-party liability, with a fast digital claims experience and on-demand roadside assistance.",
    featured: true,
    coverMin: 100000,
    coverMax: 2500000,
    coverStep: 50000,
    coverDefault: 600000,
    ratePerLakh: 320,
    terms: [1, 2, 3],
    highlights: [
      {
        title: "Cashless garages",
        description: "Repairs at 5,000+ partner garages nationwide.",
      },
      {
        title: "Zero depreciation",
        description: "Full claim value without depreciation deductions.",
      },
      {
        title: "24×7 roadside help",
        description: "Towing, fuel and on-spot assistance anytime.",
      },
    ],
    coverage: [
      {
        label: "Own damage",
        detail: "Accident, fire, theft and natural calamities",
        included: true,
      },
      {
        label: "Third-party liability",
        detail: "Mandatory legal cover",
        included: true,
      },
      {
        label: "Personal accident cover",
        detail: "For the owner-driver",
        included: true,
      },
      {
        label: "Engine protection",
        detail: "Available as an add-on",
        included: false,
      },
    ],
    benefits: [
      "Instant digital policy issuance",
      "No-claim bonus protection",
      "Self-inspection via app",
      "Transferable no-claim bonus",
    ],
    exclusions: [
      "Driving without a valid licence",
      "Damage under the influence of alcohol",
    ],
    claimSettlementRatio: 94.8,
    rating: 4.3,
    reviewCount: 1760,
  },
  {
    id: "travel-globe-guard",
    slug: "globe-guard-travel",
    name: "GlobeGuard Travel Insurance",
    category: "Travel",
    tagline: "Worldwide travel protection for trips and emergencies.",
    description:
      "Single-trip travel insurance covering medical emergencies, trip cancellation, baggage loss and passport assistance, with 24×7 global support while you’re abroad.",
    featured: false,
    coverMin: 200000,
    coverMax: 5000000,
    coverStep: 100000,
    coverDefault: 1000000,
    ratePerLakh: 90,
    terms: [1, 2, 3],
    highlights: [
      {
        title: "Global medical cover",
        description: "Emergency treatment and hospitalisation abroad.",
      },
      {
        title: "Trip cancellation",
        description: "Reimbursement for covered cancellations.",
      },
      {
        title: "Baggage & passport",
        description: "Cover for lost baggage and passport assistance.",
      },
    ],
    coverage: [
      {
        label: "Emergency medical expenses",
        detail: "Up to sum insured",
        included: true,
      },
      {
        label: "Trip cancellation & delay",
        detail: "As per policy schedule",
        included: true,
      },
      {
        label: "Loss of baggage",
        detail: "Checked-in baggage cover",
        included: true,
      },
      {
        label: "Adventure sports",
        detail: "Available as an add-on",
        included: false,
      },
    ],
    benefits: [
      "Covers 200+ destinations",
      "Cashless medical assistance abroad",
      "24×7 multilingual emergency desk",
      "Quick online claims",
    ],
    exclusions: [
      "Pre-planned medical treatment abroad",
      "Losses due to undisclosed conditions",
    ],
    claimSettlementRatio: 95.1,
    rating: 4.4,
    reviewCount: 980,
  },
  {
    id: "home-shield-secure",
    slug: "home-shield-secure",
    name: "HomeShield Property Cover",
    category: "Home",
    tagline: "Protect your home structure and contents from the unexpected.",
    description:
      "Home insurance covering the building structure and contents against fire, theft, natural disasters and accidental damage, with optional cover for valuables.",
    featured: false,
    coverMin: 1000000,
    coverMax: 50000000,
    coverStep: 500000,
    coverDefault: 5000000,
    ratePerLakh: 28,
    terms: [1, 3, 5],
    highlights: [
      {
        title: "Structure + contents",
        description: "Single policy for building and belongings.",
      },
      {
        title: "Natural calamity cover",
        description: "Flood, earthquake, storm and more.",
      },
      {
        title: "Burglary protection",
        description: "Cover for theft and attempted break-ins.",
      },
    ],
    coverage: [
      {
        label: "Fire & allied perils",
        detail: "Structure and contents",
        included: true,
      },
      {
        label: "Burglary & theft",
        detail: "Covered up to sum insured",
        included: true,
      },
      {
        label: "Natural disasters",
        detail: "Flood, earthquake, cyclone",
        included: true,
      },
      {
        label: "Portable electronics",
        detail: "Available as an add-on",
        included: false,
      },
    ],
    benefits: [
      "Cover for owned and rented homes",
      "Long-term policy discounts",
      "Quick claim surveys",
      "Optional jewellery & valuables cover",
    ],
    exclusions: [
      "Wear and tear or gradual deterioration",
      "Damage from unlawful activities",
    ],
    claimSettlementRatio: 93.4,
    rating: 4.2,
    reviewCount: 610,
  },
  {
    id: "term-smart-income",
    slug: "smart-income-term",
    name: "SmartIncome Protect",
    category: "Term Life",
    tagline: "Term cover that pays your family a monthly income.",
    description:
      "A term plan variant that replaces lost income with a steady monthly payout to your family, instead of a single lump sum — helping them manage everyday expenses with stability.",
    featured: true,
    coverMin: 2500000,
    coverMax: 30000000,
    coverStep: 2500000,
    coverDefault: 7500000,
    ratePerLakh: 70,
    terms: [10, 15, 20, 25],
    highlights: [
      {
        title: "Monthly income payout",
        description: "Family receives a regular income for up to 10 years.",
      },
      {
        title: "Inflation-protected",
        description: "Option to increase payouts each year.",
      },
      {
        title: "Tax benefits",
        description: "Eligible under Section 80C.",
      },
    ],
    coverage: [
      {
        label: "Monthly income benefit",
        detail: "Paid to nominee on claim",
        included: true,
      },
      {
        label: "Lump sum + income mix",
        detail: "Choose your payout structure",
        included: true,
      },
      {
        label: "Terminal illness",
        detail: "Accelerated benefit",
        included: true,
      },
      {
        label: "Maturity benefit",
        detail: "Pure protection — none",
        included: false,
      },
    ],
    benefits: [
      "Income payouts for steady support",
      "Flexible payout period",
      "Level premium for the full term",
      "Riders for accident and disability",
    ],
    exclusions: [
      "Death by suicide within the first 12 months",
      "Non-disclosure of material facts",
    ],
    claimSettlementRatio: 97.9,
    rating: 4.6,
    reviewCount: 1430,
  },
];
