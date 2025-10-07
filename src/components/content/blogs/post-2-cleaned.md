---
title: Building a Scalable Blogging Site. Is hardcoding easier for developers?
date: 2025-08-02
author: Saurav Rijal
authorImage: /images/authors/saurav.jpg
tags:
  - blogging
  - react
  - scalability
  - markdown
---

# Building a Scalable Blogging Site: Is Hardcoding Easier for Developers?

When you're starting out building your personal website or portfolio, adding a blog might seem straightforward. You write a few paragraphs in JSX, maybe even just toss a few `<p>` tags in a component, slap it onto a route, and you're done. But what happens when you're 10 posts deep? 50 posts? Want to add tags? Filter posts? Add commenting, reactions, or dynamic slugs?

This post walks you through **how I migrated my developer blog from hardcoded pages to a scalable Markdown + React system** with Firebase-based commenting, and why doing it right matters for long-term growth.

---

## Why Not Just Hardcode?

Let's be real — hardcoding is fast and feels good at first. Here's how I started:

- Every blog post was its own React component under `pages/blogs/`
- Each had its own route manually registered in `App.jsx` or `router.jsx`
- I styled content manually using Tailwind or CSS modules

For a couple of posts, this is fine. But once I crossed 5–6 posts, problems started piling up:

- I had to **manually copy boilerplate code** for each new blog post
- There was **no separation of content and code** — my blog content was buried in JSX
- I couldn't easily **filter or list posts by tag/date**
- I had no simple way to **generate dynamic slugs or titles**
- Content updates required **re-deploying the whole site**

That's when I realized — this wasn't sustainable.

---

## The Markdown Migration

Instead of coding every post, I switched to writing each blog in a `.md` file.

Each Markdown file had a **frontmatter header** like this:

title: My First Blog Post
date: 2025-07-22
author: Saurav Rijal
tags:

react

markdown

dev
authorImage: /images/authors/saurav.jpg

text

This allowed me to keep content clean, structured, and version-controlled, while still having full freedom over layout and rendering.

I used a library like `marked` to convert the markdown body into HTML and then safely render it in React using `dangerouslySetInnerHTML`.

---

## 📁 Project Structure for Scale

Here's the high-level folder structure I use:

/src
/app
/blogs
index.jsx // Blog listing
[slug].jsx // Dynamic blog post
/lib
/posts // All .md files stored here
utils.js // For parsing frontmatter + body

text

Instead of hardcoding every route, I built a dynamic router that reads all `.md` files at build time, parses their slugs, and renders the correct post.

---

## Creating Slugs from Filenames

Each Markdown file is stored under `/src/lib/posts/` and named like this:

- `my-first-blog.md`
- `how-i-fixed-my-react-app.md`
- `scaling-your-design-system.md`

We parse slugs from filenames by stripping the `.md` extension.

export function getAllSlugs() {
const files = import.meta.glob('/src/lib/posts/*.md', { as: 'raw', eager: true });
return Object.entries(files).map(([path, content]) => {
const slug = path.split('/').pop().replace('.md', '');
return { slug, content };
});
}

text

Each blog route looks like:

- `/blogs/my-first-blog`
- `/blogs/how-i-fixed-my-react-app`

That's clean, SEO-friendly, and intuitive.

---

## Parsing Frontmatter with Regex

I used a custom utility to extract frontmatter (YAML) and markdown body:

function parseFrontMatter(mdContent) {
const match = /^---\n([\s\S]+?)\n---/.exec(mdContent);
if (!match) return { attributes: {}, body: mdContent };

const rawAttributes = match;
const attributes = {};
rawAttributes.split('\n').forEach(line => {
const [key, ...rest] = line.split(':');
attributes[key.trim()] = rest.join(':').trim();
});

const body = mdContent.slice(match.length);
return { attributes, body };
}

text

This approach lets me use `.md` files like mini blog CMS entries without needing an actual CMS yet.

---

## Why This Is Scalable

Let's break down why this setup works long-term.

### 1. Separation of Concerns

- Blog content lives in Markdown
- Blog display lives in React
- Layout is reusable across posts

This reduces duplication and lets non-developers (or future me) edit content easily.

### 2. Easier Maintenance

Want to update an author name or fix a typo? Just open the `.md` file.

Want to change how all blog posts are styled? Just update the `BlogPost.jsx` layout file.

### 3. Rich Metadata

Thanks to frontmatter, I can now:

- Display author image/name
- Filter posts by tag
- Sort by date
- Generate preview cards

### 4. Scalable Routing

The `[slug].jsx` file in React handles any blog route dynamically.

import { useParams } from "react-router-dom";
import { getAllSlugs, parseFrontMatter } from "../../lib/utils";
import { marked } from "marked";

export default function BlogPost() {
const { slug } = useParams();
const post = getAllSlugs().find(p => p.slug === slug);
const { attributes, body } = parseFrontMatter(post.content);

return (
<article>
<h1>{attributes.title}</h1>
<div dangerouslySetInnerHTML={{ __html: marked(body) }} />
</article>
);
}

text

This means no more adding routes for new posts — the slug handles it.

---

## Adding Comments with Firebase

I wanted people to engage with my blog. Instead of using Disqus or embedding something external, 
I built my own commenting system using Firebase Firestore.

### Features:

- Google or anonymous sign-in
- Authenticated comment posting
- Threaded replies
- Per-comment reactions (❤️ 👍 💡 ⭐)
- Real-time updates (thanks to Firestore listeners)

---

## Reactions — The Right Way

Every user can react to a comment with only one reaction at a time. Reacting again replaces the previous one.

userReactions: {
uid1: "heart",
uid2: "thumb",
uid3: "star"
}

text

We calculate counts by mapping over the `userReactions` values.

Only authenticated users can delete their own comments — not others. This keeps things clean, secure, and friendly.

---

## Real-Time Firestore Listeners

I use `onSnapshot` to listen to comment changes in real-time:

useEffect(() => {
const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
return onSnapshot(q, snap => {
setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});
}, []);

text

This means users can see new comments, edits, or replies instantly, without refreshing.

---

## How It Feels Now

Adding a new blog post is as easy as:

1. Creating a new `.md` file
2. Writing content with frontmatter
3. Saving and pushing to GitHub

The system automatically:

- Parses metadata
- Generates a slug
- Renders layout
- Shows on the homepage
- Supports comments out-of-the-box

No rebuilds, no manual routing, no repeated code.

---

## The CMS Question

Eventually, if my site grows or others want to contribute, I can plug in a CMS like:

- Netlify CMS
- Contentful
- Sanity

For now, though, Markdown keeps everything version-controlled, fast, and developer-friendly.

---

## Tools I Used

- React + Vite
- React Router DOM
- Firebase Auth & Firestore
- Tailwind CSS
- `marked` for parsing markdown
- Regex for frontmatter
- Custom hooks for comments and slugs

---

## Future Upgrades

Here's where I plan to go next:

- Add pagination and infinite scroll
- Integrate Firestore likes into blog analytics
- Let users bookmark blog posts
- Add reading time estimates
- Dark mode for reader comfort

---

## Final Thoughts: Is Hardcoding Easier?

Yes, hardcoding is easier — but only at first.

If you're building something small that won't grow, go ahead and hardcode. But if you care about:

- Growth
- Maintainability
- Clean content-authoring
- Feature expansion

Then investing in Markdown + dynamic slugs + proper architecture is absolutely worth it.

This small change made my site more flexible, future-proof, and fun to build.

---

## If you're a dev reading this

Go build your own markdown-powered blog. You'll learn about parsing, slugs, dynamic routes, real-time Firebase, and scalable design patterns. It's worth it.

Feel free to reach out if you want help or want to see the source!

Thanks for reading 🙌