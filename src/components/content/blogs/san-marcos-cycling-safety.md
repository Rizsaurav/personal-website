---
title: "Mapping Where San Marcos Fails Its Cyclists: With Data"
date: 2026-02-21
author: Saurav Rijal
summary: "Four notebooks, city GIS data, TxDOT traffic counts, and graph ML: a data-science audit that finds the ten most dangerous cycling segments in San Marcos, TX."
tags:
  - data-science
  - geospatial
  - machine-learning
  - python
featured: true
coverImage: "/blog-covers/cover-cycling-safety.jpg"
---

# Mapping Where San Marcos Fails Its Cyclists: With Data

I bike around San Marcos. Some streets feel fine; others feel like a dare. I got tired of arguing from vibes, so I did what a data person does: I built the dataset and measured it.

## Why it needed to exist

Cycling safety debates run on anecdotes: one person's scary intersection versus another's smooth commute. But cities *have* the data: GIS layers of bike facilities, routes, centerlines, lighting, sidewalks. And TxDOT publishes traffic counts. Nobody had stitched San Marcos's layers together into a single scored network, so dangerous segments stayed invisible in the aggregate.

## What it does

A four-notebook pipeline that turns raw city data into a ranked safety audit:

1. **Network skeleton & topology**: build the street graph from city GIS layers (bicycle facilities, routes, centerlines, lighting coverage, sidewalks)
2. **Probabilistic enrichment**: fuse TxDOT AADT traffic counts onto the network so every segment knows its real vehicle exposure
3. **Spatial engineering & physics**: derive features like lighting gaps, sidewalk presence, and facility discontinuity
4. **Graph intelligence & ML**: train a safety predictor over the graph and score every segment

The output: the **top 10 critical failure segments** as GeoJSON, plus an interactive Streamlit app to explore the scored network. Checkpointed CSVs at every stage, so the whole thing is reproducible.

## How I thought of it

The "a-ha" was treating streets as a graph, not a spreadsheet. Safety isn't a property of a segment in isolation, it's about *discontinuity*: the protected lane that dumps you into 45-mph traffic for 200 meters is more dangerous than a consistently mediocre road. Graph features capture that; per-segment averages don't. Once I framed it as "find the graph's failure points," the notebook sequence wrote itself.

## What I'd do next

Crash data fusion (TxDOT CRIS), time-of-day risk, and a proper before/after evaluation if the city acts on any segment. This is the project that convinced me I want to do data science that leaves the notebook.
