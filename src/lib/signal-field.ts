/** Reusable draw buffers. Three separable waves preserve the original field exactly. */
export function signalField() {
  const buckets: number[][] = [[], [], []];
  const xWave: number[] = [];
  const yWave: number[] = [];
  const diagonal: number[] = [];
  return (cols: number, rows: number, flow: number, px: number, py: number) => {
    for (const bucket of buckets) bucket.length = 0;
    for (let i = 0; i < cols; i++) xWave[i] = Math.sin(i * 0.33 + flow);
    for (let j = 0; j < rows; j++) yWave[j] = Math.sin(j * 0.41 - flow * 0.8);
    for (let k = 0; k < cols + rows - 1; k++)
      diagonal[k] = Math.sin(k * 0.18 + flow * 1.3);
    for (let j = 0; j < rows; j++) {
      const y = j * 42;
      for (let i = 0; i < cols; i++) {
        const x = i * 42;
        let v = (xWave[i] + yWave[j] + diagonal[i + j] + 3) / 6;
        const dx = x - px,
          dy = y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 36000) v = Math.min(1, v + (1 - d2 / 36000) * 0.9);
        buckets[v > 0.72 ? 2 : v > 0.5 ? 1 : 0].push(x, y, v);
      }
    }
    return buckets;
  };
}
