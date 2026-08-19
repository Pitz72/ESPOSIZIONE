/** Colori ANSI minimali, senza dipendenze. Disattivati fuori da TTY o con NO_COLOR. */

const ESC = String.fromCharCode(27);
const enabled = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

function wrap(code: number): (s: string) => string {
  return (s: string) => (enabled ? `${ESC}[${code}m${s}${ESC}[0m` : s);
}

export const c = {
  bold: wrap(1),
  dim: wrap(2),
  italic: wrap(3),
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  blue: wrap(34),
  magenta: wrap(35),
  cyan: wrap(36),
  gray: wrap(90),
};
