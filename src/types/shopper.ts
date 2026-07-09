export type ShopperState =
  | "Browser"
  | "Explorer"
  | "Comparer"
  | "Discount Seeker"
  | "Impulse Buyer"
  | "Cart Abandoner"
  | "Returning Visitor"
  | "Loyal Customer"
  | "High Intent Buyer"
  | "Window Shopper"
  | "Repeat Buyer"
  | "VIP Customer"
  | "Gift Shopper"
  | "Researcher"
  | "Uncertain Buyer";

export const SHOPPER_STATES: ShopperState[] = [
  "Browser",
  "Explorer",
  "Comparer",
  "Discount Seeker",
  "Impulse Buyer",
  "Cart Abandoner",
  "Returning Visitor",
  "Loyal Customer",
  "High Intent Buyer",
  "Window Shopper",
  "Repeat Buyer",
  "VIP Customer",
  "Gift Shopper",
  "Researcher",
  "Uncertain Buyer",
];

export type RiskLevel = "low" | "medium" | "high";
export type Effort = "low" | "medium" | "high";
export type Urgency = "low" | "medium" | "high" | "critical";

export interface PersonalizationRecommendation {
  id: string;
  title: string;
  type:
    | "discount_popup"
    | "free_shipping"
    | "testimonials"
    | "bundle"
    | "recently_viewed"
    | "cross_sell"
    | "upsell"
    | "urgency_timer"
    | "inventory_message"
    | "price_drop_alert"
    | "wishlist_reminder"
    | "email_reminder"
    | "sms_reminder"
    | "reward_points"
    | "personal_coupon"
    | "recommendation_carousel";
  why: string;
  expectedConversionLift: string;
  confidence: number;
  effort: Effort;
  priority: number;
}

export interface AlternativeClassification {
  state: ShopperState;
  confidence: number;
  reasonRejected: string;
}

export interface TimelineEvidencePoint {
  eventIndex: number;
  label: string;
  weight: "signal" | "supporting" | "noise";
  note?: string;
}

export interface AIReasoning {
  observedBehaviors: string[];
  importantSignals: string[];
  ignoredSignals: string[];
  reasoning: string;
  finalDecision: string;
  businessStrategy: string;
  whyNotOthers: string;
}

export interface SessionAnalysis {
  id: string;
  sessionId: string;
  createdAt: string;
  shopperState: ShopperState;
  confidence: number;
  evidenceStrength: number;
  modelConfidence: number;
  evidence: string[];
  aiExplanation: string;
  recommendedAction: string;
  expectedBusinessImpact: string;
  expectedLift: string;
  estimatedRevenueImpact: number;
  urgency: Urgency;
  riskLevel: RiskLevel;
  alternatives: AlternativeClassification[];
  recommendations: PersonalizationRecommendation[];
  reasoning: AIReasoning;
  timelineEvidence: TimelineEvidencePoint[];
  source: "gemini" | "mock";
  /** The event stream that produced this analysis — required so saved/compared/exported analyses remain self-contained. */
  sourceEvents: import("./events").SessionEvent[];
}

/** A persisted history entry: an analysis plus user-facing metadata not part of the AI output itself. */
export interface SavedAnalysis {
  analysis: SessionAnalysis;
  favorite: boolean;
  savedLabel?: string;
  savedAt: string;
}

export interface MockSession {
  id: string;
  label: string;
  persona: string;
  events: import("./events").SessionEvent[];
  createdAt: string;
}
