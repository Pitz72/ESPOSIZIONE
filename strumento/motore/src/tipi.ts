/**
 * Il formato dei dati di ESPOSIZIONE 3.0: l'ambientazione (la scheda del §43 del
 * documento di design) e la storia (scene, scelte, memoria). Nessuna delle due
 * sa come verrà mostrata: testo, libro o grafica sono affare di chi le presenta.
 */

export type Grado = 0 | 1 | 2;
export type Valore = -1 | 0 | 1;
export type Gravita = "lieve" | "grave" | "mortale" | "morte";
export type Dimensione = "fiducia" | "debito" | "paura" | "affetto" | "rancore";
/** Le quattro fasce del tiro (§18.2): In pieno, Riesci, Quasi, Non riesci. */
export type Fascia = "pieno" | "riesci" | "quasi" | "non";

// ---------------------------------------------------------------------------
// Condizioni ed effetti: il linguaggio della memoria della storia (§14)
// ---------------------------------------------------------------------------

export type Condizione =
  | { fatto: string }
  | { nonFatto: string }
  | { misura: string; almeno?: number; alPiu?: number }
  | { cosa: string; almeno?: number }
  /** Porti una cosa con questa proprietà: «luce», «compromettente»… */
  | { cosaProprieta: string }
  | { notizia: string }
  | { nonNotizia: string }
  | { tratto: string }
  | { convinzione: string }
  | { statoAnimo: string }
  | { persona: string; dimensione: Dimensione; almeno?: number; alPiu?: number }
  /** Conosci la persona almeno a questo livello: 1 ci hai parlato, 2 la conosci bene. */
  | { conosci: string; almeno?: number }
  /** La persona tradirebbe, se ne avesse l'occasione (§30.4). */
  | { tradisce: string }
  /** La persona viaggia con te come compagno (§33). */
  | { compagno: string }
  /** Uno dei compagni che viaggiano con te ha questo tratto. */
  | { trattoCompagno: string }
  | { traccia: string; almeno: number }
  | { momento: string | string[] }
  | { luogo: string | string[] }
  | { logorio: string; almeno: number }
  | { ferita: Gravita }
  | { filo: string; almeno: number }
  | { scadenza: string; almeno: number }
  | { tutte: Condizione[] }
  | { una: Condizione[] }
  | { non: Condizione }
  // Solo per le aggravanti: si valutano nel contesto di una prova.
  | { tracciaQui: number }
  | { logorioSuAmbito: number }
  | { tagScena: string };

export type Effetto =
  | { fatto: string }
  | { togliFatto: string }
  | { misura: string; piu: number }
  | { cosa: string; piu: number }
  /** Una cosa scende di uno stato: intatta, rovinata, rotta (§7.1). */
  | { rompi: string }
  | { notizia: string }
  | { verifica: string }
  | { convinzione: string }
  | { togliConvinzione: string }
  | { tratto: string; origine?: string }
  | { togliTratto: string }
  | { persona: string; cambia: Partial<Record<Dimensione, number>> }
  | { conosci: string; livello: 1 | 2 }
  /** La persona si unisce al personaggio come compagno (§33). */
  | { compagno: string }
  /** Il compagno se ne va. */
  | { congeda: string }
  | { statoAnimo: string }
  | { passaStatoAnimo: string }
  | { traccia: string; piu: number } // "qui" = la zona del luogo attuale
  | { logorio: string; piu: number }
  | { rimedio: string }
  | { ferita: { nome: string; gravita: Gravita; ambito: string; tipo?: string; segno?: string } }
  | { cura: true }
  | { tempo: number }
  | { filo: string; piu: number }
  | { preparazione: string }
  | { tacca: string };

/**
 * Uno spostamento della soglia di un gradino (§18.1). Vale per le prove di uno dei
 * generi indicati, o di una delle capacità indicate, e se la condizione è vera.
 */
export interface Spostamento {
  generi?: string[];
  capacita?: string[];
  se?: Condizione;
  gradini: -1 | 1;
  testo: string;
}

// ---------------------------------------------------------------------------
// L'ambientazione (§43)
// ---------------------------------------------------------------------------

export interface Capacita {
  id: string;
  nome: string;
  ambito: string;
  partenza: Grado;
  fondo: Grado;
  /** La frase della partenza: la prima riga del costo nel quadro. */
  causa: string;
}

export interface Tratto {
  id: string;
  nome: string;
  /** Gli effetti detti a parole, per la scheda e per il libro. */
  effetti: string;
  sposta?: Spostamento[];
  /** Il tratto del corpo che manca apre una via con un'alternativa (§6.1). */
  delCorpo?: boolean;
  /** Si ottiene solo con la storia, non si sceglie all'inizio. */
  siGuadagna?: boolean;
}

export interface Proprieta {
  id: string;
  nome: string;
  /** Quanto costa, per ambito (−1, 0, +1). */
  valori: Partial<Record<string, Valore>>;
  /** La frase del quadro per ogni ambito con valore diverso da zero. */
  cause: Partial<Record<string, string>>;
  sposta?: Spostamento[];
  /** Ciò che in questo luogo non si può fare senza una condizione: leggere al buio, nuotare. */
  serve?: Array<{ generi: string[]; se: Condizione; testo: string }>;
  /** Una condizione che annulla la proprietà: una luce accesa annulla il buio. */
  annullataDa?: { se: Condizione; testo: string };
}

export interface RigaPropria {
  ambito: string;
  valore: Valore;
  testo: string;
}

export interface Luogo {
  id: string;
  nome: string;
  zona: string;
  proprieta: string[];
  righe?: RigaPropria[];
  /** Proprietà dei momenti che qui non valgono: «all'alba i magazzini restano vuoti». */
  sospende?: Array<{ proprieta: string; momento?: string; testo: string }>;
  /** Gli stati del luogo (§11.3): se la condizione vale, aggiunge o toglie proprietà. */
  stati?: Array<{ se: Condizione; aggiungi?: string[]; togli?: string[] }>;
  /** Un posto tranquillo: qui si ripensa e si mettono insieme le notizie (§8.3–8.5). */
  tranquillo?: boolean;
}

export interface Momento {
  id: string;
  nome: string;
  ore: number;
  proprieta: string[];
  righe?: RigaPropria[];
}

export interface Aggravante {
  id: string;
  testo: string;
  quando: Condizione;
}

export interface Preparazione {
  id: string;
  testo: string;
  costo: string;
  /** "luogo": vale finché resti nel luogo; "prova": si consuma alla prossima prova; "cosa": vale finché hai la cosa. */
  durata: "luogo" | "prova" | "cosa";
  cosa?: string;
}

/** Una voce del catalogo delle difficoltà (§44). */
export interface VoceCatalogo {
  id: string;
  cosa: string;
  soglia: 6 | 8 | 10 | 12;
  /** I generi della prova: li leggono tratti, proprietà, stati d'animo e attrezzi. */
  generi?: string[];
  sposta?: Array<{ se: Condizione; gradini: -1 | 1; testo: string }>;
  /** Ciò che serve per tentare: una delle condizioni (per esempio la forza). */
  serve?: { testo: string; una: Condizione[] };
}

export interface StatoAnimo {
  id: string;
  nome: string;
  effetti: string;
  sposta?: Spostamento[];
  penalita?: { capacita?: string[]; ambiti?: string[]; testo: string };
  passa: { testo: string; ore?: number; inLuogoTranquillo?: boolean; alPrimoNonRiesci?: boolean };
}

export interface Logorio {
  id: string;
  nome: string;
  stadi: [string, string, string];
  /** Sale di uno stadio ogni tante ore senza rimedio (0 = non sale col tempo). */
  ogniOre: number;
  /** Sale anche con questi eventi. */
  saleCon: Array<"ferita" | "rovescio">;
  ambiti: string[];
  rimedio: string;
  /** Che cosa succede se la prova di resistenza allo stremo va in Non riesci. */
  crollo: { testo: string; effetti: Effetto[] };
}

export interface Arma {
  id: string;
  nome: string;
  tipo: string;
  /** L'ambito che la ferita colpisce, e quindi le capacità che impedisce. */
  colpisce: string;
  daEsposto: Gravita;
  daScoperto: Gravita;
  /** Il tratto che una ferita grave lascia, guarendo (§36). */
  segno?: string;
}

export interface Protezione {
  id: string;
  nome: string;
  contro: string[];
}

export interface PuntoDebole {
  id: string;
  testo: string;
  capacita: string;
  gradi: 1 | 2;
  soglia: string;
  requisito?: Condizione;
  richiede?: string;
}

export interface Avversario {
  id: string;
  nome: string;
  /** La persona che l'avversario è, se ha un legame (§32). */
  persona?: string;
  natura: "si-chiude" | "avanza";
  copertura: Grado;
  puntiDeboli: PuntoDebole[];
  pericolo: { arma?: string; sociale?: string };
  sogliaDifesa?: string;
  movente: { vuole: string; smette: string; mantieneLaParola: boolean };
  /** Che cosa perdi con il Quasi della difesa, se non scegli la ferita (§38). */
  perdi?: { testo: string; effetti: Effetto[] };
}

export interface VoceRepertorio {
  id: string;
  zona: string;
  testo: string;
  /** "prezzo": si usa solo come prezzo di un successo allo scoperto (§28.6). */
  tipo?: "prezzo";
  quando?: Condizione;
  effetti: Effetto[];
  /** Un imprevisto che apre una scena (un agguato, per esempio). */
  vai?: string;
}

export interface Ambientazione {
  id: string;
  titolo: string;
  frase: string;
  criterioFondo: string;
  ambiti: Array<{ id: string; nome: string }>;
  capacita: Capacita[];
  tratti: Tratto[];
  proprieta: Proprieta[];
  luoghi: Luogo[];
  momenti: Momento[];
  aggravanti: Aggravante[];
  preparazioni: Preparazione[];
  catalogo: VoceCatalogo[];
  tempo: { unita: string; plurale: string; conCalma: number };
  logorii: Logorio[];
  statiAnimo: StatoAnimo[];
  armi: Arma[];
  ferite: { lieveGuarisceIn: number; graveDiventaMortaleIn: number; mortaleUccideIn: number; conMortaleSoloAmbiti: string[]; siMuore: boolean };
  traccia: { calaOgniOre: number; imprevistoFinoA: [number, number, number, number] };
  avversari: Avversario[];
  protezioni: Protezione[];
  repertorio: VoceRepertorio[];
  crescita: { tipo: "arco" | "fissa"; tacche: [number, number, number] };
  /** Le capacità che la fiducia e il rancore rendono più facili o più difficili, e quelle che la paura facilita (§29). */
  sociali: { fiducia: string[]; paura: string[] };
  difesa: string[];
  resistenza: string;
}

// ---------------------------------------------------------------------------
// La storia
// ---------------------------------------------------------------------------

export type Testo = string | Array<{ se?: Condizione; testo: string }>;

export interface Esito {
  vai: string;
  effetti?: Effetto[];
}

export interface Prova {
  capacita: string;
  /** La voce del catalogo delle difficoltà. */
  soglia: string;
  /** Righe di costo scritte dall'autore (il ritocco del §45.1). */
  righe?: Array<{ testo: string; valore: Valore }>;
  /** Spostamenti di soglia scritti dall'autore: al massimo un gradino per parte. */
  sposta?: Array<{ testo: string; gradini: -1 | 1 }>;
  /** La persona con cui si fa la prova: i suoi legami spostano la soglia (§29). */
  persona?: string;
  /** Una persona che fa la cosa con te: +1 al tiro, e un favore (§30.3). */
  aiuto?: string;
  posta: string;
  unColpoSolo?: boolean;
  /** Che cosa ottieni, detto in breve per il quadro. Se manca, il titolo della scena di arrivo. */
  ottieni?: string;
  riesci: Esito;
  /** La notizia del Non riesci è obbligatoria (§28.4). */
  nonRiesci: Esito & { notizia: string };
  /** Obbligatorio se la prova può essere allo scoperto (controllo 11). */
  rovescio?: Esito;
  dono?: { testo: string; effetti: Effetto[] };
  /** La metà del Quasi: scritta, oppure presa da un ripiego della scena (§28.3). */
  meta?: { testo: string; vai: string; effetti?: Effetto[] } | { ripiego: string };
  prezzo?: { testo: string; effetti: Effetto[] };
}

export interface Scelta {
  id: string;
  /** In prima persona, al presente (§15.3). */
  testo: string;
  requisito?: Condizione;
  /** Il requisito detto a parole, mostrato accanto a una scelta chiusa. */
  richiede?: string;
  nascondiSeChiusa?: boolean;
  unaVolta?: boolean;
  /** Non si esaurisce mai (§15.6). */
  sempre?: boolean;
  /** È il ripiego dell'ostacolo: non si tira e costa (§15.2). */
  ripiego?: boolean;
  effetti?: Effetto[];
  vai?: string;
  prova?: Prova;
}

export interface Confronto {
  avversario: string;
  andarsene: { testo: string; effetti: Effetto[]; vai: string };
  parlare?: { testo: string; capacita: string; soglia: string; requisito?: Condizione; richiede?: string; riesci: Esito };
  /** Le fini che la finestra rende possibili, senza tiro. */
  fini: Array<{ id: string; testo: string; effetti?: Effetto[]; vai: string }>;
  /** Dove si va se il pericolo sociale scatta. */
  seTiPrende?: string;
}

export interface Scena {
  id: string;
  luogo: string;
  titolo: string;
  testo: Testo;
  tag?: string[];
  entrando?: Effetto[];
  scelte?: Scelta[];
  confronto?: Confronto;
  finale?: { tipo: "vittoria" | "sconfitta" | "morte" };
  /** Indicazioni per un'interfaccia grafica; il motore non le legge. */
  presentazione?: Record<string, string>;
}

export interface Notizia {
  id: string;
  testo: string;
  verita: "vera" | "incompleta" | "falsa";
  /** Le notizie che, se le hai, la smentiscono (solo per le false). */
  smentitaDa?: string[];
  /** Le notizie con cui non può essere vera insieme. */
  contrasto?: string[];
}

export interface Convinzione {
  id: string;
  testo: string;
  /** Le notizie che la mettono in dubbio; vuoto se nessuna può farlo. */
  dubbioDa: string[];
  lasciare: { testo: string; effetti?: Effetto[] };
  tenere: { testo: string; effetti?: Effetto[] };
}

export interface Deduzione {
  id: string;
  da: string[];
  notizia: string;
  testo: string;
}

export interface Cosa {
  id: string;
  nome: string;
  /** Le proprietà della cosa: «luce», «compromettente», «ingombrante»… */
  proprieta?: string[];
  fragile?: boolean;
  scorta?: boolean;
  /** +1 al tiro per questi generi o capacità (§7). */
  attrezzo?: { generi?: string[]; capacita?: string[]; testo: string };
}

export interface Combinazione {
  id: string;
  da: string[];
  cosa: string;
  testo: string;
  ore: number;
  /** Le parti che si consumano combinando. */
  consuma?: string[];
}

export interface Persona {
  id: string;
  nome: string;
  dimensioni: Partial<Record<Dimensione, number>>;
  /** Quanto la conosci all'inizio: 1 ci hai già parlato, 2 la conosci bene. */
  conosciuta?: 1 | 2;
  reazioni?: Array<{ id: string; se: Condizione; cambia: Partial<Record<Dimensione, number>>; testo: string }>;
  /** Se il suo movente le permette di tradire (§30.4). */
  puoTradire?: boolean;
  /** Per accordare le parole con cui il gioco la descrive: «affezionata», «terrorizzata». */
  femminile?: boolean;
  /** Se può viaggiare con il personaggio: le sue capacità (da due a quattro) e i suoi tratti (uno o due). */
  compagno?: { capacita: Record<string, 0 | 1 | 2 | 3>; tratti: string[] };
}

export interface Storia {
  id: string;
  titolo: string;
  ambientazione: string;
  inizio: string;
  momentoIniziale: string;
  morte: string;
  personaggio: {
    livelli: Record<string, 0 | 1 | 2 | 3>;
    cose: Record<string, number>;
    protezioni: string[];
    tratti: string[];
    convinzioni: string[];
  };
  fatti: Array<{ id: string; parola: string }>;
  misure: Array<{ id: string; nome: string; max: number }>;
  notizie: Notizia[];
  convinzioni: Convinzione[];
  deduzioni: Deduzione[];
  cose: Cosa[];
  combinazioni: Combinazione[];
  persone: Persona[];
  fili: Array<{ id: string; nome: string; tappe: number }>;
  scadenze: Array<{ id: string; nome: string; caselle: number; ogniOre: number; alScadere: string; salvoSe?: Condizione }>;
  scene: Scena[];
}
