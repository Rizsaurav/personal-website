import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

marked.use(
  markedHighlight({
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}
