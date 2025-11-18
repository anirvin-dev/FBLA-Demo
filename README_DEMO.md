# Yolo — Byte-Sized Business Boost
## FBLA Demo Documentation

### 📋 Table of Contents
- [Quick Start](#quick-start)
- [Demo Script (60-90s)](#demo-script-60-90s)
- [Features Overview](#features-overview)
- [Technical Architecture](#technical-architecture)
- [Judging Points](#judging-points)

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### Running the Demo

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev:scouting

# 3. Open your browser to http://localhost:3000
```

**That's it!** No environment variables, no external services required.

### First-Time Setup

1. Click "Get Started" on the home page
2. You'll be automatically logged in as a demo user
3. Click "Load Demo Data" on the Discover page
4. Start exploring!

---

## Demo Script (60-90s)

**For judges: Follow this script to see all key features**

### Part 1: Introduction (10s)
> "Welcome to Yolo — Byte-Sized Business Boost. This is a local business discovery platform that rewards users with points for their engagement."

*Show the home page with Yolo branding*

### Part 2: Discovery (15s)
> "Users can discover local businesses, filter by category, and search by name or location."

*Navigate to Discover → Show filtering by 'Food & Dining' → Search for 'coffee'*

### Part 3: Business Details & Reviews (20s)
> "Each business has detailed information, customer reviews, and special deals. Users can leave reviews and earn points."

*Click on 'The Coffee Corner' → Scroll through reviews → Click 'Leave a Review' → Show bot verification → Submit review (show points earned)*

### Part 4: Deals & Purchases (15s)
> "Users can claim exclusive deals and simulate purchases to earn more points."

*Click 'Claim' on a deal → Complete bot verification → Click 'Simulate Purchase' → Enter $25 → Show points earned*

### Part 5: Points Redemption (15s)
> "Points can be redeemed with partner retailers like Amazon, Nike, and Starbucks."

*Navigate to Points page → Show points balance → Select a partner → Click 'Redeem' (if enough points) → Show redemption code*

### Part 6: Additional Features (10s)
> "Users can also bookmark their favorite businesses for quick access."

*Navigate to Bookmarks → Show bookmarked businesses*

### Part 7: Dev Admin (10s)
> "For this demo, we have an admin panel where we can manage test data and settings."

*Navigate to Admin → Show data status → Toggle DEV_MODE*

---

## Features Overview

### ✅ Core Features Implemented

1. **Business Discovery**
   - Grid/list view of local businesses
   - Category filtering (Food, Retail, Services)
   - Search by name, address, or description
   - Sort by rating, review count, or name

2. **Business Details**
   - Complete business information
   - Customer reviews with ratings
   - Available deals and coupons
   - Bookmark functionality
   - Verified business badges

3. **Reviews & Ratings**
   - 5-star rating system
   - Text reviews with character limits
   - Bot verification before submission
   - Points awarded based on review quality:
     - Base: 10 points
     - Bonus: +10 for 100+ characters
     - Bonus: +5 for 5-star ratings

4. **Points System**
   - Earn points from reviews and purchases
   - 1 dollar = 1 point for purchases
   - Real-time points balance tracking
   - Transaction history

5. **Partner Redemptions**
   - Multiple partner options (Amazon, Nike, Adidas, Levi's, Starbucks, Target)
   - Points-based redemption
   - Unique redemption codes
   - Redemption history

6. **Deals & Coupons**
   - Business-specific deals
   - One-time claim per user
   - Bot verification before claiming
   - Terms and expiration dates

7. **Bookmarks**
   - Save favorite businesses
   - Quick access from dedicated page
   - One-click toggle

8. **Bot Verification**
   - Simple math challenge (e.g., "7 + 3 = ?")
   - Required before reviews and deal claims
   - Prevents spam and abuse
   - Auto-fill in DEV_MODE

9. **Dev Admin Panel**
   - Load/reset demo data
   - Add test points
   - Toggle DEV_MODE
   - Toggle Nirv AI (stub)
   - View data statistics

---

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (radix-ui)
- **Icons**: Lucide React
- **State Management**: React hooks + localStorage

### Data Storage
- **Type**: Client-side (localStorage)
- **Keys**:
  - `yolo_demo_businesses` - Business data
  - `yolo_demo_reviews` - Review data
  - `yolo_bookmarks_v1` - User bookmarks
  - `yolo_user_points_v1` - Points and transactions
  - `yolo_redemptions_v1` - Redemption history
  - `yolo_claimed_deals_v1` - Claimed deals
  - `user_yolo_demo` - User accounts (demo)
  - `yolo_session_demo` - Session data (demo)

### Validation
- **Library**: Zod schemas
- **Coverage**: Business data, reviews, user input

### Demo Authentication
⚠️ **Security Notice**: The authentication system is for DEMO PURPOSES ONLY
- Passwords stored in localStorage (insecure)
- No encryption or hashing
- Session management via cookies
- DEV_MODE bypasses auth entirely

### Project Structure
```
apps/web/
├── app/(sidebar)/          # Main app routes
│   ├── discover/          # Business discovery
│   ├── business/[id]/     # Business details
│   ├── bookmarks/         # Saved businesses
│   ├── points/            # Points & redemptions
│   ├── search/            # Search page
│   └── admin/dev/         # Dev admin panel
├── components/
│   ├── business/          # Business UI components
│   ├── review/            # Review components
│   ├── verification/      # Bot challenge
│   └── points/            # Points/redemption UI
├── lib/
│   ├── services/          # Business logic
│   ├── schemas/           # Zod validation
│   ├── types/             # TypeScript types
│   ├── constants/         # App constants
│   └── auth/              # Demo auth
└── data/                  # Mock JSON data
```

---

## Judging Points

### Innovation & Creativity
- **Points Rewards System**: Gamifies local business discovery
- **Bot Verification**: Simple yet effective spam prevention
- **Partner Network**: Real-world value through redemptions

### Technical Implementation
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Type Safety**: Full TypeScript with Zod validation
- **Component Architecture**: Reusable, modular components
- **Performance**: Client-side rendering, instant interactions

### User Experience
- **Intuitive Navigation**: Clear sidebar, breadcrumbs
- **Consistent Design**: shadcn/ui components throughout
- **Responsive**: Mobile-friendly design
- **Accessibility**: Semantic HTML, ARIA labels

### Business Value
- **User Engagement**: Points incentivize reviews and visits
- **Business Growth**: Increased visibility and reviews
- **Community Building**: Connects users with local businesses
- **Monetization Potential**: Partner commissions, featured listings

### Scalability & Production Readiness

#### What's Demo-Ready ✅
- UI/UX fully functional
- All features working locally
- Data validation and error handling
- Responsive design

#### What's Needed for Production ⚠️
1. **Backend API**
   - PostgreSQL/MongoDB database
   - REST or GraphQL API
   - Server-side validation

2. **Authentication**
   - OAuth (Google, Facebook, Apple)
   - JWT token management
   - Password hashing (bcrypt)
   - Email verification

3. **Payment Integration**
   - Stripe or Square for purchases
   - Partner API integrations
   - Transaction logging

4. **AI Recommendations (Nirv)**
   - Machine learning model
   - User preference tracking
   - Collaborative filtering

5. **Security**
   - HTTPS everywhere
   - Rate limiting
   - Input sanitization
   - CSRF protection

6. **Infrastructure**
   - CDN for assets
   - Caching (Redis)
   - Load balancing
   - Monitoring & logging

---

## Demo Data

### Businesses
- 12 businesses across 3 categories
- Categories: Food & Dining, Retail & Shopping, Services
- Example businesses: Blue Moon Bakery, TechStyle Electronics, Sunset Yoga Studio

### Reviews
- 36 pre-seeded reviews
- 3-5 reviews per business
- Varying ratings and lengths

### Deals
- 10 deals across different businesses
- Mix of percentage discounts and fixed prices
- Realistic terms and conditions

### Partners
- 6 redemption partners
- Points required: 500 - 2500
- Rewards: $5 - $25 gift cards

---

## Troubleshooting

### "No businesses found"
→ Click "Load Demo Data" on the Discover page or visit `/admin/dev` to seed data

### "Reviews not appearing"
→ Refresh the business page after submitting a review

### "Points not updating"
→ Check `/points` page for your current balance. Navigate away and back if needed.

### "Can't claim deals"
→ Each deal can only be claimed once per user

### Reset Everything
→ Go to `/admin/dev` and click "Reset All Data"

---

## Contact & Credits

**Built for**: FBLA Competition 2025
**Demo Purpose**: Business Software Development

**Technologies Used**:
- Next.js 15
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zod
- Lucide Icons

---

## License

This is a demo application for educational purposes. Not licensed for commercial use.

