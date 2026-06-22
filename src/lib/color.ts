/** Convert "H S% L%" (the format our CSS tokens use) to a #rrggbb hex string. */
export function hslTripleToHex(triple: string): string {
  const [h, s, l] = triple
    .trim()
    .replace(/%/g, "")
    .split(/\s+/)
    .map(Number);
  if ([h, s, l].some(Number.isNaN)) return "#2647c9";

  const sat = s / 100;
  const lig = l / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lig - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Read a CSS custom property (HSL triple) off the document root as hex. */
export function readTokenAsHex(token: string): string {
  if (typeof window === "undefined") return "#2647c9";
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    token,
  );
  return hslTripleToHex(value);
}
