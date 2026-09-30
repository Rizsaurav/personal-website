---
title: "The Open-Weight Oligopoly: Who Actually Owns the Downloads"
date: 2026-09-30
author: Saurav Rijal
summary: "I audited 20,000 Hugging Face models and found downloads brutally concentrated (Gini 0.918) in an ecosystem that is simultaneously decentralizing. Here is how I measured it and what predicts a hit."
tags:
  - ai
  - llm
  - research
  - huggingface
featured: true
coverImage: "/blog-covers/cover-open-weight-oligopoly.svg"
---

# The Open-Weight Oligopoly: Who Actually Owns the Downloads

Everyone says open weights democratized AI. I wanted to check whether the numbers agree. So I pulled 20,000 models from the Hugging Face Hub, about 2.84 billion trailing-30-day downloads across 4,144 organizations, and measured concentration the way economists measure markets: Gini coefficients, Herfindahl indices, top-N shares, and a predictive model to see what actually drives downloads.

The headline finding is a paradox. Downloads are brutally concentrated and the ecosystem is decentralizing at the same time.

## How concentrated is it

The model-download Gini is 0.918. For context, that is more unequal than wealth distribution in most countries. The top 100 models take 48.4% of all downloads. The top 1,000 take 81.2%. The vast majority of models are downloaded by almost nobody.

But concentration of downloads is not the same as concentration of power. The publisher Herfindahl index is only 375, which in antitrust terms is an unconcentrated market. The largest single publisher holds just 11.99% of downloads. No one owns this ecosystem.

## The decentralization trend

This is the part I did not expect. Looking at the top-10 organizations' share of downloads by model creation cohort: 78.62% for models created in 2022, falling to 53.74% for 2026. The old guard's grip is loosening. New organizations keep arriving and taking share.

Meanwhile models keep getting bigger. Median parameter count went from 124.4M in the early cohorts to 11.96B. The open-weight world is simultaneously more crowded and more heavyweight.

## Can you predict a hit

I built a pipeline to find out. OLS on log downloads (n=20,000) explains about 14.8% of the variance, which tells you most of what drives downloads is not in the metadata. A random forest with repeated cross-validation reaches AUC 0.723 ± 0.012 at classifying above-median downloads, barely beating logistic regression at 0.716 ± 0.012. K-means over model characteristics finds four archetypes with a silhouette of 0.292: real structure, but fuzzy.

Translation: downloads are predictable, but far from deterministic. Good metadata helps. It does not make hits.

## How it was built

Everything runs through an assertion-gated pipeline, six stages from collection to tables, where each stage validates its inputs before proceeding. The 20,000-model sample comes from the public Hub API, enriched with parameter counts, pipeline tags, and license data where available. All figures and tables regenerate from the raw JSON with one command. The repo is public and the analysis reruns byte-identically in a fresh environment.

If you work on model infrastructure, evaluation, or AI policy, the concentration numbers are worth sitting with. The open-weight ecosystem looks like a monopoly from the download curve and a bazaar from the publisher table. Both are true.

Code and full paper: [github.com/Rizsaurav/-Open-Weight-Oligopoly](https://github.com/Rizsaurav/-Open-Weight-Oligopoly)
