type GraphSample = {
  expression: string;
  width?: number;
  height?: number;
};

const SAFE_EXPRESSION = /^[0-9xX+\-*/^().,\s=absincosteqrtlgpPIEMath]*$/;

function normalizeExpression(raw: string) {
  return raw
    .replace(/^y\s*=\s*/i, "")
    .replace(/^f\s*\(\s*x\s*\)\s*=\s*/i, "")
    .replace(/(\d)(x)/gi, "$1*$2")
    .replace(/(\d)\(/g, "$1*(")
    .replace(/\)(x|\d)/gi, ")*$1")
    .replace(/\^/g, "**");
}

function evaluateExpression(expression: string, x: number) {
  const sanitized = normalizeExpression(expression);

  if (!SAFE_EXPRESSION.test(sanitized)) {
    throw new Error("Expression contains unsupported characters.");
  }

  const evaluator = new Function(
    "x",
    "const { abs, cos, sin, tan, sqrt, log, exp, PI, E } = Math; return Number(" +
      sanitized +
      ");",
  );

  return Number(evaluator(x));
}

function projectPoint(value: number, min: number, max: number, size: number) {
  return ((value - min) / (max - min)) * size;
}

export function renderFallbackGraphSvg({
  expression,
  width = 360,
  height = 220,
}: GraphSample) {
  const domain = { min: -10, max: 10 };
  const range = { min: -10, max: 10 };
  const points: string[] = [];

  for (let index = 0; index <= 120; index += 1) {
    const x = domain.min + ((domain.max - domain.min) / 120) * index;

    try {
      const y = evaluateExpression(expression, x);

      if (!Number.isFinite(y) || y < range.min * 4 || y > range.max * 4) {
        continue;
      }

      const px = projectPoint(x, domain.min, domain.max, width);
      const py = height - projectPoint(y, range.min, range.max, height);

      points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
    } catch {
      continue;
    }
  }

  if (!points.length) {
    throw new Error("Could not sample a valid set of graph points.");
  }

  const axisX = height - projectPoint(0, range.min, range.max, height);
  const axisY = projectPoint(0, domain.min, domain.max, width);
  const gridXs = Array.from({ length: 9 }, (_, index) => ((index + 1) * width) / 10);
  const gridYs = Array.from({ length: 7 }, (_, index) => ((index + 1) * height) / 8);

  const verticalLines = gridXs
    .map(
      (x) =>
        `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(34,49,39,0.08)" stroke-width="1" />`,
    )
    .join("");

  const horizontalLines = gridYs
    .map(
      (y) =>
        `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(34,49,39,0.08)" stroke-width="1" />`,
    )
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="Graph of ${expression}">
      <rect width="${width}" height="${height}" rx="18" fill="#fffdfa" />
      ${verticalLines}
      ${horizontalLines}
      <line x1="0" y1="${axisX}" x2="${width}" y2="${axisX}" stroke="#233228" stroke-width="1.4" />
      <line x1="${axisY}" y1="0" x2="${axisY}" y2="${height}" stroke="#233228" stroke-width="1.4" />
      <polyline
        points="${points.join(" ")}"
        stroke="#d95f33"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <text x="${width - 18}" y="18" text-anchor="end" fill="#5d6c62" font-size="12" font-family="IBM Plex Mono, monospace">${expression}</text>
    </svg>
  `.trim();
}

export function renderGraphErrorSvg(expression: string, message: string) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" fill="none" role="img" aria-label="Graph render error for ${expression}">
      <rect width="360" height="220" rx="18" fill="#fffdfa" />
      <rect x="18" y="18" width="324" height="184" rx="16" fill="#fff4ea" stroke="#d95f33" stroke-dasharray="8 8" />
      <text x="28" y="52" fill="#d95f33" font-size="16" font-family="Space Grotesk, sans-serif">Graph needs a cleaner expression</text>
      <text x="28" y="84" fill="#5d6c62" font-size="12" font-family="IBM Plex Mono, monospace">${expression}</text>
      <text x="28" y="116" fill="#233228" font-size="13" font-family="Space Grotesk, sans-serif">${message}</text>
      <text x="28" y="150" fill="#5d6c62" font-size="12" font-family="Space Grotesk, sans-serif">Try forms like y = x^2 - 2*x - 3 or sin(x).</text>
    </svg>
  `.trim();
}
