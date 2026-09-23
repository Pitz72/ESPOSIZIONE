/**
 * Giocatori automatici (§24): fanno giocare molte partite con strategie diverse e
 * contano come finiscono. Servono a trovare vicoli ciechi ed errori, e a vedere se
 * una strategia batte tutte le altre. Non misurano il divertimento: quello no.
 */

import { intero } from "./dadi.ts";
import { agisci, vista, type VistaScelta } from "./motore.ts";
import { nuovaPartita, type Gioco } from "./stato.ts";

export type Politica = "casuale" | "prudente" | "temeraria";

export interface Resoconto {
  politica: Politica;
  partite: number;
  esiti: Record<string, number>;
  finali: Record<string, number>;
  bloccate: string[];
  errori: string[];
  passiMedi: number;
  azioniMedie: number;
  sceneViste: Set<string>;
}

function scegli(politica: Politica, scelte: VistaScelta[], rng: number): { id: string; rng: number } {
  let candidate = scelte;
  if (politica === "prudente") {
    const sicure = scelte.filter((s) => !s.ricevuta || s.ricevuta.grado === 0);
    if (sicure.length) candidate = sicure;
  } else if (politica === "temeraria") {
    const prove = scelte.filter((s) => s.ricevuta);
    if (prove.length) candidate = prove;
  }
  const i = intero(rng, 0, candidate.length - 1);
  return { id: candidate[i.valore].id, rng: i.stato };
}

export function simula(g: Gioco, politica: Politica, partite: number, semeIniziale = 1): Resoconto {
  const r: Resoconto = { politica, partite, esiti: {}, finali: {}, bloccate: [], errori: [], passiMedi: 0, azioniMedie: 0, sceneViste: new Set() };
  let passi = 0;
  let azioni = 0;
  for (let k = 0; k < partite; k++) {
    const seme = semeIniziale + k * 7919;
    let p = nuovaPartita(g, seme);
    let rng = seme ^ 0x5bd1e995;
    let n = 0;
    try {
      while (!p.finita && n < 600) {
        r.sceneViste.add(p.scena);
        const v = vista(g, p);
        const disponibili = v.scelte.filter((s) => s.disponibile);
        if (disponibili.length === 0) {
          r.bloccate.push(`${p.scena} (seme ${seme})`);
          break;
        }
        const c = scegli(politica, disponibili, rng);
        rng = c.rng;
        p = agisci(g, p, c.id).partita;
        n++;
      }
      r.sceneViste.add(p.scena);
      const esito = p.finita?.tipo ?? (n >= 600 ? "troppo lunga" : "bloccata");
      r.esiti[esito] = (r.esiti[esito] ?? 0) + 1;
      if (p.finita) r.finali[p.scena] = (r.finali[p.scena] ?? 0) + 1;
      passi += p.passo;
      azioni += n;
    } catch (e) {
      r.errori.push(`seme ${seme}, scena ${p.scena}: ${(e as Error).message}`);
    }
  }
  r.passiMedi = passi / partite;
  r.azioniMedie = azioni / partite;
  return r;
}
