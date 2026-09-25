/**
 * Dal formato dati al librogame (§48.1): regole, scheda, tabelle e paragrafi
 * numerati, in Markdown, pronti per la catena Typst del repository.
 * Il libro e il gioco digitale leggono gli stessi dati: nessuna regola cambia.
 */

import type { Ambientazione, Condizione, Effetto, Prova, Scena, Scelta, Storia, Testo } from "./tipi.ts";
import { intero } from "./dadi.ts";
import { fascePercento } from "./dadi.ts";

const NUMERI = ["zero", "un'", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodici"];
const SOGLIA_NOME: Record<number, string> = { 4: "sotto Facile", 6: "Facile", 8: "Impegnativa", 10: "Ardua", 12: "Estrema", 14: "oltre Estrema" };
const DIMENSIONI = { fiducia: "fiducia", debito: "debito", paura: "paura", affetto: "affetto", rancore: "rancore" } as const;

function segno(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${-n}` : "0";
}

/** Il numero di paragrafo di ogni scena: l'inizio è l'1, il resto mescolato in modo riproducibile. */
export function numerazione(storia: Storia, seme = 7): Map<string, number> {
  const altre = storia.scene.filter((s) => s.id !== storia.inizio).map((s) => s.id);
  let rng = seme;
  for (let i = altre.length - 1; i > 0; i--) {
    const r = intero(rng, 0, i);
    rng = r.stato;
    [altre[i], altre[r.valore]] = [altre[r.valore], altre[i]];
  }
  return new Map<string, number>([[storia.inizio, 1], ...altre.map((id, i) => [id, i + 2] as [string, number])]);
}

export function libro(amb: Ambientazione, storia: Storia, seme = 7): string {
  const numero = numerazione(storia, seme);
  const n = (id: string) => `**${numero.get(id) ?? "?"}**`;

  const cap = (id: string) => amb.capacita.find((c) => c.id === id)!;
  const luogo = (id: string) => amb.luoghi.find((l) => l.id === id)!;
  const momentoBreve = (id: string) => amb.momenti.find((m) => m.id === id)!.nome.split(",")[0];
  const voce = (id: string) => storia.notizie.findIndex((k) => k.id === id) + 1;
  const notizia = (id: string) => `la voce ${voce(id)} del taccuino`;
  const parola = (id: string) => storia.fatti.find((f) => f.id === id)?.parola ?? id.toUpperCase();
  const cosa = (id: string) => storia.cose.find((o) => o.id === id)?.nome ?? id;
  const misura = (id: string) => storia.misure.find((m) => m.id === id)?.nome ?? id;
  const logorio = (id: string) => amb.logorii.find((l) => l.id === id)!;
  const tratto = (id: string) => amb.tratti.find((t) => t.id === id)?.nome.toUpperCase() ?? id;
  const persona = (id: string) => storia.persone.find((p) => p.id === id)?.nome.split(",")[0] ?? id;
  const convinzione = (id: string) => storia.convinzioni.find((c) => c.id === id)?.testo ?? id;
  const stato = (id: string) => amb.statiAnimo.find((s) => s.id === id)?.nome.toLowerCase() ?? id;
  const ore = (k: number) => (k === 1 ? "un'ora" : `${NUMERI[k] ?? k} ore`);

  // ---- condizioni ed effetti a parole
  const frase = (c: Condizione): string => {
    if ("tutte" in c) return c.tutte.map(frase).join(" e ");
    if ("una" in c) return c.una.map(frase).join(" oppure ");
    if ("non" in c) {
      const x = c.non;
      if ("momento" in x) return `non è ${[x.momento].flat().map(momentoBreve).join(" né ")}`;
      if ("traccia" in x) return `la Traccia a ${luogo(x.traccia).nome} è meno di ${x.almeno}`;
      if ("convinzione" in x) return `non credi più che «${convinzione(x.convinzione)}»`;
      if ("tratto" in x) return `non sei ${tratto(x.tratto)}`;
      return `non vale: ${frase(x)}`;
    }
    if ("fatto" in c) return `hai la parola chiave ${parola(c.fatto)}`;
    if ("nonFatto" in c) return `non hai la parola chiave ${parola(c.nonFatto)}`;
    if ("misura" in c) return `${misura(c.misura)} è almeno ${c.almeno ?? 0}`;
    if ("cosa" in c) return (c.almeno ?? 1) > 1 ? `hai almeno ${c.almeno} ${cosa(c.cosa).toLowerCase()}` : `hai: ${cosa(c.cosa)}`;
    if ("cosaProprieta" in c) return c.cosaProprieta === "luce" ? "hai una luce accesa" : `hai una cosa ${c.cosaProprieta}`;
    if ("notizia" in c) return `hai segnato ${notizia(c.notizia)}, e non è smentita`;
    if ("nonNotizia" in c) return `non hai segnato ${notizia(c.nonNotizia)}`;
    if ("tratto" in c) return `sei ${tratto(c.tratto)}`;
    if ("convinzione" in c) return `credi che «${convinzione(c.convinzione)}»`;
    if ("statoAnimo" in c) return `sei ${stato(c.statoAnimo)}`;
    if ("persona" in c) return `${persona(c.persona)} ha ${DIMENSIONI[c.dimensione]} almeno ${c.almeno ?? 0}`;
    if ("conosci" in c) return `conosci ${persona(c.conosci)}`;
    if ("tradisce" in c) return `${persona(c.tradisce)} ha rancore 3, oppure paura 2 e rancore 2`;
    if ("compagno" in c) return `${persona(c.compagno)} è con te`;
    if ("trattoCompagno" in c) return `con te c'è qualcuno che è ${tratto(c.trattoCompagno)}`;
    if ("traccia" in c) return `la Traccia a ${luogo(c.traccia).nome} è almeno ${c.almeno}`;
    if ("momento" in c) return `è ${[c.momento].flat().map(momentoBreve).join(" o ")}`;
    if ("luogo" in c) return `sei ${[c.luogo].flat().map((l) => luogo(l).nome).join(" o ")}`;
    if ("logorio" in c) return `${logorio(c.logorio).nome} è almeno «${logorio(c.logorio).stadi[c.almeno - 1]}»`;
    if ("ferita" in c) return `hai una ferita almeno ${c.ferita}`;
    if ("filo" in c) return `${c.filo} è almeno ${c.almeno}`;
    if ("scadenza" in c) return `${c.scadenza} è almeno ${c.almeno}`;
    return "(condizione di prova)";
  };
  const effetto = (e: Effetto): string => {
    if ("tempo" in e) return ore(e.tempo);
    if ("cosa" in e) return `${segno(e.piu)} ${cosa(e.cosa)}`;
    if ("rompi" in e) return `${cosa(e.rompi)} scende di uno stato`;
    if ("fatto" in e) return `la parola chiave ${parola(e.fatto)}`;
    if ("togliFatto" in e) return `cancella la parola chiave ${parola(e.togliFatto)}`;
    if ("notizia" in e) return notizia(e.notizia);
    if ("verifica" in e) return `${notizia(e.verifica)}, come verificata`;
    if ("convinzione" in e) return `la convinzione «${convinzione(e.convinzione)}»`;
    if ("togliConvinzione" in e) return `cancella la convinzione «${convinzione(e.togliConvinzione)}»`;
    if ("tratto" in e) return `il tratto ${tratto(e.tratto)}${e.origine ? ` (${e.origine})` : ""}`;
    if ("togliTratto" in e) return `cancella il tratto ${tratto(e.togliTratto)}`;
    if ("persona" in e) return `${persona(e.persona)}: ${Object.entries(e.cambia).map(([d, v]) => `${d} ${segno(v!)}`).join(", ")}`;
    if ("conosci" in e) return `conosci ${persona(e.conosci)}`;
    if ("compagno" in e) return `${persona(e.compagno)} viene con te: segnala fra i compagni`;
    if ("congeda" in e) return `${persona(e.congeda)} non è più con te`;
    if ("statoAnimo" in e) return `sei ${stato(e.statoAnimo)}`;
    if ("passaStatoAnimo" in e) return `non sei più ${stato(e.passaStatoAnimo)}`;
    if ("misura" in e) return `${misura(e.misura)} ${segno(e.piu)}`;
    if ("traccia" in e) return `${segno(e.piu)} Traccia a ${e.traccia === "qui" ? "questo luogo" : luogo(e.traccia).nome}`;
    if ("logorio" in e) return `${logorio(e.logorio).nome} sale di uno stadio`;
    if ("rimedio" in e) return `${logorio(e.rimedio).nome} torna «${logorio(e.rimedio).stadi[0]}»`;
    if ("ferita" in e) return `ferita ${e.ferita.gravita}: ${e.ferita.nome} (${e.ferita.ambito})`;
    if ("cura" in e) return "la ferita più grave migliora di un grado";
    if ("filo" in e) return `${storia.fili.find((f) => f.id === e.filo)?.nome ?? e.filo} ${segno(e.piu)}`;
    if ("preparazione" in e) return `preparazione: «${amb.preparazioni.find((p) => p.id === e.preparazione)?.testo}»`;
    if ("tacca" in e) return `una tacca a ${cap(e.tacca).nome}`;
    return "";
  };
  const segna = (effetti: Effetto[] | undefined) => {
    const utili = (effetti ?? []).filter((e) => effetto(e));
    return utili.length ? ` *Segna: ${utili.map(effetto).join("; ")}.*` : "";
  };
  const testo = (t: Testo) => (typeof t === "string" ? t : t.map((b) => (b.se ? `*Se ${frase(b.se)}:* ${b.testo}` : b.testo)).join("\n\n"));

  // I momenti in cui una scelta è possibile, guardando solo le condizioni sul momento.
  const momentiAmmessi = (c: Condizione | undefined): string[] => {
    const valuta = (x: Condizione, m: string): boolean => {
      if ("tutte" in x) return x.tutte.every((y) => valuta(y, m));
      if ("una" in x) return x.una.some((y) => valuta(y, m));
      if ("non" in x) return "momento" in x.non ? ![x.non.momento].flat().includes(m) : true;
      if ("momento" in x) return [x.momento].flat().includes(m);
      return true;
    };
    return amb.momenti.map((m) => m.id).filter((m) => !c || valuta(c, m));
  };

  /** Le proprietà che valgono in un luogo, in un momento. */
  const proprietaIn = (l: string, m: string): string[] => {
    const lu = luogo(l);
    const mo = amb.momenti.find((x) => x.id === m)!;
    const ids = new Set(lu.proprieta);
    for (const id of mo.proprieta) if (!(lu.sospende ?? []).some((s) => s.proprieta === id && (!s.momento || s.momento === m))) ids.add(id);
    return [...ids];
  };
  /** Il costo di partenza: capacità e ambiente, per momento. */
  const costoDi = (capId: string, l: string, m: string, righe: number) => {
    const c = cap(capId);
    let amb_ = 0;
    for (const id of proprietaIn(l, m)) amb_ += amb.proprieta.find((x) => x.id === id)?.valori[c.ambito] ?? 0;
    for (const r of [...(luogo(l).righe ?? []), ...(amb.momenti.find((x) => x.id === m)!.righe ?? [])]) if (r.ambito === c.ambito) amb_ += r.valore;
    return c.partenza + Math.max(-2, Math.min(2, amb_)) + righe;
  };
  /** La soglia con le proprietà del luogo e del momento: un gradino al massimo per parte. */
  const sogliaDi = (capId: string, sogliaId: string, l: string, m: string) => {
    const v = amb.catalogo.find((x) => x.id === sogliaId)!;
    const generi = v.generi ?? [];
    let su = false;
    let giu = false;
    for (const id of proprietaIn(l, m)) {
      for (const s of amb.proprieta.find((x) => x.id === id)?.sposta ?? []) {
        if (s.se) continue;
        if (!(s.generi?.some((x) => generi.includes(x)) || s.capacita?.includes(capId))) continue;
        if (s.gradini > 0) su = true;
        else giu = true;
      }
    }
    return v.soglia + (su ? 2 : 0) - (giu ? 2 : 0);
  };
  const perMomento = (valori: Array<{ m: string; v: string }>) => {
    const tutti = new Set(valori.map((x) => x.v));
    return tutti.size === 1 ? valori[0].v : valori.map((x) => `${momentoBreve(x.m)} ${x.v}`).join(" · ");
  };
  /** Le ragioni che spostano la soglia e dipendono da chi legge: notizie, tratti, persone, stati d'animo, attrezzi, aiuti. */
  const variazioni = (capId: string, sogliaId: string, l: string, pr?: Prova) => {
    const v = amb.catalogo.find((x) => x.id === sogliaId)!;
    const generi = v.generi ?? [];
    const out: string[] = [];
    for (const s of v.sposta ?? []) out.push(`${s.gradini < 0 ? "−2" : "+2"} alla soglia se ${frase(s.se)}`);
    for (const t of amb.tratti) for (const s of t.sposta ?? []) if (s.generi?.some((x) => generi.includes(x)) || s.capacita?.includes(capId)) if (!s.se || !("luogo" in s.se) || [s.se.luogo].flat().includes(l)) out.push(`${s.gradini < 0 ? "−2" : "+2"} se sei ${t.nome.toUpperCase()}`);
    for (const st of amb.statiAnimo) for (const s of st.sposta ?? []) if (s.generi?.some((x) => generi.includes(x)) || s.capacita?.includes(capId)) out.push(`${s.gradini < 0 ? "−2" : "+2"} se sei ${st.nome.toLowerCase()}`);
    if (proprietaIn(l, "notte").includes("buio") || luogo(l).proprieta.includes("buio")) {
      const buio = amb.proprieta.find((x) => x.id === "buio");
      if (buio?.sposta?.some((s) => s.generi?.some((x) => generi.includes(x)))) out.push("con una luce accesa ignora il buio");
    }
    for (const o of storia.cose) if (o.attrezzo && (o.attrezzo.capacita?.includes(capId) || o.attrezzo.generi?.some((x) => generi.includes(x)))) out.push(`+1 al tiro se hai ${o.nome.toLowerCase()}`);
    if (pr?.persona) {
      if (amb.sociali.fiducia.includes(capId)) out.push(`−2 alla soglia se ${persona(pr.persona)} ha fiducia almeno 2, +2 se ha rancore almeno 2`);
      if (amb.sociali.paura.includes(capId)) out.push(`−2 alla soglia se ${persona(pr.persona)} ha paura almeno 2`);
    }
    if (pr?.aiuto) out.push(`+1 al tiro con l'aiuto di ${persona(pr.aiuto)}, se ha fiducia almeno 2 o ti deve un favore; poi il debito scende di 1`);
    for (const s of pr?.sposta ?? []) out.push(`${s.gradini < 0 ? "−2" : "+2"} alla soglia: ${s.testo}`);
    if (v.serve) out.push(`${v.serve.testo} (${v.serve.una.map(frase).join(" oppure ")})`);
    return out;
  };

  const out: string[] = [];
  const p = (s = "") => out.push(s);

  // ---- testata
  p(`# ${storia.titolo}`);
  p();
  p(`### Un librogame di prova per ESPOSIZIONE 3.0`);
  p();
  p(`*Generato da \`strumento/motore\` a partire dagli stessi dati che si giocano sullo schermo. Ambientazione: ${amb.titolo}.*`);
  p();

  // ---- regole
  p(`## Come si gioca`);
  p();
  p(`Ti servono due dadi a sei facce, una matita e la scheda che trovi più avanti. Comincia dal paragrafo **1**. Ogni paragrafo racconta una situazione e ti offre delle scelte: scegline una e vai al paragrafo indicato.`);
  p();
  p(`**Le scelte chiuse.** Alcune scelte dicono «solo se…». Se la condizione non vale, non puoi sceglierle, ma ti dicono che cosa ti manca. Se una scelta non ti darebbe niente che non hai già, non serve sceglierla.`);
  p();
  p(`**Il tempo.** Il tempo si misura in ore. Quando un paragrafo ti dice di segnare delle ore, annerisci le caselle del tempo sulla scheda e fai, in quest'ordine, le cose della sezione «Quando passa il tempo».`);
  p();
  p(`**Le prove.** Quando una scelta è una prova, prima di tirare ti fai il quadro, con quattro domande.`);
  p();
  p(`1. **Puoi?** Se la prova dice «serve…» e non hai quello che serve, non puoi tentarla.`);
  p(`2. **Ci riesci?** Prendi la soglia scritta nel paragrafo per il momento del giorno in cui sei. Toglile 2 o aggiungile 2 per le ragioni scritte fra parentesi che valgono per te, ma **al massimo 2 in giù e 2 in su**. Poi aggiungi al tiro il livello della capacità (Inesperto +0, Pratico +1, Esperto +2, Maestro +3), +1 per ogni attrezzo o aiuto (al massimo +2), −1 per ogni ferita lieve all'ambito della capacità, per ogni logorio allo stremo e per ogni stato d'animo che lo dice (al massimo −3). Se la soglia scende sotto 6, non tiri: riesci.`);
  p(`3. **Quanto ti costa?** Prendi il *costo di partenza* scritto nel paragrafo, aggiungi 1 per ogni aggravante vera, togli 1 per ogni preparazione. Il grado è il risultato, ma non sotto il Fondo della capacità e non sopra 2: **0 al coperto, 1 esposto, 2 allo scoperto**.`);
  p(`4. **Che cosa cambia?** Leggi la posta, cioè che cosa rischi. Se non ti piace, puoi ancora scegliere un'altra via.`);
  p();
  p(`Poi tiri due dadi e aggiungi i tuoi bonus. Confronta il totale con la soglia:`);
  p();
  p(`> **Supera la soglia di 4: in pieno. La raggiungi: riesci. Manca 1 o 2: quasi. Di più: non riesci.**`);
  p();
  p(`Il paragrafo ti dice dove andare in ogni caso. Poi segni il costo del tuo grado, con la tabella «Dopo il tiro».`);
  p();
  p(`**Il Quasi.** Quando manca 1 o 2, scegli tu fra tre possibilità: **tutto**, e il costo si legge sulla riga del grado di sopra (allo scoperto, più su non si va: ottieni, e vai lo stesso al paragrafo del rovescio); **la metà**, se il paragrafo la offre, al tuo grado; oppure **lasci perdere**: non ottieni niente, e paghi solo una tacca di Traccia se eri esposto o allo scoperto.`);
  p();
  p(`**Ritentare.** Se non sei riuscito al coperto o esposto, o se hai lasciato perdere, puoi tornare al paragrafo della prova e ritentare, ma prima segni un'ora. Le prove segnate «una volta sola» non si ritentano.`);
  p();
  p(`**Il taccuino.** Quando un paragrafo ti dice di segnare una voce del taccuino, spuntala: è una cosa che hai sentito dire. Se il paragrafo dice «come verificata», spunta anche la seconda casella. Alcune voci dicono da quali altre sono smentite: quando segni una di quelle, cancella la voce smentita. Non tutto quello che si sente dire al porto è vero.`);
  p();
  p(`**Le convinzioni.** Sulla scheda ci sono le cose che credi. Alcune scelte sono chiuse finché ci credi. In un luogo tranquillo, se hai segnato una voce che mette in dubbio una convinzione, puoi ripensarci: segna un'ora, e decidi se lasciarla andare o tenerla.`);
  p();
  if (storia.deduzioni.length) {
    p(`**Mettere insieme.** In un luogo tranquillo, se hai segnato certe voci del taccuino, puoi metterle insieme: segna un'ora e la voce nuova. ${storia.deduzioni.map((d) => `Le voci ${d.da.map(voce).join(" e ")} danno la voce ${voce(d.notizia)}.`).join(" ")}`);
    p();
  }
  if (storia.combinazioni.length) {
    p(`**Le cose.** ${storia.combinazioni.map((c) => `${c.testo}: se hai ${c.da.map((x) => cosa(x).toLowerCase()).join(" e ")}, cancellale e segna ${cosa(c.cosa).toLowerCase()}.`).join(" ")} Una cosa fragile usata come attrezzo si rovina a ogni «non riesci»; rovinata funziona ancora, rotta no.`);
    p();
  }
  const compagni = storia.persone.filter((x) => x.compagno);
  if (compagni.length) {
    p(`**I compagni.** Qualcuno può venire con te. Finché è con te, in ogni prova in cui conosce la capacità puoi chiedergli di **aiutarti** (+1 al tiro, se si fida di te almeno 2 o ti deve un favore; poi il debito scende di 1) oppure di **farla al posto tuo**: usa il suo livello e i suoi tratti al posto dei tuoi, e se finisce in un rovescio le ferite sono sue e il suo rancore sale di 1. Se il rancore di un compagno arriva a 3, se ne va. Le sue ferite guariscono e peggiorano come le tue. ${compagni.map((x) => `${persona(x.id)}: ${Object.entries(x.compagno!.capacita).map(([k, v]) => `${cap(k).nome} ${["Inesperta", "Pratica", "Esperta", "Maestra"][v]}`.replace(/a$/, x.femminile ? "a" : "o")).join(", ")}; ${x.compagno!.tratti.map(tratto).join(", ")}.`).join(" ")}`);
    p();
  }
  p(`**Le persone.** Sulla scheda ogni persona ha le sue caselle: fiducia, debito, paura, affetto, rancore. Chi si fida di te almeno 2 ti aiuta, se glielo chiedi; chi ce l'ha con te almeno 2 non ti aiuta. Quando un paragrafo ti dice di cambiare una casella, fallo.`);
  p();
  p(`**Crescere.** Ogni prova finita in «in pieno» o «riesci» dà una tacca alla capacità usata (una per paragrafo). Con ${amb.crescita.tacche[0]} tacche un Inesperto diventa Pratico, con altre ${amb.crescita.tacche[1]} un Pratico diventa Esperto. Maestro non si diventa senza un maestro.`);
  p();
  for (const s of storia.scadenze) {
    p(`**La scadenza.** ${s.nome}: annerisci una casella ogni ${s.ogniOre} ore. Quando anneriresti l'ultima${s.salvoSe ? `, a meno che ${frase(s.salvoSe)},` : ""} vai subito al ${n(s.alScadere)}.`);
    p();
  }
  p(`**La morte.** Se muori, vai al ${n(storia.morte)}. Nessuna prova può ucciderti senza che la sua posta lo dica prima.`);
  p();

  // ---- il tempo
  p(`### Quando passa il tempo`);
  p();
  p(`1. **Scadenza**: se è il suo turno, annerisci una casella.`);
  p(`2. **Logorio**: ${amb.logorii.filter((l) => l.ogniOre > 0).map((l) => `${l.nome} sale di uno stadio ogni ${l.ogniOre} ore senza rimedio`).join("; ")}. Se un logorio è allo stremo, fai una prova di ${cap(amb.resistenza).nome}: due dadi più il livello, meno 1, contro 8. Con «quasi» perdi un'ora; con «non riesci» succede quello che dice la tabella dei logorii.`);
  p(`3. **Stati d'animo**: quelli che passano col tempo passano.`);
  p(`4. **Ferite**: una ferita lieve guarisce dopo ${amb.ferite.lieveGuarisceIn} ore; una grave non curata diventa mortale dopo ${amb.ferite.graveDiventaMortaleIn} ore; una ferita mortale non curata uccide dopo ${amb.ferite.mortaleUccideIn} ore.`);
  p(`5. **Traccia**: in ogni luogo dove non hai lasciato Traccia nuova da ${amb.traccia.calaOgniOre} ore, la Traccia cala di uno.`);
  p(`6. **Imprevisto**, una volta sola per scelta: tira due dadi. Se il risultato è al massimo ${amb.traccia.imprevistoFinoA.map((x, i) => `${x} (Traccia ${i})`).join(", ")} secondo la Traccia del luogo in cui sei, tira un dado sulla tabella degli imprevisti di quel luogo.`);
  p();

  // ---- confronto
  p(`### Il confronto`);
  p();
  p(`Alcuni paragrafi mettono davanti a te un avversario. Segna sulla scheda la sua **copertura** (al coperto, esposto, allo scoperto) e procedi a scambi:`);
  p();
  p(`1. Scegli una delle vie del paragrafo: una prova contro un punto debole, parlare (una volta sola), oppure andartene (non si tira).`);
  p(`2. Contro un punto debole: con «riesci» la sua copertura scende di quanto dice il punto debole, con «in pieno» di un grado in più; con «quasi» scegli se scoprirlo salendo tu di un grado, o lasciar perdere; con «non riesci» non lo scopri.`);
  p(`3. Se ora è allo scoperto si apre la finestra: scegli una delle fini del paragrafo, senza tirare.`);
  p(`4. Altrimenti reagisce. **Chi si chiude**, se la tua prova non è riuscita, si ricopre di un grado; se eri allo scoperto, scatta il suo pericolo. **Chi avanza** scende di un grado da solo; da esposto in giù ti è addosso e colpisce: fai una prova di difesa con ${amb.difesa.map((x) => cap(x).nome).join(" o ")}, al grado della tua ultima azione. Con «riesci» eviti il colpo; con «in pieno» lo eviti e lui si scopre di un grado; con «quasi» scegli fra la ferita dell'arma un grado più lieve e perdere qualcosa; con «non riesci» subisci la ferita dell'arma. Al coperto non ti raggiunge.`);
  p();

  // ---- scheda
  p(`## La tua scheda`);
  p();
  p(`| Capacità | Ambito | Partenza | Fondo | Livello | Tacche | Com'è andata la prima volta |`);
  p(`|---|---|---|---|---|---|---|`);
  for (const c of amb.capacita) p(`| ${c.nome} | ${c.ambito} | ${c.partenza} | ${c.fondo} | ${["Inesperto", "Pratico", "Esperto", "Maestro"][storia.personaggio.livelli[c.id] ?? 0]} | | |`);
  p();
  p(`**Tratti:** ${storia.personaggio.tratti.map(tratto).join(" · ")}. Tratti guadagnati: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`);
  p();
  p(`**Cose:** ${Object.entries(storia.personaggio.cose).map(([id, q]) => `${cosa(id)}${q > 1 ? ` (${q})` : ""}`).join(", ")}.`);
  p();
  p(`**Protezioni:** ${storia.personaggio.protezioni.map((id) => `${amb.protezioni.find((x) => x.id === id)?.nome}: ☐ intatta ☐ rovinata ☐ rotta`).join("; ")}. Una protezione declassa una ferita (${amb.protezioni.map((x) => x.contro.join(", ")).join("; ")}) di un grado e scende di uno stato.`);
  p();
  p(`**Convinzioni:** ${storia.personaggio.convinzioni.map((c) => `☐ «${convinzione(c)}»`).join(" · ")}`);
  p();
  p(`**Logorio:** ${amb.logorii.map((l) => `${l.nome}: ☐ ${l.stadi.join(" ☐ ")}`).join(" · ")}`);
  p();
  p(`**Stati d'animo:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_ (al massimo due)`);
  p();
  p(`**Ferite:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`);
  p();
  p(`**Traccia:** ${amb.luoghi.map((l) => `${l.nome} ☐☐☐`).join(" · ")}`);
  p();
  p(`**Tempo:** ${amb.momenti.map((m) => `${momentoBreve(m.id)} ${"☐".repeat(m.ore)}`).join(" · ")} (poi si ricomincia)`);
  p();
  for (const s of storia.scadenze) p(`**${s.nome}:** ${"☐".repeat(s.caselle)}`);
  p();
  p(`**Parole chiave:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`);
  p();
  if (storia.persone.some((x) => x.compagno)) {
    p(`**Con te:** \_\_\_\_\_\_\_\_\_\_\_\_ · ferite del compagno: \_\_\_\_\_\_\_\_\_\_\_\_`);
    p();
  }
  p(`**Le persone**`);
  p();
  p(`| Persona | Fiducia | Debito | Paura | Affetto | Rancore |`);
  p(`|---|---|---|---|---|---|`);
  for (const x of storia.persone) {
    const d = (k: keyof typeof DIMENSIONI) => (k in x.dimensioni ? `${x.dimensioni[k]}` : "—");
    p(`| ${x.nome} | ${d("fiducia")} | ${d("debito")} | ${d("paura")} | ${d("affetto")} | ${d("rancore")} |`);
  }
  p();
  p(`**Il taccuino.** Ogni voce ha due caselle: la prima quando la senti, la seconda quando la verifichi.`);
  p();
  storia.notizie.forEach((k, i) => p(`${i + 1}. ☐ ☐ ${k.testo}${k.smentitaDa?.length ? ` *Smentita dalle voci ${k.smentitaDa.map(voce).join(" e ")}.*` : ""}${storia.convinzioni.some((c) => c.dubbioDa.includes(k.id)) ? ` *Mette in dubbio: «${storia.convinzioni.filter((c) => c.dubbioDa.includes(k.id)).map((c) => c.testo).join("», «")}».*` : ""}`));
  p();

  // ---- tabelle
  p(`## Le tabelle`);
  p();
  p(`### Le fasce`);
  p();
  p(`Quanto devono fare i dadi, cioè la soglia meno i tuoi bonus, e che cosa ti aspetta su 100 tiri:`);
  p();
  p(`| I dadi devono fare | In pieno | Riesci | Quasi | Non riesci |`);
  p(`|---|---|---|---|---|`);
  for (let d = 3; d <= 12; d++) {
    const f = fascePercento(d);
    p(`| ${d} | ${f.pieno} | ${f.riesci} | ${f.quasi} | ${f.non} |`);
  }
  p();
  p(`### Dopo il tiro`);
  p();
  p(`| | Al coperto | Esposto | Allo scoperto |`);
  p(`|---|---|---|---|`);
  p(`| **In pieno** | ottieni, e qualcosa in più | + una tacca di Traccia | + una tacca di Traccia e il prezzo |`);
  p(`| **Riesci** | ottieni | + una tacca di Traccia | + una tacca di Traccia e il prezzo |`);
  p(`| **Quasi** | tutto (+1 Traccia) · la metà · lasci perdere | tutto (+1 Traccia e il prezzo) · la metà (+1 Traccia) · lasci perdere (+1 Traccia) | tutto (+1 Traccia e il rovescio) · la metà (+1 Traccia e il prezzo) · lasci perdere (+1 Traccia) |`);
  p(`| **Non riesci** | segni la voce del taccuino | + una tacca di Traccia e un imprevisto del luogo | + una tacca di Traccia, sale il logorio del suo ambito, perdi il travestimento, vai al paragrafo del rovescio |`);
  p();
  p(`Il **prezzo**, se il paragrafo non lo dice, è la voce «prezzo» degli imprevisti del luogo. La Traccia non sale mai più di una tacca per prova.`);
  p();
  p(`### Le proprietà dei luoghi`);
  p();
  p(`Ti servono per capire perché la soglia e il costo cambiano. I paragrafi li hanno già calcolati.`);
  p();
  for (const pr of amb.proprieta) {
    const val = Object.entries(pr.valori).filter(([, v]) => v).map(([a, v]) => `${a} ${segno(v!)}`).join(", ");
    const sp = (pr.sposta ?? []).map((s) => `${s.testo}: ${s.gradini < 0 ? "−2" : "+2"} alla soglia`).join("; ");
    p(`- **${pr.nome}**${val ? ` (costo: ${val})` : ""}${sp ? `. ${sp}` : ""}${pr.serve?.length ? `. ${pr.serve.map((s) => s.testo).join("; ")}` : ""}${pr.annullataDa ? `. ${pr.annullataDa.testo}` : ""}.`);
  }
  p();
  p(`| Luogo | Proprietà | ${amb.momenti.map((m) => momentoBreve(m.id)).join(" | ")} |`);
  p(`|---|---|${amb.momenti.map(() => "---").join("|")}|`);
  for (const l of amb.luoghi) p(`| ${l.nome} | ${l.proprieta.map((id) => amb.proprieta.find((x) => x.id === id)?.nome.toLowerCase()).join(", ") || "—"} | ${amb.momenti.map((m) => proprietaIn(l.id, m.id).map((id) => amb.proprieta.find((x) => x.id === id)?.nome.toLowerCase()).join(", ") || "—").join(" | ")} |`);
  p();
  p(`### I tratti`);
  p();
  for (const t of amb.tratti) p(`- **${t.nome}**: ${t.effetti}.`);
  p();
  p(`### Gli stati d'animo`);
  p();
  for (const s of amb.statiAnimo) p(`- **${s.nome}**: ${s.effetti}. Passa ${s.passa.testo}.`);
  p();
  p(`### Aggravanti (+1 ciascuna)`);
  p();
  for (const ag of amb.aggravanti) {
    const q = ag.quando;
    const quando = "tracciaQui" in q ? `la Traccia del luogo in cui sei è almeno ${q.tracciaQui}` : "logorioSuAmbito" in q ? "un logorio che tocca l'ambito della capacità è almeno al secondo stadio" : "tagScena" in q ? "il paragrafo dice «sono in tanti a guardare»" : "cosaProprieta" in q ? `porti ${storia.cose.filter((o) => o.proprieta?.includes(q.cosaProprieta)).map((o) => o.nome.toLowerCase()).join(" o ")}` : frase(q);
    p(`- *${ag.testo}*: se ${quando}.`);
  }
  p();
  p(`### Preparazioni (−1 ciascuna, una per tipo)`);
  p();
  for (const x of amb.preparazioni) p(`- *${x.testo}*: ${x.costo}; ${x.durata === "luogo" ? "vale finché resti nel luogo" : x.durata === "prova" ? "vale per una prova" : `vale finché hai ${cosa(x.cosa!).toLowerCase()}`}.`);
  p();
  p(`### Logorii`);
  p();
  for (const l of amb.logorii) p(`- **${l.nome}** (${l.ambiti.join(", ")}): ${l.stadi.join(" · ")}. Rimedio: ${l.rimedio}. Se crolli: ${l.crollo.testo}${segna(l.crollo.effetti)}`);
  p();
  p(`### Armi`);
  p();
  p(`| Arma | Se ti colpisce esposto | Se ti colpisce allo scoperto |`);
  p(`|---|---|---|`);
  for (const ar of amb.armi) p(`| ${ar.nome} | ${ar.daEsposto} | ${ar.daScoperto} |`);
  p();
  p(`### Imprevisti e prezzi`);
  p();
  for (const l of amb.luoghi) {
    const voci = amb.repertorio.filter((v) => v.zona === l.zona && v.tipo !== "prezzo");
    const prezzi = amb.repertorio.filter((v) => v.zona === l.zona && v.tipo === "prezzo");
    if (!voci.length) continue;
    p(`**${l.nome}** (tira un dado; se la voce non vale o il dado supera le voci, non succede niente):`);
    p();
    voci.forEach((v, i) => p(`${i + 1}. ${v.quando ? `*Solo se ${frase(v.quando)}:* ` : ""}${v.testo}${segna(v.effetti)}${v.vai ? ` Vai al ${n(v.vai)}.` : ""}`));
    for (const v of prezzi) p(`- *Prezzo:* ${v.testo}${segna(v.effetti)}`);
    p();
  }

  // ---- paragrafi
  p(`## I paragrafi`);
  p();
  const ordinate = [...storia.scene].sort((a, b) => numero.get(a.id)! - numero.get(b.id)!);
  const provaInRiga = (s: Scena, c: Scelta, pr: Prova, req: string) => {
    const ammessi = momentiAmmessi(c.requisito);
    const righe = (pr.righe ?? []).reduce((x, r) => x + r.valore, 0);
    const sog = perMomento(ammessi.map((m) => ({ m, v: String(sogliaDi(pr.capacita, pr.soglia, s.luogo, m)) })));
    const cost = perMomento(ammessi.map((m) => ({ m, v: segno(costoDi(pr.capacita, s.luogo, m, righe)).replace("+", "") })));
    const nomeSoglia = SOGLIA_NOME[amb.catalogo.find((x) => x.id === pr.soglia)!.soglia];
    const vari = variazioni(pr.capacita, pr.soglia, s.luogo, pr);
    const c_ = cap(pr.capacita);
    const meta = pr.meta ? ("ripiego" in pr.meta ? (s.scelte ?? []).find((x) => x.id === (pr.meta as { ripiego: string }).ripiego)?.vai : pr.meta.vai) : undefined;
    const dono = pr.dono ? `segna anche: ${pr.dono.testo}${segna(pr.dono.effetti)}` : `segna anche ${notizia(pr.nonRiesci.notizia)}`;
    const quasi = [`al ${n(pr.riesci.vai)} salendo di un grado`, meta ? `al ${n(meta)} (la metà)` : "", `resta qui (lasci perdere)`].filter(Boolean).join(", ");
    const extra = [pr.unColpoSolo ? "Una volta sola." : "", pr.prezzo ? `Il prezzo, allo scoperto: ${pr.prezzo.testo}${segna(pr.prezzo.effetti)}` : ""].filter(Boolean).join(" ");
    return `- **Prova: ${c.testo}**${req}. ${c_.nome} (${c_.ambito}, Fondo ${c_.fondo}). Soglia ${nomeSoglia}: ${sog}${vari.length ? ` (${vari.join("; ")})` : ""}. Costo di partenza: ${cost}${(pr.righe ?? []).map((r) => ` (compresa la riga «${r.testo}», ${segno(r.valore)})`).join("")}. *${pr.posta}* **In pieno**: ${n(pr.riesci.vai)}, e ${dono} · **Riesci**: ${n(pr.riesci.vai)}${segna(pr.riesci.effetti)} · **Quasi**: scegli ${quasi} · **Non riesci**: segna ${notizia(pr.nonRiesci.notizia)}, vai al ${n(pr.nonRiesci.vai)}${segna(pr.nonRiesci.effetti)}${pr.rovescio ? `; allo scoperto, rovescio: ${n(pr.rovescio.vai)}${segna(pr.rovescio.effetti)}` : ""}.${extra ? ` ${extra}` : ""}`;
  };
  for (const s of ordinate) {
    const lu = luogo(s.luogo);
    p(`### ${numero.get(s.id)}`);
    p();
    p(`*${lu.nome}.*${s.tag?.includes("sorvegliato") ? " *Qui sono in tanti a guardare.*" : ""}`);
    p();
    p(testo(s.testo));
    if (s.entrando?.length) {
      p();
      p(segna(s.entrando).trim());
    }
    p();
    if (s.finale) {
      p(`**Fine.** ${{ vittoria: "Ce l'hai fatta.", sconfitta: "La storia finisce qui.", morte: "La tua storia finisce qui." }[s.finale.tipo]}`);
      p();
      continue;
    }
    for (const c of s.scelte ?? []) {
      const req = c.requisito ? ` *(solo se ${frase(c.requisito)})*` : "";
      if (c.prova) p(provaInRiga(s, c, c.prova, req));
      else p(`- ${c.ripiego ? "*Ripiego, non si tira:* " : ""}${c.testo}${req}.${segna(c.effetti)} Vai al ${n(c.vai ?? s.id)}.`);
    }
    if (lu.tranquillo && !s.confronto) p(`- *Luogo tranquillo:* qui puoi ripensare a una convinzione o mettere insieme le voci del taccuino (un'ora), poi torni a questo paragrafo.`);
    if (s.confronto) {
      const conf = s.confronto;
      const avv = amb.avversari.find((x) => x.id === conf.avversario)!;
      const arma = avv.pericolo.arma ? amb.armi.find((x) => x.id === avv.pericolo.arma) : undefined;
      p(`**Confronto con ${avv.nome}**: ${avv.natura === "avanza" ? "chi avanza" : "chi si chiude"}, parte ${["al coperto", "esposto", "allo scoperto"][avv.copertura]}. Pericolo: ${arma ? `${arma.nome} (esposto: ${arma.daEsposto}; allo scoperto: ${arma.daScoperto})${avv.sogliaDifesa ? `, difesa ${SOGLIA_NOME[amb.catalogo.find((x) => x.id === avv.sogliaDifesa)!.soglia]}` : ""}` : `${avv.pericolo.sociale} (vai al ${n(conf.seTiPrende!)})`}. Vuole ${avv.movente.vuole}; smette ${avv.movente.smette}; ${avv.movente.mantieneLaParola ? "mantiene la parola" : "non mantiene la parola"}.`);
      p();
      const cost = (capId: string) => perMomento(amb.momenti.map((m) => ({ m: m.id, v: segno(costoDi(capId, s.luogo, m.id, 0)).replace("+", "") })));
      for (const pd of avv.puntiDeboli) {
        const sog = perMomento(amb.momenti.map((m) => ({ m: m.id, v: String(sogliaDi(pd.capacita, pd.soglia, s.luogo, m.id)) })));
        p(`- **Punto debole: ${pd.testo}**${pd.requisito ? ` *(solo se ${frase(pd.requisito)})*` : ""}. ${cap(pd.capacita).nome}, soglia ${sog}, costo di partenza ${cost(pd.capacita)}. Se riesci, lo scopri di ${pd.gradi === 1 ? "un grado" : "due gradi"}.`);
      }
      if (conf.parlare) p(`- **Parlare, una volta sola: ${conf.parlare.testo}**${conf.parlare.requisito ? ` *(solo se ${frase(conf.parlare.requisito)})*` : ""}. ${cap(conf.parlare.capacita).nome}, soglia ${sogliaDi(conf.parlare.capacita, conf.parlare.soglia, s.luogo, "giorno")}, costo di partenza ${cost(conf.parlare.capacita)}. Se riesci, vai al ${n(conf.parlare.riesci.vai)}.${segna(conf.parlare.riesci.effetti)} Se non riesci, reagisce.`);
      p(`- *Ripiego, non si tira:* ${conf.andarsene.testo}.${segna(conf.andarsene.effetti)} Vai al ${n(conf.andarsene.vai)}.`);
      p(`- **Finestra** (quando è allo scoperto, senza tirare): ${conf.fini.map((f) => `${f.testo}${segna(f.effetti)} → ${n(f.vai)}`).join(" · ")}.`);
    }
    p();
  }
  return out.join("\n");
}
