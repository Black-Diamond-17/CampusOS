# CampusOS - Nigeria's Campus Super-App (MVP)

**The concept:** One offline-first app for Nigerian university students that combines the things they currently chase across WhatsApp groups, scattered PDFs and random websites: campus map with walking routes, personal timetable, campus marketplace with WhatsApp chat, events calendar, CBT exam practice with timer, and a CGPA calculator. Built for the reality of Nigerian campuses: low data, frequent power cuts, cheap Android phones.

**Why this market (evidence, Nov 2026):**
- Nigeria crossed 1.1 million tertiary admissions in the 2025-26 cycle, with ~2.5 million tertiary students; 278 universities and 841 total tertiary institutions (JAMB policy meeting, May 2026; Asquare 2024).
- Nigeria EdTech market projected at US$185-200M by end of 2026, growing 15-20%/year; 935 EdTech startups (HolonIQ 2024; EduTech Global Jan 2026).
- Proven Nigerian competitors validate each module: CampusPlug / Campus Market / Peerify (campus marketplace), Cubbes (100k+ students, 100+ African universities, timetable + past questions + events), CampusRunz (25+ campuses, marketplace + services), SyncUp (timetable + marketplace + campus map at University of Abuja).

**What this MVP does (all working, no backend, no cost):**
1. Campus map - 4 campuses (UNILAG, OAU, UI, FUNAAB) with tappable places, details, and a walking route planner (distance + minutes).
2. Timetable - add/edit/delete classes, saved on device, today's classes on home screen.
3. Marketplace - browse/filter/search seed listings, post your own item, one-tap WhatsApp chat with the seller.
4. Events - add and track campus events.
5. CBT practice - 20-question bank across 9 subjects, JAMB-style timer per question, explanations, instant scoring, full review and saved history.
6. CGPA calculator - semester GPA, overall CGPA with previous results, class-of-degree label.
7. PWA - installable on Android (Add to Home Screen), works fully offline via service worker.

**How to run:** unzip, then serve the folder: `python3 -m http.server 8000` and open http://localhost:8000 - or open index.html directly. Works on any phone browser; install it like an app.

**Honest note on the million-dollar question:** This MVP proves the concept and the code is real, but an app only becomes a business with distribution, content depth (hundreds of past questions per course), trust systems and repeat usage. The realistic path: launch on your own campus, add past questions for your department, charge vendors a small listing fee or run sponsored event slots, then expand campus by campus. No app is a guaranteed million dollars; this one has a real market behind it and costs nothing to test.

**Next steps to grow it:** backend with accounts, real past-question database per course, vendor verification, event ticket sales, push notifications.

commited by black diamond 
