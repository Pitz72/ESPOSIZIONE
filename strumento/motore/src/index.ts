/** ESPOSIZIONE Studio, il motore 3.0: l'interfaccia pubblica. */

export type * from "./tipi.ts";
export { prepara, nuovaPartita, type Partita, type Gioco, type Evento, type DatiTiro, type DatiEsito } from "./stato.ts";
export { vista, agisci, quadroProva, parolePersona, type Vista, type VistaScelta, type Quadro } from "./motore.ts";
export { componi, riuscita, tieni, type Composizione, type Riga, type Riuscita, type RigaRiuscita } from "./quadro.ts";
export { almeno, fasce, fascePercento, fasciaDi, probabilita, tiraDueDadi } from "./dadi.ts";
export { controlla, type Rilievo } from "./controlli.ts";
export { libro } from "./libro.ts";
export { simula, POLITICHE, type Politica, type Resoconto } from "./simulazione.ts";
