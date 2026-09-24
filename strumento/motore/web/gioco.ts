/**
 * L'app web della Santa Rita: un'interfaccia sul motore, come la riga di comando
 * e il librogame. Chiede al motore `vista` e `agisci`, e disegna quello che riceve:
 * tutte le regole stanno nel motore, qui ci sono soltanto luce, carta e dadi.
 */

import ambJson from "../dati/porto.ambientazione.json" with { type: "json" };
import storiaJson from "../dati/santa-rita.storia.json" with { type: "json" };
import type { Ambientazione, Storia } from "../src/tipi.ts";
import { prepara, nuovaPartita, type DatiEsito, type DatiTiro, type Evento, type Partita } from "../src/stato.ts";
import { agisci, vista, type RicevutaPiena, type Vista, type VistaScelta } from "../src/motore.ts";
import { numerazione } from "../src/libro.ts";
import { CIELI, disegna as disegnaPanorama } from "./panorama.ts";
import * as suono from "./suono.ts";

const amb = ambJson as unknown as Ambientazione;
const storia = storiaJson as unknown as Storia;
const g = prepara(amb, storia);
const paragrafo = numerazione(storia);
const CHIAVE = "esposizione:santa-rita:app";
const GRADI = ["al coperto", "esposto", "allo scoperto"];
const CASELLE = [
  ["Successo pieno", "Fallimento pulito"],
  ["Successo sporco", "Rovescio minore"],
  ["Successo a caro prezzo", "Rovescio"],
];
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
let ricevute = 0;
let iniziata = false;
let rollio: { id: string; esito: ReturnType<typeof agisci>; prima: Partita; testo: string; ricevuta: RicevutaPiena } | null = null;
let fase: "ricevuta" | "tiro" | "timbro" = "ricevuta";
let aperta: VistaScelta | null = null;

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T;

// ---------------------------------------------------------------------------
// Salvataggio
// ---------------------------------------------------------------------------

function salva(): void {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify({ partita, diario: diario.slice(-40), ricevute, suono: suono.eAcceso() }));
  } catch {
    /* il browser non conserva: si gioca lo stesso */
  }
}

function carica(): { partita: Partita; diario: VoceDiario[]; ricevute: number; suono?: boolean } | null {
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
  ricevute = 0;
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

const momentoId = (p: Partita) => {
  const giorno = amb.momenti.reduce((s, m) => s + m.passi, 0);
  let resto = p.passo % giorno;
  let i = amb.momenti.findIndex((m) => m.id === storia.momentoIniziale);
  while (resto >= amb.momenti[i].passi) {
    resto -= amb.momenti[i].passi;
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
let inizioTempo = performance.now();

function ridimensiona(): void {
  const c = tela();
  const r = c.getBoundingClientRect();
  const d = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.max(1, Math.round(r.width * d));
  c.height = Math.max(1, Math.round(r.height * d));
  c.getContext("2d")!.setTransform(d, 0, 0, d, 0, 0);
  quadro();
}

function quadro(): void {
  const c = tela();
  const r = c.getBoundingClientRect();
  const t = moto() ? (performance.now() - inizioTempo) / 1000 : 12;
  disegnaPanorama(c.getContext("2d")!, r.width, r.height, panoramaStato.luogo, panoramaStato.momento, t, panoramaStato.tensione);
}

function anima(): void {
  if (moto() && !document.hidden) quadro();
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
  quadro();
}

// ---------------------------------------------------------------------------
// Il diario
// ---------------------------------------------------------------------------

const DADO = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function eventiHtml(ev: Evento[]): string {
  const out: string[] = [];
  let passi = 0;
  let momento = "";
  const scarica = () => {
    if (passi) out.push(`<li class="ev tempo">${passi === 1 ? "Passa un passo" : `Passano ${passi} passi`}${momento ? `: ${esc(momento)}` : ""}.</li>`);
    passi = 0;
  };
  for (const e of ev) {
    if (e.tipo === "tempo") {
      passi++;
      momento = e.testo.match(/\((.*)\)/)?.[1] ?? "";
      continue;
    }
    scarica();
    if (e.tipo === "tiro" && e.dati && "dadi" in e.dati) {
      const d = e.dati as DatiTiro;
      out.push(`<li class="ev tiro"><span class="glifi">${DADO[d.dadi[0]]}${DADO[d.dadi[1]]}</span>${esc(e.testo.split(":")[0])}: ${d.dadi[0]} + ${d.dadi[1]} + ${d.bonus}${d.penalita ? ` − ${d.penalita}` : ""} = ${d.totale} contro ${d.soglia}</li>`);
    } else if (e.tipo === "esito") {
      const d = e.dati as DatiEsito | undefined;
      out.push(`<li class="ev esito" data-g="${d?.grado ?? 1}" data-r="${d?.riesce ?? ""}">${esc(e.testo)}</li>`);
    } else {
      out.push(`<li class="ev ${e.tipo}">${esc(e.testo)}</li>`);
    }
  }
  scarica();
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
  if (s.tipo === "parlare" || s.ricevuta?.unColpoSolo) return "una volta sola";
  if (s.povera) return "via povera";
  if (s.tipo === "riprova") return "costa un passo";
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
  const voci = v.scelte
    .map((s) => {
      if (!s.disponibile) {
        return `<li><div class="risposta chiusa"><span class="num">·</span><span class="t">${esc(s.testo)}<small>Richiede: ${esc(s.richiede ?? "non disponibile")}</small></span></div></li>`;
      }
      i++;
      const r = s.ricevuta;
      const tag = etichetta(s);
      return `<li><button type="button" class="risposta${r ? " prova" : ""}" data-scelta="${esc(s.id)}" aria-keyshortcuts="${i}">
        <span class="num">${i}</span>
        <span class="t">${esc(s.testo)}${tag ? `<em class="tag">${tag}</em>` : ""}</span>
        ${r ? `<span class="pill" data-g="${r.grado}">${GRADI[r.grado]}<b>${r.probabilita}%</b></span>` : ""}
      </button></li>`;
    })
    .join("");
  $("#dock").innerHTML = v.finale ? "" : `${conf}<ol class="risposte">${voci}</ol>`;
}

// ---------------------------------------------------------------------------
// La scheda
// ---------------------------------------------------------------------------

function pip(n: number, pieni: number, cls = ""): string {
  return `<span class="pips ${cls}">${Array.from({ length: n }, (_, i) => `<i class="${i < pieni ? "on" : ""}"></i>`).join("")}</span>`;
}

function disegnaScheda(v: Vista): void {
  const giorno = amb.momenti.reduce((s, m) => s + m.passi, 0);
  const nelGiorno = partita.passo % giorno;
  let k = 0;
  const tempo = amb.momenti
    .map((m) => `<div class="giornata-m" data-m="${m.id}">${Array.from({ length: m.passi }, () => { const c = k < nelGiorno ? "fatto" : k === nelGiorno ? "ora" : ""; k++; return `<span class="${c}"></span>`; }).join("")}<em>${esc(m.nome.split(",")[0].replace(/^(l'|il |la )/, ""))}</em></div>`)
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
  const ferite = partita.ferite.length
    ? partita.ferite.map((f) => `<li class="ferita" data-g="${f.gravita}"><span>${esc(f.nome)}</span><b>${f.gravita}</b></li>`).join("")
    : '<li class="vuoto">Nessuna ferita</li>';
  const prot = Object.entries(partita.protezioni).map(([id, s]) => `<li><span>${esc(amb.protezioni.find((x) => x.id === id)?.nome ?? id)}</span><b>${["intatta", "intaccata", "inservibile"][s]}</b></li>`).join("");
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
  const taccuino = v.stato.conoscenze.length ? v.stato.conoscenze.map((k) => `<li>${esc(k)}</li>`).join("") : '<li class="vuoto">Non sai ancora niente di preciso.</li>';
  $("#scheda-corpo").innerHTML = `
    <section><div class="sez"><span>La giornata</span><span>passo ${partita.passo}</span></div><div class="giornata">${tempo}</div></section>
    <section>${scadenza}</section>
    <section><div class="sez"><span>Come stai</span></div>${logorio}<ul class="righe-scheda">${ferite}${prot}</ul></section>
    <section><div class="sez"><span>Traccia</span><span>chi ti ha notato</span></div><ul class="righe-scheda">${traccia}</ul></section>
    <section><div class="sez"><span>Taccuino</span><span>${v.stato.conoscenze.length}</span></div><ul class="taccuino">${taccuino}</ul>${v.stato.parole.length ? `<p class="parole">${v.stato.parole.map((p) => `<span>${esc(p)}</span>`).join("")}</p>` : ""}</section>
    <section><div class="sez"><span>Capacità</span></div><ul class="righe-scheda capacita">${capacita}</ul></section>
    <section><div class="sez"><span>Oggetti</span></div><ul class="righe-scheda">${v.stato.oggetti.map((o) => `<li><span>${esc(o)}</span></li>`).join("") || '<li class="vuoto">Niente</li>'}</ul></section>`;
}

// ---------------------------------------------------------------------------
// Il foglio della ricevuta, i dadi e il timbro
// ---------------------------------------------------------------------------

const PUNTI: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
const FACCE: Record<number, [number, number]> = { 1: [0, 0], 6: [0, 180], 2: [0, -90], 5: [0, 90], 3: [-90, 0], 4: [90, 0] };

function dado(id: string): string {
  const facce = [1, 2, 3, 4, 5, 6]
    .map((n) => `<div class="faccia f${n}">${Array.from({ length: 9 }, (_, i) => `<i class="${PUNTI[n].includes(i) ? "p" : ""}"></i>`).join("")}</div>`)
    .join("");
  return `<div class="dado-lancio"><div class="dado" id="${id}">${facce}</div></div>`;
}

function righeRicevuta(r: RicevutaPiena): string {
  return r.righe
    .map((x) => {
      const v = x.tipo === "partenza" ? String(x.valore) : x.valore > 0 ? `+${x.valore}` : `−${-x.valore}`;
      return `<li class="${x.conta ? "" : "spenta"}"><span class="v">${v}</span><span class="c">${esc(x.testo)}${x.nota ? `<small>${esc(x.nota)}</small>` : ""}</span></li>`;
    })
    .join("");
}

function apriFoglio(s: VistaScelta): void {
  const r = s.ricevuta!;
  aperta = s;
  fase = "ricevuta";
  const nota = r.nota ?? (r.somma < r.grado ? `${r.capacita} non scende sotto ${GRADI[r.fondo]}` : r.somma > 2 ? "più di allo scoperto non si va" : "");
  $("#foglio-carta").innerHTML = `
    <header class="carta-testa">
      <span>Capitaneria del porto</span>
      <span>Ricevuta n. ${String(ricevute + 1).padStart(4, "0")}</span>
    </header>
    <p class="carta-quando">${esc(vista(g, partita).scena.momento.split(",")[0])} · passo ${partita.passo}</p>
    <h3 class="carta-azione">${esc(s.testo)}</h3>
    <ol class="carta-righe">${righeRicevuta(r)}</ol>
    <div class="carta-totale"><span class="v">${r.somma < 0 ? `−${-r.somma}` : r.somma}</span><span class="grado" data-g="${r.grado}">${GRADI[r.grado]}</span></div>
    ${nota ? `<p class="carta-nota">${esc(nota)}</p>` : ""}
    <dl class="carta-prova">
      <div><dt>Prova</dt><dd>${r.sogliaNome} · ${r.soglia}</dd></div>
      <div><dt>${esc(r.capacita)}</dt><dd>${r.livello} +${r.bonus}${r.penalita ? ` −${r.penalita}` : ""}</dd></div>
      <div class="grande"><dt>Riesci</dt><dd>${r.probabilita}<small>%</small></dd></div>
    </dl>
    ${r.posta ? `<p class="carta-posta">${esc(r.posta)}</p>` : ""}
    ${r.unColpoSolo ? '<p class="carta-nota">Una volta sola: non si ritenta.</p>' : ""}
    ${r.ritento ? '<p class="carta-nota">Ritentare costa un passo.</p>' : ""}
    <div class="timbro" id="timbro" hidden></div>`;
  $("#vassoio").innerHTML = dado("d1") + dado("d2");
  $("#vassoio").hidden = true;
  $("#conto").textContent = "";
  $("#tira").hidden = false;
  $("#tira").textContent = "Tira i dadi";
  $("#altra").hidden = false;
  $("#foglio").hidden = false;
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
  if (!aperta || fase !== "ricevuta") return;
  const s = aperta;
  const prima = partita;
  const esito = agisci(g, partita, s.id);
  rollio = { id: s.id, esito, prima, testo: s.testo, ricevuta: s.ricevuta! };
  ricevute++;
  // La partita si registra subito: ricaricare la pagina non cambia i dadi.
  partita = esito.partita;
  salvaConRollio();
  const tiro = esito.eventi.find((e) => e.tipo === "tiro" && e.dati && "dadi" in e.dati)?.dati as DatiTiro | undefined;
  fase = "tiro";
  $("#tira").hidden = true;
  $("#altra").hidden = true;
  const vassoio = $("#vassoio");
  vassoio.hidden = false;
  if (tiro) {
    suono.dadi();
    lancia($("#d1"), tiro.dadi[0]);
    lancia($("#d2"), tiro.dadi[1]);
  }
  setTimeout(() => timbra(tiro, esito.eventi), moto() ? 1250 : 50);
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
  const esitoEv = ev.find((e) => e.tipo === "esito")?.dati as DatiEsito | undefined;
  const riesce = tiro?.riesce ?? esitoEv?.riesce ?? false;
  const grado = tiro?.grado ?? esitoEv?.grado ?? 0;
  const casella = esitoEv?.casella ?? CASELLE[grado][riesce ? 0 : 1];
  const t = $("#timbro");
  t.innerHTML = `<b>${riesce ? "Riesci" : "Non riesci"}</b><span>${esc(casella)}</span>`;
  t.dataset.r = String(riesce);
  t.hidden = false;
  if (tiro) {
    $("#conto").innerHTML = `${tiro.dadi[0]} + ${tiro.dadi[1]} + ${tiro.bonus}${tiro.penalita ? ` − ${tiro.penalita}` : ""} = <b>${tiro.totale}</b> contro ${tiro.soglia}`;
  }
  suono.timbro(riesce);
  effetto(riesce ? "luce" : grado === 2 ? "scossa-forte" : "scossa");
  $("#tira").hidden = false;
  $("#tira").textContent = "Continua";
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
  if (s.ricevuta) apriFoglio(s);
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
    else if (e.tipo === "crescita") avviso("oro", "Tentativi risparmiati", e.testo);
    else if (e.tipo === "qualita" && e.testo.startsWith("Sai che:")) {
      suono.penna();
      avviso("inchiostro", "Nel taccuino", e.testo.slice(9));
    } else if (e.tipo === "qualita" && e.testo.startsWith("Parola chiave")) avviso("inchiostro", "Parola chiave", e.testo.slice(15));
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
// Il finale
// ---------------------------------------------------------------------------

function controllaFinale(): void {
  if (!partita.finita) return;
  const tipo = partita.finita.tipo;
  const v = vista(g, partita);
  const tiri = diario.flatMap((d) => d.eventi).filter((e) => e.tipo === "tiro").length;
  const traccia = Object.values(partita.traccia).reduce((a, b) => a + b, 0);
  $("#finale").dataset.tipo = tipo;
  $("#finale-corpo").innerHTML = `
    <p class="fin-sopra">${{ vittoria: "Vittoria", sconfitta: "Sconfitta", morte: "Morte" }[tipo]} · ${esc(v.scena.momento.split(",")[0])} · passo ${partita.passo}</p>
    <h2>${{ vittoria: "Ce l'hai fatta.", sconfitta: "La storia finisce qui.", morte: "La tua storia finisce qui." }[tipo]}</h2>
    <p class="fin-titolo">${esc(v.scena.titolo)}</p>
    <dl class="fin-conti">
      <div><dt>Passi</dt><dd>${partita.passo}</dd></div>
      <div><dt>Dadi tirati</dt><dd>${tiri}</dd></div>
      <div><dt>Traccia lasciata</dt><dd>${traccia}</dd></div>
      <div><dt>Nel taccuino</dt><dd>${v.stato.conoscenze.length} / ${storia.conoscenze.length}</dd></div>
    </dl>`;
  setTimeout(() => {
    $("#finale").hidden = false;
    suono.campana();
  }, moto() ? 900 : 0);
}

function testoRegistro(): string {
  return diario
    .map((d) => `${d.continua ? "" : `${d.titolo.toUpperCase()} (${d.luogo}, ${d.momento})\n${d.testo.replace(/\*/g, "")}\n`}${d.scelta ? `» ${d.scelta}\n` : ""}${d.eventi.filter((e) => e.tipo !== "tempo").map((e) => `  · ${e.testo}`).join("\n")}`)
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
    scelte: v.scelte.map((s) => ({ id: s.id, tipo: s.tipo, disponibile: s.disponibile, ...(s.richiede ? { richiede: s.richiede } : {}), ...(s.ricevuta ? { somma: s.ricevuta.somma, grado: s.ricevuta.grado, soglia: s.ricevuta.soglia, probabilita: s.ricevuta.probabilita } : {}) })),
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
  $("#sopra").textContent = `${v.scena.momento.split(",")[0]} · passo ${partita.passo}`;
  $("#luogo").textContent = v.scena.luogo;
  disegnaDiario();
  disegnaScelte(v);
  disegnaScheda(v);
  disegnaCofano(v);
}

function sovrapposto(id: string, apri: boolean): void {
  const el = $(id);
  el.hidden = !apri;
}

function avvia(dati: { partita?: Partita; diario?: VoceDiario[]; ricevute?: number }): void {
  const salvata = dati.partita ? { partita: dati.partita, diario: dati.diario ?? [], ricevute: dati.ricevute ?? 0 } : carica();
  if (salvata) {
    partita = salvata.partita;
    diario = salvata.diario.length ? salvata.diario : [voceDi(partita)];
    ricevute = salvata.ricevute;
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
        return document.body.classList.toggle("scheda-aperta");
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
      if (!$("#foglio").hidden && fase === "ricevuta") chiudiFoglio();
      for (const id of ["#come", "#cofano"]) $(id).hidden = true;
      document.body.classList.remove("scheda-aperta");
      return;
    }
    if (!$("#foglio").hidden) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (fase === "timbro") continua();
        else if (fase === "ricevuta") tira();
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
hot?.snapshot?.(() => ({ partita, diario, ricevute }));
if (hot?.ready) hot.ready(avvia);
else avvia(hot?.data ?? {});
