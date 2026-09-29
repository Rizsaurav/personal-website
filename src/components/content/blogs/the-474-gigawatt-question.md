---
title: "The 474-Gigawatt Question: Auditing AI Data Center Load in the ERCOT Queue"
date: "2026-09-28"
author: "Saurav Rijal"
summary: "ERCOT reported about 474 GW of large-load requests, roughly 90% of it data centers. Headlines read that as impending demand. I rebuilt the number from primary ERCOT documents and ran it through a probabilistic model: the honest answer is a 63.4 GW mean, not 474."
tags: ["research", "data-science", "energy"]
coverImage: "/blog-covers/poster-ercot.svg"
---

# The 474-Gigawatt Question: Auditing AI Data Center Load in the ERCOT Queue

In July 2026, ERCOT told the Texas Senate Committee on Business and Commerce that it was tracking approximately 474 gigawatts of large-load interconnection requests, about 90% of it attributed to data centers. Days earlier, Texas's actual summer peak had been 91,134 MW. So the headline number was roughly five times the largest load the grid had ever served. Headlines routinely presented the queue as impending demand, and that bothered me, because a queue is not demand. A queue is a request inventory, and only a fraction of requests ever survive the study, approval, and construction stages. I wanted to know what the number actually means. So I audited it, using ERCOT's own documents and nothing else.

![Conference poster: The 474-Gigawatt Question, auditing AI data center load in the ERCOT queue](/blog-covers/poster-ercot.svg)
*The full poster: The 474-Gigawatt Question, auditing AI data center load in the ERCOT interconnection queue.*

## Why this question

Four sub-questions drove the work. How fast did the queue grow, and is the growth really exponential? What share of the queue has actually been built? How did ERCOT's own long-run demand forecasts respond to the AI-load wave: gradually, or with a structural break? And what is a defensible statistical distribution for the load that could realistically materialize? Every number in the analysis comes from primary sources (ERCOT board decks, legislative testimony decks, six Capacity, Demand and Reserves report vintages, official peak-demand records), extracted by a numbered, rerunnable pipeline whose assertion scripts exit nonzero if any value drifts from its source document. Anything I couldn't verify against a primary document was excluded.

## The growth: real, exponential, and almost entirely AI

Five verified queue snapshots trace the trajectory: 63 GW in December 2024, 137 GW on April 28, 2025, 226 GW on November 18, 2025, 410 GW on March 26, 2026, and about 474 GW on July 29, 2026. A log-linear fit gives a growth rate of 1.22 per year: doubling every 6.8 months, with R² = 0.97. The data-center share rose from 73% to about 90% over the same period, so the exponential trajectory is almost entirely an AI-infrastructure story. That part of the headline is true. The requests are real and they are compounding.

```stat
474 GW | large-load requests tracked by ERCOT, July 2026
6.8 mo | queue doubling time (R² = 0.97)
~90% | data-center share of the queue
```

## The funnel: only 1.24% is energized

Here is where the headline falls apart. Break the 474.7 GW June-2026 queue by study status and the dominant stage is "no studies submitted": 284.3 GW, or 59.9% of the queue. Only 5.9 GW, 1.24%, is observed energized. Approved-to-energize plus observed totals 1.92%. The Gini coefficient across stage megawatts is 0.639: extreme concentration in the unstudied tail.

ERCOT's own utilization data corroborate the funnel. In the March 2026 status update, 9,042 MW was approved to energize while only 3,883 MW was observed at non-simultaneous peak (42.9%). Across the verified utilization rows, observed load at peak runs 43 to 54% of approved megawatts. There is a persistent double discount: approved is not built, and built is not coincident.

> Approved is not built, and built is not coincident.

## Forecast whiplash: the models saw it too

Six vintages of ERCOT's Capacity, Demand and Reserves reports show what happened to the official forecasts when the AI wave hit. For the 2026 summer peak, successive vintages forecast 82,949 (May 2017), 88,057 (December 2021), 89,655 (May 2024), 108,391 (revised February 2025), and 95,419 MW (May 2025), against an observed 91,134 MW. The revised February 2025 vintage, the first to absorb the AI-load wave, overshot by 17,257 MW (15.9% too high). The May 2025 vintage then revised sharply downward. For 2030, the May 2025 vintage projects 141,704 MW, up 46% from the May 2024 vintage's 95,670 MW for the same target year. The long-run forecast didn't merely grow; it was rewritten.

I tested for a structural break with a Chow mean-shift test on the 2026-target forecasts, splitting pre-AI-boom vintages from AI-era vintages: F = 2.77, p = 0.195. It doesn't reject forecast stability at 5%, but with only five vintages the test lacks power, so I treated it as descriptive. The honest reading: the "break" is a single-vintage spike followed by a partial correction, not a clean regime shift. The forecasters panicked and then walked it back.

## The Monte Carlo: how much load actually realizes?

I ran 10,000 seeded Monte Carlo draws over the funnel, giving each stage a Beta-distributed conversion to realized load with documented assumed priors (for example, Beta(5,95) for "no studies submitted" and Beta(99,1) for "observed energized"). The result: realized load with mean 63.4 GW (sd 8.0), median 62.9 GW, and a 90% interval of 51.4 to 77.5 GW. I want to be explicit about what this is: a model output conditional on its assumed priors, not an ERCOT measurement. But its value is comparative. Even under generous priors for the advanced stages, realized load lands an order of magnitude below the headline queue, because 88% of requests sit in the two least-advanced stages.

```stat
63.4 GW | Monte Carlo mean for realized load
1.24% | of the queue observed energized
51–78 GW | 90% interval for realized load
```

## What surprised me

The vintage whiplash did. Before 2022, ERCOT's forecast errors were modest, within about 3%. Then the sign flipped: older vintages under-predicted as Texas load surged, and then the February 2025 vintage over-predicted 2026 by 15.9%, the largest absolute error in the sample. Watching a forecaster swing from "we didn't see it coming" to "we overshot by 17 gigawatts" within one vintage cycle is a live demonstration of how hard this problem is. Also striking: ERCOT's decks have an apparent year typo labeling 2026 data as "2025." I flagged it rather than silently correcting it, because provenance discipline is the whole point of the exercise.

## The honest limits

A few things I won't oversell. The Monte Carlo output depends on assumed stage-conversion priors that are my modeling choices, not ERCOT data. The Chow test is descriptive with n = 5, not dispositive. Secondary or unverified values (a June-2026 438 GW snapshot, a June-2026 utilization row, press-reported peaks, and forecast-revision claims found only in press) were excluded from all results, so if anything this audit is conservative. And the 91,134 MW peak figure was marked preliminary by ERCOT at the time.

## Where this lives

I wrote the full audit up as an IEEE-format paper with a fully reproducible, assertion-gated pipeline, and made a conference poster for it (embedded above). It's independent research, not published or peer-reviewed anywhere. The takeaway I'd put in front of any grid planner: the queue is a request inventory, not a load commitment. Treating it as demand overstates the load by roughly an order of magnitude. Plan accordingly.
