/* Figure descriptors declared in an article's front-matter (`visuals:`).
   Each one renders after the section whose heading matches `after`. */

export interface Stage {
  name: string;
  /** short mono tag shown on the bay face (e.g. "Gemini 2.5 Pro") */
  tag?: string;
  desc: string;
}

export interface PipelineVisual {
  type: "pipeline";
  after: string;
  title: string;
  /** "Pipeline" | "Architecture" | "Data flow" ... shown in the figure label */
  kind?: string;
  caption?: string;
  stages: Stage[];
}

export interface TabsVisual {
  type: "tabs";
  after: string;
  title: string;
  caption?: string;
  tabs: { label: string; points: string[] }[];
}

export interface Datum {
  label: string;
  value: number;
  /** display string for the value, e.g. "48.4%" */
  display?: string;
  note?: string;
}

export interface BarsVisual {
  type: "bars";
  after: string;
  title: string;
  caption?: string;
  unit?: string;
  max?: number;
  reference?: { label: string; value: number; display?: string };
  data: Datum[];
}

export interface LineVisual {
  type: "line";
  after: string;
  title: string;
  caption?: string;
  unit?: string;
  /** ISO dates drive the x position */
  data: { date: string; label: string; value: number; display?: string }[];
}

export type Visual = PipelineVisual | TabsVisual | BarsVisual | LineVisual;
