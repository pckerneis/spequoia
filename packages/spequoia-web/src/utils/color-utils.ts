export function getContrastingTextColor(
  backgroundColor: string,
  opacity = 1,
): string {
  const defaultColor = 'rgb(0, 0, 0, ' + opacity + ')';

  if (backgroundColor.startsWith('var(')) {
    if (typeof window !== 'undefined') {
      const computedColor = getComputedStyle(
        document.documentElement,
      ).getPropertyValue(backgroundColor.slice(4, -1).trim());
      return getContrastingTextColor(computedColor);
    }
    return defaultColor;
  }

  let r: number, g: number, b: number;

  if (backgroundColor.startsWith('#')) {
    const hex = backgroundColor.slice(1);
    const num = parseInt(hex, 16);
    r = (num >> 16) & 255;
    g = (num >> 8) & 255;
    b = num & 255;
  } else if (backgroundColor.startsWith('rgb')) {
    const match = backgroundColor.match(/\d+/g);
    if (!match || match.length < 3) return defaultColor;
    [r, g, b] = match.map(Number);
  } else {
    return defaultColor;
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5
    ? 'rgb(0, 0, 0, ' + opacity + ')'
    : 'rgb(255, 255, 255, ' + opacity + ')';
}
