---
title: "PetTalks: A Forum for People Who Talk About Their Pets (Everyone)"
date: 2025-05-04
author: Saurav Rijal
summary: "A full-stack community forum — posts, comments, upvotes, search — built in 10 hours with React and a cloud SQL backend."
tags:
  - web-dev
  - react
  - full-stack
---

# PetTalks: A Forum for People Who Talk About Their Pets (Everyone)

Pet owners will talk about their pets to anyone who stands still long enough. I built them a place to do it properly: PetTalks, a discussion forum for sharing stories, photos, and advice.

## Why it needed to exist

Honestly? This one needed to exist because I needed to learn full-stack development end to end, and "forum" is the perfect forcing function: it has users, content, relationships between content, sorting, searching, and moderation-shaped problems. Pets were the theme because nobody argues about the theme when the theme is dogs.

## What it does

A complete forum in React with a cloud-hosted SQL database:

- **Create posts** with titles, text, images (via URL), and tags
- **Home feed** showing creation time, title, and upvote counts
- **Sort by recency or upvotes**, plus **search by title**
- **Dedicated post pages** with comments, upvote buttons, and edit/delete
- **Pseudo-authentication** so the multi-user experience feels real

Built in about 10 hours — a sprint that taught me more about shipping than a month of tutorials.

## How I thought of it

I picked the most boring-reliable architecture I could: React frontend, SQL backend, REST between them. The discipline was in *not* reaching for exotic tools. Forums are a solved problem; the learning was in executing the solved problem cleanly — schema design, optimistic UI updates for upvotes, and keeping the feed fast.

## What I'd do next

Real auth, image uploads instead of URLs, and a moderation queue. The bones are solid; it just needs to grow up.
