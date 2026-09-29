---
title: "Sentimental Movies: Ranking Films by How People Actually Felt"
date: 2025-02-24
author: Saurav Rijal
summary: "Streaming platforms optimize for watch time, not enjoyment. I analyzed thousands of IMDb reviews with NLP to rank movies by real audience sentiment."
tags:
  - nlp
  - machine-learning
  - fastapi
  - react
coverImage: "/blog-covers/cover-sentimental-movies.jpg"
---

# Sentimental Movies: Ranking Films by How People Actually Felt

Ever been let down by a "popular" movie a streaming platform pushed at you? That's because platforms optimize for watch time and engagement, not whether audiences actually *liked* the movie. I built a discovery platform that ranks films by genuine audience sentiment instead of hype.

## Why it needed to exist

Star ratings are broken. A 7.8 on IMDb tells you nothing about *why*: was it a fun ride, a masterpiece, or just inoffensive? And trending rows are engagement traps. I wanted a ranking based on the one signal that matters: how the movie made people feel, in their own words.

## What it does

- Pulled **IMDb's top 2000 highest-rated movies** and thousands of user reviews
- Ran **NLTK sentiment analysis** over the reviews, assigning each film a **sentiment score from 0 to 1**: a measure of emotional positivity, not just approval
- **Filtered out overhyped disappointments** and surfaced hidden gems the algorithms bury
- Added an **AI movie bot** that fetches spoiler-free summaries of any title
- Served it all through a **FastAPI + PostgreSQL backend** with a **React** discovery frontend

The sentiment score digs deeper than stars: it captures whether viewers found a film emotionally powerful, deeply engaging, or just plain disappointing: the texture that a single number erases.

## How I thought of it

I'd noticed that the movies I loved most were rarely the ones the algorithm surfaced, they were the ones a friend described with *feeling*. Reviews are full of feeling; ratings strip it out. NLP sentiment analysis is basically a machine for recovering exactly what the rating destroyed. The project was an excuse to prove that the text around the numbers is more informative than the numbers.

## What I'd do next

Aspect-based sentiment (acting vs. plot vs. cinematography), temporal sentiment drift (do classics age well?), and personalized recommendations weighted by *your* review history.
