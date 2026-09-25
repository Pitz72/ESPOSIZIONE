/**
 * L'app web della Santa Rita: un'interfaccia sul motore, come la riga di comando
 * e il librogame. Chiede al motore `vista` e `agisci`, e disegna quello che riceve:
 * tutte le regole stanno nel motore, qui ci sono soltanto luce, carta e dadi.
 */

import ambJson from "../dati/porto.ambientazione.json" with { type: "json" };
import storiaJson from "../dati/santa-rita.storia.json" with { type: "json" };
import type { Ambientazione, Fascia, Storia } from "../src/tipi.ts";
import { prepara, nuovaPartita, type DatiEsito, type DatiTiro, type Evento, type Partita } from "../src/stato.ts";
import { agisci, vista, type Quadro, type Vista, type VistaScelta } from "../src/motore.ts";
import { numerazione } from "../src/libro.ts";
import { CIELI, disegna as disegnaPanorama } from "./panorama.ts";
import * as suono from "./suono.ts";

const amb = ambJson as unknown as Ambientazione;
const storia = storiaJson as unknown as Storia;
const g = prepara(amb, storia);
const paragrafo = numerazione(storia);
const CHIAVE = "esposizione:santa-rita:app:3";
const GRADI = ["al coperto", "esposto", "allo scoperto"];
const FASCE: Record<Fascia, string> = { pieno: "In pieno", riesci: "Riesci", quasi: "Quasi", non: "Non riesci" };
const PARTE: Record<string, string> = { tratto: "tratto", notizia: "notizia", proprieta: "luogo", legame: "legame", "stato d'animo": "umore", scena: "scena", cosa: "cosa", aiuto: "aiuto", ferita: "ferita", logorio: "logorio" };
const moto = () => !matchMedia("(prefers-reduced-motion: reduce)").matches;

interface VoceDiario {
  scena: string;
  titolo: string;
  luogo: string;
  momento: string;
  n?: number;
  testo: string;
  continua?: boolean;
  scelta?: string;
  eventi: Evento[];
}

let partita: Partita;
let diario: VoceDiario[] = [];
let ultimi: Evento[] = [];
let quadri = 0;
let iniziata = false;
let rollio: { id: string; esito: ReturnType<typeof agisci>; prima: Partita; testo: string } | null = null;
let fase: "quadro" | "tiro" | "timbro" = "quadro";
let aperta: VistaScelta | null = null;

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T;

// ---------------------------------------------------------------------------
// Salvataggio
// ---------------------------------------------------------------------------

function salva(): void {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify({ partita, diario: diario.slice(-40), quadri, suono: suono.eAcceso() }));
  } catch {
    /* il browser non conserva: si gioca lo stesso */
  }
}

function carica(): { partita: Partita; diario: VoceDiario[]; quadri: number; suono?: boolean } | null {
  try {
    const s = localStorage.getItem(CHIAVE);
    if (!s) return null;
    const d = JSON.parse(s);
    vista(g, d.partita);
    return d;
  } catch {
    return null;
  }
}

function voceDi(p: Partita, continua = false): VoceDiario {
  const v = vista(g, p);
  return { scena: v.scena.id, titolo: v.scena.titolo, luogo: v.scena.luogo, momento: v.scena.momento, n: paragrafo.get(v.scena.id), testo: v.scena.testo, continua, eventi: [] };
}

function nuova(): void {
  partita = nuovaPartita(g, Math.floor(Math.random() * 1_000_000));
  diario = [voceDi(partita)];
  ultimi = [];
  quadri = 0;
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
    .map((p) => `<p>${esc(p).replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/«([^»]+)»/g, '<span class="battuta">«$1»</span>')}</p>`)
    .join("");
}

const oreGiorno = amb.momenti.reduce((s, m) => s + m.ore, 0);

const momentoId = (p: Partita) => {
  let resto = p.ora % oreGiorno;
  let i = amb.momenti.findIndex((m) => m.id === storia.momentoIniziale);
  while (resto >= amb.momenti[i].ore) {
    resto -= amb.momenti[i].ore;
    i = (i + 1) % amb.momenti.length;
  }
  return amb.momenti[i].id;
};

const luogoId = (p: Partita) => g.scene.get(p.scena)!.luogo;

// ---------------------------------------------------------------------------
// Il panorama
// ---------------------------------------------------------------------------

const tela = () => $<HTMLCanvasElement>("#panorama");
let panoramaStato = { luogo: "banchina", momento: "alba", tensione: 0 };
const inizioTempo = performance.now();

function ridimensiona(): void {
  const c = tela();
  const r = c.getBoundingClientRect();
  const d = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.max(1, Math.round(r.width * d));
  c.height = Math.max(1, Math.round(r.height * d));
  c.getContext("2d")!.setTransform(d, 0, 0, d, 0, 0);
  panorama();
}

function panorama(): void {
  const c = tela();
  const r = c.getBoundingClientRect();
  const t = moto() ? (performance.now() - inizioTempo) / 1000 : 12;
  disegnaPanorama(c.getContext("2d")!, r.width, r.height, panoramaStato.luogo, panoramaStato.momento, t, panoramaStato.tensione);
}

function anima(): void {
  if (moto() && !document.hidden) panorama();
  requestAnimationFrame(anima);
}

function aggiornaPanorama(p: Partita): void {
  const luogo = luogoId(p);
  const momento = momentoId(p);
  const zona = amb.luoghi.find((l) => l.id === luogo)!.zona;
  const cambia = luogo !== panoramaStato.luogo || momento !== panoramaStato.momento;
  panoramaStato = { luogo, momento, tensione: p.traccia[zona] ?? 0 };
  document.documentElement.style.setProperty("--acc", CIELI[momento]?.accento ?? "#8ccde2");
  if (cambia && moto()) {
    const pan = $(".panorama");
    pan.classList.remove("cambio");
    void pan.offsetWidth;
    pan.classList.add("cambio");
  }
  suono.mareA({ nave: 1.4, banchina: 1, chiesa: 0.8, magazzini: 0.5, archivio: 0.3, gallo: 0.2 }[luogo] ?? 0.6);
  panorama();
}

// ---------------------------------------------------------------------------
// Il diario
// ---------------------------------------------------------------------------

const DADO = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function eventiHtml(ev: Evento[]): string {
  const out: string[] = [];
  for (const e of ev) {
    if (e.tipo === "tiro" && e.dati && "dadi" in e.dati) {
      const d = e.dati as DatiTiro;
      const b = d.bonus >= 0 ? `+ ${d.bonus}` : `− ${-d.bonus}`;
      out.push(`<li class="ev tiro"><span class="glifi">${DADO[d.dadi[0]]}${DADO[d.dadi[1]]}</span>${esc(e.testo.split(":")[0])}: ${d.dadi[0]} + ${d.dadi[1]} ${b} = ${d.totale} contro ${d.soglia}</li>`);
    } else if (e.tipo === "esito" && e.dati && "fascia" in e.dati) {
      const d = e.dati as DatiEsito;
      out.push(`<li class="ev esito" data-g="${d.grado}" data-f="${d.fascia}">${esc(e.testo)}</li>`);
    } else {
      out.push(`<li class="ev ${e.tipo}">${esc(e.testo)}</li>`);
    }
  }
  return out.length ? `<ul class="eventi">${out.join("")}</ul>` : "";
}

function disegnaDiario(): void {
  const el = $("#diario");
  el.innerHTML = diario
    .map((v, i) => {
      const ultima = i === diario.length - 1;
      const testa = v.continua
        ? `<p class="sopra">${esc(v.titolo)} · la scena continua</p>`
        : `<p class="sopra">${esc(v.luogo)} · ${esc(v.momento.split(",")[0])}${v.n ? ` · paragrafo ${v.n}` : ""}</p><h2>${esc(v.titolo)}</h2>`;
      return `<article class="voce${ultima ? " presente" : " passata"}">
        ${testa}
        ${v.continua ? "" : `<div class="prosa">${prosa(v.testo)}</div>`}
        ${v.scelta ? `<p class="scelto"><span>»</span> ${esc(v.scelta)}</p>` : ""}
        ${eventiHtml(v.eventi)}
      </article>`;
    })
    .join("");
  const presente = el.querySelector(".presente") as HTMLElement | null;
  if (presente) {
    const alto = presente.offsetTop - 12;
    el.scrollTo({ top: alto, behavior: moto() && iniziata ? "smooth" : "auto" });
  }
}

// ---------------------------------------------------------------------------
// Le scelte
// ---------------------------------------------------------------------------

function etichetta(s: VistaScelta): string {
  if (s.tipo === "finestra") return "finestra";
  if (s.tipo === "difesa") return "difesa";
  if (s.tipo === "parlare" || s.quadro?.unColpoSolo) return "una volta sola";
  if (s.ripiego) return "ripiego";
  if (s.tipo === "riprova") return "ti costa un'ora";
  if (s.tipo === "ripensa") return "ci ripensi";
  if (s.tipo === "deduci") return "ragioni";
  return "";
}

function disegnaScelte(v: Vista): void {
  let i = 0;
  const conf = v.confronto
    ? `<div class="confronto" data-finestra="${v.confronto.finestra}" data-difesa="${v.confronto.inDifesa}">
        <div class="conf-testa"><span class="conf-nome">${esc(v.confronto.avversario)}</span><span class="conf-natura">${esc(v.confronto.natura)}</span></div>
        <div class="copertura">${GRADI.map((gr, k) => `<span data-g="${k}" class="${gr === v.confronto!.copertura ? "attuale" : ""}">${gr}</span>`).join("")}</div>
        ${v.confronto.inDifesa ? '<p class="allarme">Ti attacca. Difenditi.</p>' : v.confronto.finestra ? '<p class="allarme finestra">La finestra è aperta: decidi tu come finisce.</p>' : ""}
      </div>`
    : "";
  const sospeso = v.sospeso ? `<p class="sospeso" data-t="${v.sospeso.tipo}">${esc(v.sospeso.testo)}</p>` : "";
  const voci = v.scelte
    .map((s) => {
      if (!s.disponibile) {
        return `<li><div class="risposta chiusa" data-da="${s.chiusaDa ?? ""}"><span class="num">·</span><span class="t">${esc(s.testo)}<small>${s.chiusaDa === "convinzione" ? "" : "Richiede: "}${esc(s.richiede ?? "non disponibile")}</small></span></div></li>`;
      }
      i++;
      const q = s.quadro;
      const tag = etichetta(s);
      return `<li><button type="button" class="risposta${q ? " prova" : ""}${s.tipo === "quasi" ? " quasi" : ""}" data-scelta="${esc(s.id)}" aria-keyshortcuts="${i}">
        <span class="num">${i}</span>
        <span class="t">${esc(s.testo)}${tag ? `<em class="tag">${tag}</em>` : ""}${s.costa ? `<small>Costa: ${esc(s.costa)}</small>` : ""}</span>
        ${q ? `<span class="pill" data-g="${q.grado}">${GRADI[q.grado]}<b>${q.riesci.nonSiTira ? "sicuro" : `${q.riesci.probabilita}%`}</b></span>` : ""}
      </button></li>`;
    })
    .join("");
  $("#dock").innerHTML = v.finale ? "" : `${conf}${sospeso}<ol class="risposte">${voci}</ol>`;
}

// ---------------------------------------------------------------------------
// La scheda
// ---------------------------------------------------------------------------

function pip(n: number, pieni: number, cls = ""): string {
  return `<span class="pips ${cls}">${Array.from({ length: n }, (_, i) => `<i class="${i < pieni ? "on" : ""}"></i>`).join("")}</span>`;
}

const STATO_NOTIZIA: Record<string, string> = { sentita: "sentita dire", verificata: "verificata", smentita: "smentita" };

function disegnaScheda(v: Vista): void {
  const nelGiorno = partita.ora % oreGiorno;
  let k = 0;
  const tempo = amb.momenti
    .map((m) => `<div class="giornata-m" data-m="${m.id}" style="grid-template-columns: repeat(${m.ore}, 1fr)">${Array.from({ length: m.ore }, () => { const c = k < nelGiorno ? "fatto" : k === nelGiorno ? "ora" : ""; k++; return `<span class="${c}"></span>`; }).join("")}<em>${esc(m.nome.split(",")[0].replace(/^(l'|il |la )/, ""))}</em></div>`)
    .join("");
  const sc = storia.scadenze[0];
  const pieno = partita.scadenze[sc.id];
  const scadenza = `<div class="scadenza${pieno >= sc.caselle - 2 ? " urgente" : ""}"><div class="sez"><span>${esc(sc.nome)}</span><span>${pieno} / ${sc.caselle}</span></div>${pip(sc.caselle, pieno, "nave")}</div>`;
  const logorio = amb.logorii
    .map((l) => {
      const st = partita.logorio[l.id].stadio;
      return `<div class="metro" data-s="${st}"><span class="nome">${esc(l.nome)}</span><span class="stato">${esc(l.stadi[st - 1])}</span>${pip(3, st, "stadio")}</div>`;
    })
    .join("");
  const umori = v.stato.statiAnimo.map((s) => `<li class="umore"><span>${esc(s)}</span></li>`).join("");
  const ferite = partita.ferite.length
    ? partita.ferite.map((f) => `<li class="ferita" data-g="${f.gravita}"><span>${esc(f.nome)}</span><b>${f.gravita}</b></li>`).join("")
    : '<li class="vuoto">Nessuna ferita</li>';
  const prot = Object.entries(partita.protezioni).map(([id, s]) => `<li><span>${esc(amb.protezioni.find((x) => x.id === id)?.nome ?? id)}</span><b>${["intatta", "rovinata", "rotta"][s]}</b></li>`).join("");
  const qui = luogoId(partita);
  const traccia = amb.luoghi
    .map((l) => `<li class="${l.id === qui ? "qui" : ""}"><span>${esc(l.nome.replace(/^(La |L'|I |Il )/, ""))}</span>${pip(3, partita.traccia[l.zona] ?? 0, "occhi")}</li>`)
    .join("");
  const capacita = amb.capacita
    .map((c) => {
      const liv = partita.livelli[c.id] ?? 0;
      return `<li><span>${esc(c.nome)}</span><span class="liv">${["Inesperto", "Pratico", "Esperto", "Maestro"][liv]}</span>${pip(3, liv, "liv")}</li>`;
    })
    .join("");
  const tratti = v.stato.tratti.map((t) => `<li><b class="nome-t">${esc(t.nome)}</b><small>${esc(t.effetti)}${t.origine ? ` · ${esc(t.origine)}` : ""}</small></li>`).join("");
  const convinzioni = v.stato.convinzioni.length
    ? v.stato.convinzioni.map((c) => `<li class="${c.inDubbio ? "dubbio" : ""}">«${esc(c.testo)}»${c.inDubbio ? "<small>in dubbio</small>" : ""}</li>`).join("")
    : '<li class="vuoto">Nessuna</li>';
  const persone = v.stato.persone.length ? v.stato.persone.map((p) => `<li><b class="nome-t">${esc(p.nome)}</b><small>${esc(p.parole)}</small></li>`).join("") : '<li class="vuoto">Non conosci ancora nessuno.</li>';
  const taccuino = v.stato.notizie.length
    ? v.stato.notizie.map((n) => `<li data-s="${n.stato}">${esc(n.testo)}<small>${STATO_NOTIZIA[n.stato]}${n.contrasto.length ? " · non può essere vera insieme a un'altra" : ""}</small></li>`).join("")
    : '<li class="vuoto">Non sai ancora niente di preciso.</li>';
  const cose = v.stato.cose.map((o) => `<li><span>${esc(o.nome)}${o.quante > 1 ? ` ×${o.quante}` : ""}</span>${o.stato ? `<b>${esc(o.stato)}</b>` : ""}</li>`).join("") || '<li class="vuoto">Niente</li>';
  $("#scheda-corpo").innerHTML = `
    <section><div class="sez"><span>La giornata</span><span>ora ${partita.ora}</span></div><div class="giornata">${tempo}</div></section>
    <section>${scadenza}</section>
    <section><div class="sez"><span>Come stai</span></div>${logorio}<ul class="righe-scheda">${umori}${ferite}${prot}</ul></section>
    <section><div class="sez"><span>Tratti</span></div><ul class="lista-scheda">${tratti}</ul></section>
    <section><div class="sez"><span>Traccia</span><span>chi ti ha notato</span></div><ul class="righe-scheda">${traccia}</ul></section>
    <section><div class="sez"><span>Persone</span></div><ul class="lista-scheda">${persone}</ul></section>
    <section><div class="sez"><span>Taccuino</span><span>${v.stato.notizie.length}</span></div><ul class="taccuino">${taccuino}</ul>${v.stato.parole.length ? `<p class="parole">${v.stato.parole.map((p) => `<span>${esc(p)}</span>`).join("")}</p>` : ""}</section>
    <section><div class="sez"><span>Convinzioni</span></div><ul class="taccuino convinzioni">${convinzioni}</ul></section>
    <section><div class="sez"><span>Capacità</span></div><ul class="righe-scheda capacita">${capacita}</ul></section>
    <section><div class="sez"><span>Cose</span></div><ul class="righe-scheda">${cose}</ul></section>`;
}

// ---------------------------------------------------------------------------
// Il quadro, i dadi e i timbri
// ---------------------------------------------------------------------------

const PUNTI: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
const FACCE: Record<number, [number, number]> = { 1: [0, 0], 6: [0, 180], 2: [0, -90], 5: [0, 90], 3: [-90, 0], 4: [90, 0] };

function dado(id: string): string {
  const facce = [1, 2, 3, 4, 5, 6]
    .map((n) => `<div class="faccia f${n}">${Array.from({ length: 9 }, (_, i) => `<i class="${PUNTI[n].includes(i) ? "p" : ""}"></i>`).join("")}</div>`)
    .join("");
  return `<div class="dado-lancio"><div class="dado" id="${id}">${facce}</div></div>`;
}

const segno = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0");

function sezioneRiesci(q: Quadro): string {
  const r = q.riesci;
  const righe = r.righe
    .map((x) => {
      const v = x.tipo === "soglia" ? String(x.valore) : x.tipo === "nota" ? "" : segno(x.valore);
      const parte = x.parte && x.tipo !== "soglia" && x.tipo !== "livello" ? `<em class="parte">${PARTE[x.parte] ?? x.parte}</em>` : "";
      return `<li class="${x.conta ? "" : "spenta"}"><span class="v">${v}</span><span class="c">${esc(x.testo)}${parte}${x.nota ? `<small>${esc(x.nota)}</small>` : ""}</span></li>`;
    })
    .join("");
  const f = r.fasce;
  const barra = r.nonSiTira
    ? '<p class="carta-nota">Sotto Facile: non si tira, riesci.</p>'
    : `<div class="fasce" role="img" aria-label="In pieno ${f.pieno}, riesci ${f.riesci}, quasi ${f.quasi}, non riesci ${f.non}, su 100">
        ${(["pieno", "riesci", "quasi", "non"] as Fascia[]).map((k) => `<span data-f="${k}" style="flex-grow:${Math.max(f[k], 0.001)}"><b>${f[k]}</b><i>${FASCE[k]}</i></span>`).join("")}
      </div>
      <p class="carta-dadi">I dadi devono fare ${r.dadi}</p>`;
  return `<section class="sez-carta"><h4>Ci riesci?</h4><ol class="carta-righe">${righe}</ol>${barra}</section>`;
}

function sezioneCosta(q: Quadro): string {
  const c = q.costo;
  const righe = c.righe
    .map((x) => {
      const v = x.tipo === "partenza" ? String(x.valore) : segno(x.valore);
      return `<li class="${x.conta ? "" : "spenta"}"><span class="v">${v}</span><span class="c">${esc(x.testo)}${x.nota ? `<small>${esc(x.nota)}</small>` : ""}</span></li>`;
    })
    .join("");
  return `<section class="sez-carta"><h4>Quanto ti costa?</h4><ol class="carta-righe">${righe}</ol>
    <div class="carta-totale"><span class="v">${segno(c.somma).replace("+", "")}</span><span class="grado" data-g="${q.grado}">${GRADI[q.grado]}</span></div>
    ${c.nota ? `<p class="carta-nota">${esc(c.nota)}</p>` : ""}</section>`;
}

function sezioneDopo(q: Quadro): string {
  const d = q.dopo;
  return `<section class="sez-carta"><h4>Che cosa cambia?</h4><ul class="carta-dopo">
      <li><b>Riesci</b> ${esc(d.riesci)}${q.riesci.fasce.pieno ? `; in pieno, ${esc(d.pieno)}` : ""}</li>
      <li><b>Quasi</b> scegli tu: ${esc(d.quasi.join(" · "))}</li>
      <li><b>Non riesci</b> ${esc(d.nonRiesci)}</li>
      ${d.persone.map((x) => `<li><b>Persone</b> ${esc(x)}</li>`).join("")}
    </ul>
    ${d.posta ? `<p class="carta-posta">${esc(d.posta)}</p>` : ""}
    ${q.unColpoSolo ? '<p class="carta-nota">Una volta sola: non si ritenta.</p>' : ""}
    ${q.ritento ? '<p class="carta-nota">Ritentare ti costa un\'ora.</p>' : ""}</section>`;
}

function apriFoglio(s: VistaScelta): void {
  const q = s.quadro!;
  aperta = s;
  fase = "quadro";
  $("#foglio-carta").innerHTML = `
    <header class="carta-testa">
      <span>Capitaneria del porto</span>
      <span>Quadro n. ${String(quadri + 1).padStart(4, "0")}</span>
    </header>
    <p class="carta-quando">${esc(vista(g, partita).scena.momento.split(",")[0])} · ora ${partita.ora} · ${esc(q.capacita)}, ${esc(q.ambito)}</p>
    <h3 class="carta-azione">${esc(s.testo)}</h3>
    <section class="sez-carta"><h4>Puoi farlo?</h4><p class="carta-puoi">${q.puoi.aperta ? "Sì" : "No"}${q.puoi.righe.length ? ` · ${esc(q.puoi.righe.join(" · "))}` : ""}</p></section>
    ${sezioneRiesci(q)}
    ${sezioneCosta(q)}
    ${sezioneDopo(q)}
    <div class="timbri" id="timbri" hidden></div>`;
  $("#vassoio").innerHTML = dado("d1") + dado("d2");
  $("#vassoio").hidden = true;
  $("#conto").textContent = "";
  $("#tira").hidden = false;
  $("#tira").textContent = q.riesci.nonSiTira ? "Procedi" : "Tira i dadi";
  $("#altra").hidden = false;
  $("#foglio").hidden = false;
  $("#foglio").scrollTop = 0;
  requestAnimationFrame(() => $("#foglio").classList.add("aperto"));
  $<HTMLButtonElement>("#tira").focus();
}

function chiudiFoglio(): void {
  $("#foglio").classList.remove("aperto");
  $("#foglio").hidden = true;
  aperta = null;
}

function lancia(el: HTMLElement, faccia: number): void {
  const [fx, fy] = FACCE[faccia];
  if (!moto()) {
    el.style.transition = "none";
    el.style.transform = `rotateX(${fx}deg) rotateY(${fy}deg)`;
    return;
  }
  el.style.transition = "none";
  el.style.transform = `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg)`;
  void el.offsetWidth;
  const giri = 2 + Math.floor(Math.random() * 2);
  el.style.transition = "transform 1.15s cubic-bezier(.15,.75,.25,1)";
  el.style.transform = `rotateX(${fx + 360 * giri}deg) rotateY(${fy + 360 * giri}deg) rotateZ(0deg)`;
}

function tira(): void {
  if (!aperta || fase !== "quadro") return;
  const s = aperta;
  const prima = partita;
  const esito = agisci(g, partita, s.id);
  rollio = { id: s.id, esito, prima, testo: s.testo };
  quadri++;
  // La partita si registra subito: ricaricare la pagina non cambia i dadi.
  partita = esito.partita;
  salvaConRollio();
  const tiro = esito.eventi.find((e) => e.tipo === "tiro" && e.dati && "dadi" in e.dati)?.dati as DatiTiro | undefined;
  fase = "tiro";
  $("#tira").hidden = true;
  $("#altra").hidden = true;
  const vassoio = $("#vassoio");
  if (tiro) {
    vassoio.hidden = false;
    suono.dadi();
    lancia($("#d1"), tiro.dadi[0]);
    lancia($("#d2"), tiro.dadi[1]);
  }
  setTimeout(() => timbra(tiro, esito.eventi), moto() && tiro ? 1250 : 50);
}

function salvaConRollio(): void {
  // Il diario si completa quando si chiude il foglio; se la pagina si ricarica prima, lo completa adesso.
  const d = diario;
  diario = [...diario];
  if (rollio) registra(rollio.testo, rollio.esito.eventi, rollio.prima, true);
  salva();
  diario = d;
}

function timbra(tiro: DatiTiro | undefined, ev: Evento[]): void {
  fase = "timbro";
  const esitoEv = ev.find((e) => e.tipo === "esito" && e.dati && "fascia" in e.dati)?.dati as DatiEsito | undefined;
  const fascia: Fascia = tiro?.fascia ?? esitoEv?.fascia ?? "riesci";
  const grado = tiro?.grado ?? esitoEv?.grado ?? 0;
  const t = $("#timbri");
  t.innerHTML = `<div class="timbro" data-f="${fascia}"><b>${FASCE[fascia]}</b><span>${fascia === "quasi" ? "scegli tu" : tiro ? `margine ${segno(tiro.margine)}` : "non si tira"}</span></div>
    <div class="timbro grado-t" data-g="${grado}"><b>${GRADI[grado]}</b><span>il costo</span></div>`;
  t.hidden = false;
  if (tiro) {
    const b = tiro.bonus >= 0 ? `+ ${tiro.bonus}` : `− ${-tiro.bonus}`;
    $("#conto").innerHTML = `${tiro.dadi[0]} + ${tiro.dadi[1]} ${b} = <b>${tiro.totale}</b> contro ${tiro.soglia}`;
  }
  const bene = fascia === "pieno" || fascia === "riesci";
  suono.timbro(bene);
  effetto(bene ? "luce" : fascia === "quasi" ? "scossa" : grado === 2 ? "scossa-forte" : "scossa");
  $("#tira").hidden = false;
  $("#tira").textContent = fascia === "quasi" ? "Scegli come finisce" : "Continua";
  $<HTMLButtonElement>("#tira").focus();
}

function continua(): void {
  if (!rollio) return;
  const r = rollio;
  rollio = null;
  chiudiFoglio();
  registra(r.testo, r.esito.eventi, r.prima);
  reazioni(r.esito.eventi, r.prima, partita);
  salva();
  disegnaTutto();
  controllaFinale();
}

// ---------------------------------------------------------------------------
// Agire
// ---------------------------------------------------------------------------

function registra(scelta: string, ev: Evento[], prima: Partita, soloDati = false): void {
  const ultima = diario[diario.length - 1];
  diario[diario.length - 1] = { ...ultima, scelta, eventi: ev };
  const nuovaVoce = voceDi(partita, partita.scena === prima.scena);
  diario.push(nuovaVoce);
  if (!soloDati) ultimi = ev;
}

function esegui(s: VistaScelta): void {
  const prima = partita;
  const r = agisci(g, partita, s.id);
  partita = r.partita;
  registra(s.testo, r.eventi, prima);
  reazioni(r.eventi, prima, partita);
  salva();
  disegnaTutto();
  controllaFinale();
}

function scegli(id: string): void {
  if (rollio) return;
  const s = vista(g, partita).scelte.find((x) => x.id === id && x.disponibile);
  if (!s) return;
  if (s.quadro) apriFoglio(s);
  else esegui(s);
}

// ---------------------------------------------------------------------------
// Le reazioni: avvisi, luce, scosse
// ---------------------------------------------------------------------------

function effetto(nome: string): void {
  if (!moto() && nome !== "ferita") return;
  const app = $("#app");
  app.classList.remove("luce", "scossa", "scossa-forte", "ferita", "notato");
  void app.offsetWidth;
  app.classList.add(nome);
  setTimeout(() => app.classList.remove(nome), 1300);
}

function avviso(tipo: string, titolo: string, testo: string): void {
  const box = $("#avvisi");
  const el = document.createElement("div");
  el.className = `avviso ${tipo}`;
  el.innerHTML = `<b>${esc(titolo)}</b><span>${esc(testo)}</span>`;
  box.appendChild(el);
  while (box.children.length > 4) box.firstElementChild!.remove();
  setTimeout(() => el.classList.add("via"), 5200);
  setTimeout(() => el.remove(), 5800);
}

function reazioni(ev: Evento[], prima: Partita, dopo: Partita): void {
  for (const e of ev) {
    if (e.tipo === "ferita" && /^Ferita/.test(e.testo)) {
      effetto("ferita");
      suono.ferita();
      avviso("rosso", "Sei ferito", e.testo.replace(/^Ferita \w+: /, ""));
    } else if (e.tipo === "protezione") avviso("", "La giacca ti salva", e.testo);
    else if (e.tipo === "imprevisto") avviso("imprevisto", "Imprevisto", e.testo);
    else if (e.tipo === "crescita" && /ora sei/.test(e.testo)) avviso("oro", "Stai migliorando", e.testo);
    else if (e.tipo === "crescita") avviso("oro", "Rispetto alla prima volta", e.testo);
    else if (e.tipo === "notizia") {
      suono.penna();
      const [titolo, ...resto] = e.testo.split(": ");
      avviso(/^Smentita/.test(e.testo) ? "rosso" : "inchiostro", resto.length ? `Nel taccuino · ${titolo}` : "Nel taccuino", resto.join(": ") || e.testo);
    } else if (e.tipo === "convinzione") avviso("inchiostro", "Ciò che credi", e.testo);
    else if (e.tipo === "tratto") avviso("oro", "Chi sei", e.testo);
    else if (e.tipo === "persona") avviso("", "Persone", e.testo);
    else if (e.tipo === "statoAnimo") avviso("ambra", "Come ti senti", e.testo);
    else if (e.tipo === "memoria" && e.testo.startsWith("Parola chiave")) avviso("inchiostro", "Parola chiave", e.testo.slice(15));
    else if (e.tipo === "logorio") avviso("ambra", "Come stai", e.testo);
    else if (e.tipo === "morte") effetto("ferita");
  }
  for (const [zona, v] of Object.entries(dopo.traccia)) {
    if (v > (prima.traccia[zona] ?? 0)) {
      const nome = amb.luoghi.find((l) => l.zona === zona)?.nome ?? zona;
      avviso("occhi", "Ti hanno notato", `${nome}: Traccia ${v}${v >= 2 ? ". Qui ti guardano." : ""}`);
      if (zona === amb.luoghi.find((l) => l.id === luogoId(dopo))?.zona) effetto("notato");
    }
  }
  const sc = storia.scadenze[0];
  if (dopo.scadenze[sc.id] >= sc.caselle - 2 && dopo.scadenze[sc.id] > prima.scadenze[sc.id]) {
    avviso("rosso", "Il tempo stringe", `${sc.nome}: ${dopo.scadenze[sc.id]} su ${sc.caselle}`);
    suono.campana();
  }
}

// ---------------------------------------------------------------------------
// Il finale: la scheda di adesso accanto a quella dell'inizio (§42)
// ---------------------------------------------------------------------------

function controllaFinale(): void {
  if (!partita.finita) return;
  const tipo = partita.finita.tipo;
  const v = vista(g, partita);
  const tiri = diario.flatMap((d) => d.eventi).filter((e) => e.tipo === "tiro").length;
  const traccia = Object.values(partita.traccia).reduce((a, b) => a + b, 0);
  const iniziali = new Set(storia.personaggio.tratti);
  const guadagnati = v.stato.tratti.filter((t) => !iniziali.has(t.id));
  const persi = storia.personaggio.tratti.filter((t) => !(t in partita.tratti)).map((t) => amb.tratti.find((x) => x.id === t)?.nome ?? t);
  const lasciate = storia.personaggio.convinzioni.filter((c) => !partita.convinzioni[c]).map((c) => storia.convinzioni.find((x) => x.id === c)?.testo ?? c);
  const cresciute = amb.capacita.filter((c) => (partita.livelli[c.id] ?? 0) > (storia.personaggio.livelli[c.id] ?? 0)).map((c) => `${c.nome}: ${["Inesperto", "Pratico", "Esperto", "Maestro"][partita.livelli[c.id]]}`);
  const cambio = [
    ...cresciute.map((x) => `<li>${esc(x)}</li>`),
    ...guadagnati.map((t) => `<li>Adesso: <b>${esc(t.nome)}</b>${t.origine ? `, ${esc(t.origine)}` : ""}</li>`),
    ...persi.map((t) => `<li>Non più: <b>${esc(t)}</b></li>`),
    ...lasciate.map((c) => `<li>Non credi più: «${esc(c)}»</li>`),
    ...v.stato.persone.map((p) => `<li>${esc(p.nome)}: ${esc(p.parole)}</li>`),
  ].join("");
  $("#finale").dataset.tipo = tipo;
  $("#finale-corpo").innerHTML = `
    <p class="fin-sopra">${{ vittoria: "Vittoria", sconfitta: "Sconfitta", morte: "Morte" }[tipo]} · ${esc(v.scena.momento.split(",")[0])} · ora ${partita.ora}</p>
    <h2>${{ vittoria: "Ce l'hai fatta.", sconfitta: "La storia finisce qui.", morte: "La tua storia finisce qui." }[tipo]}</h2>
    <p class="fin-titolo">${esc(v.scena.titolo)}</p>
    <dl class="fin-conti">
      <div><dt>Ore</dt><dd>${partita.ora}</dd></div>
      <div><dt>Dadi tirati</dt><dd>${tiri}</dd></div>
      <div><dt>Traccia lasciata</dt><dd>${traccia}</dd></div>
      <div><dt>Nel taccuino</dt><dd>${v.stato.notizie.length} / ${storia.notizie.length}</dd></div>
    </dl>
    ${cambio ? `<h3 class="fin-cambio">Com'è cambiato il tuo personaggio</h3><ul class="fin-lista">${cambio}</ul>` : ""}`;
  setTimeout(() => {
    $("#finale").hidden = false;
    suono.campana();
  }, moto() ? 900 : 0);
}

function testoRegistro(): string {
  return diario
    .map((d) => `${d.continua ? "" : `${d.titolo.toUpperCase()} (${d.luogo}, ${d.momento})\n${d.testo.replaceAll("*", "")}\n`}${d.scelta ? `» ${d.scelta}\n` : ""}${d.eventi.filter((e) => e.tipo !== "tempo").map((e) => `  · ${e.testo}`).join("\n")}`)
    .join("\n\n");
}

// ---------------------------------------------------------------------------
// Sotto il cofano
// ---------------------------------------------------------------------------

function disegnaCofano(v: Vista): void {
  const dati = {
    scena: v.scena.id,
    luogo: v.scena.luogo,
    momento: v.scena.momento,
    confronto: v.confronto ?? null,
    sospeso: v.sospeso ?? null,
    scelte: v.scelte.map((s) => ({
      id: s.id,
      tipo: s.tipo,
      disponibile: s.disponibile,
      ...(s.richiede ? { richiede: s.richiede, chiusaDa: s.chiusaDa } : {}),
      ...(s.quadro ? { soglia: s.quadro.riesci.soglia, dadi: s.quadro.riesci.dadi, fasce: s.quadro.riesci.fasce, grado: s.quadro.grado } : {}),
    })),
    eventiUltimaAzione: ultimi.map((e) => (e.dati ? { tipo: e.tipo, testo: e.testo, dati: e.dati } : { tipo: e.tipo, testo: e.testo })),
  };
  $("#cofano-dati").textContent = JSON.stringify(dati, null, 2);
}

// ---------------------------------------------------------------------------
// Tutto insieme
// ---------------------------------------------------------------------------

function disegnaTutto(): void {
  const v = vista(g, partita);
  aggiornaPanorama(partita);
  $("#sopra").textContent = `${v.scena.momento.split(",")[0]} · ora ${partita.ora}`;
  $("#luogo").textContent = v.scena.luogo;
  disegnaDiario();
  disegnaScelte(v);
  disegnaScheda(v);
  disegnaCofano(v);
}

function sovrapposto(id: string, apri: boolean): void {
  $(id).hidden = !apri;
}

function avvia(dati: { partita?: Partita; diario?: VoceDiario[]; quadri?: number }): void {
  const salvata = dati.partita ? { partita: dati.partita, diario: dati.diario ?? [], quadri: dati.quadri ?? 0 } : carica();
  if (salvata) {
    partita = salvata.partita;
    diario = salvata.diario.length ? salvata.diario : [voceDi(partita)];
    quadri = salvata.quadri;
    $("#continua-partita").hidden = !!partita.finita;
    $("#inizia").textContent = partita.finita ? "Comincia la storia" : "Nuova partita";
    if (!partita.finita) $("#inizia").className = "secondario";
  } else nuova();

  document.body.classList.add("in-titolo");
  new ResizeObserver(ridimensiona).observe(tela());
  ridimensiona();
  requestAnimationFrame(anima);
  disegnaTutto();

  document.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("button");
    if (!b) return;
    switch (b.id) {
      case "inizia":
        if ((salvata && !partita.finita) || partita.finita) nuova();
        iniziata = true;
        document.body.classList.remove("in-titolo");
        sovrapposto("#titolo", false);
        disegnaTutto();
        return;
      case "continua-partita":
        iniziata = true;
        document.body.classList.remove("in-titolo");
        sovrapposto("#titolo", false);
        disegnaTutto();
        controllaFinale();
        return;
      case "btn-scheda-chiudi":
        document.body.classList.remove("scheda-aperta");
        return;
      case "tira":
        return fase === "timbro" ? continua() : tira();
      case "altra":
        return chiudiFoglio();
      case "btn-come":
        return sovrapposto("#come", true);
      case "btn-cofano":
        return sovrapposto("#cofano", true);
      case "btn-scheda":
        return void document.body.classList.toggle("scheda-aperta");
      case "btn-suono": {
        const acceso = suono.eAcceso() ? (suono.spegni(), false) : suono.accendi();
        b.textContent = acceso ? "Suono sì" : "Suono no";
        b.setAttribute("aria-pressed", String(acceso));
        if (acceso) aggiornaPanorama(partita);
        return;
      }
      case "btn-ricomincia":
        if (b.dataset.conferma === "si") {
          nuova();
          b.dataset.conferma = "";
          b.textContent = "Ricomincia";
          sovrapposto("#finale", false);
          disegnaTutto();
        } else {
          b.dataset.conferma = "si";
          b.textContent = "Sicuro? Ricomincia";
          setTimeout(() => {
            b.dataset.conferma = "";
            b.textContent = "Ricomincia";
          }, 4000);
        }
        return;
      case "fin-nuova":
        nuova();
        sovrapposto("#finale", false);
        disegnaTutto();
        return;
      case "fin-rileggi":
        return sovrapposto("#finale", false);
      case "fin-copia": {
        const testo = testoRegistro();
        navigator.clipboard?.writeText(testo).then(
          () => (b.textContent = "Registro copiato"),
          () => (b.textContent = "Copia non riuscita"),
        );
        return;
      }
    }
    if (b.dataset.chiudi !== undefined) {
      (b.closest(".velo") as HTMLElement).hidden = true;
      return;
    }
    if (b.dataset.scelta) scegli(b.dataset.scelta);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("#foglio").hidden && fase === "quadro") chiudiFoglio();
      for (const id of ["#come", "#cofano"]) $(id).hidden = true;
      document.body.classList.remove("scheda-aperta");
      return;
    }
    if (!$("#foglio").hidden) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (fase === "timbro") continua();
        else if (fase === "quadro") tira();
      }
      return;
    }
    if (!$("#titolo").hidden || !$("#finale").hidden) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      const disponibili = vista(g, partita).scelte.filter((s) => s.disponibile);
      if (disponibili[n - 1]) scegli(disponibili[n - 1].id);
    }
  });
}

const hot = (window as unknown as { claude?: { hot?: { snapshot?: (f: () => unknown) => void; ready?: (f: (d: object) => void) => void; data?: object } } }).claude?.hot;
hot?.snapshot?.(() => ({ partita, diario, quadri }));
if (hot?.ready) hot.ready(avvia);
else avvia(hot?.data ?? {});
