# Market 365 (OpenMarket365)
## Unified Software Requirements Specification (SRS) & System Architecture
**Version:** 4.0 (Autonomous Single-Owner Modules & Zero-Cost Serverless Specification)  
**Date:** September 2026  
**Status:** Approved for Implementation & $0 Infrastructure Baseline  
**Architecture Paradigm:** 4 Fully Decoupled Autonomous Modules • Exactly 1 Sole Owner per Module • 100% Free Cloud Tiers ($0.00 / 0 EGP)

---

## Executive Summary & Single-Owner Module Architecture

### 1. The Zero-Cost Serverless Breakthrough on Vercel
The platform operates on a **$0.00 / month (0 EGP)** serverless model using permanent cloud free tiers:
* **Vercel (Hobby Tier):** Next.js 14+ SSR, Server Actions, automated SSL, global Edge CDN.
* **Supabase (Free Tier):** Managed PostgreSQL 16+ (500 MB relational storage, native Arabic/English FTS, `pgvector`, Row-Level Security).
* **YouTube Video API:** Zero-cost, unlimited 4K/1080p video streaming for factory commercials and TV episodes.
* **Cloudflare R2 / Supabase Storage:** 10 GB free S3-compatible storage with **$0 egress fees** for photos and PDF certificates.
* **Upstash QStash & Redis:** 10,000 free async messages/day for non-blocking RFQ lead routing.
* **Vercel Cron Jobs:** Automated daily certificate expiry checks and classifieds cleanup.
* **Resend / Brevo:** 3,000–9,000 free transactional emails/month.

```
+-----------------------------------------------------------------------------------+
|                     VERCEL GLOBAL EDGE NETWORK (100% FREE TIER)                   |
|      Free Global CDN • Edge Caching • Auto SSL (HTTPS) • DDoS Protection          |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        FULL-STACK APPLICATION (VERCEL HOBBY)                      |
| Next.js 14+ (App Router) • React 18+ • TypeScript • Tailwind CSS • shadcn/ui      |
| • Server-Side Rendering (SSR) for Maximum Google SEO                              |
| • Server Actions & Route Handlers (Zero-Cost Serverless Compute)                  |
| • Native Arabic (RTL) & English (LTR) with CSS Logical Properties                 |
| • Progressive Web App (PWA) - Native Mobile Experience without App Store Fees     |
+-------------------+---------------------+---------------------+-------------------+
                    |                     |                     |
                    v                     v                     v
+-----------------------------+  +------------------+  +----------------------------+
|      DATABASE ENGINE        |  |  MEDIA STORAGE   |  |     VIDEO STREAMING        |
|  Supabase / Neon (Free)     |  | Cloudflare R2 /  |  |  YouTube Video API (Free)  |
| • Managed PostgreSQL 16+    |  | Supabase Storage |  | • Unlimited 4K/1080p Stream|
| • Built-in FTS (Arabic/EN)  |  | • 10 GB Free     |  | • Zero Transcoding CPU     |
| • JSONB Specifications      |  | • $0 Egress Fees |  | • Zero Bandwidth Costs     |
| • pgvector AI Matching      |  | • Company Scans  |  | • Direct TV Episode &      |
| • Row Level Security (RLS)  |  | • PDF Certs      |  |   Exporter Showroom Embeds |
+-----------------------------+  +------------------+  +----------------------------+
                    ^                     ^
                    |                     |
+-------------------+---------------------+---------------------+
|                     SERVERLESS BACKGROUND WORKERS                     |
| • Vercel Cron Jobs (Scheduled daily tasks & cert expiry checks)       |
| • Upstash QStash & Redis (10,000 free async messages/day for RFQs)    |
| • Resend / Brevo (3,000–9,000 free transactional emails/month)        |
+-----------------------------------------------------------------------+
```

---

### 2. The 4 Autonomous Modules (1 Module = 1 Sole Owner)

To ensure zero dependencies between team members and total accountability, all interdependent sub-features are unified so that **each module is owned end-to-end (Frontend, Backend, Database, and Services) by exactly ONE person**:

```
+-----------------------------------------------------------------------------------+
|                     THE 4 INDEPENDENT SQUAD MODULES                               |
+-----------------------------------------------------------------------------------+
| MODULE 1: Identity, Auth & Subscription Engine      ──► SOLE OWNER: Seif Kassab   |
| (Auth, JWT, RBAC, 4 Subscription Tiers, Quotas)                                   |
+-----------------------------------------------------------------------------------+
| MODULE 2: Exporter Digital Showrooms & Catalog      ──► SOLE OWNER: Karim Ayman   |
| (4-Level Taxonomy, Product CRUD, Certs Vault, PWA)                                |
+-----------------------------------------------------------------------------------+
| MODULE 3: Procurement RFQ Engine & Trade Boards     ──► SOLE OWNER: GamalEldin    |
| (RFQ Wizard, Sealed Quotes, Contact Unlock, Boards)                               |
+-----------------------------------------------------------------------------------+
| MODULE 4: Cloud Pipeline, Admin & Governance        ──► SOLE OWNER: Seif Amr      |
| (R2 Uploads, QStash Queue, Admin Console, Playwright)                             |
+-----------------------------------------------------------------------------------+
```

---

## 1. Project Overview & Business Objectives

### 1.1 Mission & Vision
**Market 365** is Egypt's national B2B digital export gateway and open trade showroom. Its primary mission is to eliminate traditional brokerage friction and opaque intermediary markups by directly connecting Egyptian agricultural aggregators, industrial factories, and commercial producers with verified wholesale buyers, import managers, and procurement officers worldwide.

### 1.2 The Core Operational Pillars
1. **Direct Supplier Discovery (Zero Transaction Commission):** The platform provides unmasked direct contact coordinates (phone, WhatsApp, executive email, factory location) to registered importers. The platform facilitates direct trade introductions and never levies commissions on closed deals.
2. **Transparent Compliance & Capabilities Showcase:** Egyptian exporters receive a high-trust digital showroom highlighting verified facility capacity, automated sorting lines (e.g., Sortex), cold storage specs, and accredited international certifications (ISO 22000, GlobalG.A.P., BRC, Halal, FDA, Organic).
3. **Structured Procurement Matchmaking (RFQ Engine):** Global importers post structured Requests for Quotation (RFQs) specifying commodities, Incoterms, destination ports, and required certifications. The platform automatically matches and alerts qualified Egyptian exporters to submit direct commercial quotes.
4. **Predictable Monetization Model:** Exporters subscribe to tiered annual memberships (**Standard, Plus, Premium, Elite**) unlocking showcase media depth (photo allowances, video presentation depth, and monthly dynamic updates). Additional revenue streams include homepage video advertising slots, promotional tickers, and a domestic surplus board.
5. **Synergy with TV Programme & Media Pipeline:** The platform is tightly coupled with the national TV programme *"Yes We Can"* (*"نعم نستطيع"*) and its dedicated YouTube channel. Field footage shot at exporter factories doubles as the promotional video commercial hosted on the platform via YouTube embeds.
6. **Strict Domain Boundary (Outside ERP / Escrow Scope):** The platform is strictly an open B2B discovery and matchmaking gateway. It intentionally excludes internal ERP modules (general ledger accounting, inventory stock movements, customs clearance execution, physical freight forwarding) and financial escrow/settlement.

---

## 2. User Roles, Personas & User Stories

### 2.1 User Roles & Personas
| Role | User Persona | Primary Objective |
| :--- | :--- | :--- |
| **Visitor (Public)** | International trade researcher, domestic buyer | Browse sector directory, search commodities in AR/EN, evaluate Egyptian supplier capacities without friction. |
| **Importer (Buyer)** | Wholesale procurement manager, foreign supermarket buyer | Register for free, submit structured RFQs, review direct bids, unlock supplier WhatsApp/phone numbers for offline deal finalization. |
| **Exporter (Supplier)** | Egyptian producer, farm aggregator, export director | Showcase factory facilities, display verified compliance certificates, receive category-matched RFQ leads, submit competitive quotes. |
| **Administrator / Ops** | Market 365 compliance officers, verification auditors | Validate company Commercial Registrations (CR), audit quality certificates, moderate listings, manage subscriptions, oversee platform health. |
| **Content / TV Editor** | Editorial staff, TV show media production team | Publish export news and market studies, link TV episodes, manage homepage sponsored ad slots. |

---

### 2.2 Comprehensive User Stories

#### A. Public Visitor
* **US-VIS-01 (Faceted Discovery):** As a Visitor, I want to browse products by sector, commodity type, and required international certificate so that I can immediately identify Egyptian suppliers capable of fulfilling my country's import regulations.
* **US-VIS-02 (Bilingual Experience):** As a Visitor, I want to seamlessly switch between English (LTR) and Arabic (RTL) without losing my search context or active filters.
* **US-VIS-03 (Company Profile Preview):** As a Visitor, I want to view an exporter's public profile, facility photos, and product specifications while seeing masked contact placeholders prompting me to register for free to reveal direct communication channels.

#### B. International Importer (Buyer)
* **US-IMP-01 (Free Instant Registration):** As an Importer, I want to register a free buyer account using my corporate email and business details so that I can access supplier direct contacts and post buying requirements.
* **US-IMP-02 (Structured RFQ Creation):** As an Importer, I want to create a Request for Quotation specifying target commodity, quantity (MT), packaging standards, destination port, Incoterms (FOB/CIF), and mandatory certificates so that only qualified producers respond.
* **US-IMP-03 (Quotation Comparison & Contact Unlock):** As an Importer, I want to review received quotations in my private dashboard, compare pricing and lead times, and accept a quote to immediately unlock the supplier's full contact coordinates (WhatsApp, phone, executive email).
* **US-IMP-04 (Direct Information Enquiries):** As an Importer, I want to submit a one-click direct enquiry or request additional video verification for a specific factory through the platform.

#### C. Egyptian Exporter (Supplier)
* **US-EXP-01 (Onboarding & Verification):** As an Exporter, I want to register my company and upload my Egyptian Commercial Registration (CR) and Tax ID so that my business can be officially verified with a trust badge.
* **US-EXP-02 (Digital Showroom Management):** As an Exporter, I want to manage my product listings, upload facility photos, and attach quality certificates within my subscription tier quotas so that international buyers can assess my capacity.
* **US-EXP-03 (RFQ Lead Alerts):** As an Exporter, I want to receive real-time email and dashboard alerts whenever an importer submits an RFQ matching my product categories and certificates so that I can submit a quote promptly.
* **US-EXP-04 (Dynamic Showcase - Elite Tier):** As an Elite Tier Exporter, I want to refresh my featured shipment video and gallery once a month so foreign buyers can verify my active harvesting and dispatch operations.
* **US-EXP-05 (Visitor Analytics):** As an Exporter, I want to view my monthly profile views, search impressions, and the names/countries of authenticated importing companies that viewed my profile.

#### D. Administrator & Platform Operator
* **US-ADM-01 (CR & Legal Verification Console):** As an Administrator, I want a dedicated audit dashboard to inspect submitted Commercial Registrations and approve or reject exporter verification status.
* **US-ADM-02 (Certificate Auditing):** As an Administrator, I want to review uploaded compliance certificates (ISO, GlobalG.A.P., Halal, FDA) against accreditation standards before displaying "Verified" badges.
* **US-ADM-03 (Subscription & Entitlement Override):** As an Administrator, I want to activate, upgrade, or extend exporter annual subscription plans, record offline payment references, and adjust quotas.
* **US-ADM-04 (RFQ Moderation & Quality Scoring):** As an Administrator, I want to screen incoming RFQs to eliminate spam, incomplete submissions, and fraudulent inquiries before broadcasting to exporters.

#### E. Content & TV Media Editor
* **US-EDT-01 (Visual Editorial Publishing):** As a Content Editor, I want a rich-text publishing dashboard to post trade articles, market news, and regulatory updates in Arabic and English.
* **US-EDT-02 (TV Episode & Video Scheduling):** As an Editor, I want to embed full episodes of *"Yes We Can"* from YouTube and schedule paid video commercials on the homepage video wall with automated start and expiration dates.

---

## 3. The 100% Free ($0.00) Technology Stack

Every component selected is Free and Open-Source Software (FOSS) and operates strictly within permanent, non-expiring cloud free tiers. Zero credit card billing, zero software license fees, and zero server hosting invoices.

| Layer | Technology | Free Tier Provider | Zero-Cost ($0.00) Technical Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend & Compute** | **Next.js 14+ (App Router)** | **Vercel (Hobby Tier)** | Unlimited static deployments, Server-Side Rendering (SSR) for Google SEO, Server Actions, Edge middleware, and automatic SSL certificates. **Cost: $0.00** |
| **Frontend Language** | **TypeScript** | Open Source | Compile-time type safety preventing runtime bugs across shared API models. **Cost: $0.00** |
| **UI Components & Styling** | **Tailwind CSS + shadcn/ui** | Open Source (MIT) | Pre-built accessible Radix UI primitives. Native CSS logical properties provide instant LTR/RTL layout flipping for Arabic and English. **Cost: $0.00** |
| **Mobile Solution** | **Progressive Web App (PWA)** | Open Web Standard | Installable mobile app experience on iOS and Android with offline caching and Web Push. Zero App Store fees ($0 vs $99/yr Apple fee). **Cost: $0.00** |
| **Database Engine** | **Managed PostgreSQL 16+** | **Supabase (Free Tier)** | 500 MB relational storage (handles >100,000 product rows), full ACID transactions, connection pooling via Supavisor, and built-in REST API. **Cost: $0.00** |
| **Search Engine** | **PostgreSQL Native FTS** | **Supabase (Built-in)** | Multi-lingual stemming (Arabic `arabic` dictionary + English `english`), `pg_trgm` fuzzy matching, and GIN indexing with zero extra servers. **Cost: $0.00** |
| **AI Semantic Search** | **`pgvector` Extension** | **Supabase (Built-in)** | Native vector embeddings enable cross-lingual matching (e.g. matching a Spanish RFQ for "comino en grano" to an Arabic listing for "كمون"). **Cost: $0.00** |
| **Media & PDF Storage** | **Cloudflare R2 / Supabase Storage** | **Cloudflare / Supabase** | 10 GB of free S3-compatible storage with **$0 egress bandwidth fees** for factory photo galleries and compliance PDF certificates. **Cost: $0.00** |
| **Video Delivery Pipeline** | **YouTube Video API & Embeds** | **YouTube (Free)** | Zero-cost 4K/1080p video streaming. Eliminates heavy transcoding servers and terabytes of bandwidth costs by leveraging TV show's YouTube channel. **Cost: $0.00** |
| **Scheduled Tasks & Crons** | **Vercel Cron Jobs** | **Vercel (Free)** | Automated daily certificate expiration checks, local listing expiration, and subscription status updates. **Cost: $0.00** |
| **Asynchronous Message Queue** | **Upstash QStash & Redis** | **Upstash (Free Tier)** | 10,000 free serverless requests/day for asynchronous RFQ lead routing and background email dispatches. **Cost: $0.00** |
| **Transactional Email Relay** | **Resend / Brevo** | **Free Tier** | Resend (3,000 emails/month free) or Brevo (300 emails/day = 9,000 emails/month free) for RFQ alerts, quote notifications, and password resets. **Cost: $0.00** |
| **Edge CDN & DDoS Shield** | **Vercel Edge Network / Cloudflare** | **Free Tier** | Global edge caching, DDoS mitigation, and automatic TLS 1.3 encryption. **Cost: $0.00** |

---

## 4. The 4 Autonomous Modules (1 Module = 1 Sole Owner)

Each module is an **autonomous, end-to-end subsystem**. The assigned team member owns the **Frontend, Backend / API, Database, and Services** for their respective module.

---

### MODULE 1: Identity, Authentication & Subscription Monetization Engine
* **SOLE OWNER:** **Seif Kassab**
* **Scope & Bounded Context:** User authentication, password security, session management, Role-Based Access Control (RBAC), and the 4-tier exporter subscription monetization engine.
* **Why Independent:** Emits cryptographically signed JWT tokens with claims (`user_id`, `role`, `tier_code`, `company_id`). Downstream modules simply read these claims from the session cookie without making cross-module calls.

#### Functional Requirements Covered:
* **FR-AUTH-001 (Importer Registration):** Free instant buyer signup with corporate email, company name, country, and WhatsApp verification.
* **FR-AUTH-002 (Exporter Onboarding):** Egyptian supplier signup capturing Commercial Registration (CR) number, Tax ID, Governorate, and CR document upload (`PENDING_VERIFICATION`).
* **FR-AUTH-003 (JWT Session Cookies):** Cryptographically signed JWT tokens transmitted exclusively via HTTP-only, Secure, SameSite cookies.
* **FR-AUTH-004 (RBAC Gatekeeper Middleware):** Restricts API endpoints across `VISITOR`, `IMPORTER`, `EXPORTER`, and `ADMIN` roles.
* **FR-SUB-001 (Subscription Entitlement Engine):** Enforces 4 distinct tiers:
  * **Standard (STD):** 15 products, 10 images, static annual profile.
  * **Plus (PLS):** 50 products, 25 images, static annual profile.
  * **Premium (PRM):** 150 products, 60 images, 1 fixed YouTube video embed.
  * **Elite (ELT):** Unlimited products & images, multi-video embeds with **1 dynamic video/gallery refresh every 30 days**.
* **FR-SUB-002 (Quota Enforcement Middleware):** Server-side interceptors that block product creations or image uploads if an exporter has reached their tier limit.
* **FR-SUB-003 (Offline Payment Recording):** Mechanism for recording external bank transfer references, payment dates, and manual activation of annual plans.

#### Technical Layer Breakdown (Owned 100% by Seif Kassab):
| Technical Layer | What Seif Kassab Implements in Module 1 |
| :--- | :--- |
| **Frontend** | Bilingual signup and login pages; password recovery screens; subscription pricing & comparison matrix; exporter subscription status badge; upgrade prompt modals. |
| **Backend / API** | Next.js Server Actions for authentication (signup, login, logout, reset); JWT cookie verification; RBAC middleware; Server Actions for subscription plan upgrades and quota enforcement checks. |
| **Database** | Supabase PostgreSQL tables: `auth.users`, `user_profiles`, `user_roles`, `subscription_plans`, `plan_entitlements`, `company_subscriptions`, and `offline_payment_audit` with strict Row-Level Security (RLS). |
| **Services / Cloud** | Session management, cookie security headers, and Vercel Edge authentication middleware. |

---

### MODULE 2: Exporter Digital Showrooms, Catalog & Compliance Ecosystem
* **SOLE OWNER:** **Karim Ayman**
* **Scope & Bounded Context:** Exporter storefront showcase, 4-level category taxonomy, dynamic product catalog, compliance certificate vault, masked contact reveal UI, and responsive PWA.
* **Why Independent:** Acts as the public face and discovery portal of Market 365. Contains its own catalog data models, JSONB specifications, and certificate badge logic without depending on external bidding workflows.

#### Functional Requirements Covered:
* **FR-DIR-001 (Bilingual Storefront Showcase):** Public company profile with bilingual overview (AR/EN), plant size ($m^2$), annual capacity (MT), packaging standards, and export port history.
* **FR-DIR-002 (Masked Contact Reveal):** Displays masked contact placeholders to unauthenticated visitors, while unmasking full direct phone, WhatsApp, and executive emails to logged-in buyers.
* **FR-CAT-001 (4-Level Structured Taxonomy):** Hierarchical navigation: $\text{Main Sector} \rightarrow \text{Commodity Type} \rightarrow \text{Mandatory Country Certificate} \rightarrow \text{Exporter Tiles}$.
* **FR-PRD-001 (Product CRUD & Dynamic JSONB Specs):** Exporters manage commodities specifying HS Code, MOQ, Packaging, and dynamic JSONB attributes (purity %, moisture %, calibre).
* **FR-CRT-001 (Compliance Certificate Vault):** Upload compliance certificates (ISO 22000, GlobalG.A.P., BRC, Halal, FDA, Organic) with document previews.
* **FR-CRT-002 (Verified Trust Badges):** Displays "CR Verified" and accredited certificate trust badges on approved company profiles.
* **FR-MOB-001 (Progressive Web App):** PWA manifest, service workers, touch optimization, and seamless 375px–1920px responsiveness across mobile, tablet, and desktop.

#### Technical Layer Breakdown (Owned 100% by Karim Ayman):
| Technical Layer | What Karim Ayman Implements in Module 2 |
| :--- | :--- |
| **Frontend** | Homepage layout; 4-level category visual navigator; faceted search filter sidebar; exporter showroom profile layout; masked contact reveal component; product CRUD modal; certificate upload wizard; PWA manifest. |
| **Backend / API** | Next.js Server Actions for company profile CRUD, product creation/update/deletion, certificate document attachment, and masked contact lookup logic. |
| **Database** | Supabase PostgreSQL tables: `companies`, `company_profiles`, `sectors`, `commodities`, `products` (with JSONB specs), `certificates`, and `company_certificates` with GIN indexing. |
| **Services / Cloud** | Client-side WebP image compression library (resizing phone uploads by 80% before upload); OpenGraph and Schema.org JSON-LD structured data generation for Google SEO. |

---

### MODULE 3: Procurement Matchmaking (RFQ) & Secondary Trade Boards
* **SOLE OWNER:** **GamalEldin**
* **Scope & Bounded Context:** Sourcing inquiries, Request for Quotation (RFQ) intake wizard, confidential commercial bidding, mutual contact unlocking, Local Market domestic surplus board, and Distressed Cargo emergency resale board.
* **Why Independent:** Fully autonomous procurement transaction workflow. Consumes commodity categories and exporter IDs without coupling to storefront presentation code.

#### Functional Requirements Covered:
* **FR-RFQ-001 (Structured RFQ Intake Wizard):** Multi-step sourcing wizard for importers specifying Commodity, Quantity (MT), Destination Port, Incoterms (FOB/CIF), Target Delivery Window, and Mandatory Certificates.
* **FR-RFQ-002 (Three Broadcast Modes):** System supports: (1) Category broadcast; (2) Direct exporter inquiry; (3) One-click automated distribution.
* **FR-RFQ-003 (Commercial Quotation Submission):** Matched exporters submit confidential quotes specifying Unit Price (USD/EUR), Packaging Details, Port of Loading, Lead Time, and Terms.
* **FR-RFQ-004 (Quote Confidentiality & Anti-Collusion):** Competing exporters cannot see each other's bids. Quotes are strictly visible only to the requesting buyer and administrators.
* **FR-RFQ-005 (Mutual Contact Unlock Engine):** When an importer clicks `ACCEPT QUOTE`, the RFQ transitions state and automatically reveals complete direct contact details (WhatsApp, mobile, direct email) to both parties for offline deal closure.
* **FR-LOC-001 (Local Market Domestic Surplus):** Egyptian producers list factory-gate domestic inventory with photos, unit price (EGP), available quantity, quality grade, warehouse location (governorate), and direct seller phone.
* **FR-DST-001 (Distressed / Diverted Cargo Resale):** Exporters list en-route, rejected, or disputed container shipments seeking rapid resale at international destination ports with discounted pricing (USD), Bill of Lading (BL) status, and inspection certificates.
* **FR-TRD-001 (Direct WhatsApp Communication):** Automatic generation of pre-filled WhatsApp click-to-chat links connecting buyers directly to sellers with zero commission.

#### Technical Layer Breakdown (Owned 100% by GamalEldin):
| Technical Layer | What GamalEldin Implements in Module 3 |
| :--- | :--- |
| **Frontend** | Importer multi-step RFQ submission wizard; exporter quotation submission form; importer quote comparison dashboard with "Accept & Unlock" modal; Local Market surplus board; Distressed Cargo emergency resale board. |
| **Backend / API** | Next.js Server Actions for RFQ creation, quote submission, quote acceptance, mutual contact reveal logic, and classifieds listing CRUD. |
| **Database** | Supabase PostgreSQL tables: `rfqs`, `rfq_attachments`, `quotes`, `quote_attachments`, `rfq_matches`, `local_market_listings`, and `distressed_cargo_listings` with anti-collusion RLS. |
| **Services / Cloud** | Port-level geo-querying, Incoterm rules validation, and WhatsApp direct link formatting. |

---

### MODULE 4: Cloud Infrastructure, Media Hub, Security & Admin Governance
* **SOLE OWNER:** **Seif Amr**
* **Scope & Bounded Context:** Cloud serverless integrations, background message queues, file storage pipelines, TV show media integration, anti-scraping security, administrative back-office, and automated testing.
* **Why Independent:** The operational backbone of Market 365. Runs asynchronous event processing, storage presigning, scheduled cron automation, and administrative compliance oversight without blocking user-facing journeys.

#### Functional Requirements Covered:
* **FR-MED-001 (Cloudflare R2 Direct Uploads):** Presigned URL generation allowing direct browser-to-R2 uploads of company photos and PDF certificates ($0 egress fees).
* **FR-MED-002 (YouTube Video Wall & TV Hub):** Ingests YouTube links from the TV show *"Yes We Can"* (*نعم نستطيع*), powering the homepage video wall and TV episode showroom at zero bandwidth cost.
* **FR-CMS-001 (Editorial Hub & Government Links):** Built-in trade news publishing manager and official trade directory linking to Egyptian authorities (NFSA, CAPQ, GOEIC, Customs).
* **FR-QSH-001 (Asynchronous RFQ Lead Routing):** Upstash QStash worker that evaluates incoming RFQs in the background within 60 seconds and triggers supplier alerts.
* **FR-NOT-001 (Transactional Email Relay):** Resend / Brevo API integration with isolated domain routing (`mail.market365.eg`) for instant RFQ alerts and verification emails.
* **FR-CRN-001 (Vercel Cron Daily Automation):** Scheduled cron jobs inspecting certificate expiration dates (degrading badges to `EXPIRED`) and auto-unpublishing expired classifieds.
* **FR-SEC-001 (Anti-Scraping Defense):** Contact reveal rate-limiting (maximum 50 reveals/day), Cloudflare Bot Fight Mode, and synthetic honeytoken company records.
* **FR-ADM-001 (Admin Governance Console):** Secured admin dashboard with split-screen Commercial Registration audit viewer, certificate review queue, and platform KPI metrics.
* **FR-TST-001 (Playwright QA Automation):** End-to-end automated testing suites verifying buyer registration, RFQ creation, quote submission, and admin approval workflows.

#### Technical Layer Breakdown (Owned 100% by Seif Amr):
| Technical Layer | What Seif Amr Implements in Module 4 |
| :--- | :--- |
| **Frontend** | Next.js Admin console interface (CR audit split-screen PDF viewer, cert review queue, user management table, KPI metrics overview); Homepage Video Wall carousel; TV show episode gallery; Editorial news feed & reader view. |
| **Backend / API** | Admin Server Actions for CR approval/rejection, certificate verification, and manual subscription activations; presigned R2 upload API; Upstash QStash webhook endpoint; contact reveal rate-limiting middleware. |
| **Database** | Supabase PostgreSQL tables: `audit_logs`, `moderation_actions`, `analytics_events`, `media_assets`, `articles`, `government_links`, and `tv_episodes`. |
| **Services / Cloud** | Cloudflare R2 bucket configuration; Upstash QStash event queues; Resend email relay; Vercel Cron scheduled triggers; Playwright automated test suites. |

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Performance & Latency Thresholds
* **NFR-PERF-01 (Page Load Speed):** Public landing, directory, and exporter profile pages shall achieve a First Contentful Paint (FCP) of $<1.0\text{s}$ and Time to Interactive (TTI) of $<2.0\text{s}$ on standard 4G mobile connections via Vercel Edge caching.
* **NFR-PERF-02 (Database Search Latency):** PostgreSQL full-text search and multi-facet filtering queries shall execute and return data in $<150\text{ms}$ on Supabase.
* **NFR-PERF-03 (Serverless API Response Time):** 95% of Next.js Route Handlers and Server Actions shall respond within $<200\text{ms}$.
* **NFR-PERF-04 (Asynchronous RFQ Processing):** RFQ category matching and notification dispatch shall complete within $<60\text{s}$ of buyer submission via Upstash QStash.

---

### 5.2 Scalability & Concurrency
* **NFR-SCAL-01 (Auto-Scaling Serverless Capacity):** Vercel serverless compute and Supabase connection pooling scale automatically from zero to thousands of concurrent users with **zero manual server management**.
* **NFR-SCAL-02 (Decoupled File Storage):** All user media and PDF certificates shall be persisted in Cloudflare R2 / Supabase Storage, ensuring that compute instances remain 100% stateless.

---

### 5.3 Security, Anti-Scraping & Legal Defense
* **NFR-SEC-01 (Transport Security):** 100% of web traffic shall be encrypted via TLS 1.3 with automated Vercel SSL certificate issuance and renewal.
* **NFR-SEC-02 (Anti-Scraping Defense):** Because the platform's primary commercial asset is its verified exporter directory, the following defensive controls shall be enforced:
  * Direct contact coordinates require authenticated importer sessions;
  * Vercel Edge Firewall & Cloudflare Bot Fight Mode to block automated crawlers;
  * Per-account rate limiting on contact reveals (maximum 50 reveals/day for standard importer accounts);
  * Injection of synthetic "honeytoken" exporter records to legally prove directory theft if scraped by competitors.
* **NFR-SEC-03 (File Upload Sanitization):** Uploaded files shall be validated via binary magic bytes (rejecting executable scripts), assigned randomized UUID filenames, and stored with non-executable content types.
* **NFR-SEC-04 (Legal & Privacy Compliance):** The platform shall comply with international privacy regulations:
  * GDPR-compliant data processing agreement and cookie consent banner;
  * Importer "Private Browsing" toggle for analytics;
  * Strict separation of marketing and transactional email relays.

---

### 5.4 Reliability, Backups & Disaster Recovery
* **NFR-REL-01 (Target Availability):** The platform shall target 99.9% uptime backed by Vercel and Supabase SLA baselines.
* **NFR-REL-02 (ACID Data Guarantees):** All subscription assignments, RFQ submissions, and quotation bids shall execute within ACID relational database transactions.
* **NFR-REL-03 (Automated Disaster Recovery):**
  * Daily automated database backups provided by Supabase;
  * GitHub-based GitOps deployment history ensuring instant one-click rollback on Vercel.

---

### 5.5 Usability, Accessibility & Internationalization (i18n)
* **NFR-USE-01 (Native RTL & LTR Layouts):** The entire application shall support Modern Standard Arabic (RTL) and International English (LTR) with seamless visual mirroring and culturally aligned typography (Cairo / Inter fonts).
* **NFR-USE-02 (Responsive Form Factors):** 100% functional parity across desktop ($1920\text{px}$ down to $1024\text{px}$), tablet ($768\text{px}$), and mobile devices ($375\text{px}+$ screen widths).
* **NFR-USE-03 (Accessibility Standard):** Public visitor journeys shall target WCAG 2.1 Level AA compliance for contrast ratios, keyboard navigation, and ARIA labels.

---

## 6. Implementation Timeline & Sprint Schedule (10 Weeks)

```
WEEK:       01   02   03   04   05   06   07   08   09   10
--------------------------------------------------------------
SPRINT 1:  [== Inception, Architecture & Taxonomy ==]
SPRINT 2:       [== Auth, Showroom Base & Cloud R2 ==]
SPRINT 3:            [== Showroom UI, Search & Certs ==]
SPRINT 4:                 [== RFQ Matchmaking Engine ==]
SPRINT 5:                      [== Subscriptions, Trade Boards & Video Wall ==]
SPRINT 6:                           [== Playwright Testing & Go-Live ==]
LAUNCH:                                                          [★ $0 MVP ★]
```

### Sprint-by-Sprint Individual Tasks:
* **Sprint 1 (Weeks 1–2): Inception, Architecture, Taxonomy & Design Kit**
  * *Seif Kassab:* Next.js 14+ repo baseline on Vercel, Supabase setup, base types.
  * *Karim Ayman:* Figma design kit (AR/EN), Tailwind CSS tokens, shadcn/ui components.
  * *GamalEldin:* 4-level taxonomy definitions, HS code register, standard crop specifications.
  * *Seif Amr:* Cloudflare R2 bucket setup, Upstash QStash account, Resend testing domain.
* **Sprint 2 (Weeks 3–4): Auth, Showroom Base & Storage Pipelines**
  * *Seif Kassab:* Supabase Auth (JWT in HTTP-only cookies), RBAC middleware, signup/login forms.
  * *Karim Ayman:* Bilingual Root Layout (RTL/LTR switcher), Header, Footer, PWA setup.
  * *GamalEldin:* RFQ intake form schema, commercial Incoterm rules definition.
  * *Seif Amr:* Direct-to-R2 presigned upload endpoint, client-side WebP image optimizer.
* **Sprint 3 (Weeks 5–6): Showrooms, Search & Certificate Vault**
  * *Seif Kassab:* Subscription entitlement engine database tables and quota middleware.
  * *Karim Ayman:* Exporter profile layout, 4-level category navigator, certificate upload wizard, masked contacts.
  * *GamalEldin:* RFQ quote submission form, quote comparison dashboard logic.
  * *Seif Amr:* Vercel Cron jobs for daily cert expiry tracking, YouTube video wall integration.
* **Sprint 4 (Weeks 7–8): RFQ Procurement Engine & Classifieds**
  * *Seif Kassab:* Plan upgrade modals and offline payment audit tables.
  * *Karim Ayman:* Faceted search filter UI, product CRUD modal, mobile responsive polish.
  * *GamalEldin:* Local Market surplus board, Distressed Cargo emergency board, mutual contact unlock.
  * *Seif Amr:* Upstash QStash async lead matching worker, Resend transactional email triggers.
* **Sprint 5 (Week 9): Monetization, Admin Governance & Security**
  * *Seif Kassab:* Final verification of plan quota interceptors on all product/image endpoints.
  * *Karim Ayman:* Exporter subscription badge UI, pricing comparison page.
  * *GamalEldin:* Direct WhatsApp link formatting, trade council pilot exporter onboarding.
  * *Seif Amr:* Next.js Admin console (CR audit, cert review, KPI metrics), anti-scraping rate limits.
* **Sprint 6 (Week 10): Playwright Testing, Hardening & Go-Live**
  * *Seif Kassab:* Supabase connection pooling audit, domain mapping on Vercel.
  * *Karim Ayman:* Final WCAG AA accessibility audit, cross-device testing.
  * *GamalEldin:* Client walkthrough with 50 seeded Egyptian exporters.
  * *Seif Amr:* Automated Playwright test run, security scan, production launch.

---

## 7. RACI Matrix for the 4 Autonomous Modules

* **R = Responsible:** Single person who builds the module end-to-end.
* **A = Accountable:** Single person with final delivery sign-off.
* **C = Consulted:** Consulted for interface contract alignment.
* **I = Informed:** Kept informed via Git pull requests.

| Autonomous Module | Seif Kassab | Karim Ayman | GamalEldin | Seif Amr |
| :--- | :---: | :---: | :---: | :---: |
| **MODULE 1: Identity, Auth & Subscription Engine** | **R / A (100%)** | C | I | I |
| **MODULE 2: Exporter Showrooms & Product Catalog** | C | **R / A (100%)** | C | I |
| **MODULE 3: Procurement RFQ Engine & Trade Boards**| C | C | **R / A (100%)** | C |
| **MODULE 4: Cloud Pipeline, Admin & Governance** | I | I | I | **R / A (100%)** |

---

## 8. Critical Strategic Path & Risk Mitigation Matrix

| # | Strategic Risk | Severity | Root Cause | Engineering & Business Mitigation Strategy |
| :-: | :--- | :---: | :--- | :--- |
| **1** | **Supply-Side Cold Start** | **CRITICAL** | Importers will not visit an empty directory; exporters will not pay for an unvisited platform. | **Pre-Launch Seeding (GamalEldin):** Onboard 50–100 prominent Egyptian exporters with free 1-year Standard/Plus listings during Weeks 1–4 so the directory is populated on Day 1. |
| **2** | **Free Tier Threshold Surpassing** | **LOW** | Growth could eventually exceed free tier database or storage caps. | **Graceful Expansion Path (Seif Amr):** Supabase and Cloudflare R2 free tiers support up to 500 MB DB and 10 GB files. If the platform grows to 1,000+ paid exporters, annual subscriptions easily fund minor upgrade tiers ($25/mo). |
| **3** | **Contact Scraping & Directory Theft** | **HIGH** | The platform’s open contact policy allows competitors to crawl and harvest supplier phone numbers. | **Layered Defense (Seif Amr):** Gate unmasked contact information behind free registered buyer accounts; enforce strict daily view rate limits (50/day); inject honeytoken decoy records. |
| **4** | **Cold Email Blacklisting** | **HIGH** | Mass cold outreach to foreign importers can trigger spam complaints that block transactional RFQ emails. | **Domain Separation (Seif Amr):** Strictly isolate transactional emails (via Resend/Brevo) from outreach campaigns, adhering strictly to GDPR and CAN-SPAM opt-out standards. |
| **5** | **Certificate Credibility & Liability** | **HIGH** | Exporters displaying lapsed or forged certificates expose buyers to customs cargo rejections. | **Active Expiry Tracking (Seif Amr & GamalEldin):** Certificates display "Verified" only after human admin audit; automated Vercel Cron jobs degrade badges to "Expired" on their lapse date. |

---

## 9. Summary Traceability Matrix

| Autonomous Module | Core Business Need | Architecture & Stack Implementation | Sole Owner |
| :--- | :--- | :--- | :---: |
| **MODULE 1: Identity & Subscriptions** | Secure access, 4-tier monetization | Supabase Auth, JWT in HTTP-only cookies, quota middleware | **Seif Kassab** |
| **MODULE 2: Showroom & Catalog** | High SEO discovery, 4-level taxonomy | Next.js 14+ SSR, Supabase JSONB specs, WebP optimization | **Karim Ayman** |
| **MODULE 3: Procurement & Trade Boards**| Zero-commission RFQs & classifieds | Confidential quote engine, mutual contact unlock, WhatsApp API | **GamalEldin** |
| **MODULE 4: Cloud, Admin & Governance**| Cloud storage, async queues, admin | Cloudflare R2, Upstash QStash, Resend, Playwright QA | **Seif Amr** |
| **Literal $0 Cost Baseline** | Zero software licenses, zero server bills| 100% Free Tiers (Vercel, Supabase, R2, Upstash, Resend) | **All Members** |

---
*End of Master Single-Owner Specification (SRS v4.0)*
