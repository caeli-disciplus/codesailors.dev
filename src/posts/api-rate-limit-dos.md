---
title: "Why the AI kept crashing the API it was built on"
excerpt: "A prototype SaaS was getting throttled into oblivion by its own frontend. The fix was a caching layer and a batch endpoint — not more retries."
category: Performance
categoryFull: Performance
categoryColor: "#C0451C"
readTime: "5 min read"
date: 2026-02-03
tags: posts
layout: post-layout.njk
---

A two-person startup had a working SaaS dashboard they were proud of — built in weeks with an AI coding assistant doing most of the typing. Then real users arrived, and the app fell over. Pages took eight seconds to load. The API provider's dashboard showed request volumes that made no sense: thousands of calls per user session, quickly hitting their rate limits, and their monthly bill was climbing.

## Diagnosis

The generated frontend treated the API as a chat partner rather than a scarce resource. Every component that needed data fetched it independently, with no shared cache:

- The dashboard rendered six widgets; each made its own call to the same endpoint on mount
- Loading states triggered *refetches* — optimistic retry logic had been pasted into every data hook, so one flaky response cascaded into three or four duplicate calls
- Typeahead search called the API on every keystroke, with no debounce

A single user session could fire 200+ API calls where 20 would do. Multiply by real traffic and the app was effectively DDoSing its own backend.

## The fix

- Introduced a request cache at the data layer: identical in-flight requests are deduplicated, and responses are reused for their TTL instead of refetched
- Built one batched dashboard endpoint so the six widgets hydrate from a single call
- Debounced the typeahead (250ms) and made results cancel-on-new-request so late responses can't overwrite fresh ones
- Removed the blanket retry loops; failures now surface to the UI immediately with a manual "retry" affordance

Result: a typical session went from ~200 API calls to ~15, page loads dropped from eight seconds to under one, and the client stopped hitting rate limits entirely. The projected API bill fell by roughly 80%.

## The lesson

AI-generated code tends to be locally correct and globally wasteful. Each component's fetching logic is reasonable in isolation; nobody — human or model — ever looked at the *aggregate* traffic pattern. Performance problems in AI-built apps are rarely one slow query; they're many reasonable-looking decisions that multiply. The profile always comes before the fix.

---

*This case note is an illustrative composite: the scenario is representative of problems commonly found in AI-assisted codebases, but it is not a specific client engagement. Details are anonymised and simplified.*
