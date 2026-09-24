---
title: "The checkout that remembered everything: debugging a ghost state bug"
excerpt: "An AI-scaffolded storefront kept charging the wrong cart totals at random. The culprit wasn't the payment provider — it was state living in two places at once."
category: Debugging
categoryFull: Debugging
categoryColor: "#C0451C"
readTime: "4 min read"
date: 2026-01-12
tags: posts
layout: post-layout.njk
---

A solo founder launched a storefront built largely with an AI scaffolding tool. Weeks after launch, customers started reporting a strange bug: on some sessions, the checkout total didn't match what was in the cart. Not always. Not on every browser. Just *sometimes* — which is the worst kind of bug.

The AI assistant had been asked to "fix" it three times. Each pass added logging, guarded the payment call, rewrote the discount calculation. The bug survived all three rounds.

## Diagnosis

Reproducing it took a while, but the pattern that finally triggered it consistently: open the store, add items, **navigate away and come back**, then check out. The totals matched on a fresh session and diverged on a returning one.

The scaffold had been generated with server-side rendering *and* a client-side store, and both kept their own copy of the cart. On a fresh visit they started in sync. On a return visit, the client store rehydrated from stale local storage while the server rebuilt the cart from the database. Checkout read from the client; pricing read from the server. Every "fix" so far had been applied to the pricing code, which was never the problem.

## The fix

- Made the server the single source of truth for cart state; the client store became a dumb cache with no business logic
- Removed the local-storage rehydration path that resurrected stale carts
- Added a checksum comparison on checkout: if client and server disagree, the server wins and the client is silently resynced
- Wrote a regression test that simulates the navigate-away-and-return session

## The lesson

When AI tools scaffold an app, they optimise for making the demo work, not for architectural consistency. Two sources of truth in a stateful app is an invisible defect — nothing crashes, everything *looks* fine, and each targeted "fix" touches symptoms instead of the seam. Bugs that survive three AI repair rounds usually aren't in the code being patched; they're in the architecture the code lives in.

---

*This case note is an illustrative composite: the scenario is representative of problems commonly found in AI-assisted codebases, but it is not a specific client engagement. Details are anonymised and simplified.*
