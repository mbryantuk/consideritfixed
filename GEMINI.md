# Consider IT Fixed Project Context

## Overview
- **Project Name:** Consider IT Fixed
- **Location:** Felpham, West Sussex
- **Mission:** To offer friendly, reliable Tech Support, Advice, and General Assistance.
- **Primary Goal:** Build an incredibly user-friendly and accessible website for users to discover services, create an account, and request assistance or quotes.

## Core Features to Implement
1. **Services Showcase:** A clear, easy-to-read section highlighting core offerings:
   - Device Setup & Migration (Computers, Phones, Tablets)
   - Maintenance & Upgrades
   - Virus & Malware Removal
   - Data Recovery & Backup Solutions
   - Home Networking & Wi-Fi Troubleshooting
   - Smart Device & Home Office Setup
   - Printer & Peripheral Support
   - Parental Controls & Cybersecurity Advice
   - Tech Tutoring & Purchasing Advice
   - Software Installation & Troubleshooting
   - Gaming Setups & Performance Optimisation
   - Homeworker Support (Home Office Setup, VPN, Video Call Stability)
   - AI Advice & Guidance (ChatGPT, Copilot, Safe Usage)
2. **User Portal & Onboarding:** 
   - Passwordless login (Magic Links) for extreme ease of use.
   - Profile Onboarding Gateway: Users must provide Name, Address, Phone, DOB (for age discounts), and select Device Types (via checkboxes) before submitting a request.
   - My Profile Page: Allow users to edit their personal information and toggle marketing communication preferences (opt-in/opt-out).
   - A dashboard for users to view their past and current requests, appointments, quotes, and invoices.
3. **Request, Quote & Invoicing System:** 
   - Users can log specific issues or requests, including their preferred **Availability** for a call or visit.
   - Interactive Notes: Customers and the Admin can leave messages on the request ticket to discuss the issue.
   - Quote Tracker: Admin can issue a quote. Customer can Accept or Reject. Admin can issue a revised quote if rejected. History of quotes is kept.
   - Invoicing: Once a job is completed, Admin can generate a final invoice marking the ticket closed. Admin can track whether it is unpaid or paid.
   - Optional: Online appointment booking integration (e.g., Calendly).
4. **Admin Panel:**
   - Secure login for the business owner.
   - A dashboard to view, manage, and respond to all customer tickets, requests, and bookings.
   - Deep dive ticket view allowing the Admin to see the customer's full profile details (Phone, Address, Devices) alongside the issue.
5. **Trust & Credibility Building:**
   - **About Me/Us Page:** A friendly profile highlighting local roots, experience, and why customers should trust Consider IT Fixed.
   - **Testimonials Section:** Showcase positive feedback from local clients.
   - **FAQ / Knowledge Base:** Answers to common questions (call-out fees, service areas).
   - **Pricing Guide:** Transparent outline of hourly rates or standard fees.
   - **Areas Covered:** Explicit visual component listing service areas (Felpham, Bognor Regis, etc.) to boost local presence.
6. **Engagement & Support Tools:**
   - **Minimalist Language Switcher:** A sleek flag-based dropdown in the navigation utilizing Google Translate for automatic multi-language support (English, Polish, Romanian, Ukrainian, Lithuanian, Spanish, French) without clutter.
   - **Remote Support Portal:** Quick-access page for downloading remote support tools.
   - **Tech Tips Blog:** Share local tech alerts and tips (boosts local SEO).
   - **Live Chat / WhatsApp Integration:** Widget for immediate communication.
   - **Social Media (SOME) Integration:** Links to local community platforms (e.g., Nextdoor, Facebook local groups), Google My Business reviews, and easy sharing of Tech Tips to social platforms.

## Design & Development Principles
- **Extreme Accessibility (a11y):** The target audience may not be highly technical. Strict adherence to WCAG. Use `aria-hidden` and `focusable=false` on decorative elements.
- **Intuitive UX:** Frictionless journeys. Avoid technical jargon; use plain, reassuring English.
- **Responsive & Cross-Device:** The application must work flawlessly on Mobile, Tablet, Desktop, and any other device that users might possibly use to access it (e.g., varied screen sizes, older browsers, Smart TVs).
- **Trust and Local Focus:** Emphasize Felpham, West Sussex. Avoid generic, "scammy" templates.
- **SEO Optimization:** Local SEO focus. Proper semantic HTML, meta tags, descriptive headings, alt text, and explicit OpenGraph tags tailored for West Sussex search queries.

## Technical Stack & Guidelines
- **Framework:** Next.js (React) App Router for SSR, fast performance, and SEO.
- **Authentication:** NextAuth.js with Passwordless Login (Magic Links via Email) to reduce login friction for non-technical users.
- **Database:** SQLite with Prisma ORM for a simple, self-contained, and reliable data layer.
- **Styling:** Custom Vanilla CSS (CSS Modules) to ensure a bespoke, highly accessible, and non-generic design.
- **Code Quality:** Prioritize semantic HTML, clean code, and maintainability.
- **Branding:** Refer to `BRANDING.md` for tone, color, typography, and styling guidelines.
- **Docker Deployment:** Project is fully containerized with a `Dockerfile` and `docker-compose.yml` to support standalone environments with external volumes for persistent SQLite storage.