export type UserRole = 'VISITOR' | 'REPORTER' | 'EXPORTER' | 'ADMIN';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_PAYMENT' | 'SUSPENDED';
export type RfqStatus = 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
export type QuoteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type ListingType = 'LOCAL_SUPPLIER' | 'DISTRESSED_CARGO';

export interface Profile {
  id: string;
  user_role: UserRole;
  full_name: string | null;
  company_name: string | null;
  country_code: string | null;
  business_phone: string | null;
  whatsapp_number: string | null;
  is_verified: boolean;
  profile_browsing: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  subscription_code: string;
  tier_code?: string;
  name_en: string;
  name_ar: string | null;
  annual_price_usd: number | null;
  annual_price_usd_discounted?: number | null;
  annual_price_egp?: number | null;
  max_products: number | null;
  max_storage_mb?: number | null;
  max_images?: number | null;
  video_allowed: boolean;
  max_video_duration_minutes: number | null;
  monthly_frequency_days?: number | null;
  dynamic_refresh_allowed?: boolean;
  refresh_frequency_days?: number | null;
}

export interface Subscription {
  id: string;
  company_id: string;
  subscription_code: string;
  subscription_status: SubscriptionStatus;
  billing_cycle_start: string | null;
  billing_cycle_end: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  amount: number | null;
  currency: string;
  tax: string | null;
  billing_document_url: string | null;
  subscribed_by: string | null;
  approved_at: string | null;
  payment_notes: string | null;
}

export interface Category {
  id: number;
  parent_id: number | null;
  code: string | null;
  name_en: string;
  name_ar: string | null;
  hs_code: string | null;
  display_order: number;
}

export interface Company {
  id: string;
  user_id: string;
  company_name_en: string;
  company_name_ar: string | null;
  slug: string;
  cr_number: string | null;
  tax_id: string | null;
  governorate: string | null;
  factory_address_ar: string | null;
  factory_address_en: string | null;
  company_phone: string | null;
  website: string | null;
  company_email: string | null;
  cr_document_url: string | null;
  verification_status: VerificationStatus;
  verified_at: string | null;
  verified_by: string | null;
  logo_url: string | null;
  cover_banner_url: string | null;
  about_ar: string | null;
  about_en: string | null;
  quality_iso: string | null;
  annual_capacity_ml: number | null;
  export_port_history: string | null;
  youtube_video_id: string | null;
  featured_gallery_url: string | null;
  sorting_machinery: string | null;
  cold_storage_capacity_ml: number | null;
  featured_gallery_url_2: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  category_id: number | null;
  title_ar: string | null;
  title_en: string | null;
  slug: string | null;
  body_ar: string | null;
  body_en: string | null;
  hs_code: string | null;
  packaging_type: string | null;
  harvest_season_from: string | null;
  harvest_season_to: string | null;
  price: number | null;
  minimum_order_quantity: number | null;
  is_published: boolean;
  published_at: string | null;
  images?: string[];
  company?: Company;
  category?: Category;
}

export interface CompanyCertificate {
  id: string;
  company_id: string;
  certificate_name: string | null;
  certificate_number: string | null;
  valid_from: string | null;
  valid_to: string | null;
  document_url: string | null;
  verification_status: VerificationStatus;
  issued_by: string | null;
}

export interface Rfq {
  id: string;
  requester_id: string;
  category_id: number | null;
  required_quantity: number;
  quantity_unit: string | null;
  destination_country_code: string | null;
  destination_port: string | null;
  incoterm: string | null;
  delivery_deadline: string | null;
  quote_deadline: string | null;
  technical_specifications: string | null;
  packaging_requirements: string | null;
  payment_terms: string | null;
  rfq_status: RfqStatus;
  created_at: string;
  category?: Category;
  requester?: Profile;
}

export interface Quote {
  id: string;
  rfq_id: string;
  company_id: string;
  unit_price: number | null;
  currency: string;
  port_of_loading: string | null;
  lead_time_days: number | null;
  valid_until: string | null;
  commercial_terms: string | null;
  packaging_details: string | null;
  delivery_terms: string | null;
  status: QuoteStatus;
  submitted_at: string;
  updated_at: string;
  company?: Company;
}

export interface MarketListing {
  listing_id: string;
  listing_type: ListingType;
  company_id: string;
  category_id: number | null;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  quantity: number | null;
  quantity_unit: string | null;
  location: string | null;
  description_country_code: string | null;
  bill_of_lading_number: string | null;
  quality_grade: string | null;
  seller_contact_phone: string | null;
  seller_contact_email: string | null;
  image_url: string | null;
  document_url: string | null;
  inspection_company: string | null;
  approval_at: string | null;
  is_active: boolean;
  created_at: string;
  company?: Company;
  category?: Category;
}

export interface ContentItem {
  id: string;
  content_type: string;
  author_id: string | null;
  title_ar: string | null;
  title_en: string | null;
  slug: string | null;
  body_ar: string | null;
  body_en: string | null;
  category: string | null;
  featured_image_url: string | null;
  youtube_video_id: string | null;
  external_url: string | null;
  is_published: boolean;
  published_at: string | null;
}

export interface ActivityLog {
  id: string;
  activity_event_type: string;
  actor_id: string | null;
  target_entity: string | null;
  target_id: string | null;
  metadata: Record<string, any> | null;
  ip_hash: string | null;
  created_at: string;
}
