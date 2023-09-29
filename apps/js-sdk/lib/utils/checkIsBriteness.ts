import invariant from 'ts-invariant';

type HexColorType = `#${string}`;

export function checkIsBrightness(color: HexColorType): boolean {
  invariant(color.length === 7, 'color must be hex color');
  invariant(color[0] === '#', 'color must be hex color');

  const rgb = color
    .substring(1)
    .match(/.{2}/g)!
    .map((hex: string) => parseInt(hex, 16));
  const brightness = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);
  return brightness >= 128;
}

export function getContrastColor(color: HexColorType): string {
  return checkIsBrightness(color) ? '#262626' : '#efefef';
}
