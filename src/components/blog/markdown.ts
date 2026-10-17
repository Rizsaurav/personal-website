import { Marked, type Token, type Tokens } from "marked";
import DOMPurify from "dompurify";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface TocEntry {
  id: string;
  text: string;
  depth: number;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Renderer rules:
   - images become numbered figures (alt text = caption) with an expand button
   - h2/h3 get stable ids and a hash anchor; the body h1 is dropped because the
     article header already carries the title
   - ```stat blocks become a readout strip ("VALUE | label" per line)
   - fenced code gets a language label and a copy button */
function figure(token: Tokens.Image, captionHtml?: string): string {
  const src = esc(token.href ?? "");
  const alt = esc(token.text ?? "");
  const capHtml = captionHtml ?? alt;
  const cap = capHtml ? `<figcaption>${capHtml}</figcaption>` : "";
  return `<figure class="bl-figure"><button type="button" class="bl-zoom" data-zoom aria-label="Expand figure: ${alt}"><img src="${src}" alt="${alt}" loading="lazy" /><span class="bl-zoom-hint" aria-hidden="true">Expand</span></button>${cap}</figure>`;
}

const md = new Marked({
  renderer: {
    image(token: Tokens.Image) {
      return figure(token);
    },
    paragraph(token: Tokens.Paragraph) {
      // "![alt](src)\n*caption*" -> one figure whose caption is the italic line
      const t = token.tokens;
      if (t.length > 0 && t[0].type === "image") {
        const rest = t.slice(1).filter((x) => x.raw.trim() !== "");
        const cap = rest.length ? this.parser.parseInline(rest) : undefined;
        return figure(t[0] as Tokens.Image, cap);
      }
      return false;
    },
    heading(token: Tokens.Heading) {
      if (token.depth === 1) return "";
      const inner = this.parser.parseInline(token.tokens);
      if (token.depth === 2 || token.depth === 3) {
        const id = slugify(token.text);
        return `<h${token.depth} id="${id}">${inner}<a class="bl-anchor" href="#${id}" aria-label="Link to this section">#</a></h${token.depth}>`;
      }
      return `<h${token.depth}>${inner}</h${token.depth}>`;
    },
    code(token: Tokens.Code) {
      if (token.lang === "stat") {
        const items = token.text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((line) => {
            const i = line.indexOf("|");
            const value = (i >= 0 ? line.slice(0, i) : line).trim();
            const label = (i >= 0 ? line.slice(i + 1) : "").trim();
            return `<div class="bl-stat"><span class="bl-stat-v">${esc(value)}</span><span class="bl-stat-l">${esc(label)}</span></div>`;
          })
          .join("");
        return `<div class="bl-stats" role="group" aria-label="Key figures">${items}</div>`;
      }
      const lang = esc((token.lang ?? "").split(/\s/)[0]);
      return `<div class="bl-code"><div class="bl-code-bar"><span>${lang || "code"}</span><button type="button" data-copy>Copy</button></div><pre tabindex="0"><code>${esc(token.text)}</code></pre></div>`;
    },
  },
});

export interface Section {
  id: string;
  title: string;
  html: string;
}

type TokenList = Token[] & { links: ReturnType<typeof md.lexer>["links"] };

function toHtml(tokens: Token[], links: TokenList["links"]): string {
  const list = Object.assign([...tokens], { links }) as TokenList;
  return DOMPurify.sanitize(md.parser(list), {
    ADD_TAGS: ["figure", "figcaption"],
    ADD_ATTR: ["loading", "data-zoom", "data-copy"],
  });
}

/** Split the body into an intro plus one section per h2. */
export function parseArticle(body: string): {
  intro: string;
  sections: Section[];
  toc: TocEntry[];
  stats: { value: string; label: string }[];
} {
  const tokens = md.lexer(body);
  const groups: { id: string; title: string; tokens: Token[] }[] = [
    { id: "", title: "", tokens: [] },
  ];
  const toc: TocEntry[] = [];
  const stats: { value: string; label: string }[] = [];
  for (const t of tokens) {
    if (t.type === "heading" && t.depth === 2) {
      const id = slugify(t.text);
      groups.push({ id, title: t.text, tokens: [t] });
      toc.push({ id, text: t.text, depth: 2 });
      continue;
    }
    if (t.type === "heading" && t.depth === 3) {
      toc.push({ id: slugify(t.text), text: t.text, depth: 3 });
    }
    if (t.type === "code" && t.lang === "stat" && stats.length === 0) {
      for (const line of t.text.split("\n")) {
        const i = line.indexOf("|");
        if (i > 0)
          stats.push({
            value: line.slice(0, i).trim(),
            label: line.slice(i + 1).trim(),
          });
      }
    }
    groups[groups.length - 1].tokens.push(t);
  }
  const [first, ...rest] = groups;
  return {
    intro: toHtml(first.tokens, tokens.links),
    sections: rest.map((g) => ({
      id: g.id,
      title: g.title,
      html: toHtml(g.tokens, tokens.links),
    })),
    toc,
    stats,
  };
}
