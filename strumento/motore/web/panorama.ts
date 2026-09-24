/**
 * Il panorama: una striscia del porto disegnata in tempo reale, in cima all'app.
 * Il luogo decide che cosa si vede, il momento del giorno decide la luce.
 * È il tema grafico di questa ambientazione: un'altra storia ne avrebbe un altro,
 * e il motore non ne sa niente.
 */

export interface Cielo {
  cielo: string[];
  astro: { tipo: "sole" | "luna"; x: number; y: number; r: number; col: string; alone: string };
  mare: string;
  riflesso: string;
  sagoma: string;
  luci: string | null;
  accento: string;
  stelle?: boolean;
  uccelli?: boolean;
}

export const CIELI: Record<string, Cielo> = {
  alba: {
    cielo: ["#1d1a33", "#5b3f63", "#c8747a", "#f4b98f"],
    astro: { tipo: "sole", x: 0.8, y: 0.8, r: 20, col: "#ffe2bd", alone: "rgba(255,168,130,.42)" },
    mare: "#2c2542", riflesso: "#f6bf98", sagoma: "#1a1428", luci: null, accento: "#f2a488", uccelli: true,
  },
  giorno: {
    cielo: ["#2b5b82", "#6b9bbb", "#b9d3dc", "#e2ece8"],
    astro: { tipo: "sole", x: 0.24, y: 0.2, r: 16, col: "#fffbef", alone: "rgba(255,255,226,.4)" },
    mare: "#29506b", riflesso: "#e4f1f4", sagoma: "#1b2c3a", luci: null, accento: "#8ccde2", uccelli: true,
  },
  sera: {
    cielo: ["#191327", "#4a2a45", "#b5563f", "#f0a45a"],
    astro: { tipo: "sole", x: 0.12, y: 0.84, r: 22, col: "#ffd59e", alone: "rgba(255,138,80,.45)" },
    mare: "#2b1c2c", riflesso: "#f2a85e", sagoma: "#140d16", luci: "#ffc46a", accento: "#f2a650",
  },
  notte: {
    cielo: ["#02040a", "#060d1c", "#0e1a31", "#1a2a4c"],
    astro: { tipo: "luna", x: 0.78, y: 0.2, r: 11, col: "#eef1ff", alone: "rgba(170,195,255,.28)" },
    mare: "#06101f", riflesso: "#a3b9ea", sagoma: "#03060c", luci: "#ffcf7a", accento: "#ffcf7a", stelle: true,
  },
};

// ---------------------------------------------------------------------------
// Utilità
// ---------------------------------------------------------------------------

function generatore(seme: number) {
  let s = seme >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

type C = CanvasRenderingContext2D;

function finestra(ctx: C, x: number, y: number, w: number, h: number, luce: string | null, t: number, k: number) {
  if (luce) {
    const f = 0.75 + 0.25 * Math.sin(t * (1.3 + (k % 5) * 0.2) + k);
    ctx.fillStyle = alpha(luce, 0.55 + 0.4 * f);
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = alpha(luce, 0.12 * f);
    ctx.fillRect(x - w, y - h * 0.6, w * 3, h * 2.2);
  } else {
    ctx.fillStyle = "rgba(255,255,255,.07)";
    ctx.fillRect(x, y, w, h);
  }
}

function lanterna(ctx: C, x: number, y: number, luce: string, t: number, forza = 1) {
  const f = (0.8 + 0.2 * Math.sin(t * 7 + x)) * forza;
  const g = ctx.createRadialGradient(x, y, 0, x, y, 34 * f);
  g.addColorStop(0, alpha(luce, 0.55));
  g.addColorStop(1, alpha(luce, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 34 * f, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = luce;
  ctx.fillRect(x - 2, y - 3, 4, 6);
}

// ---------------------------------------------------------------------------
// Cielo, astri, mare
// ---------------------------------------------------------------------------

function cielo(ctx: C, W: number, H: number, c: Cielo, t: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.78);
  c.cielo.forEach((col, i) => g.addColorStop(i / (c.cielo.length - 1), col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (c.stelle) {
    const r = generatore(7);
    for (let i = 0; i < 90; i++) {
      const x = r() * W, y = r() * H * 0.62, s = r();
      ctx.fillStyle = `rgba(230,236,255,${0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * (0.6 + s * 2) + i))})`;
      ctx.fillRect(x, y, s > 0.9 ? 2 : 1, s > 0.9 ? 2 : 1);
    }
  }
  const a = c.astro;
  const ax = a.x * W, ay = a.y * H * 0.78;
  const alone = ctx.createRadialGradient(ax, ay, 0, ax, ay, a.r * 6);
  alone.addColorStop(0, a.alone);
  alone.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = alone;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = a.col;
  ctx.beginPath();
  ctx.arc(ax, ay, a.r, 0, Math.PI * 2);
  ctx.fill();
  if (a.tipo === "luna") {
    ctx.fillStyle = c.cielo[1];
    ctx.beginPath();
    ctx.arc(ax + a.r * 0.45, ay - a.r * 0.2, a.r * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
  // nuvole lente
  const r = generatore(3);
  for (let i = 0; i < 5; i++) {
    const w = 120 + r() * 200, y = 14 + r() * H * 0.34;
    const x = ((r() * W + t * (4 + r() * 5)) % (W + w * 2)) - w;
    ctx.fillStyle = c.stelle ? "rgba(40,55,90,.18)" : alpha(c.cielo[c.cielo.length - 1], 0.16);
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, 7 + r() * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (c.uccelli) {
    ctx.strokeStyle = alpha(c.sagoma, 0.7);
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 4; i++) {
      const x = ((t * (18 + i * 3) + i * 230) % (W + 60)) - 30;
      const y = H * (0.18 + 0.05 * i) + Math.sin(t * 1.5 + i) * 6;
      const ala = 4 + 2 * Math.sin(t * 8 + i * 2);
      ctx.beginPath();
      ctx.moveTo(x - 7, y - ala);
      ctx.quadraticCurveTo(x - 3, y - 1, x, y);
      ctx.quadraticCurveTo(x + 3, y - 1, x + 7, y - ala);
      ctx.stroke();
    }
  }
}

function mare(ctx: C, W: number, H: number, y0: number, y1: number, c: Cielo, t: number) {
  ctx.fillStyle = c.mare;
  ctx.fillRect(0, y0, W, y1 - y0);
  const r = generatore(11);
  for (let i = 0; i < 70; i++) {
    const y = y0 + 3 + r() * (y1 - y0 - 4);
    const w = 8 + r() * 30;
    const x = ((r() * W + Math.sin(t * 0.7 + i) * 12) % W);
    const vicino = 1 - Math.abs(x / W - c.astro.x) * 1.6;
    ctx.fillStyle = alpha(c.riflesso, Math.max(0.06, 0.12 + 0.35 * vicino) * (0.6 + 0.4 * Math.sin(t * 2 + i)));
    ctx.fillRect(x, y, w, 1);
  }
}

// ---------------------------------------------------------------------------
// I luoghi
// ---------------------------------------------------------------------------

function banchina(ctx: C, W: number, H: number, c: Cielo, t: number) {
  const oriz = H * 0.66;
  mare(ctx, W, H, oriz, H * 0.86, c, t);
  // la Santa Rita
  const nx = W * 0.6, ny = oriz + 6;
  const dondola = Math.sin(t * 0.8) * 1.5;
  ctx.save();
  ctx.translate(0, dondola);
  ctx.fillStyle = c.sagoma;
  ctx.beginPath();
  ctx.moveTo(nx - 150, ny - 18);
  ctx.lineTo(nx + 160, ny - 22);
  ctx.lineTo(nx + 130, ny + 6);
  ctx.lineTo(nx - 120, ny + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(nx + 110, ny - 34, 44, 14); // cassero di poppa
  ctx.strokeStyle = c.sagoma;
  ctx.lineWidth = 3;
  const alberi = [nx - 90, nx, nx + 80];
  const alt = [H * 0.46, H * 0.56, H * 0.42];
  alberi.forEach((x, i) => {
    ctx.beginPath();
    ctx.moveTo(x, ny - 18);
    ctx.lineTo(x, ny - 18 - alt[i]);
    ctx.stroke();
    for (let k = 1; k <= 3; k++) {
      const y = ny - 18 - alt[i] * (k / 3.4);
      const l = 34 - k * 6;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - l, y);
      ctx.lineTo(x + l, y);
      ctx.stroke();
      ctx.fillStyle = alpha(c.sagoma, 0.9);
      ctx.fillRect(x - l + 2, y, l * 2 - 4, 4); // vele serrate
    }
    ctx.lineWidth = 3;
  });
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = alpha(c.sagoma, 0.8);
  ctx.beginPath();
  ctx.moveTo(nx - 150, ny - 18);
  ctx.lineTo(alberi[0], ny - 18 - alt[0]);
  ctx.lineTo(alberi[1], ny - 18 - alt[1]);
  ctx.lineTo(alberi[2], ny - 18 - alt[2]);
  ctx.lineTo(nx + 160, ny - 24);
  ctx.stroke();
  if (c.luci) {
    lanterna(ctx, nx + 150, ny - 38, c.luci, t, 0.9);
    lanterna(ctx, alberi[1], ny - 18 - alt[1] * 0.3, c.luci, t, 0.6);
  }
  ctx.restore();
  // la gru
  const gx = W * 0.16;
  ctx.strokeStyle = c.sagoma;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(gx - 30, H * 0.88);
  ctx.lineTo(gx, H * 0.34);
  ctx.lineTo(gx + 30, H * 0.88);
  ctx.moveTo(gx, H * 0.36);
  ctx.lineTo(gx + 120, H * 0.3);
  ctx.stroke();
  const oscilla = Math.sin(t * 1.1) * 6;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(gx + 116, H * 0.31);
  ctx.lineTo(gx + 116 + oscilla, H * 0.56);
  ctx.stroke();
  ctx.fillStyle = c.sagoma;
  ctx.fillRect(gx + 104 + oscilla, H * 0.56, 24, 16); // la rete col carico
  // la banchina e le casse
  ctx.fillRect(0, H * 0.86, W, H * 0.14);
  const r = generatore(5);
  for (let i = 0; i < 9; i++) {
    const x = W * 0.28 + i * 26 + r() * 10, h = 12 + r() * 18;
    ctx.fillRect(x, H * 0.86 - h, 22, h);
  }
  if (c.luci) lanterna(ctx, W * 0.34, H * 0.7, c.luci, t, 0.8);
}

function gallo(ctx: C, W: number, H: number, c: Cielo, t: number) {
  const base = H * 0.9;
  const r = generatore(21);
  ctx.fillStyle = c.sagoma;
  let x = -10, k = 0;
  while (x < W) {
    const w = 60 + r() * 70, h = H * (0.32 + r() * 0.22);
    const taverna = x < W * 0.5 && x + w > W * 0.42;
    ctx.fillStyle = c.sagoma;
    ctx.fillRect(x, base - h, w, h);
    ctx.beginPath();
    ctx.moveTo(x - 3, base - h);
    ctx.lineTo(x + w / 2, base - h - 14 - r() * 8);
    ctx.lineTo(x + w + 3, base - h);
    ctx.fill();
    for (let j = 0; j < 3; j++) finestra(ctx, x + 10 + j * (w / 3.2), base - h + 16, 8, 10, c.luci, t, k++);
    if (taverna) {
      finestra(ctx, x + w * 0.35, base - 34, w * 0.3, 34, c.luci ?? "#ffcf8a", t, 99);
      // l'insegna del Gallo
      ctx.fillStyle = c.sagoma;
      ctx.fillRect(x + w, base - h * 0.62, 26, 2);
      const d = Math.sin(t * 1.6) * 0.12;
      ctx.save();
      ctx.translate(x + w + 20, base - h * 0.62 + 2);
      ctx.rotate(d);
      ctx.fillRect(-1, 0, 2, 6);
      ctx.beginPath();
      ctx.arc(0, 16, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.luci ? alpha(c.luci, 0.8) : "rgba(255,255,255,.18)";
      ctx.beginPath(); // la cresta
      ctx.moveTo(-5, 12); ctx.lineTo(-2, 7); ctx.lineTo(0, 11); ctx.lineTo(3, 6); ctx.lineTo(5, 12);
      ctx.fill();
      ctx.restore();
    }
    // comignoli e fumo
    if (r() < 0.5) {
      ctx.fillStyle = c.sagoma;
      ctx.fillRect(x + w * 0.7, base - h - 22, 8, 16);
      for (let i = 0; i < 5; i++) {
        const q = (t * 0.2 + i / 5) % 1;
        ctx.fillStyle = `rgba(200,190,185,${0.14 * (1 - q)})`;
        ctx.beginPath();
        ctx.arc(x + w * 0.7 + 4 + q * 24, base - h - 24 - q * 50, 4 + q * 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    x += w + 2;
  }
  ctx.fillStyle = c.sagoma;
  ctx.fillRect(0, base, W, H - base);
}

function archivio(ctx: C, W: number, H: number, c: Cielo, t: number) {
  const base = H * 0.9;
  const cx = W * 0.5, w = Math.min(W * 0.6, 520), h = H * 0.44;
  ctx.fillStyle = c.sagoma;
  ctx.fillRect(0, base, W, H - base);
  // case ai lati
  const r = generatore(33);
  for (let x = 0; x < W; x += 70) {
    if (Math.abs(x + 30 - cx) < w / 2 + 30) continue;
    const hh = H * (0.25 + r() * 0.15);
    ctx.fillRect(x, base - hh, 64, hh);
    finestra(ctx, x + 14, base - hh + 14, 7, 9, c.luci, t, x);
    finestra(ctx, x + 40, base - hh + 14, 7, 9, c.luci, t, x + 3);
  }
  ctx.fillStyle = c.sagoma;
  ctx.fillRect(cx - w / 2, base - h, w, h);
  ctx.beginPath(); // frontone
  ctx.moveTo(cx - w / 2 - 12, base - h);
  ctx.lineTo(cx, base - h - H * 0.16);
  ctx.lineTo(cx + w / 2 + 12, base - h);
  ctx.fill();
  ctx.fillRect(cx - w / 2 - 16, base - 10, w + 32, 10); // gradini
  ctx.fillStyle = alpha(c.cielo[c.cielo.length - 1], 0.09);
  for (let i = 0; i < 7; i++) ctx.fillRect(cx - w / 2 + 18 + i * ((w - 40) / 6), base - h + 10, 6, h - 22); // colonne
  for (let i = 0; i < 6; i++) finestra(ctx, cx - w / 2 + 30 + i * ((w - 60) / 5.3), base - h * 0.55, 10, 22, c.luci, t, i + 40);
  // la bandiera
  ctx.strokeStyle = c.sagoma;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, base - h - H * 0.16);
  ctx.lineTo(cx, base - h - H * 0.3);
  ctx.stroke();
  ctx.fillStyle = c.sagoma;
  ctx.beginPath();
  const fy = base - h - H * 0.3;
  ctx.moveTo(cx, fy);
  for (let i = 0; i <= 10; i++) ctx.lineTo(cx + i * 3, fy + Math.sin(t * 4 + i * 0.7) * 2);
  for (let i = 10; i >= 0; i--) ctx.lineTo(cx + i * 3, fy + 14 + Math.sin(t * 4 + i * 0.7) * 2);
  ctx.fill();
}

function magazzini(ctx: C, W: number, H: number, c: Cielo, t: number) {
  const base = H * 0.9;
  ctx.fillStyle = c.sagoma;
  ctx.fillRect(0, base, W, H - base);
  const n = Math.max(5, Math.ceil(W / 150));
  const w = W / n;
  for (let i = 0; i < n; i++) {
    const x = i * w, h = H * 0.42;
    ctx.fillStyle = c.sagoma;
    ctx.fillRect(x + 4, base - h, w - 8, h);
    ctx.beginPath();
    ctx.moveTo(x, base - h);
    ctx.lineTo(x + w / 2, base - h - H * 0.12);
    ctx.lineTo(x + w, base - h);
    ctx.fill();
    ctx.fillStyle = alpha(c.cielo[c.cielo.length - 1], 0.08);
    ctx.fillRect(x + w * 0.3, base - h * 0.62, w * 0.4, h * 0.62); // il portone
    const num = i + 5;
    ctx.font = `600 ${Math.round(H * 0.1)}px "IM Fell English", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = num === 7 ? (c.luci ?? c.accento) : alpha(c.cielo[c.cielo.length - 1], 0.22);
    ctx.fillText(String(num), x + w / 2, base - h * 0.7);
  }
  // la lanterna del guardiano, che fa il giro
  if (c.luci) {
    const gx = ((Math.sin(t * 0.25) + 1) / 2) * W;
    lanterna(ctx, gx, base - 18, c.luci, t, 0.9);
  }
}

function chiesa(ctx: C, W: number, H: number, c: Cielo, t: number) {
  const oriz = H * 0.7;
  mare(ctx, W, H, oriz, H * 0.9, c, t);
  ctx.fillStyle = c.sagoma;
  ctx.fillRect(0, H * 0.9, W, H * 0.1);
  const cx = W * 0.42, w = 150, h = H * 0.42, base = H * 0.9;
  ctx.fillRect(cx - w / 2, base - h, w, h);
  ctx.beginPath();
  ctx.moveTo(cx - w / 2 - 6, base - h);
  ctx.lineTo(cx, base - h - 40);
  ctx.lineTo(cx + w / 2 + 6, base - h);
  ctx.fill();
  ctx.fillRect(cx + w / 2 - 6, base - h - H * 0.22, 34, h + H * 0.22); // campanile
  ctx.beginPath();
  ctx.moveTo(cx + w / 2 - 10, base - h - H * 0.22);
  ctx.lineTo(cx + w / 2 + 11, base - h - H * 0.34);
  ctx.lineTo(cx + w / 2 + 32, base - h - H * 0.22);
  ctx.fill();
  ctx.fillRect(cx - 1, base - h - 58, 2, 18); // croce
  ctx.fillRect(cx - 6, base - h - 52, 12, 2);
  // rosone e porta
  const luce = c.luci ?? "#ffe4b0";
  const f = 0.7 + 0.3 * Math.sin(t * 2.3);
  ctx.fillStyle = alpha(luce, c.luci ? 0.75 * f : 0.18);
  ctx.beginPath();
  ctx.arc(cx, base - h + 30, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - 12, base - 44, 24, 44);
  // case basse
  const r = generatore(9);
  for (let x = cx + w; x < W; x += 58) {
    const hh = 26 + r() * 30;
    ctx.fillStyle = c.sagoma;
    ctx.fillRect(x + 30, base - hh, 50, hh);
    finestra(ctx, x + 50, base - hh + 10, 7, 8, c.luci, t, x);
  }
}

function nave(ctx: C, W: number, H: number, c: Cielo, t: number) {
  // sottocoperta: legno, buio, una lanterna che dondola
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1a120c");
  g.addColorStop(1, "#070503");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // il boccaporto, da cui entra il cielo
  const bx = W * 0.72;
  const cg = ctx.createLinearGradient(0, 0, 0, 40);
  c.cielo.forEach((col, i) => cg.addColorStop(i / (c.cielo.length - 1), col));
  ctx.fillStyle = cg;
  ctx.fillRect(bx, 0, 90, 38);
  ctx.fillStyle = alpha(c.cielo[c.cielo.length - 1], 0.08);
  ctx.beginPath();
  ctx.moveTo(bx, 38);
  ctx.lineTo(bx - 60, H);
  ctx.lineTo(bx + 170, H);
  ctx.lineTo(bx + 90, 38);
  ctx.fill();
  // le costole dello scafo
  ctx.strokeStyle = "#2c1e13";
  ctx.lineWidth = 9;
  for (let x = -40; x < W + 80; x += 110) {
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.quadraticCurveTo(x + 30, H * 0.3, x + 10, -10);
    ctx.stroke();
  }
  ctx.fillStyle = "#23180f";
  ctx.fillRect(0, 36, W, 10); // il baglio
  // casse e catena
  ctx.fillStyle = "#120c07";
  const r = generatore(17);
  for (let i = 0; i < 8; i++) {
    const x = i * (W / 8) + r() * 20, h = 26 + r() * 30, w = 44 + r() * 30;
    ctx.fillRect(x, H - h, w, h);
  }
  ctx.strokeStyle = "#3a2c20";
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.ellipse(W * 0.24, 50 + i * 12, 3, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // la lanterna
  const ang = Math.sin(t * 1.2) * 0.22;
  const lx = W * 0.44 + Math.sin(ang) * 70, ly = 46 + Math.cos(ang) * 70;
  ctx.strokeStyle = "#2c1e13";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W * 0.44, 46);
  ctx.lineTo(lx, ly);
  ctx.stroke();
  const gl = ctx.createRadialGradient(lx, ly, 0, lx, ly, H * 1.1);
  gl.addColorStop(0, "rgba(255,196,110,.36)");
  gl.addColorStop(0.4, "rgba(255,170,80,.1)");
  gl.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffd28a";
  ctx.fillRect(lx - 3, ly, 6, 8);
}

const LUOGHI: Record<string, (ctx: C, W: number, H: number, c: Cielo, t: number) => void> = { banchina, gallo, archivio, magazzini, chiesa, nave };

/** Disegna una scena del panorama. `tensione` (0–3) scurisce i bordi: la Traccia del luogo. */
export function disegna(ctx: C, W: number, H: number, luogo: string, momento: string, t: number, tensione: number): void {
  const c = CIELI[momento] ?? CIELI.giorno;
  ctx.clearRect(0, 0, W, H);
  if (luogo !== "nave") cielo(ctx, W, H, c, t);
  (LUOGHI[luogo] ?? banchina)(ctx, W, H, c, t);
  // la sfumatura verso la pagina, e gli occhi addosso
  const s = ctx.createLinearGradient(0, H * 0.45, 0, H);
  s.addColorStop(0, "rgba(10,11,15,0)");
  s.addColorStop(1, "rgba(10,11,15,.96)");
  ctx.fillStyle = s;
  ctx.fillRect(0, 0, W, H);
  if (tensione > 0) {
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, W * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(120,20,12,${0.12 * tensione})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }
}
