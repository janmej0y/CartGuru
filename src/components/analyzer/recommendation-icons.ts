import {
  Tag,
  Truck,
  MessageSquare,
  Package,
  History,
  TrendingUp,
  Timer,
  AlertTriangle,
  ArrowDownRight,
  Heart,
  Mail,
  Smartphone,
  Award,
  Ticket,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { PersonalizationRecommendation } from "@/types/shopper";

export const RECOMMENDATION_ICONS: Record<PersonalizationRecommendation["type"], LucideIcon> = {
  discount_popup: Tag,
  free_shipping: Truck,
  testimonials: MessageSquare,
  bundle: Package,
  recently_viewed: History,
  cross_sell: TrendingUp,
  upsell: TrendingUp,
  urgency_timer: Timer,
  inventory_message: AlertTriangle,
  price_drop_alert: ArrowDownRight,
  wishlist_reminder: Heart,
  email_reminder: Mail,
  sms_reminder: Smartphone,
  reward_points: Award,
  personal_coupon: Ticket,
  recommendation_carousel: LayoutGrid,
};

export function getRecommendationIcon(type: PersonalizationRecommendation["type"]): LucideIcon {
  return RECOMMENDATION_ICONS[type] ?? Package;
}

export const RECOMMENDATION_TYPE_LABELS: Record<PersonalizationRecommendation["type"], string> = {
  discount_popup: "Discount popup",
  free_shipping: "Free shipping",
  testimonials: "Testimonials",
  bundle: "Bundle offer",
  recently_viewed: "Recently viewed",
  cross_sell: "Cross-sell",
  upsell: "Upsell",
  urgency_timer: "Urgency timer",
  inventory_message: "Inventory message",
  price_drop_alert: "Price drop alert",
  wishlist_reminder: "Wishlist reminder",
  email_reminder: "Email reminder",
  sms_reminder: "SMS reminder",
  reward_points: "Reward points",
  personal_coupon: "Personal coupon",
  recommendation_carousel: "Recommendation carousel",
};
