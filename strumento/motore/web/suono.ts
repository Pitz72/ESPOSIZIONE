/**
 * Il suono, generato nel browser: niente file audio. Parte solo quando chi gioca
 * lo accende, e ogni funzione tace se il suono è spento.
 */

let ctx: AudioContext | null = null;
let principale: GainNode | null = null;
let mareNodo: { sorgente: AudioBufferSourceNode; guadagno: GainNode } | null = null;
let acceso = false;

function rumore(secondi: number, marrone = false): AudioBuffer {
  const c = ctx!;
  const b = c.createBuffer(1, Math.floor(c.sampleRate * secondi), c.sampleRate);
  const d = b.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    if (marrone) {
      ultimo = (ultimo + 0.02 * w) / 1.02;
      d[i] = ultimo * 3.5;
    } else d[i] = w;
  }
  return b;
}

export function accendi(): boolean {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      principale = ctx.createGain();
      principale.gain.value = 0.7;
      principale.connect(ctx.destination);
    }
    void ctx.resume();
    acceso = true;
    avviaMare();
    return true;
  } catch {
    return false;
  }
}

export function spegni(): void {
  acceso = false;
  if (mareNodo && ctx) {
    mareNodo.guadagno.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    const n = mareNodo;
    setTimeout(() => n.sorgente.stop(), 1500);
    mareNodo = null;
  }
}

export function eAcceso(): boolean {
  return acceso;
}

function avviaMare(): void {
  if (!ctx || !principale || mareNodo) return;
  const s = ctx.createBufferSource();
  s.buffer = rumore(8, true);
  s.loop = true;
  const filtro = ctx.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 420;
  const g = ctx.createGain();
  g.gain.value = 0;
  g.gain.setTargetAtTime(0.16, ctx.currentTime, 1.5);
  // l'onda che va e viene
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.09;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.07;
  lfo.connect(lfoG).connect(g.gain);
  lfo.start();
  s.connect(filtro).connect(g).connect(principale);
  s.start();
  mareNodo = { sorgente: s, guadagno: g };
}

/** Il volume del mare segue il luogo: sottocoperta si sente di più, in taverna quasi niente. */
export function mareA(forza: number): void {
  if (mareNodo && ctx) mareNodo.guadagno.gain.setTargetAtTime(0.16 * forza, ctx.currentTime, 0.8);
}

function colpo(quando: number, freq: number, durata: number, volume: number, tipo: BiquadFilterType = "bandpass"): void {
  const c = ctx!;
  const s = c.createBufferSource();
  s.buffer = rumore(durata);
  const f = c.createBiquadFilter();
  f.type = tipo;
  f.frequency.value = freq;
  f.Q.value = 3;
  const g = c.createGain();
  g.gain.setValueAtTime(volume, quando);
  g.gain.exponentialRampToValueAtTime(0.001, quando + durata);
  s.connect(f).connect(g).connect(principale!);
  s.start(quando);
}

function nota(quando: number, freq: number, durata: number, volume: number, tipo: OscillatorType = "sine", verso?: number): void {
  const c = ctx!;
  const o = c.createOscillator();
  o.type = tipo;
  o.frequency.setValueAtTime(freq, quando);
  if (verso) o.frequency.exponentialRampToValueAtTime(verso, quando + durata);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, quando);
  g.gain.exponentialRampToValueAtTime(volume, quando + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, quando + durata);
  o.connect(g).connect(principale!);
  o.start(quando);
  o.stop(quando + durata + 0.05);
}

/** Due dadi che rotolano su un tavolo di legno. */
export function dadi(durata = 1.1): void {
  if (!acceso || !ctx) return;
  const t = ctx.currentTime;
  let x = 0;
  while (x < durata) {
    colpo(t + x, 1800 + Math.random() * 2200, 0.04, 0.35 * (1 - x / durata) + 0.08);
    x += 0.035 + Math.random() * 0.09 * (x / durata + 0.3);
  }
  colpo(t + durata, 900, 0.08, 0.3);
}

/** Il timbro della capitaneria che cade sulla ricevuta. */
export function timbro(riesce: boolean): void {
  if (!acceso || !ctx) return;
  const t = ctx.currentTime;
  nota(t, 140, 0.22, 0.6, "sine", 50);
  colpo(t, 320, 0.12, 0.5, "lowpass");
  if (riesce) {
    nota(t + 0.18, 523, 0.6, 0.08, "triangle");
    nota(t + 0.26, 784, 0.8, 0.06, "triangle");
  } else {
    nota(t + 0.18, 196, 0.8, 0.09, "triangle", 174);
  }
}

/** Un battito sordo: una ferita. */
export function ferita(): void {
  if (!acceso || !ctx) return;
  const t = ctx.currentTime;
  nota(t, 70, 0.25, 0.7, "sine", 40);
  nota(t + 0.28, 64, 0.3, 0.55, "sine", 38);
}

/** La penna sul taccuino. */
export function penna(): void {
  if (!acceso || !ctx) return;
  const t = ctx.currentTime;
  for (let i = 0; i < 5; i++) colpo(t + i * 0.05, 5200, 0.05, 0.05, "highpass");
}

/** Una campana lontana: una svolta della storia. */
export function campana(): void {
  if (!acceso || !ctx) return;
  const t = ctx.currentTime;
  nota(t, 220, 3, 0.12, "sine");
  nota(t, 440 * 1.19, 2.2, 0.05, "sine");
  nota(t, 660 * 1.01, 1.6, 0.03, "sine");
}
