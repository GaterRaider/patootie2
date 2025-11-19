# Project TODO

## Core Features
- [x] Bilingual support (English/Korean) with language detection
- [x] IP-based geolocation for South Korea (auto-load Korean)
- [x] Manual language toggle in header with localStorage persistence
- [x] Dark/light theme based on device preference (default to light)
- [x] Responsive mobile-first design

## Page Sections
- [x] Header with navigation and language toggle
- [x] Hero section with Patootie introduction
- [x] Service categories (4 clickable cards)
- [x] Process section (3-step workflow)
- [x] Contact form with validation and anti-spam
- [x] About Patootie section
- [x] Footer with Impressum and Privacy Policy

## Contact Form Features
- [x] All required fields with proper validation
- [x] Service dropdown auto-filled from card clicks
- [x] Country dropdown with all countries
- [x] Mandatory checkbox validation
- [x] Honeypot anti-spam field
- [x] Rate limiting (same email + IP)
- [x] Email automation (confirmation + admin notification)
- [x] Success message/redirect after submission

## Backend Implementation
- [x] Database schema for form submissions
- [x] tRPC procedures for form handling
- [x] Email sending functionality
- [x] IP geolocation integration
- [x] Rate limiting middleware

## Design & Styling
- [x] Modern minimalist design
- [x] Clean typography (Inter or similar)
- [x] Soft shadows and rounded corners
- [x] Icons for services and steps
- [x] Accessible color contrast
- [x] Smooth scrolling navigation

## New Enhancements
- [x] Add subtle theme toggle button for manual dark/light mode switching
- [x] Enhance header design with modern visual elements
- [x] Add glassmorphism effect to header
- [x] Include logo/icon next to site title
- [x] Add colored accent bar at top
- [x] Enhance navigation with hover effects
- [x] Add prominent CTA button in header

## Mobile Header Fixes
- [x] Fix long site title wrapping on mobile (use shorter version or logo only)
- [x] Fix language toggle and theme toggle overlapping on mobile
- [x] Reorganize header controls for better mobile layout

## Navigation Enhancement
- [x] Add enhanced hover animations to navigation links
- [x] Improve transition smoothness and visual feedback

## Website Improvements
- [x] Create dedicated Privacy Policy page with routing
- [x] Update privacy policy content (English and Korean)
- [x] Restructure footer with better layout and design
- [x] Replace placeholder portrait with professional photo
- [x] Reduce excessive spacing between sections

## Services Section Redesign
- [x] Redesign services section with modern card-based layout (2x2 desktop, 2 col tablet, stacked mobile)
- [x] Update all service descriptions with detailed, fully written-out text
- [x] Add enhanced hover effects (elevation, shadow, icon animation, prominent CTA)
- [x] Add CTA buttons to each service card
- [x] Implement click-to-scroll with service pre-fill in contact form
- [x] Add optional accordion expansion for detailed service information
- [x] Ensure professional, trust-oriented design with soft neutral tones

## UI Refinements
- [x] Move service card titles inline with icons for compact layout
- [x] Auto-expand "Learn more" section when clicking on card
- [x] Reduce spacing between all sections for better visual density

## Card Click Behavior Fix
- [x] Separate card click (expand only) from CTA button click (scroll to form)

## Card Toggle Behavior
- [x] Make service cards toggle between expanded/collapsed states on click

## Contact Form Redesign
- [x] Improve visual design with modern styling and better spacing
- [x] Add real-time validation feedback (checkmarks, error messages)
- [x] Add placeholder text to all dropdowns
- [x] Implement progress indicator showing form completion
- [x] Add focus states and smooth transitions
- [x] Group related fields visually (personal info, address, contact preferences)
- [x] Improve mobile form layout

## Footer Redesign
- [x] Redesign footer with clean 3-column layout
- [x] Add "About Patootie" column with short description
- [x] Add "Quick Links" column with Services, Process, About, Contact
- [x] Add "Legal" column with Privacy Policy and full Impressum
- [x] Update Impressum with actual address and contact info
- [x] Add centered copyright line at bottom
- [x] Ensure mobile stacking order: About, Quick Links, Legal
- [x] Use minimal design with soft spacing and subtle colors

## Hero Section Content Update
- [x] Update hero headline to "Your support for dealing with German authorities"
- [x] Update hero description with new text about German bureaucracy
- [x] Keep existing bullet points unchanged
- [x] Update Korean translations for headline and description

## Branding Update - Rename to Kwon EasyBureau
- [x] Update site title in header from "Help for Your Journey to Germany" to "Kwon EasyBureau"
- [x] Update mobile header name from "Patootie" to "Kwon EasyBureau"
- [x] Replace all "Patootie" mentions in hero section with "Kwon EasyBureau"
- [x] Replace all "Patootie" mentions in about section with "Kwon EasyBureau"
- [x] Replace all "Patootie" mentions in footer with "Kwon EasyBureau"
- [x] Update Korean translations with "Kwon EasyBureau" (권 이지뷰로 or keep as Kwon EasyBureau)
- [x] Update copyright line with new company name
- [x] Update all service descriptions mentioning Patootie

## Theme Toggle Simplification
- [x] Simplify theme toggle to only switch between dark and light (no system mode)
- [x] Detect device preference on initial load as default
- [x] Update ThemeContext to toggle between dark/light only

## Mobile Hamburger Menu
- [x] Add hamburger icon on left side of mobile header
- [x] Implement slide-out navigation panel for mobile
- [x] Include Services, Process, About, Contact links
- [x] Add smooth open/close animations
- [x] Close menu when clicking outside or on a link

## Mobile Menu Z-Index Fix
- [x] Fix z-index layering so mobile menu appears above all website content
- [x] Ensure overlay covers entire page

## Mobile Menu Positioning Fix (Attempt 2)
- [x] Move mobile menu outside header element to avoid z-index conflicts
- [x] Ensure menu overlays all content properly

## PostgreSQL Migration
- [x] Replace mysql2 with pg package
- [x] Update drizzle schema for PostgreSQL
- [x] Update drizzle.config.ts for PostgreSQL
- [x] Update database initialization in server/db.ts
- [x] Generate new migrations
- [x] Create deployment zip file

## Final Fixes
- [x] Clean up drizzle folder - remove all files except schema.ts
- [x] Add visible checkbox UI to privacy policy field in contact form

## Checkbox Visibility Fix
- [x] Replace Radix Checkbox component with native HTML checkbox for privacy policy field


## Latest GitHub Sync
- [x] Pull latest commit from GitHub Patootie2 repository
- [x] Sync all project files from GitHub (translations, Privacy Policy, images, etc.)
- [x] Update company branding from Kwon EasyBureau to HandokHelper throughout the site
- [x] Verify dev server running without errors after sync
- [x] All files up-to-date with GitHub latest version


## SMTP Email Configuration with Mailjet
- [x] Configure Mailjet SMTP credentials (host, port, user, pass)
- [x] Set SMTP_FROM email address (info@handokhelper.de)
- [x] Set ADMIN_EMAIL for notifications (info@handokhelper.de)
- [x] Create SMTP configuration test (email.test.ts)
- [x] Verify SMTP connection to Mailjet server
- [x] Create contact form email submission test (contact-submission.test.ts)
- [x] Test email formatting for confirmation emails
- [x] Test email formatting for admin notifications
- [x] Send test email successfully to admin inbox
- [x] Verify all email environment variables are correctly set


## MailJet API Migration (SMTP to HTTP API)
- [x] Install node-mailjet package
- [x] Update environment variables (MAILJET_API_KEY, MAILJET_SECRET_KEY, EMAIL_FROM)
- [x] Refactor email.ts to use MailJet API instead of nodemailer SMTP
- [x] Update sendConfirmationEmail function for MailJet API
- [x] Update sendAdminNotificationEmail function for MailJet API
- [x] Add error handling for MailJet API responses
- [x] Create MailJet API configuration test (mailjet-config.test.ts)
- [x] Create contact form email submission test for MailJet (contact-submission-mailjet.test.ts)
- [x] Test email sending with MailJet API (6/6 tests passed)
- [x] Verify confirmation emails work with API (317ms)
- [x] Verify admin notifications work with API (all tests passed)
- [x] Remove SMTP dependencies (nodemailer SMTP no longer used)


## Contact Form Enhancement
- [x] Add field icons (envelope, phone, map, calendar, etc.)
- [x] Implement section grouping with subtle background colors
- [x] Enhance submit button with gradient, hover effects, and loading state
- [x] Add inline validation feedback with checkmarks and error messages
- [x] Test all form improvements and ensure responsive design


## Conditional Field Visibility
- [x] Show/hide State/Province field based on country selection
- [x] Only display for USA and Canada
- [x] Test conditional logic with different country selections (12 tests, all passing)
- [x] Ensure smooth transitions and responsive design


## Form Layout Reorganization (Corrected)
- [x] Move "Describe your situation" field into Additional Information section
- [x] Keep single Additional Information box (no duplicates)
- [x] Maintain amber/yellow color scheme
- [x] Add helpful placeholder hint text starting with "Please..."
- [x] Test placeholder behavior and form layout
