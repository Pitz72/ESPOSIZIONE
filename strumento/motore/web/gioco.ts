/**
 * La versione elettronica del librogame: un'interfaccia sul motore, come la riga
 * di comando. Usa solo `vista` e `agisci`; tutte le regole stanno nel motore.
 */

import ambJson from "../dati/porto.ambientazione.json" with { type: "json" };
import storiaJson from "../dati/santa-rita.storia.json" with { type: "json" };
import type { Ambientazione, Storia } from "../src/tipi.ts";
import { prepara, nuovaPartita, type Evento, type Partita } from "../src/stato.ts";
import { agisci, vista, type RicevutaPiena, type Vista, type VistaScelta } from "../src/motore.ts";
import { numerazione } from "../src/libro.ts";

const amb = ambJson as unknown as Ambientazione;
const storia = storiaJson as unknown as Storia;
const g = prepara(amb, storia);
const paragrafo = numerazione(storia);
const CHIAVE = "esposizione:santa-rita:partita";

let partita: Partita;
let eventi: Evento[] = [];
let aperta: string | null = null; // la prova di cui si sta leggendo la ricevuta
let confermaRicomincia = false;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

// ---------------------------------------------------------------------------
// Salvataggio nel browser: una comodità, mai necessario
// ---------------------------------------------------------------------------

function salva(): void {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify({ partita, eventi }));
  } catch {
    /* il browser non conserva niente: si gioca lo stesso */
  }
}

function carica(): { partita: Partita; eventi: Evento[] } | null {
  try {
    const s = localStorage.getItem(CHIAVE);
    if (!s) return null;
    const d = JSON.parse(s);
    vista(g, d.partita); // se i dati sono cambiati e la partita non vale più, si ricomincia
    return d;
  } catch {
    return null;
  }
}

function nuova(): void {
  partita = nuovaPartita(g, Math.floor(Math.random() * 1_000_000));
  eventi = [];
  aperta = null;
  confermaRicomincia = false;
  salva();
}

// ---------------------------------------------------------------------------
// Testo
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function prosa(s: string): string {
  return s
    .split(/\n\n+/)
    .map((par) => `<p>${esc(par).replace(/\*([^*]+)\*/g, "<em>$1</em>")}</p>`)
    .join("");
}

const DADO = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const GRADI = ["al coperto", "esposto", "allo scoperto"];

// ---------------------------------------------------------------------------
// Ricevuta
// ---------------------------------------------------------------------------

function ricevuta(r: RicevutaPiena): string {
  const righe = r.righe
    .map((x) => {
      const v = x.tipo === "partenza" ? String(x.valore) : x.valore > 0 ? `+${x.valore}` : `−${-x.valore}`;
      return `<li class="riga${x.conta ? "" : " spenta"}"><span class="num">${v}</span><span>${esc(x.testo)}${x.nota ? `<small>${esc(x.nota)}</small>` : ""}</span></li>`;
    })
    .join("");
  const nota =
    r.nota ??
    (r.somma < r.grado ? `${r.capacita} non scende sotto ${GRADI[r.fondo]}` : r.somma > 2 ? "più di allo scoperto non si va" : "");
  return `
    <div class="ricevuta">
      <ol class="righe">${righe}</ol>
      <div class="totale"><span class="num">${r.somma < 0 ? `−${-r.somma}` : r.somma}</span><span class="grado" data-g="${r.grado}">${GRADI[r.grado]}</span>${nota ? `<small>${esc(nota)}</small>` : ""}</div>
      <p class="tiro">Prova <strong>${r.sogliaNome}</strong> (${r.soglia}) · ${esc(r.capacita)}, ${r.livello} (+${r.bonus})${r.penalita ? `, penalità −${r.penalita}` : ""} · <strong>riesci ${r.probabilita} volte su 100</strong>${r.unColpoSolo ? " · <em>una volta sola</em>" : ""}${r.ritento ? " · ritentare costa un passo" : ""}</p>
      ${r.posta ? `<p class="posta">${esc(r.posta)}</p>` : ""}
    </div>`;
}

// ---------------------------------------------------------------------------
// Eventi dell'ultima azione
// ---------------------------------------------------------------------------

function cronaca(ev: Evento[]): string {
  if (!ev.length) return "";
  const voci = ev
    .map((e) => {
      if (e.tipo === "tiro") {
        const m = e.testo.match(/^(.*?): (\d) \+ (\d) (.*)$/);
        if (m) return `<li class="ev tiro"><span class="dadi" aria-hidden="true">${DADO[+m[2]]}${DADO[+m[3]]}</span><span>${esc(m[1])}: ${m[2]} + ${m[3]} ${esc(m[4])}</span></li>`;
      }
      return `<li class="ev ${e.tipo}">${esc(e.testo)}</li>`;
    })
    .join("");
  return `<ul class="cronaca" aria-label="Che cosa è appena successo">${voci}</ul>`;
}

// ---------------------------------------------------------------------------
// Scelte
// ---------------------------------------------------------------------------

function scelta(s: VistaScelta, i: number): string {
  if (!s.disponibile) {
    return `<li class="scelta chiusa"><span class="testo">${esc(s.testo)}</span><span class="richiede">Richiede: ${esc(s.richiede ?? "non disponibile")}</span></li>`;
  }
  const etichetta = s.tipo === "finestra" ? "finestra" : s.povera ? "via povera" : s.tipo === "difesa" ? "difesa" : s.tipo === "parlare" ? "una volta sola" : "";
  const r = s.ricevuta;
  const riassunto = r
    ? `<span class="riassunto"><span class="grado" data-g="${r.grado}">${GRADI[r.grado]}</span> ${r.probabilita}%</span>`
    : "";
  const selezionata = aperta === s.id;
  return `
    <li class="scelta${selezionata ? " aperta" : ""}">
      <button type="button" class="voce" data-scelta="${esc(s.id)}" ${r ? `aria-expanded="${selezionata}"` : ""}>
        <span class="indice">${i}</span>
        <span class="testo">${esc(s.testo)}${etichetta ? ` <span class="etichetta">${etichetta}</span>` : ""}</span>
        ${riassunto}
      </button>
      ${
        r && selezionata
          ? `${ricevuta(r)}<div class="azioni"><button type="button" class="primario" data-tira="${esc(s.id)}">Tira i dadi</button><button type="button" class="secondario" data-chiudi>Scegli un'altra via</button></div>`
          : ""
      }
    </li>`;
}

// ---------------------------------------------------------------------------
// Scheda
// ---------------------------------------------------------------------------

function scheda(v: Vista): string {
  const giorno = amb.momenti.reduce((s, m) => s + m.passi, 0);
  const nelGiorno = partita.passo % giorno;
  let cont = 0;
  const tempo = amb.momenti
    .map((m) => {
      const caselle = Array.from({ length: m.passi }, () => `<i class="${cont++ < nelGiorno ? "piena" : ""}"></i>`).join("");
      return `<div class="momento"><span>${esc(m.nome.split(",")[0])}</span><span class="caselle">${caselle}</span></div>`;
    })
    .join("");
  const scadenze = storia.scadenze
    .map((s) => `<div class="blocco"><h3>${esc(s.nome)}</h3><span class="caselle grande">${Array.from({ length: s.caselle }, (_, i) => `<i class="${i < partita.scadenze[s.id] ? "piena" : ""}"></i>`).join("")}</span></div>`)
    .join("");
  const logorio = amb.logorii
    .map((l) => {
      const st = partita.logorio[l.id].stadio;
      return `<li><span>${esc(l.nome)}</span><span class="stadio" data-s="${st}">${esc(l.stadi[st - 1])}</span></li>`;
    })
    .join("");
  const traccia = amb.luoghi
    .map((l) => {
      const t = partita.traccia[l.zona] ?? 0;
      return `<li${l.nome === v.scena.luogo ? ' class="qui"' : ""}><span>${esc(l.nome)}</span><span class="caselle">${[0, 1, 2].map((i) => `<i class="${i < t ? "piena" : ""}"></i>`).join("")}</span></li>`;
    })
    .join("");
  const lista = (xs: string[], vuoto: string) => (xs.length ? `<ul class="elenco">${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="vuoto">${vuoto}</p>`);
  return `
    <div class="blocco"><h3>Il tempo</h3><div class="tempo">${tempo}</div></div>
    ${scadenze}
    <div class="blocco"><h3>Come stai</h3><ul class="coppie">${logorio}</ul>${lista(v.stato.ferite, "Nessuna ferita.")}${lista(v.stato.protezioni, "")}</div>
    <div class="blocco"><h3>Traccia</h3><ul class="coppie traccia">${traccia}</ul></div>
    <div class="blocco"><h3>Capacità</h3><ul class="coppie">${v.stato.capacita.map((c) => { const [n, l] = c.split(": "); return `<li><span>${esc(n)}</span><span class="livello">${esc(l)}</span></li>`; }).join("")}</ul></div>
    <div class="blocco"><h3>Oggetti</h3>${lista(v.stato.oggetti, "Niente.")}</div>
    <div class="blocco"><h3>Taccuino</h3>${lista(v.stato.conoscenze, "Non sai ancora niente di preciso.")}${v.stato.parole.length ? `<p class="parole">${v.stato.parole.map(esc).join(" · ")}</p>` : ""}</div>`;
}

// ---------------------------------------------------------------------------
// Pagina
// ---------------------------------------------------------------------------

function disegna(): void {
  const v = vista(g, partita);
  const n = paragrafo.get(v.scena.id);
  let i = 0;
  const conf = v.confronto
    ? `<div class="confronto" data-finestra="${v.confronto.finestra}">
         <div><strong>${esc(v.confronto.avversario)}</strong> · ${esc(v.confronto.natura)}</div>
         <div class="copertura" aria-label="Copertura: ${esc(v.confronto.copertura)}">${GRADI.map((gr) => `<span class="${gr === v.confronto!.copertura ? "attuale" : ""}">${gr}</span>`).join("")}</div>
         ${v.confronto.inDifesa ? '<p class="allarme">Ti attacca: difenditi.</p>' : v.confronto.finestra ? '<p class="allarme finestra">La finestra è aperta: decidi tu come finisce.</p>' : ""}
       </div>`
    : "";
  const finale = v.finale
    ? `<div class="finale" data-tipo="${v.finale}"><p>${{ vittoria: "Ce l'hai fatta.", sconfitta: "La storia finisce qui.", morte: "La tua storia finisce qui." }[v.finale]}</p><button type="button" class="primario" data-nuova>Ricomincia da capo</button></div>`
    : "";

  $("#scena").innerHTML = `
    ${cronaca(eventi)}
    <header class="intestazione">
      <p class="dove">${esc(v.scena.luogo)} · ${esc(v.scena.momento)}${n ? ` · <span title="Il paragrafo corrispondente nel libro stampato">paragrafo ${n}</span>` : ""}</p>
      <h2>${esc(v.scena.titolo)}</h2>
    </header>
    <div class="prosa">${prosa(v.scena.testo)}</div>
    ${conf}
    ${finale}
    ${v.scelte.length ? `<ol class="scelte">${v.scelte.map((s) => scelta(s, s.disponibile ? ++i : 0)).join("")}</ol>` : ""}`;
  $("#scheda-corpo").innerHTML = scheda(v);
  const ric = $("#ricomincia");
  ric.textContent = confermaRicomincia ? "Sicuro? Ricomincia" : "Ricomincia";
  ric.classList.toggle("avviso", confermaRicomincia);
}

function esegui(id: string): void {
  const r = agisci(g, partita, id);
  partita = r.partita;
  eventi = r.eventi;
  aperta = null;
  salva();
  disegna();
  $("#scena").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

function avvia(dati: { partita?: Partita; eventi?: Evento[] }): void {
  const salvata = dati.partita ? { partita: dati.partita, eventi: dati.eventi ?? [] } : carica();
  if (salvata) {
    partita = salvata.partita;
    eventi = salvata.eventi;
  } else nuova();

  document.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest("button");
    if (!t) return;
    if (t.id === "ricomincia") {
      if (confermaRicomincia) nuova();
      else confermaRicomincia = true;
      disegna();
      return;
    }
    confermaRicomincia = false;
    if (t.id === "mostra-scheda") {
      const aside = $("#scheda");
      const aperto = aside.dataset.aperta === "true";
      aside.dataset.aperta = String(!aperto);
      t.setAttribute("aria-expanded", String(!aperto));
      t.textContent = aperto ? "Mostra la scheda" : "Nascondi la scheda";
      return;
    }
    if (t.dataset.nuova !== undefined) {
      nuova();
      disegna();
      return;
    }
    if (t.dataset.chiudi !== undefined) {
      aperta = null;
      disegna();
      return;
    }
    if (t.dataset.tira) return esegui(t.dataset.tira);
    const id = t.dataset.scelta;
    if (!id) return;
    const s = vista(g, partita).scelte.find((x) => x.id === id);
    if (!s) return;
    // Una prova mostra prima la ricevuta: si tira solo dopo averla letta (§10).
    if (s.ricevuta) {
      aperta = aperta === id ? null : id;
      disegna();
    } else esegui(id);
  });

  disegna();
}

const hot = (window as unknown as { claude?: { hot?: { snapshot?: (f: () => unknown) => void; ready?: (f: (d: object) => void) => void; data?: object } } }).claude?.hot;
hot?.snapshot?.(() => ({ partita, eventi }));
if (hot?.ready) hot.ready(avvia);
else avvia(hot?.data ?? {});
