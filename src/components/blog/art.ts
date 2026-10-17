/* Per-story colour palettes for the covers. */

export interface Palette {
  name: string;
  bg: string;
  line: string;
  fill: string;
  accent: string;
}

/* Considered duotone / riso-style palettes, one per story (by unit number).
   Warm and cool, none green, none neon. */
export const PALETTES: Palette[] = [
  { name: "ultramarine", bg: "#2b3a8c", line: "#f1e9d8", fill: "#3b4aa3", accent: "#f2a65a" },
  { name: "tomato", bg: "#d9553b", line: "#fbefe0", fill: "#e46b52", accent: "#1f2a44" },
  { name: "petrol", bg: "#25566b", line: "#efe6d2", fill: "#306a82", accent: "#e8b04a" },
  { name: "plum", bg: "#5b2a5e", line: "#f3e3e8", fill: "#6e3a72", accent: "#f0b46a" },
  { name: "mustard", bg: "#e5b13a", line: "#1e1b16", fill: "#efc55c", accent: "#b3412b" },
  { name: "clay", bg: "#e7b9ae", line: "#3a1f1a", fill: "#f0cbc1", accent: "#3b4aa3" },
  { name: "navy", bg: "#1e2a4a", line: "#f3ead8", fill: "#2a3a63", accent: "#ef7b5c" },
  { name: "sky", bg: "#b9d3ea", line: "#1b2b4a", fill: "#cfe1f1", accent: "#d9553b" },
  { name: "burgundy", bg: "#6d1f2f", line: "#f5e6d8", fill: "#812c3d", accent: "#e9b872" },
  { name: "lilac", bg: "#c9bfe8", line: "#2a1f4f", fill: "#d9d1f0", accent: "#e5683f" },
  { name: "umber", bg: "#8a5a33", line: "#f6e8d0", fill: "#9c6a40", accent: "#f1c36a" },
  { name: "slate", bg: "#3e5c76", line: "#f0ebe0", fill: "#4d6e8a", accent: "#f4a259" },
  { name: "blush", bg: "#f2d4d0", line: "#2b2b4f", fill: "#f8e3e0", accent: "#c2410c" },
  { name: "iris", bg: "#4b3f9e", line: "#f0e9ff", fill: "#5d51b3", accent: "#f5a3b5" },
  { name: "ocean", bg: "#1f6f8b", line: "#f2efe4", fill: "#2a82a0", accent: "#f7b267" },
];

export const paletteFor = (unit: number): Palette =>
  PALETTES[(Math.max(1, unit) - 1) % PALETTES.length];
