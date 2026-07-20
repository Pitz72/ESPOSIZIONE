/**
 * FATTI CREATI SCRIVENDO (docs/author-experience.md §5.1) — la leva n.1 dell'esperienza d'autore.
 *
 * L'autore scrive una conseguenza in italiano ("ora ha la chiave", "aumenta fiducia di 1",
 * "Stress +10"): qui la frase diventa un `Effect` del formato .iwstory e, se il fatto citato
 * non esiste ancora, la PROPOSTA di crearlo. Lo `stateSchema` si popola come sottoprodotto
 * della scrittura, non come compito preliminare.
 *
 * Modulo puro (nessun React, nessun DOM): testabile con `node --test`.
 */
import type { Story, Effect, VarDecl, Literal } from "../../../core/src/index.ts";

// --- Normalizzazione ------------------------------------------------------

/** minuscolo, senza accenti, spazi compattati: base di ogni confronto. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Chiave tecnica derivata da una frase d'autore ("ha la chiave" -> "ha_la_chiave"). */
export function slugify(label: string): string {
  const base = normalize(label)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!base) return "fatto";
  return /^[0-9]/.test(base) ? `f_${base}` : base;
}

/** Chiave libera nello stateSchema (aggiunge _2, _3… se occupata). */
export function uniqueKey(story: Story, wanted: string): string {
  let key = wanted;
  let i = 2;
  while (story.stateSchema[key]) key = `${wanted}_${i++}`;
  return key;
}

// Rumore iniziale che l'autore scrive naturalmente e che non fa parte del nome del fatto.
const LEAD_NOISE = /^(e |poi |ora |adesso |da ora |da adesso |d'ora in poi |allora |il lettore |il personaggio |il protagonista )/;

function stripLead(s: string): string {
  let out = s.trim();
  for (;;) {
    const next = out.replace(LEAD_NOISE, "").trim();
    if (next === out) return out;
    out = next;
  }
}

/** Toglie l'articolo iniziale dal nome di un oggetto/fatto ("la chiave" -> "chiave"). */
function stripArticle(s: string): string {
  return s.replace(/^(il|lo|la|i|gli|le|un|uno|una|l'|dell'|del|della)\s*/, "").trim();
}

// --- Risoluzione di un riferimento esistente ------------------------------

export type RefMatch =
  | { kind: "var"; key: string; name: string; decl: VarDecl }
  | { kind: "resource"; id: string; name: string }
  | { kind: "item"; id: string; name: string };

/** Cerca fra fatti, indicatori e oggetti già dichiarati. Confronto per nome, etichetta o chiave. */
export function resolveRef(raw: string, story: Story): RefMatch | null {
  const n = normalize(raw);
  if (!n) return null;
  const candidates: { key: string; m: RefMatch }[] = [];

  for (const [key, decl] of Object.entries(story.stateSchema)) {
    const name = decl.label || key;
    const m: RefMatch = { kind: "var", key, name, decl };
    candidates.push({ key: normalize(name), m });
    candidates.push({ key: normalize(key.replace(/_/g, " ")), m });
  }
  for (const r of story.ruleset.resources ?? [])
    candidates.push({ key: normalize(r.name), m: { kind: "resource", id: r.id, name: r.name } });
  for (const [id, it] of Object.entries(story.items ?? {}))
    candidates.push({ key: normalize(it.name), m: { kind: "item", id, name: it.name } });

  // 1. corrispondenza esatta
  for (const c of candidates) if (c.key === n) return c.m;
  // 2. corrispondenza per contenimento (vince la più lunga: è la più specifica)
  let best: { len: number; m: RefMatch } | null = null;
  for (const c of candidates) {
    if (!c.key) continue;
    if (n.includes(c.key) || c.key.includes(n)) {
      if (!best || c.key.length > best.len) best = { len: c.key.length, m: c.m };
    }
  }
  return best ? best.m : null;
}

// --- Risultato dell'interpretazione ---------------------------------------

export interface NewFactProposal {
  key: string;
  label: string;
  decl: VarDecl;
}

export interface ParsedConsequence {
  /** L'effetto da aggiungere alla lista "Cosa cambia". */
  effect: Effect;
  /** Se presente, il fatto va creato nello stateSchema prima di applicare l'effetto. */
  newFact?: NewFactProposal;
}

const INC = /^(?:aumenta|aumento|alza|incrementa|sali|somma|aggiungi)\s+(.+?)\s+di\s+(\d+(?:[.,]\d+)?)$/;
const DEC = /^(?:diminuisci|diminuisce|abbassa|riduci|cala|sottrai|scala)\s+(.+?)\s+di\s+(\d+(?:[.,]\d+)?)$/;
const DELTA = /^(.+?)\s*([+\-−])\s*(\d+(?:[.,]\d+)?)$/;
const ASSIGN = /^(?:imposta|metti|porta)\s+(.+?)\s+a\s+(.+)$/;
const BECOMES = /^(.+?)\s+(?:diventa|passa a)\s+(.+)$/;
const GAIN = /^(?:ottieni|ottiene|prendi|prende|trova|trovi|raccogli|guadagna)\s+(.+)$/;
const LOSE = /^(?:perdi|perde|togli|toglie|rimuovi|lascia|consuma)\s+(.+)$/;

function num(s: string): number {
  return Number(s.replace(",", "."));
}

function litOf(text: string): Literal {
  const t = normalize(text);
  if (t === "vero" || t === "si" || t === "true") return true;
  if (t === "falso" || t === "no" || t === "false") return false;
  if (/^-?\d+(?:[.,]\d+)?$/.test(t)) return num(t);
  return text.trim();
}

/**
 * Interpreta una frase d'autore. Restituisce null se non riconosce nulla di sensato
 * (l'interfaccia in quel caso non indovina: mostra degli esempi).
 * L'ordine dei tentativi va dal più specifico (numerico, oggetti) al più generico (fatto sì/no).
 */
export function parseConsequence(raw: string, story: Story): ParsedConsequence | null {
  const input = raw.trim();
  if (!input) return null;
  // minuscolo ma CON accenti: le etichette proposte devono restare scritte bene.
  const s = stripLead(input.toLowerCase().replace(/\s+/g, " "));
  if (!s) return null;

  // --- 1. Variazioni numeriche ------------------------------------------
  const delta = (() => {
    let m = INC.exec(s);
    if (m) return { name: m[1], value: num(m[2]) };
    m = DEC.exec(s);
    if (m) return { name: m[1], value: -num(m[2]) };
    m = DELTA.exec(s);
    if (m) return { name: m[1], value: m[2] === "+" ? num(m[3]) : -num(m[3]) };
    return null;
  })();

  if (delta) {
    const ref = resolveRef(delta.name, story);
    if (ref?.kind === "resource")
      return { effect: { kind: "adjustResource", resource: ref.id, value: delta.value } };
    if (ref?.kind === "var" && ref.decl.type === "number")
      return { effect: { kind: "add", var: ref.key, value: delta.value } };
    if (!ref) {
      const label = stripArticle(delta.name);
      const key = uniqueKey(story, slugify(label));
      return {
        effect: { kind: "add", var: key, value: delta.value },
        newFact: { key, label, decl: { type: "number", default: 0, label } },
      };
    }
    return null; // esiste ma non è numerico: meglio non indovinare
  }

  // --- 2. Oggetti: ottieni / perdi --------------------------------------
  const gain = GAIN.exec(s);
  const lose = gain ? null : LOSE.exec(s);
  if (gain || lose) {
    const name = stripArticle((gain ?? lose)![1]);
    const ref = resolveRef(name, story);
    if (ref?.kind === "item")
      return { effect: gain ? { kind: "addItem", item: ref.id } : { kind: "removeItem", item: ref.id } };
    if (ref?.kind === "var" && ref.decl.type === "boolean")
      return { effect: { kind: "set", var: ref.key, value: Boolean(gain) } };
    if (!ref) {
      // Convenzione G5 (collaudo #02): un oggetto non dichiarato è un fatto «ha X».
      const label = `ha ${name}`;
      const key = uniqueKey(story, slugify(label));
      return {
        effect: { kind: "set", var: key, value: Boolean(gain) },
        newFact: { key, label, decl: { type: "boolean", default: false, label } },
      };
    }
    return null; // indicatore senza quantità: ambiguo
  }

  // --- 3. Assegnazioni esplicite ----------------------------------------
  const assign = ASSIGN.exec(s) ?? BECOMES.exec(s);
  if (assign) {
    const value = litOf(assign[2]);
    const ref = resolveRef(assign[1], story);
    if (ref?.kind === "var") return { effect: { kind: "set", var: ref.key, value } };
    if (!ref) {
      const label = stripArticle(assign[1]);
      const key = uniqueKey(story, slugify(label));
      const decl: VarDecl =
        typeof value === "boolean" ? { type: "boolean", default: false, label }
        : typeof value === "number" ? { type: "number", default: 0, label }
        : { type: "string", default: "", label };
      return { effect: { kind: "set", var: key, value }, newFact: { key, label, decl } };
    }
    return null; // gli indicatori si muovono per variazione, non per assegnazione
  }

  // --- 4. Fatto sì/no in forma di affermazione --------------------------
  // "ha la chiave", "la porta è aperta", "non ha più la chiave", "Carli non si fida"
  let positive = true;
  let phrase = s;
  if (/(^|\s)non\s/.test(phrase)) {
    positive = false;
    // nota: \b non funziona dopo "ù" (non è un carattere di parola per JS)
    phrase = phrase.replace(/(^|\s)non\s+/, "$1").replace(/\s+più(?=\s|$)/, "").trim();
  }
  phrase = phrase.replace(/\s+è\s+(vero|falso)$/, (_m, w: string) => {
    if (w === "falso") positive = false;
    return "";
  }).trim();
  if (!phrase) return null;

  const ref = resolveRef(phrase, story);
  if (ref?.kind === "var" && ref.decl.type === "boolean")
    return { effect: { kind: "set", var: ref.key, value: positive } };
  if (ref?.kind === "item")
    return { effect: positive ? { kind: "addItem", item: ref.id } : { kind: "removeItem", item: ref.id } };
  if (ref) return null; // numerico o a stati: serve un valore, non un'affermazione

  const key = uniqueKey(story, slugify(phrase));
  return {
    effect: { kind: "set", var: key, value: positive },
    newFact: { key, label: phrase, decl: { type: "boolean", default: false, label: phrase } },
  };
}

/** Esempi mostrati all'autore quando la frase non viene riconosciuta. */
export const CONSEQUENCE_EXAMPLES = [
  "ora ha la chiave",
  "non ha più il grimaldello",
  "aumenta fiducia di Carli di 1",
  "Stress +10",
  "l'umore diventa cupo",
];
