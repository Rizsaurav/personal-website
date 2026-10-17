declare module "virtual:articles" {
  export interface ChartPoint {
    label: string;
    value: number;
    display?: string;
    note?: string;
    date?: string;
  }
  export interface ArticleChart {
    type: "line" | "bars";
    title?: string;
    unit?: string;
    max?: number;
    caption?: string;
    reference?: { label: string; value: number; display?: string };
    data: ChartPoint[];
  }
  export interface ArticleMeta {
    slug: string;
    title: string;
    date: string;
    summary: string;
    kind: "research" | "project";
    minutes: number;
    chart: ArticleChart | null;
  }
  const articles: ArticleMeta[];
  export default articles;
}
