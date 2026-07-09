import type { SessionEvent } from "@/types/events";
import { EVENT_LABELS } from "@/types/events";
import type {
  AlternativeClassification,
  PersonalizationRecommendation,
  SessionAnalysis,
  ShopperState,
  TimelineEvidencePoint,
  Urgency,
  RiskLevel,
} from "@/types/shopper";

interface Signal {
  state: ShopperState;
  score: number;
  reasons: string[];
}

const has = (events: SessionEvent[], type: string) => events.some((e) => e.event === type);
const count = (events: SessionEvent[], type: string) => events.filter((e) => e.event === type).length;

function computeSignals(events: SessionEvent[]): Signal[] {
  const signals: Signal[] = [];
  const n = events.length;
  const purchased = has(events, "purchase");
  const addedToCart = has(events, "add_to_cart");
  const beganCheckout = has(events, "begin_checkout");
  const abandoned = has(events, "abandon_checkout");
  const returned = count(events, "return_visit");
  const compares = count(events, "compare_products");
  const reviews = count(events, "read_reviews");
  const coupons = count(events, "apply_coupon_attempt");
  const wishlist = has(events, "add_to_wishlist");
  const gift = count(events, "view_gift_options");
  const priceSort = has(events, "sort_price_low");
  const products = new Set(events.filter((e) => e.product).map((e) => e.product)).size;
  const cartThenNoCheckout = addedToCart && !beganCheckout && !purchased;
  const chatSupport = has(events, "chat_support");
  const deepScroll = count(events, "scroll_deep");
  const videoWatch = has(events, "watch_video");

  if (purchased && returned >= 1) {
    signals.push({
      state: "Loyal Customer",
      score: 78 + Math.min(returned * 4, 12),
      reasons: [`Completed purchase after ${returned} prior return visit(s)`, "Repeat engagement pattern with conversion"],
    });
  }

  if (purchased) {
    const cartValue = events.filter((e) => e.price).reduce((s, e) => s + (e.price ?? 0), 0);
    if (cartValue >= 300) {
      signals.push({
        state: "VIP Customer",
        score: 74 + Math.min(cartValue / 50, 20),
        reasons: [`High order value ($${cartValue}) completed in a single session`, "Minimal friction to purchase despite high price point"],
      });
    }
    if (!returned && cartValue < 300) {
      signals.push({
        state: "Repeat Buyer",
        score: 66,
        reasons: ["Fast, low-friction purchase suggests a known/consumable product", "No comparison shopping before buying"],
      });
    }
  }

  if (purchased && n <= 5 && !compares && !reviews) {
    signals.push({
      state: "Impulse Buyer",
      score: 82,
      reasons: [`Purchase completed in only ${n} events with no comparison or review-reading`, "Short time-to-purchase indicates low deliberation"],
    });
  }

  if (abandoned || (cartThenNoCheckout && has(events, "exit"))) {
    signals.push({
      state: "Cart Abandoner",
      score: 80 + (coupons > 0 ? 6 : 0),
      reasons: [
        addedToCart ? "Item added to cart but checkout was not completed" : "Session ended without completing checkout",
        abandoned ? "Explicit checkout abandonment event recorded" : "Exited immediately after cart action",
      ],
    });
  }

  if (coupons >= 1 && !purchased) {
    signals.push({
      state: "Discount Seeker",
      score: 70 + Math.min(coupons * 8, 20) + (priceSort ? 6 : 0),
      reasons: [`${coupons} coupon code attempt(s) detected`, priceSort ? "Also sorted by price ascending" : "Price-sensitive browsing pattern"],
    });
  }

  if (compares >= 2 || (products >= 2 && reviews >= 1)) {
    signals.push({
      state: "Comparer",
      score: 68 + Math.min(compares * 6, 20),
      reasons: [`${Math.max(compares, 1)} explicit comparison action(s) across ${products} product(s)`, "Evaluating multiple options before deciding"],
    });
  }

  if (reviews >= 2 && (compares >= 1 || chatSupport || videoWatch)) {
    signals.push({
      state: "Researcher",
      score: 71 + reviews * 4,
      reasons: [`Read reviews ${reviews} time(s)`, chatSupport ? "Contacted support for more detail" : "Deep content consumption before deciding"],
    });
  }

  if (gift >= 1) {
    signals.push({
      state: "Gift Shopper",
      score: 73 + gift * 5,
      reasons: ["Viewed gift options/framing", "Product exploration consistent with buying for someone else"],
    });
  }

  if (wishlist && !purchased) {
    signals.push({
      state: "Window Shopper",
      score: 52,
      reasons: ["Saved item to wishlist rather than purchasing", "Deferred decision without immediate intent"],
    });
  }

  if (returned >= 2 && !purchased) {
    signals.push({
      state: "Returning Visitor",
      score: 65 + returned * 5,
      reasons: [`${returned} return visits to the same product(s)`, "Sustained interest without conversion yet"],
    });
  }

  if ((beganCheckout || addedToCart) && !abandoned && !purchased && n <= 8) {
    signals.push({
      state: "High Intent Buyer",
      score: 75,
      reasons: [beganCheckout ? "Reached checkout within a short session" : "Added to cart quickly with minimal browsing", "Strong forward momentum toward purchase"],
    });
  }

  if (!addedToCart && !purchased && deepScroll >= 1 && n <= 4) {
    signals.push({
      state: "Browser",
      score: 48,
      reasons: ["Passive scrolling with no product-level engagement", "No cart or comparison actions taken"],
    });
  }

  if (!addedToCart && !purchased && products >= 3 && n <= 7) {
    signals.push({
      state: "Explorer",
      score: 55,
      reasons: [`Viewed ${products} distinct products across the session`, "Broad category exploration without narrowing down"],
    });
  }

  if (n <= 3 && !addedToCart && !purchased) {
    signals.push({
      state: "Uncertain Buyer",
      score: 44,
      reasons: ["Very short session with minimal signal", "Insufficient engagement to determine strong intent"],
    });
  }

  if (signals.length === 0) {
    signals.push({
      state: "Browser",
      score: 40,
      reasons: ["Default classification based on limited distinguishing signal"],
    });
  }

  return signals.sort((a, b) => b.score - a.score);
}

const RECOMMENDATION_LIBRARY: Record<ShopperState, Omit<PersonalizationRecommendation, "id">[]> = {
  "Cart Abandoner": [
    { title: "Trigger exit-intent discount popup", type: "discount_popup", why: "Cart was built but checkout stalled — a small incentive often recovers the sale", expectedConversionLift: "+14-22%", confidence: 84, effort: "low", priority: 1 },
    { title: "Send abandoned cart email in 1 hour", type: "email_reminder", why: "Session shows high intent up to checkout; timely reminder outperforms same-day generic emails", expectedConversionLift: "+9%", confidence: 76, effort: "low", priority: 2 },
    { title: "Surface free shipping threshold banner", type: "free_shipping", why: "Shipping cost is a top cause of checkout abandonment industry-wide", expectedConversionLift: "+7%", confidence: 65, effort: "low", priority: 3 },
  ],
  "Discount Seeker": [
    { title: "Offer a personal one-time coupon", type: "personal_coupon", why: "Multiple coupon attempts show explicit price sensitivity, not disinterest", expectedConversionLift: "+18%", confidence: 83, effort: "medium", priority: 1 },
    { title: "Show reward points balance", type: "reward_points", why: "Price-sensitive shoppers respond to visible loyalty value", expectedConversionLift: "+6%", confidence: 58, effort: "low", priority: 3 },
    { title: "Highlight current price-drop items", type: "price_drop_alert", why: "Reinforces the deal-seeking motivation already demonstrated", expectedConversionLift: "+10%", confidence: 70, effort: "low", priority: 2 },
  ],
  "Impulse Buyer": [
    { title: "Show urgency timer on similar items", type: "urgency_timer", why: "Fast checkout behavior responds well to time-boxed offers", expectedConversionLift: "+11%", confidence: 72, effort: "low", priority: 1 },
    { title: "Cross-sell low-cost add-ons at checkout", type: "cross_sell", why: "Low deliberation and low price point make impulse add-ons highly effective", expectedConversionLift: "+13%", confidence: 75, effort: "low", priority: 2 },
    { title: "Post-purchase upsell carousel", type: "upsell", why: "Capture continued momentum immediately after conversion", expectedConversionLift: "+8%", confidence: 60, effort: "medium", priority: 3 },
  ],
  Comparer: [
    { title: "Surface comparison table with testimonials", type: "testimonials", why: "Shopper is actively weighing alternatives; social proof accelerates decisions", expectedConversionLift: "+15%", confidence: 79, effort: "medium", priority: 1 },
    { title: "Show 'why customers choose this' bundle", type: "bundle", why: "Bundling reduces the need to compare across separate SKUs", expectedConversionLift: "+9%", confidence: 62, effort: "medium", priority: 2 },
    { title: "Recently viewed products carousel", type: "recently_viewed", why: "Keeps compared items accessible to reduce decision friction", expectedConversionLift: "+5%", confidence: 55, effort: "low", priority: 3 },
  ],
  Researcher: [
    { title: "Deep-dive testimonials and expert reviews", type: "testimonials", why: "Extended review-reading indicates trust-building is the blocker, not price", expectedConversionLift: "+12%", confidence: 77, effort: "medium", priority: 1 },
    { title: "Offer live chat proactively", type: "sms_reminder", why: "Research-heavy sessions convert well with a direct expert touchpoint", expectedConversionLift: "+8%", confidence: 63, effort: "high", priority: 2 },
    { title: "Email a detailed spec-comparison guide", type: "email_reminder", why: "Gives the researcher material to finish their evaluation offline", expectedConversionLift: "+7%", confidence: 60, effort: "medium", priority: 3 },
  ],
  "Returning Visitor": [
    { title: "Wishlist / saved-item reminder", type: "wishlist_reminder", why: "Repeated visits to the same product without conversion signal a nudge is needed", expectedConversionLift: "+10%", confidence: 71, effort: "low", priority: 1 },
    { title: "Show limited inventory message", type: "inventory_message", why: "Scarcity can convert sustained interest that hasn't yet become urgency", expectedConversionLift: "+9%", confidence: 66, effort: "low", priority: 2 },
    { title: "Personal coupon for return visit", type: "personal_coupon", why: "Rewards continued interest and removes the final barrier", expectedConversionLift: "+13%", confidence: 74, effort: "medium", priority: 3 },
  ],
  "Loyal Customer": [
    { title: "Award reward points multiplier", type: "reward_points", why: "Reinforces the retention loop for a customer with proven purchase history", expectedConversionLift: "+6% repeat rate", confidence: 80, effort: "low", priority: 1 },
    { title: "Cross-sell complementary consumables", type: "cross_sell", why: "Established trust makes this the ideal moment for basket expansion", expectedConversionLift: "+11%", confidence: 73, effort: "low", priority: 2 },
    { title: "Early access to new arrivals", type: "recommendation_carousel", why: "Loyal customers respond to exclusivity and being treated as insiders", expectedConversionLift: "+8%", confidence: 65, effort: "medium", priority: 3 },
  ],
  "High Intent Buyer": [
    { title: "Remove checkout friction with free shipping nudge", type: "free_shipping", why: "Shopper is already at checkout — minimize any reason to hesitate", expectedConversionLift: "+9%", confidence: 78, effort: "low", priority: 1 },
    { title: "Show urgency/stock message", type: "urgency_timer", why: "Reinforces the decision already in motion", expectedConversionLift: "+7%", confidence: 68, effort: "low", priority: 2 },
    { title: "One-click upsell before payment", type: "upsell", why: "High momentum session is the best moment to increase order value", expectedConversionLift: "+10%", confidence: 70, effort: "medium", priority: 3 },
  ],
  "Window Shopper": [
    { title: "Recently viewed retargeting carousel", type: "recently_viewed", why: "No purchase intent yet, but engagement warrants a soft retention touch", expectedConversionLift: "+5%", confidence: 52, effort: "low", priority: 1 },
    { title: "Email signup incentive", type: "email_reminder", why: "Capture contact info while interest is warm for future nurture", expectedConversionLift: "+4%", confidence: 48, effort: "low", priority: 2 },
    { title: "Wishlist reminder in 48 hours", type: "wishlist_reminder", why: "Gentle nudge without discounting margin prematurely", expectedConversionLift: "+6%", confidence: 55, effort: "low", priority: 3 },
  ],
  "Repeat Buyer": [
    { title: "One-click reorder shortcut", type: "recommendation_carousel", why: "Consumable repurchase pattern benefits from minimal friction", expectedConversionLift: "+12%", confidence: 76, effort: "medium", priority: 1 },
    { title: "Subscribe & save offer", type: "personal_coupon", why: "Predictable repurchase cadence is ideal for subscription conversion", expectedConversionLift: "+15% LTV", confidence: 72, effort: "medium", priority: 2 },
    { title: "Reward points for repeat purchase", type: "reward_points", why: "Reinforces the habitual buying pattern already established", expectedConversionLift: "+5%", confidence: 60, effort: "low", priority: 3 },
  ],
  "VIP Customer": [
    { title: "Assign a personal concierge / priority support", type: "sms_reminder", why: "High order value warrants white-glove treatment to protect LTV", expectedConversionLift: "+9% retention", confidence: 75, effort: "high", priority: 1 },
    { title: "Early access to premium drops", type: "recommendation_carousel", why: "VIP spend pattern responds to exclusivity, not discounts", expectedConversionLift: "+7%", confidence: 68, effort: "medium", priority: 2 },
    { title: "Surprise loyalty reward", type: "reward_points", why: "Unexpected recognition drives outsized advocacy from top spenders", expectedConversionLift: "+6% referral", confidence: 62, effort: "low", priority: 3 },
  ],
  "Gift Shopper": [
    { title: "Promote gift wrap and gift messaging", type: "bundle", why: "Explicit gift-options browsing signals a non-self-purchase occasion", expectedConversionLift: "+11%", confidence: 74, effort: "low", priority: 1 },
    { title: "Show curated gift bundle", type: "bundle", why: "Reduces decision effort for someone shopping for another person", expectedConversionLift: "+9%", confidence: 66, effort: "medium", priority: 2 },
    { title: "Gift receipt + easy returns messaging", type: "testimonials", why: "Reduces risk perception around choosing the 'wrong' gift", expectedConversionLift: "+5%", confidence: 58, effort: "low", priority: 3 },
  ],
  Explorer: [
    { title: "Personalized category recommendation carousel", type: "recommendation_carousel", why: "Broad browsing across products benefits from AI-curated narrowing", expectedConversionLift: "+8%", confidence: 61, effort: "medium", priority: 1 },
    { title: "Highlight bestsellers in browsed categories", type: "cross_sell", why: "Surfaces proven winners to cut through exploration paralysis", expectedConversionLift: "+6%", confidence: 57, effort: "low", priority: 2 },
    { title: "Email digest of viewed categories", type: "email_reminder", why: "Keeps exploration warm for a future session", expectedConversionLift: "+4%", confidence: 50, effort: "low", priority: 3 },
  ],
  Browser: [
    { title: "Lightweight recently viewed nudge", type: "recently_viewed", why: "Minimal engagement warrants a low-pressure retention touch only", expectedConversionLift: "+3%", confidence: 45, effort: "low", priority: 1 },
    { title: "Newsletter signup soft prompt", type: "email_reminder", why: "Low intent session — focus on future re-engagement, not conversion pressure", expectedConversionLift: "+3%", confidence: 42, effort: "low", priority: 2 },
    { title: "Trending products carousel", type: "recommendation_carousel", why: "Passive browsing can be redirected with popular, low-risk picks", expectedConversionLift: "+4%", confidence: 46, effort: "low", priority: 3 },
  ],
  "Uncertain Buyer": [
    { title: "Simple, low-commitment recommendation", type: "recommendation_carousel", why: "Insufficient signal — avoid aggressive tactics that could cause churn", expectedConversionLift: "+3%", confidence: 40, effort: "low", priority: 1 },
    { title: "Soft email capture", type: "email_reminder", why: "Preserve the option to re-engage without pressuring an undecided visitor", expectedConversionLift: "+3%", confidence: 38, effort: "low", priority: 2 },
    { title: "Show trust badges and guarantees", type: "testimonials", why: "Reduces baseline uncertainty for a first-time or ambiguous visitor", expectedConversionLift: "+4%", confidence: 44, effort: "low", priority: 3 },
  ],
};

function buildTimeline(events: SessionEvent[]): TimelineEvidencePoint[] {
  const highSignalEvents = new Set([
    "add_to_cart",
    "begin_checkout",
    "abandon_checkout",
    "purchase",
    "apply_coupon_attempt",
    "compare_products",
    "read_reviews",
    "view_gift_options",
    "return_visit",
  ]);
  return events.map((e, i) => {
    const label = EVENT_LABELS[e.event] ?? e.event;
    const weight: TimelineEvidencePoint["weight"] = highSignalEvents.has(e.event)
      ? "signal"
      : e.event === "exit" || e.event === "scroll_deep"
        ? "noise"
        : "supporting";
    return { eventIndex: i, label, weight, note: e.product ?? e.category };
  });
}

function estimateUrgency(state: ShopperState, events: SessionEvent[]): Urgency {
  if (state === "Cart Abandoner") return has(events, "abandon_checkout") ? "critical" : "high";
  if (state === "High Intent Buyer") return "high";
  if (state === "VIP Customer" || state === "Loyal Customer") return "medium";
  if (state === "Discount Seeker" || state === "Returning Visitor") return "medium";
  if (state === "Browser" || state === "Uncertain Buyer") return "low";
  return "medium";
}

function estimateRisk(state: ShopperState): RiskLevel {
  if (["Cart Abandoner", "Returning Visitor", "Discount Seeker"].includes(state)) return "high";
  if (["Window Shopper", "Uncertain Buyer", "Explorer", "Browser"].includes(state)) return "medium";
  return "low";
}

function estimateRevenue(events: SessionEvent[], confidence: number): number {
  const cartValue = events.filter((e) => e.price).reduce((s, e) => s + (e.price ?? 0), 0);
  const base = cartValue > 0 ? cartValue : 65;
  return Math.round(base * (confidence / 100) * 2.4);
}

export function runMockAnalysis(events: SessionEvent[], sessionId: string): SessionAnalysis {
  const signals = computeSignals(events);
  const primary = signals[0]!;
  const alts = signals.slice(1, 3);

  const alternatives: AlternativeClassification[] = alts.map((s) => ({
    state: s.state,
    confidence: Math.round(s.score * 0.85),
    reasonRejected: `Weaker evidence than ${primary.state.toLowerCase()}: ${s.reasons[0]?.toLowerCase() ?? "insufficient supporting signals"}`,
  }));

  while (alternatives.length < 2) {
    const filler = SHOPPER_STATE_FILLERS.find((s) => s !== primary.state && !alternatives.some((a) => a.state === s));
    if (!filler) break;
    alternatives.push({ state: filler, confidence: 22, reasonRejected: "Session lacks the distinguishing behaviors for this state" });
  }

  const confidence = Math.round(Math.min(primary.score, 96));
  const recLibrary = RECOMMENDATION_LIBRARY[primary.state] ?? RECOMMENDATION_LIBRARY.Browser;
  const recommendations: PersonalizationRecommendation[] = recLibrary.map((r, i) => ({ ...r, id: `${primary.state.toLowerCase().replace(/\s+/g, "-")}-rec-${i + 1}` }));

  const evidence = primary.reasons.slice(0, 5);
  const productNames = [...new Set(events.filter((e) => e.product).map((e) => e.product))];

  const analysis: SessionAnalysis = {
    id: crypto.randomUUID(),
    sessionId,
    createdAt: new Date().toISOString(),
    shopperState: primary.state,
    confidence,
    evidenceStrength: Math.round(Math.min(confidence + 6, 98)),
    modelConfidence: Math.round(Math.max(confidence - 4, 30)),
    evidence,
    aiExplanation: `This session shows a clear ${primary.state.toLowerCase()} pattern${productNames[0] ? ` around ${productNames[0]}` : ""}. ${primary.reasons[0]}. The sequence and timing of events — not just their presence — is what drives this classification.`,
    recommendedAction: recommendations[0]?.title ?? "Monitor session for further signal",
    expectedBusinessImpact: `Acting on this in the next session window could recover meaningful revenue at a ${confidence}% confidence level. ${estimateRisk(primary.state) === "high" ? "Without intervention, this shopper has a high probability of churning to a competitor." : "This shopper is receptive to guided personalization."}`,
    expectedLift: recommendations[0]?.expectedConversionLift ?? "+5%",
    estimatedRevenueImpact: estimateRevenue(events, confidence),
    urgency: estimateUrgency(primary.state, events),
    riskLevel: estimateRisk(primary.state),
    alternatives,
    recommendations,
    reasoning: {
      observedBehaviors: events.map((e) => `${EVENT_LABELS[e.event] ?? e.event}${e.product ? ` — ${e.product}` : ""}`),
      importantSignals: primary.reasons,
      ignoredSignals: events
        .filter((e) => ["exit", "scroll_deep"].includes(e.event))
        .map((e) => `${EVENT_LABELS[e.event] ?? e.event} — low signal on its own, treated as session boundary noise`),
      reasoning: `Starting from ${events.length} events, the sequence was evaluated for intent signals rather than raw counts. ${primary.reasons.join(". ")}. Competing hypotheses (${alts.map((a) => a.state).join(", ") || "none strong"}) were scored lower because they lacked comparable direct evidence. The dominant pattern — ${primary.state.toLowerCase()} — best explains the full sequence, not just isolated events.`,
      finalDecision: `Classified as ${primary.state} with ${confidence}% confidence.`,
      businessStrategy: `The recommended play is to ${(recommendations[0]?.title ?? "engage the shopper").toLowerCase()}, since it directly addresses the blocking factor implied by this behavior pattern. Prioritize ${estimateUrgency(primary.state, events)} urgency actions given the ${estimateRisk(primary.state)} churn risk.`,
      whyNotOthers: alts.length
        ? `${alts.map((a) => a.state).join(" and ")} ${alts.length > 1 ? "were" : "was"} considered but rejected due to weaker or absent direct evidence compared to the signals supporting ${primary.state}.`
        : `No competing classification had comparable evidence strength.`,
    },
    timelineEvidence: buildTimeline(events),
    source: "mock",
    sourceEvents: events,
  };

  return analysis;
}

const SHOPPER_STATE_FILLERS: ShopperState[] = ["Browser", "Uncertain Buyer", "Explorer", "Window Shopper"];
