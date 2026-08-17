# Prompt per Claude Code — Riconciliazione del GDD con ESPOSIZIONE 1.1

> ⚠️ **Documento storico, congelato il 17 agosto 2026.** È il mandato della sessione di riconciliazione, e si conserva com'è: non si riscrive un mandato dopo averlo eseguito.
>
> **I riferimenti a `ESPOSIZIONE-1.1.md` sono corretti per la data e non puntano più a niente.** Quel file è stato cancellato la sera stessa, quando le misure prodotte da questa sessione sono tornate alla specifica e ne hanno corretto due regole. **L'unico file valido del motore è [`ESPOSIZIONE-1.2.md`](ESPOSIZIONE-1.2.md)**; la 1.1 è recuperabile da git.
>
> Cosa è cambiato fra le due, e cosa ne discende per il GDD: [`../VERIFICA-MOTORE.md`](../VERIFICA-MOTORE.md), sezione *Coda*.

*Da incollare in una sessione di Claude Code aperta sulla cartella `ProgettoRemake`.*

---

## PRIMA DI COMINCIARE — un solo passaggio manuale

Copia il file **`ESPOSIZIONE-specifica-1.1.md`** dentro la cartella del progetto, in `MOTORE/ESPOSIZIONE-1.1.md`. Da quel momento è il documento di riferimento del motore, e questo prompt vi si appoggia per intero.

---

## MANDATO

Il progetto è nato con un'ambizione che si è persa strada facendo: **un motore di gioco di ruolo narrativo agnostico dall'ambientazione, valido a prescindere dalla narrazione**. La storia è arrivata dopo. Ha reso il motore verificabile — e questo è stato un bene — ma lo ha anche **definito**, e questo non lo era.

Il motore agnostico adesso esiste, è stato scritto fuori dal progetto proprio per non ereditarne le saldature, e sta in `MOTORE/ESPOSIZIONE-1.1.md`. **Non va riscritto e non va discusso in questa sessione.**

Questa sessione fa tre cose, in quest'ordine:

1. **Verifica** nove rilievi, contando invece di rileggere.
2. **Sceglie esplicitamente** i profili degli otto moduli, e riconcilia il GDD contro la specifica.
3. **Estende il banco** ai due sistemi portanti che non sono mai stati provati.

**Non tocca la storia. Non scrive il Cap. 5. Non riapre nessuna decisione narrativa.**

---

## REGOLE DI INGAGGIO — non negoziabili

- **Vale il metodo del progetto.** Ogni capitolo validato che va toccato richiede una **riapertura dichiarata prima**, non scoperta strada facendo, e produce un **addendum datato**, sul modello del Cap. 1 §4.7 bis, del Cap. 2 §12 bis e del Cap. 3 §7.13.
- **Un commit per decisione**, con in messaggio *cosa è stato deciso* e non quali file sono cambiati.
- **Il registro delle consegne dell'INDICE va aggiornato** per ogni voce che si apre o si chiude. Le voci chiuse si barrano con la data, non si cancellano.
- **Non si tocca la finzione.** Bibbia, SCENE, canone visivo, PROMO restano come sono.
- **Non si cancella un criterio fallito.** Se una verifica smentisce un rilievo di questo prompt, si scrive perché, e il rilievo resta a verbale accanto alla smentita.
- **Nessuna difesa d'ufficio.** Il compito non è dimostrare che il GDD aveva ragione. Se un rilievo è sbagliato, dillo con il numero che lo smentisce; se è giusto, correggi senza attenuare.

---

## FASE 0 — VERIFICA, prima di toccare qualunque cosa

**Riverifica ognuno dei nove rilievi contando, non rileggendo.** Dove serve, estendi il banco in `prototipo/` con il seme fisso già in uso.

Produci `VERIFICA-MOTORE.md` con l'esito di ciascuno — **confermato / smentito / parzialmente vero** — con la misura accanto.

| # | Rilievo | Come si verifica | Riferimento nella specifica |
|---|---|---|---|
| **R1** | Nove verbi su dodici hanno `Fondo == base`: Forzare, Resistere, Colpire, Sgattaiolare, Maneggiare, Osservare, Ragionare, Convincere, Ingannare. Su quelli un'attenuante non può mai portare sotto la base — **ricompra la neutralità, non compra un vantaggio** | conta la colonna del Cap. 1 §5.9 | N9.a — il limite è **metà** del lessico |
| **R2** | Con base ∈ {0,1,2}, luogo e momento ∈ {−1,0,+1}, 0–2 aggravanti e 0–2 attenuanti, sulle 243 combinazioni: **58% dentro la scala, 21% oltre il tetto, 21% sotto il pavimento**. In due casi su cinque un modificatore è inerte, e la ricevuta lo mostra lo stesso | enumera le combinazioni | N9.b e N9.c |
| **R3** | **Contraddizione fra Cap. 4 §3.5 e Cap. 4 §8.** §3.5 dice che lo stallo lo rompe «quello che stava già scorrendo»; §8 dice che niente si muove finché il giocatore non decide; Cap. 2 §2.1 non ha unità sotto la tappa. Il banco lo conferma già: **finestra 0,0%, ferite 0,00, mai finito 100%** | rileggi le tre sezioni insieme e verifica che la risoluzione non sia scritta da nessuna parte | §19.3 — la frazione del passo |
| **R4** | **Il tetto dell'Impedimento non esiste nel GDD.** Il Cap. 1 §4.7 dice «−2, pochi e rari» senza massimo; `prototipo/motore.py` usa `-2 × min(n,3)` = **fino a −6**, cioè il 30% su d20 | cerca la regola nel Cap. 1 e confrontala col codice | §22.1 — **−6, e la sua ragione** |
| **R5** | **«Il costo in tentativi resta piatto» non può valere su tutte le difficoltà.** Serve una curva ×1,46 su Facile, ×1,67 su Impegnativa, ×2,20 su Ardua, ×7,00 su Estrema | calcola `p(Esperto)/p(Inesperto)` per ogni CD | §21.3 — vale rispetto a un **mix dichiarato** |
| **R6** | **La regola di divergenza è mitigata, non garantita.** Una distribuzione bilanciata sui tre assi non impedisce a una **coppia specifica** di esiti di cadere entrambe su Costo | ragionamento, e un controesempio costruito | §13 — è un **validatore** |
| **R7** | **Il numero degli avversari non differenzia.** Solitario **0,85** ferite, in quattro **0,88**: +4%, dentro il rumore. La differenziazione vive solo nella mortalità (0,3% con strettoia, 2,3% senza) | rileggi la condizione 8 del banco | §23.2 — nota di taratura onesta |
| **R8** | **Il §2.6 è un'eccezione non dichiarata al principio fondante.** La condizione 13 non è passata (7,7% contro 7,7%) ed è stata riformulata nella 21. Una promessa di design è stata declassata a promemoria per l'autore, in un progetto la cui tesi è *non dipendere dalla disciplina di chi scrive* | rileggi §14 del Cap. 4 | va **registrata come eccezione**, non rovesciata |
| **R9** | **L'Esposizione fa due mestieri**, gravità per tiro e frequenza dei tiri. Il secondo è un anello di retroazione positivo, e il freno del Cap. 2 §6.6 è **dichiarato e mai specificato** | modella il loop e rispondi: converge o diverge? | §27 — **la soglia è un numero obbligatorio** |

---

## FASE 1 — SCEGLIERE I PROFILI, ED È IL BLOCCO PIÙ IMPORTANTE

Il motore ha otto moduli, ciascuno con profili dichiarati. **Il progetto li ha già scelti tutti, ma implicitamente** — e una scelta implicita è una scelta che nessuno potrà rimettere in discussione.

Produci `MOTORE/profili-respiro.md`: per ogni modulo, **il profilo scelto, la ragione in una riga, e i profili scartati.**

| Modulo | Profili disponibili | Cosa dovrebbe risultare |
|---|---|---|
| **A — Randomizzatore** | d20 piatto · d20 con pavimento di competenza · dadi a campana | **A1**, ma la scelta va motivata contro il pilastro del realismo, perché A2 esiste apposta |
| **B — Scala di competenza** | cinque livelli · tre · binaria | B1 |
| **C — Contenitore** | percorso · stagione · caso · incarico | **C1 (il percorso)** — è il Cap. 2, e va riclassificato da capitolo di motore a istanziazione |
| **E — Crescita** | arco lungo · soglie narrative · fissa · per studio | **E1**, e va verificato che il *mix di difficoltà* richiesto da §21.3 sia dichiarato da qualche parte |
| **F — Logorio** | nel corpo · nella posizione · nell'oggetto del gioco | **F1** |
| **G — Confronto** | presente · assente | presente — è il Cap. 4 |
| **H — Testo** | composito · a mano · misto | **H3 (misto)**, quasi certamente: banchi per il ricorrente, mano per le lezioni e i nodi |
| **I — Mitigazione** | presente · assente | **presente** — è l'armatura del Cap. 4 §6.2 bis, e il §25 la promuove a stadio della pipeline |

**Poi riconcilia**, nell'ordine del §38 della specifica:

1. **Verifica D3 e D4 sui dati del progetto** (sono R1 e R2 della Fase 0). Sono i due che possono spegnere l'asse del giocatore.
2. **Adotta D1, D2, D11, D12, D16.** Sono documentali: spostano righe, non cambiano regole. I verbi escono dal motore e diventano il lessico del *Respiro*; i ceppi restano quattro ma dichiarati; l'Esposizione diventa un asse astratto con la lettura dichiarata dalla Bibbia; Capp. 2 e 4 si riclassificano come istanziazioni.
3. **Chiudi D6 e D7.** Sono buchi, non correzioni: il tetto dell'Impedimento nel Cap. 1, la frazione del passo come addendum dichiarato al Cap. 2.
4. **Correggi D8 e D9.** Sono affermazioni da riformulare.
5. **Dichiara D10 e D13.** La mitigazione come quinto stadio; la soglia del freno con un numero.
6. **Misura D5, D14, D15** contro i mockup e i banchi previsti — la ricevuta che dichiara l'inerzia, i tentativi risparmiati resi visibili, i banchi dimensionati per contesto e non per combinatoria.

**Due cose che il progetto deve scrivere e che non ha:**

- **La lettura dell'Esposizione e il criterio del Fondo**, come due frasi, nella Bibbia e non nel GDD. Il criterio attuale — *«ha un Fondo solo ciò che lascia un testimone»* — è **corretto per questa finzione** e va semplicemente spostato dove appartiene.
- **La dichiarazione delle sedici voci** del §26.2, con lo stato di ciascuna: compilata, in corso, non ancora aperta. È la mappa che dice davvero quanto manca al Cap. 5.

---

## FASE 2 — IL BANCO, ESTESO AI DUE SISTEMI MAI PROVATI

Il banco ha provato **solo il Cap. 4**, con dati dichiarati provvisori. I due pezzi che reggono più del combattimento non hanno alcun sostegno empirico, e **si provano senza una riga di ambientazione**.

Stesso metodo delle 21 condizioni: **criterio dichiarato prima**, seme fisso, criteri falliti a verbale, più politiche in concorrenza.

**2.1 — La derivazione dell'Esposizione.** Quante composizioni saturano su tabelle plausibili · quante attenuanti comprate risultano inerti · quanto vale davvero, in gradini medi guadagnati, la preparazione del giocatore · **se il vincolo N9.b riporti la saturazione sotto una soglia dichiarata prima.**

**2.2 — La stabilità del loop.** Modella il ciclo Esposizione → frequenza dell'imprevisto → Traccia e consumo → Esposizione, e rispondi alla domanda binaria: **converge o diverge, e per quali intervalli di parametri.** Poi scrivi la soglia del freno **con un numero**.

**E aggiungi le invarianti I5, I6, I7** del §29 alla batteria esistente.

---

## CONSEGNA

1. `VERIFICA-MOTORE.md` — l'esito di R1–R9 con le misure. **Compresi i rilievi che smentisci, con il numero che li smentisce.**
2. `MOTORE/profili-respiro.md` — gli otto profili scelti, con ragione e scarti.
3. Gli addendum datati ai capitoli validati toccati, e il registro delle consegne aggiornato.
4. La dichiarazione delle sedici voci del §26.2 con lo stato di ciascuna.
5. Il banco esteso, e il verbale dei due nuovi blocchi di condizioni.
6. Un commit per decisione.

## COSA NON FARE

- Non riscrivere né discutere `MOTORE/ESPOSIZIONE-1.1.md`. Se una sua regola risulta sbagliata sui dati del progetto, **scrivilo in `VERIFICA-MOTORE.md`**: la specifica si corregge fuori di qui, non in casa.
- Non toccare Bibbia, SCENE, canone visivo, PROMO.
- Non prendere decisioni narrative.
- Non compilare il Cap. 5: questa sessione lo prepara, non lo scrive.
- Non riscrivere i capitoli validati. Addendum dichiarati e datati, come è già stato fatto tre volte.
- Non cancellare niente che sia già a verbale.
- Non accettare un rilievo senza averlo verificato, e non respingerne uno senza scrivere il numero che lo smentisce.
