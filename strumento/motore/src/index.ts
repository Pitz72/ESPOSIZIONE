/** ESPOSIZIONE Studio, il motore 2.0: l'interfaccia pubblica. */

export type * from "./tipi.ts";
export { prepara, nuovaPartita, type Partita, type Gioco, type Evento } from "./stato.ts";
export { vista, agisci, ricevutaProva, type Vista, type VistaScelta, type RicevutaPiena } from "./motore.ts";
export { componi, tieni, type Composizione, type Riga } from "./ricevuta.ts";
export { almeno, probabilita, tiraDueDadi } from "./dadi.ts";
export { controlla, type Rilievo } from "./controlli.ts";
export { libro } from "./libro.ts";
export { simula, type Politica, type Resoconto } from "./simulazione.ts";
