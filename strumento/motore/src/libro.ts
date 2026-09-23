/**
 * Dal formato dati al librogame (§22.1): regole, scheda, tabelle e paragrafi
 * numerati, in Markdown, pronti per la catena Typst del repository.
 * Il libro e il gioco digitale leggono gli stessi dati: nessuna regola cambia.
 */

import type { Ambientazione, Condizione, Effetto, Prova, Scena, Storia, Testo } from "./tipi.ts";
import { intero } from "./dadi.ts";
import { percentuale, probabilita } from "./dadi.ts";

const NUMERI = ["zero", "un", "due", "tre", "quattro", "cinque", "sei", "sette", "otto"];
const SOGLIA_NOME: Record<number, string> = { 6: "Facile", 8: "Impegnativa", 10: "Ardua", 12: "Estrema" };

function segno(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${-n}` : "0";
}

export function libro(amb: Ambientazione, storia: Storia, seme = 7): string {
  // ---- numerazione: l'inizio è l'1, il resto mescolato in modo riproducibile
  const altre = storia.scene.filter((s) => s.id !== storia.inizio).map((s) => s.id);
  let rng = seme;
  for (let i = altre.length - 1; i > 0; i--) {
    const r = intero(rng, 0, i);
    rng = r.stato;
    [altre[i], altre[r.valore]] = [altre[r.valore], altre[i]];
  }
  const numero = new Map<string, number>([[storia.inizio, 1], ...altre.map((id, i) => [id, i + 2] as [string, number])]);
  const n = (id: string) => `**${numero.get(id) ?? "?"}**`;

  const cap = (id: string) => amb.capacita.find((c) => c.id === id)!;
  const luogo = (id: string) => amb.luoghi.find((l) => l.id === id)!;
  const momentoBreve = (id: string) => amb.momenti.find((m) => m.id === id)!.nome.split(",")[0];
  const conoscenza = (id: string) => `la voce ${storia.conoscenze.findIndex((k) => k.id === id) + 1} del taccuino`;
  const parola = (id: string) => storia.fatti.find((f) => f.id === id)?.parola ?? id.toUpperCase();
  const oggetto = (id: string) => storia.oggetti.find((o) => o.id === id)?.nome ?? id;
  const misura = (id: string) => storia.misure.find((m) => m.id === id)?.nome ?? id;
  const logorio = (id: string) => amb.logorii.find((l) => l.id === id)!;

  // ---- condizioni ed effetti a parole
  const frase = (c: Condizione): string => {
    if ("tutte" in c) return c.tutte.map(frase).join(" e ");
    if ("una" in c) return c.una.map(frase).join(" oppure ");
    if ("non" in c) {
      const x = c.non;
      if ("momento" in x) return `non è ${[x.momento].flat().map(momentoBreve).join(" né ")}`;
      if ("traccia" in x) return `la Traccia a ${luogo(x.traccia).nome} è meno di ${x.almeno}`;
      return `non vale: ${frase(x)}`;
    }
    if ("fatto" in c) return `hai la parola chiave ${parola(c.fatto)}`;
    if ("nonFatto" in c) return `non hai la parola chiave ${parola(c.nonFatto)}`;
    if ("misura" in c) return `${misura(c.misura)} è almeno ${c.almeno ?? 0}`;
    if ("oggetto" in c) return (c.almeno ?? 1) > 1 ? `hai almeno ${c.almeno} ${oggetto(c.oggetto).toLowerCase()}` : `hai: ${oggetto(c.oggetto)}`;
    if ("conoscenza" in c) return `hai segnato ${conoscenza(c.conoscenza)}`;
    if ("nonConoscenza" in c) return `non hai segnato ${conoscenza(c.nonConoscenza)}`;
    if ("traccia" in c) return `la Traccia a ${luogo(c.traccia).nome} è almeno ${c.almeno}`;
    if ("momento" in c) return `è ${[c.momento].flat().map(momentoBreve).join(" o ")}`;
    if ("logorio" in c) return `${logorio(c.logorio).nome} è almeno «${logorio(c.logorio).stadi[c.almeno - 1]}»`;
    if ("ferita" in c) return `hai una ferita almeno ${c.ferita}`;
    if ("filo" in c) return `${c.filo} è almeno ${c.almeno}`;
    if ("scadenza" in c) return `${c.scadenza} è almeno ${c.almeno}`;
    return "(condizione di prova)";
  };
  const effetto = (e: Effetto): string => {
    if ("tempo" in e) return e.tempo === 1 ? "un passo" : `${NUMERI[e.tempo] ?? e.tempo} passi`;
    if ("oggetto" in e) return `${segno(e.piu)} ${oggetto(e.oggetto)}`;
    if ("fatto" in e) return `la parola chiave ${parola(e.fatto)}`;
    if ("togliFatto" in e) return `cancella la parola chiave ${parola(e.togliFatto)}`;
    if ("conoscenza" in e) return conoscenza(e.conoscenza);
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
  const segna = (effetti: Effetto[] | undefined) => (effetti && effetti.length ? ` *Segna: ${effetti.map(effetto).join("; ")}.*` : "");
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
  const partenze = (p: { capacita: string; righe?: Prova["righe"] }, scena: Scena, req?: Condizione) => {
    const c = cap(p.capacita);
    const l = luogo(scena.luogo);
    const righe = (p.righe ?? []).reduce((s, r) => s + r.valore, 0);
    const ammessi = momentiAmmessi(req);
    const valori = ammessi.map((m) => {
      const mo = amb.momenti.find((x) => x.id === m)!;
      return { m, v: c.partenza + (l.valori[c.ambito] ?? 0) + (mo.valori[c.ambito] ?? 0) + righe };
    });
    const tutti = new Set(valori.map((x) => x.v));
    const num = (x: number) => (x < 0 ? `−${-x}` : `${x}`);
    const somma = tutti.size === 1 ? num(valori[0].v) : valori.map((x) => `${momentoBreve(x.m)} ${num(x.v)}`).join(" · ");
    const scena_ = (p.righe ?? []).map((r) => ` (compresa la riga «${r.testo}», ${segno(r.valore)})`).join("");
    return `${c.nome} (${c.ambito}, Fondo ${c.fondo}). Somma di partenza: ${somma}${scena_}`;
  };
  const soglia = (id: string) => {
    const s = amb.soglie.find((x) => x.id === id)!;
    return `${SOGLIA_NOME[s.soglia]} (${s.soglia})`;
  };

  const out: string[] = [];
  const p = (s = "") => out.push(s);

  // ---- testata
  p(`# ${storia.titolo}`);
  p();
  p(`### Un librogame di prova per ESPOSIZIONE`);
  p();
  p(`*Generato da \`strumento/motore\` a partire dagli stessi dati che si giocano sullo schermo. Ambientazione: ${amb.titolo}.*`);
  p();

  // ---- regole
  p(`## Come si gioca`);
  p();
  p(`Ti servono due dadi a sei facce, una matita e la scheda che trovi più avanti. Comincia dal paragrafo **1**. Ogni paragrafo racconta una situazione e ti offre delle scelte: scegline una e vai al paragrafo indicato.`);
  p();
  p(`**Le scelte chiuse.** Alcune scelte dicono «solo se…». Se la condizione non vale, non puoi sceglierle, ma ti dicono che cosa ti manca.`);
  p();
  p(`**Il tempo.** Il tempo si misura in passi (${amb.tempo.passo}). Quando un paragrafo ti dice di segnare un passo, annerisci una casella del tempo sulla scheda e fai, in quest'ordine, le cose della sezione «Ogni passo».`);
  p();
  p(`**Le prove.** Quando una scelta è una prova, prima di tirare prepari la ricevuta:`);
  p();
  p(`1. Prendi la *somma di partenza* scritta nel paragrafo, per il momento del giorno in cui ti trovi.`);
  p(`2. Aggiungi 1 per ogni aggravante vera (tabella delle aggravanti).`);
  p(`3. Togli 1 per ogni preparazione che hai (tabella delle preparazioni).`);
  p(`4. Il grado è la somma, ma non sotto il Fondo della capacità e non sopra 2: **0 al coperto, 1 esposto, 2 allo scoperto**.`);
  p(`5. Leggi la posta, cioè che cosa rischi. Se non ti piace, puoi ancora scegliere un'altra via.`);
  p();
  p(`Poi tiri due dadi e aggiungi il livello della capacità (Inesperto +0, Pratico +1, Esperto +2, Maestro +3). Togli 1 per ogni ferita lieve che tocca l'ambito della capacità e 1 per ogni logorio allo stremo, fino a −3. Se raggiungi la soglia, riesci. Una ferita grave ti impedisce del tutto le capacità del suo ambito.`);
  p();
  p(`**Dopo la prova**, guarda la tabella delle sei caselle: incrocia «riesci» o «non riesci» con il grado, segna gli effetti e vai al paragrafo indicato. Il paragrafo di chi non riesce vale sia al coperto sia esposto; allo scoperto si va al paragrafo del rovescio.`);
  p();
  p(`**Ritentare.** Se non sei riuscito al coperto o esposto, puoi tornare al paragrafo della prova e ritentare, ma prima segni un passo. Le prove segnate «una volta sola» non si ritentano.`);
  p();
  p(`**Crescere.** Ogni prova riuscita dà una tacca alla capacità usata (una per paragrafo). Con ${amb.crescita.tacche[0]} tacche un Inesperto diventa Pratico, con altre ${amb.crescita.tacche[1]} un Pratico diventa Esperto. Maestro non si diventa senza un maestro.`);
  p();
  for (const s of storia.scadenze) {
    p(`**La scadenza.** ${s.nome}: annerisci una casella ogni ${s.ogniPassi} passi. Quando anneriresti l'ultima${s.salvoSe ? `, a meno che ${frase(s.salvoSe)},` : ""} vai subito al ${n(s.alScadere)}.`);
    p();
  }
  p(`**La morte.** Se muori, vai al ${n(storia.morte)}. Nessuna prova può ucciderti senza che la sua posta lo dica prima.`);
  p();

  // ---- ogni passo
  p(`### Ogni passo`);
  p();
  p(`1. **Scadenza**: se è il suo turno, annerisci una casella.`);
  p(`2. **Logorio**: ${amb.logorii.filter((l) => l.ogniPassi > 0).map((l) => `${l.nome} sale di uno stadio ogni ${l.ogniPassi} passi senza rimedio`).join("; ")}. Se un logorio è allo stremo, fai una prova di ${cap(amb.resistenza).nome}: due dadi più il livello, contro 8. Se non riesci, succede quello che dice la tabella dei logorii.`);
  p(`3. **Ferite**: una ferita lieve guarisce dopo ${amb.ferite.lieveGuarisceIn} passi; una grave non curata diventa mortale dopo ${amb.ferite.graveDiventaMortaleIn} passi; una ferita mortale non curata uccide dopo ${amb.ferite.mortaleUccideIn} passi.`);
  p(`4. **Traccia**: in ogni luogo dove non hai lasciato Traccia nuova da ${amb.traccia.calaOgniPassi} passi, la Traccia cala di uno.`);
  p(`5. **Imprevisto**: tira due dadi. Se il risultato è al massimo ${amb.traccia.imprevistoFinoA.map((x, i) => `${x} (Traccia ${i})`).join(", ")} secondo la Traccia del luogo in cui sei, tira un dado sulla tabella degli imprevisti di quel luogo.`);
  p();

  // ---- confronto
  p(`### Il confronto`);
  p();
  p(`Alcuni paragrafi mettono davanti a te un avversario. Segna sulla scheda la sua **copertura** (al coperto, esposto, allo scoperto) e procedi a scambi:`);
  p();
  p(`1. Scegli una delle vie del paragrafo: una prova contro un punto debole, parlare (una volta sola), oppure andartene (non si tira).`);
  p(`2. Se una prova contro un punto debole riesce, la sua copertura scende di quanto dice il punto debole.`);
  p(`3. Se ora è allo scoperto si apre la finestra: scegli una delle fini del paragrafo, senza tirare.`);
  p(`4. Altrimenti reagisce. **Chi si chiude**, se la tua prova è fallita, si ricopre di un grado (mai oltre quello da cui era partito); se eri allo scoperto, scatta il suo pericolo. **Chi avanza** scende di un grado da solo; da esposto in giù ti è addosso e colpisce: fai una prova di difesa con ${amb.difesa.map((x) => cap(x).nome).join(" o ")}, al grado della tua ultima azione. Se non riesci esposto subisci la ferita «da esposto» dell'arma, allo scoperto quella «da allo scoperto». Al coperto non ti raggiunge.`);
  p();

  // ---- scheda
  p(`## La tua scheda`);
  p();
  p(`| Capacità | Ambito | Partenza | Fondo | Livello | Tacche | Tentativi la prima volta |`);
  p(`|---|---|---|---|---|---|---|`);
  for (const c of amb.capacita) p(`| ${c.nome} | ${c.ambito} | ${c.partenza} | ${c.fondo} | ${["Inesperto", "Pratico", "Esperto", "Maestro"][storia.personaggio.livelli[c.id] ?? 0]} | | |`);
  p();
  p(`**Oggetti:** ${Object.entries(storia.personaggio.oggetti).map(([id, q]) => `${oggetto(id)}${q > 1 ? ` (${q})` : ""}`).join(", ")}.`);
  p();
  p(`**Protezioni:** ${storia.personaggio.protezioni.map((id) => `${amb.protezioni.find((x) => x.id === id)?.nome}: ☐ intatta ☐ intaccata ☐ inservibile`).join("; ")}. Una protezione declassa una ferita (${amb.protezioni.map((x) => x.contro.join(", ")).join("; ")}) di un grado e scende di uno stato.`);
  p();
  p(`**Logorio:** ${amb.logorii.map((l) => `${l.nome}: ☐ ${l.stadi.join(" ☐ ")}`).join(" · ")}`);
  p();
  p(`**Ferite:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`);
  p();
  p(`**Traccia:** ${amb.luoghi.map((l) => `${l.nome} ☐☐☐`).join(" · ")}`);
  p();
  p(`**Tempo:** ${amb.momenti.map((m) => `${momentoBreve(m.id)} ${"☐".repeat(m.passi)}`).join(" · ")} (poi si ricomincia)`);
  p();
  for (const s of storia.scadenze) p(`**${s.nome}:** ${"☐".repeat(s.caselle)}`);
  p();
  p(`**Parole chiave:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_`);
  p();
  for (const m of storia.misure) p(`**${m.nome}:** ${"☐".repeat(m.max)}`);
  p();
  p(`**Taccuino.** Quando un paragrafo ti dice di segnare una voce, spuntala. Non tutto quello che si sente dire al porto è vero.`);
  p();
  storia.conoscenze.forEach((k, i) => p(`${i + 1}. ☐ ${k.testo}`));
  p();

  // ---- tabelle
  p(`## Le tabelle`);
  p();
  p(`### Probabilità di riuscire`);
  p();
  p(`| | Facile (6) | Impegnativa (8) | Ardua (10) | Estrema (12) |`);
  p(`|---|---|---|---|---|`);
  ["Inesperto (+0)", "Pratico (+1)", "Esperto (+2)", "Maestro (+3)"].forEach((nome, liv) => p(`| ${nome} | ${[6, 8, 10, 12].map((s) => `${percentuale(probabilita(s, liv, 0))}%`).join(" | ")} |`));
  p();
  p(`### Dopo ogni prova`);
  p();
  p(`| | Riesci | Non riesci |`);
  p(`|---|---|---|`);
  p(`| **Al coperto** | successo pieno: niente da segnare | fallimento pulito: se il paragrafo lo dice, una cosa nel taccuino |`);
  p(`| **Esposto** | successo sporco: +1 Traccia nel luogo | rovescio minore: +1 Traccia e un imprevisto del luogo |`);
  p(`| **Allo scoperto** | a caro prezzo: +1 Traccia e il prezzo del paragrafo | rovescio: +1 Traccia, sale il logorio del suo ambito, perdi il travestimento, vai al paragrafo del rovescio |`);
  p();
  p(`### Luoghi e momenti`);
  p();
  p(`Ti servono per capire perché la somma di partenza cambia. Le somme sono già calcolate nei paragrafi.`);
  p();
  p(`| | ${amb.ambiti.map((a) => a.nome).join(" | ")} |`);
  p(`|---|${amb.ambiti.map(() => "---").join("|")}|`);
  for (const l of amb.luoghi) p(`| ${l.nome} | ${amb.ambiti.map((a) => segno(l.valori[a.id] ?? 0)).join(" | ")} |`);
  for (const m of amb.momenti) p(`| *${m.nome}* | ${amb.ambiti.map((a) => segno(m.valori[a.id] ?? 0)).join(" | ")} |`);
  p();
  p(`### Aggravanti (+1 ciascuna)`);
  p();
  const quandoAgg: Record<string, string> = {};
  for (const a of amb.aggravanti) {
    const q = a.quando;
    quandoAgg[a.id] = "tracciaQui" in q ? `la Traccia del luogo in cui sei è almeno ${q.tracciaQui}` : "logorioSuAmbito" in q ? `un logorio che tocca l'ambito della capacità è almeno al secondo stadio` : "tagScena" in q ? `il paragrafo dice «sono in tanti a guardare»` : "oggettoTag" in q ? `porti ${storia.oggetti.filter((o) => o.tag?.includes(q.oggettoTag)).map((o) => o.nome.toLowerCase()).join(" o ")}` : frase(q);
    p(`- *${a.testo}*: se ${quandoAgg[a.id]}.`);
  }
  p();
  p(`### Preparazioni (−1 ciascuna, una per tipo)`);
  p();
  for (const x of amb.preparazioni) p(`- *${x.testo}*: ${x.costo}; ${x.durata === "luogo" ? "vale finché resti nel luogo" : x.durata === "prova" ? "vale per una prova" : `vale finché hai ${oggetto(x.oggetto!).toLowerCase()}`}.`);
  p();
  p(`### Logorii`);
  p();
  for (const l of amb.logorii) p(`- **${l.nome}** (${l.ambiti.join(", ")}): ${l.stadi.join(" · ")}. Rimedio: ${l.rimedio}. Se crolli: ${l.crollo.testo}${segna(l.crollo.effetti)}`);
  p();
  p(`### Armi`);
  p();
  p(`| Arma | Se ti colpisce esposto | Se ti colpisce allo scoperto |`);
  p(`|---|---|---|`);
  for (const a of amb.armi) p(`| ${a.nome} | ${a.daEsposto} | ${a.daScoperto} |`);
  p();
  p(`### Imprevisti`);
  p();
  for (const l of amb.luoghi) {
    const voci = amb.repertorio.filter((v) => v.zona === l.zona);
    if (!voci.length) continue;
    p(`**${l.nome}** (tira un dado; se la voce non vale o il dado supera le voci, non succede niente):`);
    p();
    voci.forEach((v, i) => p(`${i + 1}. ${v.quando ? `*Solo se ${frase(v.quando)}:* ` : ""}${v.testo}${segna(v.effetti)}${v.vai ? ` Vai al ${n(v.vai)}.` : ""}`));
    p();
  }

  // ---- paragrafi
  p(`## I paragrafi`);
  p();
  const ordinate = [...storia.scene].sort((a, b) => numero.get(a.id)! - numero.get(b.id)!);
  for (const s of ordinate) {
    p(`### ${numero.get(s.id)}`);
    p();
    p(`*${luogo(s.luogo).nome}.*${s.tag?.includes("sorvegliato") ? " *Qui sono in tanti a guardare.*" : ""}`);
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
      if (c.prova) {
        const pr = c.prova;
        const extra = [
          pr.unColpoSolo ? "Una volta sola." : "",
          pr.prezzo ? `Se riesci allo scoperto: ${pr.prezzo.testo}${segna(pr.prezzo.effetti)}` : "",
          pr.conoscenza ? `Se non riesci al coperto, segna ${conoscenza(pr.conoscenza)}.` : "",
        ].filter(Boolean).join(" ");
        p(`- **Prova: ${c.testo}**${req}. ${partenze(pr, s, c.requisito)}. Soglia ${soglia(pr.soglia)}. *${pr.posta}* Riesci: ${n(pr.riesci.vai)}${segna(pr.riesci.effetti)} · Non riesci: ${n(pr.nonRiesci.vai)}${segna(pr.nonRiesci.effetti)} · Rovescio: ${n(pr.rovescio.vai)}${segna(pr.rovescio.effetti)}${extra ? `. ${extra}` : ""}`);
      } else {
        p(`- ${c.povera ? "*Via povera, non si tira:* " : ""}${c.testo}${req}.${segna(c.effetti)} Vai al ${n(c.vai ?? s.id)}.`);
      }
    }
    if (s.confronto) {
      const conf = s.confronto;
      const avv = amb.avversari.find((a) => a.id === conf.avversario)!;
      const arma = avv.pericolo.arma ? amb.armi.find((a) => a.id === avv.pericolo.arma) : undefined;
      p(`**Confronto con ${avv.nome}**: ${avv.natura === "avanza" ? "chi avanza" : "chi si chiude"}, parte ${["al coperto", "esposto", "allo scoperto"][avv.copertura]}. Pericolo: ${arma ? `${arma.nome} (esposto: ${arma.daEsposto}; allo scoperto: ${arma.daScoperto})${avv.sogliaDifesa ? `, difesa ${soglia(avv.sogliaDifesa)}` : ""}` : `${avv.pericolo.sociale} (vai al ${n(conf.seTiPrende!)})`}. Vuole ${avv.movente.vuole}; smette ${avv.movente.smette}; ${avv.movente.mantieneLaParola ? "mantiene la parola" : "non mantiene la parola"}.`);
      p();
      for (const pd of avv.puntiDeboli) {
        p(`- **Punto debole: ${pd.testo}**${pd.requisito ? ` *(solo se ${frase(pd.requisito)})*` : ""}. ${partenze({ capacita: pd.capacita }, s)}. Soglia ${soglia(pd.soglia)}. Se riesci, lo scopri di ${pd.gradi === 1 ? "un grado" : "due gradi"}.`);
      }
      if (conf.parlare) p(`- **Parlare, una volta sola: ${conf.parlare.testo}**${conf.parlare.requisito ? ` *(solo se ${frase(conf.parlare.requisito)})*` : ""}. ${partenze({ capacita: conf.parlare.capacita }, s)}. Soglia ${soglia(conf.parlare.soglia)}. Se riesci, vai al ${n(conf.parlare.riesci.vai)}.${segna(conf.parlare.riesci.effetti)} Se non riesci, reagisce.`);
      p(`- *Via povera, non si tira:* ${conf.andarsene.testo}.${segna(conf.andarsene.effetti)} Vai al ${n(conf.andarsene.vai)}.`);
      p(`- **Finestra** (quando è allo scoperto, senza tirare): ${conf.fini.map((f) => `${f.testo}${segna(f.effetti)} → ${n(f.vai)}`).join(" · ")}.`);
    }
    p();
  }
  return out.join("\n");
}
