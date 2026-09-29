---
title: "Sortify: My Files Were a Mess, So I Taught an AI to Organize Them"
date: 2025-12-30
author: Saurav Rijal
summary: "An AI document organizer that auto-classifies academic files and lets you chat with them through RAG-powered semantic search."
tags:
  - rag
  - python
  - fastapi
  - react
featured: true
coverImage: "/blog-covers/cover-sortify.svg"
---

# Sortify: My Files Were a Mess, So I Taught an AI to Organize Them

Every semester my downloads folder became a graveyard: `final_final_v2.pdf`, lecture slides mixed with assignments, readings I'd saved and never found again. Folders weren't the answer, I never maintained them. So I built something that maintains itself.

## Why it needed to exist

The problem isn't storage, it's retrieval. When you need that one paper on graph neural networks from three months ago, you don't remember the filename, you remember the *idea*. Keyword search fails on ideas. I wanted to ask "what did I save about dynamic programming?" and get the actual documents.

## What it does

Sortify is an AI-powered document organizer:

- **Automatic classification**: upload academic files and the system categorizes them without you lifting a finger
- **Chat with your documents**: a RAG-based semantic search chatbot (PGVector + Sentence Transformers) answers questions grounded in your own uploads, with the source documents cited
- **Clean workflow**: FastAPI backend with REST endpoints, React/TypeScript frontend for uploads, browsing, and chat

The RAG part is the heart of it. Documents get chunked, embedded, and stored in Postgres with pgvector; a query retrieves the semantically closest chunks and the LLM answers *from those chunks*, not from its parametric memory. That grounding is what makes the answers trustworthy instead of plausible-sounding.

## How I thought of it

I started from the retrieval failure mode: I literally couldn't find a reading two days before it was due. My first instinct was "better folders," but that's a discipline solution and discipline doesn't scale. The insight was that classification and search are the same problem, if the system understands what a document is *about* well enough to file it, it understands it well enough to answer questions about it. One embedding pipeline serves both.

## What I'd do next

Duplicate detection, automatic tagging with a controlled vocabulary, and incremental re-indexing so large libraries stay fast. Also: a "study mode" that quizzes you from your own documents.
