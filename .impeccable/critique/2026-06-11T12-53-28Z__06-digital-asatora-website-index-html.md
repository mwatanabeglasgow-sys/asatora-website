---
target: Asatora homepage (index.html)
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-06-11T12-53-28Z
slug: 06-digital-asatora-website-index-html
---
# Critique — Asatora homepage (index.html)

## Design Health: 29/40 (Good)

Nielsen heuristics: Status 3, Match 3, Control 3, Consistency 3, Error-prevention 3,
Recognition 3, Flexibility 3, Aesthetic 4, Error-recovery 2, Help 2.

## Anti-patterns verdict
Detector: overused-font (Fraunces, line 19), em-dash-overuse (6 in body), numbered-section-markers (01–06).
LLM: tiny uppercase tracked eyebrow on ~9 sections (.overline) = AI grammar; cream --paper bg + token name is the 2026 AI default (brand-committed, identity wins); brush calligraphy + real farm photography + restrained editorial spacing lift it above generic.

## Priority issues
- [P1] Small kraft-deep (#A6885A) text on cream (#F2ECE3) ≈ 2.7:1, fails AA 4.5:1 (overlines, news dates, 01/02/03). → colorize/audit
- [P1] Eyebrow on every section (9 .overline) — AI scaffold. → typeset/quieter
- [P1] Hero value proposition unclear for non-Japanese first-timer; English "what is this / what's sold" is thin above the fold. → clarify
- [P2] Em-dashes in body copy (banned voice tell). → clarify
- [P2] Numbered markers 01/02/03 + eyebrows read as scaffold. → typeset
- [P2] Fraunces is an overused display face. → typeset
- [P2] Primary commerce CTA (Add to cart) is non-functional pre-launch (drawer explains, but stress-testers hit a dead end). → harden
- [P3] Email signup has minimal validation / error recovery (heuristic 9 = 2). → harden

## Persona red flags
- Jordan (first-timer): heavy untranslated vertical Japanese; unclear what Asatora sells above the fold.
- Riley (stress): Add-to-cart leads to a "checkout opens at launch" dead end; cart count never moves.
- Casey (mobile): pinned sticky products + split hero need mobile verification; touch targets on news rows.

## Minor
- "Join the waitlist" links to the newsletter (#letter); waitlist vs newsletter mismatch.
- Em-dash arrow on news rows is decorative-only (fine) but reinforces the em-dash motif.
