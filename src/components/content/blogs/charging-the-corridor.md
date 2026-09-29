---
title: "Charging the Corridor: Auditing Texas's $328M EV Charger Buildout With Its Own Data"
date: "2026-09-28"
author: "Saurav Rijal"
summary: "Texas committed $328.3 million in public money to 474 EV fast-charging stations. I joined TxDOT's open station records with traffic counts and Census data to ask one question: does the money follow demand, or just a template? It follows the template."
tags: ["research", "data-science", "energy"]
coverImage: "/blog-covers/poster-nevi.jpg"
featured: true
---

# Charging the Corridor: Auditing Texas's $328M EV Charger Buildout With Its Own Data

Texas has committed $328.3 million in public funds to deploy 474 fast-charging stations for electric vehicles under the National Electric Vehicle Infrastructure (NEVI) program. I live in San Marcos, right on the I-35 corridor where a lot of these stations are supposed to go. What got under my skin was a simple observation from TxDOT's own open records: only 21 of the 474 stations were open to drivers, and 69.2% were still in planning. That gap between committed money and actual chargers made me want to audit the whole thing with the program's own data. So I did.

![Conference poster: Charging the Corridor, a data-science audit of Texas EV charging deployment](/blog-covers/poster-nevi.jpg)
*The full poster: Charging the Corridor, a data-science audit of the Texas NEVI buildout.*

## Why this question

The NEVI program is anchored by an engineering rule: stations no more than 50 miles apart on designated corridors. Texas, the largest recipient state, administers its share through TxDOT. Four questions kept coming back to me: does public money follow traffic demand or a construction template? How concentrated is the market capturing these funds? Can you predict where the private market simply fails to bid? And does the planned network on I-35 actually satisfy the 50-mile rule? Those four questions became the skeleton of the analysis.

## The data I pulled together

Three public data sources, joined into one reproducible pipeline:

- **TxDOT's open NEVI station records**: 474 records, retrieved September 28, 2026, with per-station grant dollars, port counts, status labels, and applicant names.
- **TxDOT traffic counts (AADT)**: about 97,000 count stations. Each site got matched to its nearest count station, with a median match distance of 0.12 miles.
- **Census county populations**: Vintage 2024 estimates, keyed by FIPS codes from the FCC Census Block API.

The joining alone surfaced a data-quality surprise: the published `NEVI_ID` field is not a record key. 168 Phase II planning-area records carry no ID at all, and six IDs are each shared by two records in different towns. So every join runs on the row-level OBJECTID instead. This is the kind of thing you only learn by touching the data yourself.

## What the numbers said

**Funding follows the template, not traffic.** An OLS regression of log grant on log traffic, log population, port count, and corridor indicators (n = 474, R² = 0.29, robust standard errors) is blunt: port count dominates (each additional port associates with roughly 11% higher grant, p < 0.001), while nearby traffic (p = 0.82) and county population (p = 0.89) have no measurable association with grant size. Plot grant against traffic on a log-log scale and you get a flat line: grants cluster in horizontal bands set by the template. High-traffic locations get no funding premium. The program is cost-responsive, not demand-responsive.

**The market is concentrated, and the largest underserved segment is an absence.** Universal EV LLC alone holds 148 stations (31.2%) and $92.6 million (28.2%) of committed funds. The top four applicants control 62.7%. The Herfindahl-Hirschman Index is 1339: below the 1500 threshold for moderate concentration, but with a twist. The second-largest "applicant" by dollars is *No Applications Received*: $49.0 million across 89 rural areas where TxDOT invited private operators and nobody bid. The program's biggest underserved segment isn't a firm. It's a market absence.

**The no-bid problem is predictable, and it comes down to people, not cars.** All 89 no-bid records sit in the County Seats track, where the bid rate is only 39% across 146 rural areas. A random forest on three structural features (traffic, population, remoteness) predicts bid versus no-bid with AUC 0.64 under repeated stratified 5-fold cross-validation, and a logistic regression on the same features reaches 0.69. The mechanism is plain: county population dominates (odds ratio 1.91, p = 0.003), while nearby traffic adds nothing once population is controlled (odds ratio 1.21, p = 0.33). Bidders respond more to population than to traffic. Bid success rises monotonically with county-population quartile, from 18.9% in the most rural quartile to 54.1% in the most urban. The market withdraws exactly where traffic and people are thinnest.

**Four station archetypes, one of them a warning.** K-means (k = 4) on standardized station features recovers small-town corridor stations (103), eight-port metro hubs (69), urban infill in the densest locations with only four ports each (204), and rural outposts (98) at 300 kW median, the only cluster whose median bid status is zero. The segmentation independently rediscovers the no-bid problem.

**The I-35 corridor passes the engineering test on paper.** Approximating I-35 with a 16-waypoint polyline and projecting 111 stations onto it, the mean gap is 4.3 miles and the maximum gap is 34.0 miles in Webb County. No gap exceeds the 50-mile rule. But within 25 miles of the Texas State campus, there are eight stations, and all eight remain in planning. The engineering checks out; execution speed is the binding constraint.

## What surprised me

Two things. First, the rural track delivers ports at the lowest observed public cost per port: $137,500 for County Seats versus $176,500 and $154,194 for the other tracks (ANOVA F = 26.8, p < 0.0001). Where the market fails, public substitution is actually cheapest per port. That's a policy gift hiding inside a market failure.

Second, at full buildout, the awarded network represents 315 to 443 MW of nameplate charging capacity: new, large, and uniquely shiftable load. Unlike a factory, EV charging can move in time. With managed-charging tariffs and on-site storage, stations can absorb midday solar surplus and avoid evening peaks. Texas leads the nation in wind generation, and pairing the charging buildout with flexibility turns transport electrification into a grid asset rather than a burden.

## The honest limits

I want to be straight about what this analysis can and can't say. Nearly 70% of records are still in planning, so the built network may differ from the awarded one. The I-35 gaps are along-track estimates from an approximate polyline, not road-network distances. The funding regression is associational: it shows grants don't track demand, not why TxDOT set the template it did. The no-bid model is modest (AUC 0.64) and predicts where the market fails, not the mechanism. And nameplate capacity is a theoretical simultaneous maximum, not expected load.

## Where this lives

I wrote the full analysis up as an IEEE-format paper with a reproducible pipeline, and made a conference poster for it (embedded above). It's independent research, not published or peer-reviewed anywhere. The headline finding still holds: the chargers are coming, and whether they become inflexible load or flexible grid assets is the open question for the energy transition.
