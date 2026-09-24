---
title: "Rewriting the 3,000-line file nobody could maintain"
excerpt: "An AI-built booking app worked fine until it needed a new feature. Then the file structure itself became the blocker — here's how it got untangled."
category: Refactoring
categoryFull: Refactoring
categoryColor: "#C0451C"
readTime: "6 min read"
date: 2026-03-02
tags: cases
layout: case-layout.njk
---

A small agency delivered a booking app to their client, assembled with AI assistance under deadline pressure. It worked. The client was happy. Then, two months later, the client wanted multi-location support — and the agency discovered they were afraid of their own codebase.

The core booking logic lived in a handful of enormous files. The largest was over 3,000 lines. None of the original developers wanted to touch it; the AI assistant made changes confidently but had started introducing regressions, because even the model couldn't hold the whole file's implicit structure in context anymore.

## Diagnosis

Reading through the file, the problem wasn't the code inside it — most functions were individually fine. The problem was the *shape*:

- Booking creation, payment handling, calendar rendering and email notifications all lived interleaved in one module
- Sixteen functions shared mutable state through module-level variables
- No tests existed, so every change was a leap of faith

The AI had optimised for the shortest path to a working feature, gluing new logic wherever it fit, which is exactly how you get a 3,000-line file.

## The fix

A staged refactor, behaviour-preserving at every step:

1. **Characterised current behaviour** — wrote characterization tests around the booking flow first, so regressions would be caught immediately (the tests were themselves AI-assisted, reviewed by a human)
2. **Severed the shared state** — module-level variables became an explicit context object passed through the flow, making data flow visible
3. **Extracted domains** — the monolith split into `booking`, `payments`, `calendar`, and `notifications` modules with defined interfaces
4. **Made the seams testable** — each module got focused unit tests; the characterisation tests stayed green throughout

Six days of work, zero behaviour change, and the multi-location feature — previously estimated at "three weeks, high risk" — landed in three days on top of the new structure.

## The lesson

Unmaintainable AI code is usually *working* code. It doesn't look like a problem until the first change request, and then it looks like an emergency. The discipline that pays off isn't rewriting what exists — it's pinning behaviour with tests before you touch anything, then changing the shape without changing the behaviour. After that, the AI assistant becomes useful again: with clear module boundaries, it stops guessing.

---

*This case note is an illustrative composite: the scenario is representative of problems commonly found in AI-assisted codebases, but it is not a specific client engagement. Details are anonymised and simplified.*
