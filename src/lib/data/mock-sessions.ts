import type { SessionEvent } from "@/types/events";
import type { MockSession } from "@/types/shopper";

function ts(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

const RAW: { label: string; persona: string; events: SessionEvent[] }[] = [
  {
    label: "Nike Air Max shopper",
    persona: "Cart Abandoner",
    events: [
      { event: "view_product", product: "Nike Air Max 270", category: "Sneakers", price: 150, timestamp: ts(42) },
      { event: "compare_products", product: "Nike Air Max 270 vs Adidas Ultraboost", timestamp: ts(39) },
      { event: "read_reviews", product: "Nike Air Max 270", timestamp: ts(36) },
      { event: "sort_price_low", timestamp: ts(33) },
      { event: "add_to_cart", product: "Nike Air Max 270", price: 150, timestamp: ts(30) },
      { event: "view_shipping_info", timestamp: ts(27) },
      { event: "begin_checkout", timestamp: ts(24) },
      { event: "abandon_checkout", timestamp: ts(20) },
      { event: "exit", timestamp: ts(19) },
    ],
  },
  {
    label: "Weekend browser, no intent",
    persona: "Window Shopper",
    events: [
      { event: "view_category", category: "Home Decor", timestamp: ts(80) },
      { event: "view_product", product: "Ceramic Vase Set", price: 42, timestamp: ts(77) },
      { event: "scroll_deep", timestamp: ts(75) },
      { event: "view_product", product: "Woven Throw Blanket", price: 38, timestamp: ts(70) },
      { event: "exit", timestamp: ts(65) },
    ],
  },
  {
    label: "Coupon hunter",
    persona: "Discount Seeker",
    events: [
      { event: "search", meta: { query: "wireless headphones deal" }, timestamp: ts(50) },
      { event: "view_product", product: "Sony WH-1000XM5", price: 349, timestamp: ts(47) },
      { event: "apply_coupon_attempt", meta: { code: "SAVE10" }, timestamp: ts(44) },
      { event: "apply_coupon_attempt", meta: { code: "WELCOME15" }, timestamp: ts(42) },
      { event: "sort_price_low", timestamp: ts(40) },
      { event: "compare_products", timestamp: ts(37) },
      { event: "add_to_wishlist", product: "Sony WH-1000XM5", timestamp: ts(34) },
      { event: "exit", timestamp: ts(30) },
    ],
  },
  {
    label: "3am impulse buy",
    persona: "Impulse Buyer",
    events: [
      { event: "view_product", product: "LED Galaxy Projector", price: 29, timestamp: ts(12) },
      { event: "zoom_image", timestamp: ts(11) },
      { event: "add_to_cart", product: "LED Galaxy Projector", price: 29, timestamp: ts(10) },
      { event: "begin_checkout", timestamp: ts(9) },
      { event: "purchase", price: 29, timestamp: ts(8) },
    ],
  },
  {
    label: "Deep researcher, laptop purchase",
    persona: "Researcher",
    events: [
      { event: "search", meta: { query: "best laptop for video editing 2026" }, timestamp: ts(140) },
      { event: "view_product", product: "MacBook Pro 14 M4", price: 1999, timestamp: ts(136) },
      { event: "read_reviews", timestamp: ts(130) },
      { event: "watch_video", product: "MacBook Pro 14 M4", timestamp: ts(126) },
      { event: "compare_products", product: "MacBook Pro vs XPS 15", timestamp: ts(120) },
      { event: "view_product", product: "Dell XPS 15", price: 1799, timestamp: ts(115) },
      { event: "read_reviews", timestamp: ts(110) },
      { event: "compare_products", timestamp: ts(104) },
      { event: "chat_support", meta: { topic: "warranty" }, timestamp: ts(98) },
      { event: "exit", timestamp: ts(90) },
    ],
  },
  {
    label: "Fourth purchase this quarter",
    persona: "Loyal Customer",
    events: [
      { event: "return_visit", timestamp: ts(15) },
      { event: "view_product", product: "Refill Pods - Lavender", price: 18, timestamp: ts(13) },
      { event: "add_to_cart", product: "Refill Pods - Lavender", price: 18, timestamp: ts(12) },
      { event: "click_recommendation", product: "Diffuser Cleaning Kit", timestamp: ts(11) },
      { event: "add_to_cart", product: "Diffuser Cleaning Kit", price: 12, timestamp: ts(10) },
      { event: "begin_checkout", timestamp: ts(8) },
      { event: "purchase", price: 30, timestamp: ts(7) },
    ],
  },
  {
    label: "High-value repeat VIP",
    persona: "VIP Customer",
    events: [
      { event: "return_visit", timestamp: ts(20) },
      { event: "view_product", product: "Leather Weekender Bag", price: 420, timestamp: ts(18) },
      { event: "view_gift_options", timestamp: ts(16) },
      { event: "add_to_cart", product: "Leather Weekender Bag", price: 420, timestamp: ts(14) },
      { event: "view_shipping_info", timestamp: ts(12) },
      { event: "begin_checkout", timestamp: ts(10) },
      { event: "purchase", price: 420, timestamp: ts(9) },
    ],
  },
  {
    label: "Gift for a friend's wedding",
    persona: "Gift Shopper",
    events: [
      { event: "search", meta: { query: "wedding gift under 100" }, timestamp: ts(60) },
      { event: "view_category", category: "Home & Kitchen", timestamp: ts(57) },
      { event: "view_gift_options", timestamp: ts(54) },
      { event: "view_product", product: "Stand Mixer", price: 89, timestamp: ts(50) },
      { event: "add_to_wishlist", product: "Stand Mixer", timestamp: ts(47) },
      { event: "view_gift_options", timestamp: ts(44) },
      { event: "add_to_cart", product: "Stand Mixer", price: 89, timestamp: ts(41) },
      { event: "exit", timestamp: ts(38) },
    ],
  },
  {
    label: "Comparing three blenders",
    persona: "Comparer",
    events: [
      { event: "search", meta: { query: "best blender" }, timestamp: ts(45) },
      { event: "view_product", product: "Vitamix 5200", price: 449, timestamp: ts(42) },
      { event: "view_product", product: "Ninja Professional", price: 99, timestamp: ts(39) },
      { event: "view_product", product: "Blendtec Classic", price: 379, timestamp: ts(36) },
      { event: "compare_products", timestamp: ts(33) },
      { event: "read_reviews", product: "Ninja Professional", timestamp: ts(30) },
      { event: "sort_price_low", timestamp: ts(27) },
      { event: "exit", timestamp: ts(24) },
    ],
  },
  {
    label: "First-time site visit",
    persona: "Uncertain Buyer",
    events: [
      { event: "view_category", category: "Electronics", timestamp: ts(10) },
      { event: "view_product", product: "USB-C Hub", price: 34, timestamp: ts(8) },
      { event: "exit", timestamp: ts(6) },
    ],
  },
  {
    label: "Checkout in progress, price sensitive",
    persona: "High Intent Buyer",
    events: [
      { event: "view_product", product: "Instant Pot Duo", price: 99, timestamp: ts(25) },
      { event: "add_to_cart", product: "Instant Pot Duo", price: 99, timestamp: ts(22) },
      { event: "view_cart", timestamp: ts(20) },
      { event: "view_shipping_info", timestamp: ts(18) },
      { event: "begin_checkout", timestamp: ts(15) },
      { event: "view_size_guide", timestamp: ts(13) },
      { event: "begin_checkout", timestamp: ts(10) },
    ],
  },
  {
    label: "Third visit, same shoes",
    persona: "Returning Visitor",
    events: [
      { event: "return_visit", timestamp: ts(200) },
      { event: "view_product", product: "Allbirds Wool Runners", price: 110, timestamp: ts(198) },
      { event: "exit", timestamp: ts(195) },
      { event: "return_visit", timestamp: ts(20) },
      { event: "view_product", product: "Allbirds Wool Runners", price: 110, timestamp: ts(18) },
      { event: "read_reviews", timestamp: ts(15) },
      { event: "add_to_wishlist", product: "Allbirds Wool Runners", timestamp: ts(12) },
      { event: "exit", timestamp: ts(10) },
    ],
  },
  {
    label: "Restocking supplements",
    persona: "Repeat Buyer",
    events: [
      { event: "return_visit", timestamp: ts(14) },
      { event: "search", meta: { query: "protein powder vanilla" }, timestamp: ts(13) },
      { event: "view_product", product: "Whey Protein Vanilla 2lb", price: 44, timestamp: ts(12) },
      { event: "add_to_cart", product: "Whey Protein Vanilla 2lb", price: 44, timestamp: ts(10) },
      { event: "begin_checkout", timestamp: ts(8) },
      { event: "purchase", price: 44, timestamp: ts(7) },
    ],
  },
  {
    label: "Browsing new arrivals, no clicks",
    persona: "Browser",
    events: [
      { event: "view_category", category: "New Arrivals", timestamp: ts(9) },
      { event: "scroll_deep", timestamp: ts(7) },
      { event: "scroll_deep", timestamp: ts(5) },
      { event: "exit", timestamp: ts(3) },
    ],
  },
  {
    label: "Exploring outdoor gear category",
    persona: "Explorer",
    events: [
      { event: "view_category", category: "Outdoor & Camping", timestamp: ts(55) },
      { event: "view_product", product: "4-Person Tent", price: 220, timestamp: ts(51) },
      { event: "view_product", product: "Sleeping Bag -10C", price: 95, timestamp: ts(47) },
      { event: "view_product", product: "Camp Stove", price: 60, timestamp: ts(43) },
      { event: "filter_apply", meta: { filter: "waterproof" }, timestamp: ts(39) },
      { event: "view_product", product: "Rain Fly Tarp", price: 35, timestamp: ts(35) },
      { event: "exit", timestamp: ts(30) },
    ],
  },
  {
    label: "Cart sitting for a week",
    persona: "Cart Abandoner",
    events: [
      { event: "view_product", product: "Dyson V15 Vacuum", price: 749, timestamp: ts(60 * 24 * 7) },
      { event: "add_to_cart", product: "Dyson V15 Vacuum", price: 749, timestamp: ts(60 * 24 * 7 - 5) },
      { event: "view_cart", timestamp: ts(40) },
      { event: "price_drop_view", timestamp: ts(35) },
      { event: "exit", timestamp: ts(30) },
    ],
  },
  {
    label: "Testimonial-driven convert",
    persona: "High Intent Buyer",
    events: [
      { event: "view_product", product: "Foam Mattress Queen", price: 599, timestamp: ts(35) },
      { event: "read_reviews", timestamp: ts(32) },
      { event: "read_reviews", timestamp: ts(28) },
      { event: "watch_video", timestamp: ts(24) },
      { event: "add_to_cart", product: "Foam Mattress Queen", price: 599, timestamp: ts(20) },
      { event: "begin_checkout", timestamp: ts(16) },
      { event: "purchase", price: 599, timestamp: ts(14) },
    ],
  },
  {
    label: "Email subscriber, not buying yet",
    persona: "Uncertain Buyer",
    events: [
      { event: "view_product", product: "Espresso Machine", price: 320, timestamp: ts(48) },
      { event: "scroll_deep", timestamp: ts(45) },
      { event: "email_signup", timestamp: ts(42) },
      { event: "exit", timestamp: ts(40) },
    ],
  },
  {
    label: "Support chat before big purchase",
    persona: "Researcher",
    events: [
      { event: "view_product", product: "Electric Standing Desk", price: 480, timestamp: ts(70) },
      { event: "view_size_guide", timestamp: ts(66) },
      { event: "chat_support", meta: { topic: "assembly time" }, timestamp: ts(62) },
      { event: "read_reviews", timestamp: ts(58) },
      { event: "compare_products", timestamp: ts(54) },
      { event: "add_to_cart", product: "Electric Standing Desk", price: 480, timestamp: ts(50) },
      { event: "exit", timestamp: ts(46) },
    ],
  },
  {
    label: "Flash sale scroller",
    persona: "Discount Seeker",
    events: [
      { event: "view_category", category: "Flash Sale", timestamp: ts(6) },
      { event: "sort_price_low", timestamp: ts(5) },
      { event: "view_product", product: "Clearance Hoodie", price: 15, timestamp: ts(4) },
      { event: "apply_coupon_attempt", meta: { code: "FLASH20" }, timestamp: ts(3) },
      { event: "add_to_cart", product: "Clearance Hoodie", price: 15, timestamp: ts(2) },
      { event: "purchase", price: 15, timestamp: ts(1) },
    ],
  },
];

export const MOCK_SESSIONS: MockSession[] = RAW.map((r, i) => ({
  id: `mock-session-${i + 1}`,
  label: r.label,
  persona: r.persona,
  events: r.events,
  createdAt: r.events[0]?.timestamp ?? new Date().toISOString(),
}));

export function getMockSessionById(id: string) {
  return MOCK_SESSIONS.find((s) => s.id === id);
}

export function randomMockSession() {
  return MOCK_SESSIONS[Math.floor(Math.random() * MOCK_SESSIONS.length)];
}

export const SAMPLE_EVENT_JSON = JSON.stringify(
  MOCK_SESSIONS[0]!.events.map((e) => {
    const rest = { ...e };
    delete rest.timestamp;
    return rest;
  }),
  null,
  2
);
