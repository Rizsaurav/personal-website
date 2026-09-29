---
title: "A Brewery Dashboard That Actually Tells Stories With Data"
date: 2025-04-20
author: Saurav Rijal
summary: "A responsive React dashboard over the Open Brewery DB API — live search, filters, charts with a point of view, and deep-linked detail pages."
tags:
  - web-dev
  - react
  - data-viz
---

# A Brewery Dashboard That Actually Tells Stories With Data

Dashboards are easy to build and hard to make *interesting*. Anyone can render a table from an API. The challenge I set myself: build a dashboard where the charts have a point of view — where the visualizations tell you something you didn't know.

## Why it needed to exist

The Open Brewery DB API has thousands of breweries with types, locations, and metadata — a genuinely fun dataset. But most demo dashboards treat data as decoration: a bar chart because the tutorial had a bar chart. I wanted every chart to answer a question: where is craft beer concentrated? Which brewery types dominate which states?

## What it does

- **Live search and filtering** across the full brewery dataset
- **Multiple charts**, each telling a different story in the data — distribution by type, geography, and more
- **Detail views with dynamic routing** — click any brewery for its full profile, at its own shareable URL
- **Responsive layout** that works on a phone at an actual brewery

## How I thought of it

I started from the charts, not the table. I sketched the two stories I wanted to tell, then designed the dashboard around them — the list view exists to serve the visualizations, not the other way around. That inversion is the whole trick: decide what the data *means* first, then build the UI that says it.

## What I'd do next

A "brewery road trip" planner using the geographic data, and user collections (visited/wishlist) with local storage.
