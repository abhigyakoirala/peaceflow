# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Native mobile application for both iOS and Android.

## Stack

Confirmed by the user: Expo / React Native with TypeScript. iOS and Android development builds, plus a browser preview.

## Users

Teenagers and adults, including people unfamiliar with technology. The interface should be simple across age demographics.

## Product Purpose

Paceflow brings period tracking, women's health education, private journaling, and curated experiences from women worldwide into one accessible mobile application.

## Capabilities and Constraints

- Smart Period Tracker.
- Women's Health Education Hub: an Instagram/Reels-inspired continuous feed with 50 original short posts, topic filters, bookmarks, and source links. Posts repeat after the finite collection and are labeled as revisits.
- Private Journal.
- Women Around the World: five influential women with researched profiles and source links: Malala Yousafzai, Wangari Maathai, Katherine Johnson, Tu Youyou, and Marie Curie.
- Personal records are device-only, with no account. No account-based backup or synchronization.
- A bottom navigation bar inspired by the supplied reference, plus a hamburger menu.
- Implementation authorized after the planning conversation. Track work in Git.

## Brand Commitments

- Name: paceflow (corrected by the user on October 2, 2026); supplied wordmark uses lowercase lettering.
- Tagline transcribed from the supplied logo: “your cycle. your power. your pace.”
- Use the supplied logo's pink as the primary brand color.
- Preserve a simple, approachable experience.

## Evidence on Hand

The user supplied a replacement logo and corrected wordmark on October 2, 2026. The cleaned logo is stored in `assets/paceflow-icon.png` with an opaque pale-pink background replacing the original black corners. The logo is used in the native icon, favicon, header and welcome screen. Preserve the existing native identifiers, Expo slug, repository URL and local-storage keys so branding changes do not disconnect installed users from their records. Educational summaries link to NHS, WHO, CDC, and FDA. Influential-women summaries link to Nobel Prize and NASA. No independent clinical review has been completed. Profiles use decorative initials, not unlicensed photographs.

## Product Principles

- Keep everyday tasks easy to find and complete.
- Use familiar language and clearly labeled navigation.
- Keep personal records on the user's device without requiring an account.
- Support both tracking and reading without making health-data entry a prerequisite for reading.

## Accessibility & Inclusion

Design for teenagers and adults with different levels of technical confidence. Proposed requirements include scalable text, screen-reader support, large touch targets, and readable contrast.

## Open Decisions

- Exact minimum age, initial launch countries, and languages.
- Minimum supported operating-system versions and real-device verification before release.
- Professional review and ongoing editorial ownership of educational content.
- Editorial content currently ships with the application and is available offline; updates ship through app releases.
- Manual export/transfer: not yet approved; no cloud backup planned.
- Native encrypted storage and backup/transfer exclusions are implemented; real-device verification remains a release requirement. Browser preview uses unencrypted localStorage and explicitly asks for sample information only.
- Prediction uses the median of up to six recent start-to-start intervals after three recorded periods, displays the observed interval range, and suppresses estimates when intervals fall outside a conservative 15–90 day algorithm guardrail. This is not a clinical definition of normal. Never rolls a missed period forward or predicts ovulation.
