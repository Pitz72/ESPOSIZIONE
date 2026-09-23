/**
 * Il formato dei dati di ESPOSIZIONE 2.0: l'ambientazione (la scheda del §19 del
 * documento di design) e la storia (scene, scelte, qualità). Nessuna delle due
 * sa come verrà mostrata: testo, libro o grafica sono affare di chi le presenta.
 */

export type Grado = 0 | 1 | 2;
export type Valore = -1 | 0 | 1;
export type Gravita = "lieve" | "grave" | "mortale" | "morte";

// ---------------------------------------------------------------------------
// Condizioni ed effetti: il linguaggio delle qualità (§4.4)
// ---------------------------------------------------------------------------

export type Condizione =
  | { fatto: string }
  | { nonFatto: string }
  | { misura: string; almeno?: number; alPiu?: number }
  | { oggetto: string; almeno?: number }
  | { conoscenza: string }
  | { nonConoscenza: string }
  | { traccia: string; almeno: number }
  | { momento: string | string[] }
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
  | { tagScena: string }
  | { oggettoTag: string };

export type Effetto =
  | { fatto: string }
  | { togliFatto: string }
  | { misura: string; piu: number }
  | { oggetto: string; piu: number }
  | { conoscenza: string }
  | { traccia: string; piu: number } // "qui" = la zona del luogo attuale
  | { logorio: string; piu: number }
  | { rimedio: string }
  | { ferita: { nome: string; gravita: Gravita; ambito: string; tipo?: string } }
  | { cura: true }
  | { tempo: number }
  | { filo: string; piu: number }
  | { preparazione: string }
  | { tacca: string };

// ---------------------------------------------------------------------------
// L'ambientazione (§19)
// ---------------------------------------------------------------------------

export interface Capacita {
  id: string;
  nome: string;
  ambito: string;
  partenza: Grado;
  fondo: Grado;
  /** La frase che compare come prima riga della ricevuta. */
  causa: string;
}

export interface Luogo {
  id: string;
  nome: string;
  zona: string;
  valori: Record<string, Valore>;
  /** Una frase per ogni ambito con valore diverso da zero. */
  cause: Record<string, string>;
}

export interface Momento {
  id: string;
  nome: string;
  passi: number;
  valori: Record<string, Valore>;
  cause: Record<string, string>;
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
  /** "luogo": vale finché resti nel luogo; "prova": si consuma alla prossima prova; "oggetto": vale finché possiedi l'oggetto. */
  durata: "luogo" | "prova" | "oggetto";
  oggetto?: string;
}

export interface Soglia {
  id: string;
  cosa: string;
  soglia: 6 | 8 | 10 | 12;
}

export interface Logorio {
  id: string;
  nome: string;
  stadi: [string, string, string];
  /** Sale di uno stadio ogni tanti passi senza rimedio (0 = non sale col tempo). */
  ogniPassi: number;
  /** Sale anche con questi eventi: "ferita", "rovescio". */
  saleCon: Array<"ferita" | "rovescio">;
  ambiti: string[];
  rimedio: string;
  /** Che cosa succede se la prova di resistenza allo stremo fallisce. */
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
  natura: "si-chiude" | "avanza";
  copertura: Grado;
  puntiDeboli: PuntoDebole[];
  pericolo: { arma?: string; sociale?: string };
  sogliaDifesa?: string;
  movente: { vuole: string; smette: string; mantieneLaParola: boolean };
}

export interface VoceRepertorio {
  id: string;
  zona: string;
  testo: string;
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
  luoghi: Luogo[];
  momenti: Momento[];
  aggravanti: Aggravante[];
  preparazioni: Preparazione[];
  soglie: Soglia[];
  tempo: { passo: string; conCalma: number };
  logorii: Logorio[];
  armi: Arma[];
  ferite: { lieveGuarisceIn: number; graveDiventaMortaleIn: number; mortaleUccideIn: number; conMortaleSoloAmbiti: string[] };
  traccia: { calaOgniPassi: number; imprevistoFinoA: [number, number, number, number] };
  avversari: Avversario[];
  protezioni: Protezione[];
  repertorio: VoceRepertorio[];
  crescita: { tipo: "arco" | "fissa"; tacche: [number, number, number] };
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
  soglia: string;
  /** Righe di scena scritte dall'autore (il «ritocco» del §21.1). */
  righe?: Array<{ testo: string; valore: Valore }>;
  posta: string;
  ritentabile?: boolean;
  unColpoSolo?: boolean;
  riesci: Esito;
  nonRiesci: Esito;
  rovescio: Esito;
  prezzo?: { testo: string; effetti: Effetto[] };
  conoscenza?: string;
}

export interface Scelta {
  id: string;
  testo: string;
  requisito?: Condizione;
  /** Il requisito detto a parole, mostrato accanto a una scelta chiusa. */
  richiede?: string;
  nascondiSeChiusa?: boolean;
  unaVolta?: boolean;
  /** È la via povera dell'ostacolo: non si tira e costa. */
  povera?: boolean;
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

export interface Storia {
  id: string;
  titolo: string;
  ambientazione: string;
  inizio: string;
  momentoIniziale: string;
  morte: string;
  personaggio: {
    livelli: Record<string, 0 | 1 | 2 | 3>;
    oggetti: Record<string, number>;
    protezioni: string[];
  };
  fatti: Array<{ id: string; parola: string }>;
  misure: Array<{ id: string; nome: string; max: number }>;
  conoscenze: Array<{ id: string; testo: string; verita: "vera" | "incompleta" | "falsa" }>;
  oggetti: Array<{ id: string; nome: string; tag?: string[] }>;
  fili: Array<{ id: string; nome: string; tappe: number }>;
  scadenze: Array<{ id: string; nome: string; caselle: number; ogniPassi: number; alScadere: string; salvoSe?: Condizione }>;
  scene: Scena[];
}
