# Saurav Rijal — Personal Website

My personal site: projects, research, and build stories.

**Live:** https://sauravrijal.onrender.com

## What this is

A portfolio + blog documenting everything I build — written with grad school
applications in mind. Every project in the Work section links to its repo and
to a long-form build story on the blog (why it exists, what it solves, and how
I thought of it).

## Tech

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn-ui
- framer-motion, react-router-dom
- Firebase (blog comments)

## Blog

Posts live as Markdown in `src/components/content/blogs/` with front-matter
(`title`, `date`, `author`, `summary`, `tags`, `featured`). Adding a post is
just adding a file — routing, listing, and reading-time are automatic.

## Develop

```bash
npm install
npm run dev
```
