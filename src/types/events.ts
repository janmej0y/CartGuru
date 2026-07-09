export type EventType =
  | "view_product"
  | "view_category"
  | "search"
  | "compare_products"
  | "sort_price_low"
  | "sort_price_high"
  | "filter_apply"
  | "scroll_deep"
  | "read_reviews"
  | "view_shipping_info"
  | "apply_coupon_attempt"
  | "add_to_cart"
  | "remove_from_cart"
  | "add_to_wishlist"
  | "view_cart"
  | "begin_checkout"
  | "abandon_checkout"
  | "purchase"
  | "exit"
  | "return_visit"
  | "view_size_guide"
  | "zoom_image"
  | "watch_video"
  | "click_recommendation"
  | "email_signup"
  | "chat_support"
  | "price_drop_view"
  | "view_gift_options";

export interface SessionEvent {
  event: EventType | string;
  product?: string;
  category?: string;
  price?: number;
  timestamp?: string;
  meta?: Record<string, string | number | boolean>;
}

export interface RawSessionInput {
  sessionId?: string;
  userId?: string;
  events: SessionEvent[];
}

export const EVENT_LABELS: Record<string, string> = {
  view_product: "Viewed product",
  view_category: "Browsed category",
  search: "Searched",
  compare_products: "Compared products",
  sort_price_low: "Sorted by price (low to high)",
  sort_price_high: "Sorted by price (high to low)",
  filter_apply: "Applied filter",
  scroll_deep: "Scrolled deep into page",
  read_reviews: "Read reviews",
  view_shipping_info: "Checked shipping info",
  apply_coupon_attempt: "Tried applying coupon",
  add_to_cart: "Added to cart",
  remove_from_cart: "Removed from cart",
  add_to_wishlist: "Added to wishlist",
  view_cart: "Viewed cart",
  begin_checkout: "Began checkout",
  abandon_checkout: "Abandoned checkout",
  purchase: "Purchased",
  exit: "Exited session",
  return_visit: "Returned to site",
  view_size_guide: "Viewed size guide",
  zoom_image: "Zoomed product image",
  watch_video: "Watched product video",
  click_recommendation: "Clicked recommendation",
  email_signup: "Signed up for email",
  chat_support: "Contacted support",
  price_drop_view: "Viewed price drop alert",
  view_gift_options: "Viewed gift options",
};
