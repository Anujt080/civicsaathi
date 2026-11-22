# CivicSaathi (सिविक साथी)

> **Citizen Guidance Platform for Indian Public Services**  
> Demystifying government service procedures, exploring public schemes, verifying document readiness, and eliminating counter friction for Indian citizens.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Overview

Every day, millions of Indian citizens visit government facilitation centers—such as **Aadhaar Seva Kendras (ASK)**, **Passport Seva Kendras (PSK)**, **Regional Transport Offices (RTO)**, and **Lok Seva Kendras (LSK)**—only to be turned away because of subtle documentation issues:

1. **Name spelling discrepancies**: Initials or minor character mismatches between identity and address proofs.
2. **Missing statutory proofs**: Missing mandatory date of birth certificates or submitting unaccepted proofs.
3. **Outdated utility proofs**: Submitting electricity or water bills older than the mandatory 3-month statutory window.
4. **Procedural confusion**: Unclear distinctions between services that can be completed online versus those requiring physical biometric counter capture.

**CivicSaathi (सिविक साथी)** is an independent, citizen-first civic-tech platform engineered to solve counter confusion before citizens leave their homes.

---

## 🚀 Features & Capabilities

### 1. ✨ NEW: Civic Services Explorer (`#services`)
A comprehensive, responsive directory for discovering and understanding Central and State public services across India:
- **What It Does**: Provides an interactive, categorized catalog of government services, outlining who qualifies to apply, statutory fee schedules, processing turnarounds, acceptable proof lists, and step-by-step submission workflows.
- **Search & Filter Functionality**:
  - **Prominent Live Search**: Real-time keyword filtering across service names, Hindi transliterations, administrative departments, description summaries, search tags, and statutory proof requirements.
  - **8 Standardized Civic Categories**:
    1. **Identity & Documents**: Aadhaar Enrolment, Aadhaar Biometric Updates, PAN Card Allotment/Correction, Passport Seva, Domicile/Residence, Caste Certificates (SC/ST/OBC).
    2. **Education**: National Scholarship Portal (NSP Post-Matric & Merit), Right to Education (RTE) 25% Free School Admission, PM-eVIDYA Digital Education.
    3. **Health**: Ayushman Bharat PM-JAY (₹5 Lakh Cashless Cover), PM Bhartiya Janaushadhi (Generic Medicines), Mother & Child Tracking (MCP Card).
    4. **Government Schemes**: PM Kisan Samman Nidhi (₹6,000/yr Income Support), National Social Assistance Pensions (IGNOAPS / Widow / Disability), PM Suraksha Bima Yojana.
    5. **Transport**: Driving Licence (Learner's & Permanent DL via Parivahan), Vehicle RC Ownership Transfer, High Security Registration Plates (HSRP).
    6. **Housing**: Pradhan Mantri Awas Yojana - Urban (PMAY-U), PMAY - Gramin (PMAY-G Rural Housing), Property Mutation & e-Khata Transfer.
    7. **Employment**: National Career Service (NCS Job Seeker ID), PM Employment Generation Programme (PMEGP Credit Subsidy), Mahatma Gandhi NREGA Job Cards.
    8. **Utilities**: PM Surya Ghar Muft Bijli Yojana (Rooftop Solar Subsidy up to ₹78,000), PM Ujjwala Yojana 2.0 (Free LPG Connection), Jal Jeevan Mission (Har Ghar Jal).
  - **Dynamic Counters & Active Filter Badges**: Real-time counter of available services per category with 1-click filter reset.
  - **Clean Empty States**: Informative zero-result screens featuring suggested search terms and 1-tap filter reset.
- **Dedicated Service Details View**:
  - Clicking **"View Details"** opens a dedicated modal providing:
    - **Service Name & Department**: Clear authority attribution.
    - **Detailed Description**: Full procedural overview and scope.
    - **Who Can Apply**: Explicit eligibility checklists and qualification criteria.
    - **Required Documents**: Categorized into **POI**, **POA**, **DOB**, and **POR** with exhaustive lists of accepted proofs.
    - **Basic Application Steps**: Numbered chronological guide from application initiation to document delivery.
    - **Important Information**: Critical statutory warnings, time limits, and regulatory caveats.
    - **Clear Action CTAs**: Direct **"Start Application"** button opening the official government portal (`uidai.gov.in`, `passportindia.gov.in`, `parivahan.gov.in`, `beneficiary.nha.gov.in`, etc.) and a secondary **"Verify Readiness First"** link seamlessly transferring context into the Document Readiness Checker.
- **Structured Sample-Data Architecture**:
  - Maintained in `src/data/servicesData.ts` adhering to the strongly-typed `CivicService` interface (`src/types/index.ts`).
  - Decoupled from presentation components so it can be seamlessly backed by an external REST API or database (e.g. Supabase / PostgreSQL) in future releases without UI refactoring.

### 2. Interactive Document Readiness & Discrepancy Verifier (`#readiness-checker`)
A pre-counter scrutiny engine running entirely client-side with zero data storage:
- **Service-Aware Rule Loading**: Automatically loads statutory document requirements based on the selected service.
- **Token-Level Name Consistency Analysis**:
  - `EXACT`: Letter-for-letter match across application records and physical cards.
  - `PERMUTATION`: Flags first/last name sequence variations (e.g., *"Rahul Sharma"* vs *"Sharma Rahul"*).
  - `PARTIAL / INITIAL`: Identifies abbreviations (e.g., *"R. Sharma"*) and alerts citizens to carry secondary photo ID.
  - `MISMATCH`: Detects critical spelling discrepancies that result in counter rejection.
- **Statutory Age & Eligibility Checks**: Validates applicant date of birth against statutory age limits (e.g. 18+ for Driving Licence, 60+ for Old Age Pension).
- **Utility Bill Currency Verification**: Automatically checks whether electricity/water bills meet the 3-month recency requirement.
- **Counter Success Scorecard (0–100%)**: Displays real-time pass/fail indicators, passed checks counter, and actionable advice for every detected discrepancy.
- **1-Click Test Scenarios**: Instant demo buttons to test:
  - *Scenario A*: Counter Ready (Full Match)
  - *Scenario B*: Advisory Warning (Abbreviated Initial)
  - *Scenario C*: Action Required (Name Mismatch & Expired POA)
- **Printable Civic Readiness Slip**: One-click print/export tool allowing citizens to print a physical preparation summary slip before visiting the counter.

### 3. Modern Civic-Tech Landing Page & Architecture
- **Indian Civic Visual Identity**: Designed with clean typography, responsive layouts, and Indian civic color accents (Navy, Royal Blue, Saffron, Emerald).
- **Persistent Theme Switching**: Seamless toggle between Light Mode and AMOLED Dark Mode, persisted in `localStorage`.
- **Mobile-First Responsive Layout**: Optimized navigation with hamburger drawer for mobile devices and clean desktop viewports.

### 4. Live Civic Bulletins & Procedural Advisories
- Interactive ticker highlighting critical government deadlines and procedural rules (UIDAI free re-validation drives, PAN-Aadhaar linking guidelines, PSK appointment mandates, contactless LL tests).

### 5. Authorized Seva Kendras Directory
- Directory of facilitation centers across districts with operational schedules, toll-free helpline numbers (1947, 1800-258-1800), and one-tap Google Maps directions.

### 6. The 3-Step Civic Journey
- Clear guidance educating citizens through:
  1. *Know Requirements Upfront*
  2. *Pre-Submission Self-Check*
  3. *Submit First-Time-Right*

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) (Functional Components, Hooks) |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) (Strict Mode) |
| **Build Tool & Bundler** | [Vite 5](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) with PostCSS & Autoprefixer |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | Inter (Google Fonts) & System Sans |

---

## 💻 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anujt080/civicsaathi.git
   cd civicsaathi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 📜 Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on `http://localhost:5173` |
| `npm run build` | Compiles TypeScript (`tsc`) and builds optimized production assets into `dist/` |
| `npm run preview` | Starts local HTTP server previewing the compiled `dist/` production bundle |

---

## 📁 Project Structure

```
CivicSaathi/
├── .gitignore                          # Git ignored files (node_modules, dist, .env)
├── index.html                          # HTML entrypoint with theme pre-render script
├── package.json                        # Dependencies and npm scripts
├── postcss.config.js                   # PostCSS plugins (Tailwind, Autoprefixer)
├── tailwind.config.js                  # Tailwind custom colors, typography & theme
├── tsconfig.json                       # TypeScript compiler settings
├── vite.config.ts                      # Vite bundler configuration
├── public/                             # Static assets
│   ├── favicon.svg                     # CivicSaathi favicon
│   ├── hero-banner.png                 # Civic illustration banner
│   ├── hero-civic-bg.svg               # Vector background graphic
│   └── logo.png                        # CivicSaathi emblem mark
└── src/                                # Application source code
    ├── main.tsx                        # React DOM root entrypoint
    ├── App.tsx                         # Main page layout & state orchestration
    ├── index.css                       # Tailwind directives & custom utilities
    ├── types/                          # Type definitions
    │   └── index.ts                    # Service, Kendra, Alert, and Checker interfaces
    ├── data/                           # Curated Indian civic datasets
    │   ├── servicesData.ts             # 27+ Central & state government services catalog
    │   ├── alertsData.ts               # Real-time procedural civic bulletins
    │   └── kendrasData.ts              # Facilitation center directories & schedules
    ├── utils/                          # Business & verification logic
    │   └── verifierEngine.ts           # Token matching, age verification & readiness scoring
    └── components/                     # Componentized UI modules
        ├── BrandLogo.tsx               # Logo emblem & CivicSaathi wordmark
        ├── Navbar.tsx                  # Top navigation bar with theme switcher
        ├── Hero.tsx                    # Hero section with live search & shortcuts
        ├── CivicAlertsMarquee.tsx      # Rotating advisory bulletin carousel
        ├── ServicesExplorer.tsx        # Civic Services Explorer with search & category filters
        ├── ServiceCategoryFilter.tsx   # Reusable 8-category filter component with counters
        ├── ServiceCard.tsx             # Service preview card with icons & metadata
        ├── ServiceIcon.tsx             # Typed civic icon mapper for services & categories
        ├── ServiceModal.tsx            # Comprehensive document checklist & detail modal
        ├── ServicesSection.tsx         # Forwarder wrapper for ServicesExplorer
        ├── ReadinessChecker.tsx        # Interactive pre-counter verification tool
        ├── HowItWorks.tsx              # 3-step citizen journey breakdown
        ├── KendrasSection.tsx          # Kendra & office locator directory
        ├── PillarsSection.tsx          # Trust & transparency pillars
        ├── FaqSection.tsx              # Citizen FAQ accordion
        └── Footer.tsx                  # National directory, helplines & legal disclaimer
```

---

## ⚖️ Non-Governmental Transparency Notice

> **Important Civic Notice:**  
> CivicSaathi is an independent, non-commercial civic-tech guidance platform. It is **not** an official government agency and does not issue identity certificates, approve statutory applications, or collect government fees. Always verify statutory rules and pay statutory fees directly through official government portals or at authorized facilitation counters.
