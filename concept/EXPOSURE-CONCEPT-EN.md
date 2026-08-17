# EXPOSURE

## A resolution engine for interactive narrative

### Concept presentation

> The die decides whether you succeed. Your state decides what it costs you.

---

## 1. What this is

Exposure is a resolution engine: the set of rules and data structures that decides what happens next, every time the protagonist of an interactive story attempts something. It is not a game and it is not a setting. It contains no proper names, names no places, describes no creatures. Someone who knows nothing about the stories it was built for should be able to implement it by reading the specification, and that is the test the specification was written against.

These pages are not that specification. The specification exists, it is called 1.2, it runs to thirty-nine sections, and it is written for whoever has to build the thing. This document comes first and does a different job: it puts anyone who might work on the engine in a position, within half an hour, to understand what it does differently, what it gave up to do it, and what adopting it costs. References in parentheses point into the specification, for anyone who wants to go down a level.

One note on the name, because it produces the most common misunderstanding. *Exposure* here has nothing to do with hiding. The word was chosen because it is already abstract in ordinary use: debt exposure, exposing yourself by taking a position, selling short. The engine defines it as *how much the situation can make you pay*, and leaves each setting to declare its own reading.

## 2. The problem, and the three usual ways of getting it wrong

A narrative role-playing game has to achieve something that sounds easy: make sure that succeeding and failing are not the only two things that can happen. Put that way, it sounds like a writing problem. It is an architecture problem, and the three customary solutions all give way, each in its own fashion.

**The ladder of degrees.** Hard failure, failure, success with a complication, success, full success. It is an ordered shape by construction, and an ordered shape whispers *better and worse* to whoever is writing. Outcomes turn into brighter and dimmer versions of the same thing, and getting genuine divergence comes down to authorial discipline. On a forty-hour project, discipline gives way, and it gives way first in the nodes nobody will ever reread.

**Damage.** It reduces every obstacle to the same question: how much has it got left. For that question to mean anything, almost everything needs a pool — the enemy, the door, the negotiation, the fever. And a pool is a privileged subsystem: it grows, it specialises, it attracts the best mechanics and ends up eating the others. A game that starts out narrative arrives at being a game of subtraction.

**Difficulty that scales.** It raises the thresholds as the character improves, to hold the risk constant. What it costs is the one experience that growth is actually able to produce: going back to where you failed and getting through. In a world that adjusts to you, forty hours later you are exactly where you started, with grander labels on everything.

Exposure refuses all three, and the pages that follow say what it puts in their place and what it agreed to pay for the privilege.

## 3. Two axes, six cells

An attempt raises two questions, not one.

The first — do you succeed or not — is settled by the die, and it is binary. Nobody rolls the second: it is determined by how you got there, and it measures how much grip the situation has on you. Three levels, stated in words: *Covered*, *Exposed*, *In the Open*.

The two axes never touch. Exposure does not modify the roll, does not move the threshold, and appears in no formula that produces a probability: it changes *what happens*, never *how likely*. That single line holds up everything else, because the moment Exposure touched the percentages the two axes would fold back into one ladder, and the whole apparatus would go back to being difficulty wearing a consequence as a costume.

Their intersection yields six cells that are qualitatively different by construction.

| | You succeed | You fail |
|---|---|---|
| **Covered** | you get it, and you leave nothing behind | you don't get through here, but you learned something: another way opens |
| **Exposed** | you get it, and the world registers that you passed | the scene changes nature underneath you |
| **In the Open** | you get it, and something breaks for good | you are in a different scene, not in the same scene gone wrong |

Three consequences are deliberate.

From *Covered* the die cannot ruin you: the worst that can happen is that you don't succeed. That is a promise, and the engine keeps it everywhere, combat included.

Criticals are not faces of the die. Full success and Reversal are rows of the grid, and their frequency is set by the player through the way they act, not by chance with a 5%.

Failure teaches you about the thing, not about the gesture. You find out how the door is built; you don't get better at forcing it. That is knowledge, and the distinction matters because it stops retrying from turning into practice.

## 4. The real invention: position is derived

This is where the difference lies that justifies building another engine at all.

In the systems that declare a position — and they are the best ones around — somebody writes that position down. An author looks at the scene and rules that you are acting in risky conditions. It works as long as the authors are few and talk to each other; past a certain size it produces thirty thousand micro-judgements that disagree with one another, and nobody notices until the game is already written.

In Exposure, position is not written. It is composed, from three factors that a setting declares once.

```
raw      = base(verb) + Place[stem] + Time[stem] + aggravators − mitigators
Exposure = raw, clamped between the verb's Floor and In the Open
```

The **verb** is the unit of competence, and it declares how much it exposes on its own. A character sheet is a list of verbs and nothing else. **Place** and **Time** declare how much they expose, but not in general: **stem by stem**, where the stems are the categories of action (body, hand, mind, voice, or whichever ones the setting decides to have).

The per-stem signature is where this engine parts company with the others, and it is easier to show than to argue. A crowd hides the hands and exposes the voice. A ruin exposes the body that makes noise and shelters the hands that work. Rain covers the thief and uncovers the walker. With a single value per factor, rain would simply be *worse*, and the choice of when to move would lose its content; and any rule containing two opposite signs at the same moment would become inexpressible. Those are the rules a good setting is made of.

A worked example, from a fiction of court intrigue. To insinuate, in the chapel, at dawn, comes out *Covered*. The same insinuation in the audience hall during a crowded reception comes out *Exposed*. But **stealing** a letter is easier during the reception than at dawn, because the crowd covers the hands and the silence uncovers them. It is rain covering the thief, in a world with no rain and no thieves. And nobody wrote it: it fell out of the intersection of two tables.

The **Floor** is the second half of the idea: the level below which no amount of preparation can bring an action. It is a property of the verb, not of the scene. Its job is to turn a design principle into arithmetic. If a fiction holds that a certain act is always the most expensive one available, you don't put that in the style guide, where it will be ignored through simple inattention — you give the verb a Floor of *In the Open*, and after that nobody can do otherwise. Reading *Floor: In the Open* next to a verb means knowing in advance that no preparation will save you.

The bill for all this is declared, and it is not small. A number of cells equal to `(places + times) × stems`: with forty places, twelve times and four stems, that is two hundred and eight cells instead of fifty-two. It is a cost in **judgement**, not in writing — it does not touch the volume of text, and it is paid once per setting, not once per node. But it is *interdependent* judgement, since every cell has to stay coherent with all the others, and it needs to be watched with a tool: the inversions are the first thing to drift when coherence slackens.

## 5. The receipt

The axis the player governs is shown before acting, with its causes, line by line. Not as a number: as a list of items in plain language.

```
IN THE OPEN
   Exposed      (base: force, by day, in open ground)
   +1           you are badly worn
   +1           this place knows you       — no effect, you are already in the open
   −1           you scouted first
   Floor: Exposed
```

More follows from a surface like that than it first appears. The player never has to guess the mental model of whoever designed the game: they read it, and learn the system by using it. The third line shows an item that does not move the total and says so, because a receipt that hides the ceiling teaches a false rule. And above all the player can see where the lever is: they are not playing against the die, which cannot be governed, they are playing against Exposure, which can be brought down by paying time and preparation.

One constraint follows, and it cuts away half the modifiers anyone would think of: **every item must be sayable in one short sentence, with no abbreviations and no icons.** If it can't be said in words, that modifier must not exist. It is an uncomfortable rule, and it is the reason the aggravators number three to five families rather than a catalogue.

## 6. What the engine does not have, and the bill for each absence

No pools, anywhere. The question is never *how much is left*, it is *how badly is it worn*. What degrades is an entity with a course, and it declares **what it prevents**. “The hands can't hold the line” closes one verb and leaves another untouched. A harm does not make you worse: it takes a way away from you. In exchange there is no privileged subsystem, and consequences get told rather than counted. The price is that the feeling of progress inside a fight has to be produced some other way, and players arriving from other games go looking for it where it isn't.

Difficulty never scales. Progression is felt by returning to where you failed. No other form of growth is proof against faking. The price is that growth is not felt on the single roll, and has to be made perceptible elsewhere: that is a hard requirement, not a suggestion.

No obstacle is a wall. Every obstacle has at least one way with no prerequisites — always available, always costly, never blocked — and that way is not rolled, because a poor way you can fail is a wall with a die in front of it. Difficulty gets expressed as a price instead of a barrier. The price is one more way per obstacle, and it is the entry authors will try to skip first: it has to be refused in validation, not recommended in guidelines.

Then a run of flat absences. Read them through: each one is a decision. The engine never rolls on the player's behalf: there is exactly one roller. It has no initiative and no turn order. It has no clock running while the player thinks. It has no attributes. It has no classes and no advancement tracks. It has no parallel sheet for adversaries. It generates no text at runtime. It has no morality scores, no reputation bars, no alignments.

## 7. Confrontation, which is not a second engine

Where there is opposition capable of reacting, no new system comes on stage: it is the behaviour of the core when the obstacle has a will. The module can even be absent, and the engine still works.

The question *how much has it got left* does not exist. The question is *how covered is it*. Exposure is reciprocal, and the two sides do different jobs: yours decides what it costs you, theirs decides whether the decisive action is worth anything. Every test you pass uncovers them by one step; when they reach the open the window is up, and what you do now spends it.

A confrontation is not about taking something away from somebody. It is about creating the moment when the decisive action is cheap. That is not a poetic restatement but arithmetic of the Floor: if the decisive act of the fiction has a Floor of *In the Open*, repeating it over and over is the worst strategy available — and not because anyone forbade it.

An adversary is described in four entries and no hit points: what covers them, what uncovers them, what it costs to get near them, and what they want and what makes them stop. The last one is never left blank, and has to be filled in even for what doesn't listen. Everything with a will wants something, but not everything that wants something will listen to you. Those who listen are stopped by words; those who don't listen are stopped by cost — fire, noise, easier prey. And what wants nothing does not stop at all. It is avoided. Cold, famine and time are not adversaries: they are the world.

It ends in three ways, and they read identically from both sides: one of you can't any more, one of you won't any more, one of you isn't there any more. The middle column is the widest, and it is a production decision before it is a design one. In life almost no confrontation ends with someone removed: it ends because one of the two stopped wanting it. In a game built this way, most of the text of a confrontation does not describe wounds. It describes people stopping.

Which leaves the question all of this raises. If winning isn't what you grow for, what is? A beginner opens the window on the fourth attempt and gets there carrying three harms; someone good opens it on the first. Same opposition, same threshold, same scene, completely different bill. **You don't grow to win confrontations. You grow to come out of them carrying less.**

## 8. Core and modules: adapting without inventing anything

A universal engine is not an engine that suits everything untouched. It is an engine in which the untouchable part is small and non-negotiable, and everything else is chosen from a closed list.

The **core** is twelve rules. They do not adapt, they do not take profiles, they are not up for negotiation; a project that touches one of them is no longer using this engine, a legitimate thing to do so long as it is said out loud. The **modules** are eight (the randomizer, the competence ladder, the container, the lexicon, growth, wear, confrontation, text, mitigation) and each is chosen from declared profiles, with a default and a reason for it.

One discipline alone keeps this architecture from decaying into a vocabulary: **a new profile is added to the specification, not invented for a project.** If a setting needs something no profile covers, that is a gap in the engine and it goes where the others are, rather than getting solved in-house.

Adapting Exposure to a fiction therefore means two things and not a third: **eight profile choices** and **sixteen entries to fill in**. The entries are listed, they have a declared form, and they stop there. If a fiction demands a seventeenth, one of two things is true: either it is a privileged subsystem and must be refused, or it is something the engine is missing and has to be argued as such.

## 9. Three distant genres, the same signature

Proof that an engine is abstract is not an argument. It is a filled-in form. The signature was completed for three fictions chosen to sit as far apart as possible.

**Court intrigue.** Reading of Exposure: *how far an act can be traced back to you*. Covered means nobody can reach you; in the open means you did it in front of everyone and cannot disown it. Criterion for the Floor: something has a Floor if it needs somebody to know it was you before it can work at all. A favour asked requires someone to know they granted it; an accusation does not exist until it is public. Wear does not live in the body here but in the position: credit, exhaustion, the patience of your patron.

**Fantasy with a discipline.** Reading: *how much of you stays attached to the thing you touched*. The strongest of the three results, because magic enters without a subsystem. Not a verb *cast spell*, which would concentrate in one point what the fiction wants to be pervasive, but three verbs distributed across the stems: trace, read, call — and the body left deliberately uncovered. The cost of the discipline is paid in Exposure and in harms, and there is no reservoir to run down. Everything that usually takes a dozen dedicated rules follows without one. Magic is always available and always the most expensive thing you can do. It does not run out; it gets paid for.

**Contemporary investigation.** Reading: *how much the person you are watching knows they are being watched*. Here wear sits neither in the investigator's body nor in their position but in the object of the work: the case going cold, pressure from above, credibility. It is a profile the engine had not anticipated, and it holds. An interrogation fills in the adversary's four entries without a line of adaptation: their version covers them, a contradiction uncovers them, and if they ask for a lawyer they are gone.

The result that counts for more than the others is that **confrontation transported whole**. The court hearing, the police interrogation and the fight are the same system, with the same three exits and the same window. The trials also corrected the engine in four places. That is why they were run before a line of game was written.

## 10. How we know it works

A criterion declared after seeing the result has validated nothing. The specification requires writing the criterion first, with a fixed seed, and never deleting the failed ones: you add the reformulated criterion beside the old one and explain why. A criterion that failed and got quietly rewritten is what separates a verification from a ceremony.

This is not an aspiration. Version 1.2 exists because two rules from 1.1 were measured against data and came out wrong.

The first was aimed at the wrong property. It constrained a ratio between two lexicon parameters; the measurement says that whether preparation lands depends on the **base** of the verbs and not on that ratio: 76.5% for verbs based at *Covered*, 48.5% at *Exposed*, 26.1% at *In the Open*. The old rule was hitting five verbs that were doing fine and leaving alone the two that were doing worst.

The second was more serious, because it concerned stability. The engine makes the frequency of the unforeseen depend on current Exposure, and that is a positive feedback loop, and it has to be braked. The brake was written as a ceiling on the inflow — and with the outflow at zero, no value of the ceiling stabilises anything. The outflow really was zero: in the engine's first application the accumulator had no decay in any line of ten chapters, and the system came out **bistable**. It held until you had a bad day, and from there it never came back. That is the wall the engine forbids, word for word. And it was not a tuning risk: it was a region of the parameter space you could be sitting in without knowing.

Out of that came the twelfth core rule, **every state that accumulates declares how it drains**, and the brake was rewritten as an inequality between inflow and outflow.

What the measurements did **not** fix belongs here as well, because that is the part that separates a presentation from a sales pitch. The scale saturates, and the saturation does not come down. The raw sum runs across eleven values on a scale that has three, and no local correction moves it by more than four points: that is the expected behaviour of a bounded scale, and it is also the defence that keeps preparation from becoming a spiral. The real defect is smaller and it has a name. It is called the **toll**, and it is the set of situations where the first step you buy doesn't land and the second one does, so that you have to pay for two to get one. It runs to one case in four among those where preparation is worth doing at all, and it is solved by declaring it in the receipt instead of hiding it.

## 11. Where it does not reach

An engine that can't say where it ends is not universal. It is merely vague.

The core assumes four things. That there is a protagonist who acts and can fail. That action is discrete, meaning there are moments where you decide and resolve. That consequences persist. And that it is worth distinguishing *how likely* from *how costly*. That last one is the deepest assumption: in a game where failure has only one possible price, the two axes collapse and what remains is a system more complicated than it needs to be.

Where one of these does not hold, the engine does not adapt: it does not apply, and it is better to know that before trying. Left outside are real-time games, pure resource management with no subject, squad tactics (which would want initiative and positioning, and both are refused here), single-solution puzzles, where there can be no poor way that isn't the solution, and fictions about a system rather than about a person.

Left inside is any narrative role-playing game with a protagonist, action in turns or in scenes, and consequences that stay. Which is, near enough, all the interactive narrative anyone would want to design.

## 12. What adopting it takes

The adaptation work is declared and finite, and whoever does it does not have to invent anything.

You start by choosing the eight profiles, **including where the choice matches the default**, because an implicit choice is a choice nobody will ever be able to reopen. Then you fill in the sixteen entries, and the first one sets the tone for everything after it: the sentence that says what being exposed means *in this fiction*. The two entries that have to be declared together and that everybody forgets are the brake and the decay: they are two numbers, not one, and neither means anything without the other.

The tables get filled in after the lexicon, never before, and they are checked by counting: half the verbs based at *Covered*, no more than two at maximum base, and every place with at least one negative stem. A place that exposes everything and shelters nothing is not a difficult place: it is a place not doing its job. **Every place has to be good for something.**

That leaves thirteen data checks and nine invariants to verify by simulation, and it should be done with several automated players competing: one alone doesn't measure the engine, it measures the player.

The debt to the schools that made all this possible is real, and acknowledging it strengthens the position rather than weakening it: *Powered by the Apocalypse* for failure as an event, *Forged in the Dark* for position as a declared state, *Genesys* for success and complication on independent axes, *Disco Elysium* for the distinction between retryable trials and trials that mark you. The language of the d20 is kept because it explains itself on screen in three seconds, and it brings nothing else with it: no classes, no attributes, no difficulty that scales with level.

What this engine adds to those schools, and what justifies its existence, is one thing.

> Position is not declared: it is derived, from tables with a per-stem signature, at zero writing cost — and the inversions, which are the interesting part of any setting, fall out as a side effect.

Everything else is discipline.

<!--pagebreak-->

## Glossary

The specification is written in Italian. These are the bindings, fixed here and to be used everywhere else.

| Italiano | English |
|---|---|
| Esposizione | Exposure |
| Coperto · Esposto · Allo scoperto | Covered · Exposed · In the Open |
| Fondo | Floor |
| ceppo | stem |
| verbo · base · grezza | verb · base · raw |
| aggravanti · attenuanti | aggravators · mitigators |
| Traccia | Trace |
| ricevuta | receipt |
| pedaggio | toll |
| freno · smaltimento | brake · decay |
| logorio · danni | wear · harms |
| Impedimento | Impairment |
| contenitore · passo · frazione | container · step · fraction |
| prova aperta · prova sigillata | open test · sealed test |
| via povera | the poor way |
| ostacolo a strati | layered obstacle |
| confronto · scambio · finestra | confrontation · exchange · window |
| successo pieno · sporco · a caro prezzo | full · dirty · at a price |
| fallimento pulito · rovescio | clean failure · reversal |
| lessico · crescita · silhouette | lexicon · growth · silhouette |
| banco delle complicazioni | bank of complications |
| mitigazione post-esito | post-outcome mitigation |
