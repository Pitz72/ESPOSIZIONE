import { useState } from "react";
import type { Story, Effect } from "../../../core/src/index.ts";
import { effectToAuthor, FACT_KIND_LABEL } from "../lib/authorLang.ts";
import { summarizeEffects } from "../lib/summarize.ts";
import { parseConsequence, CONSEQUENCE_EXAMPLES } from "../lib/factLang.ts";
import { useView } from "../view.ts";

/**
 * "Cosa cambia" — l'editor delle conseguenze (docs/author-experience.md §5.5)
 * con FATTI CREATI SCRIVENDO (§5.1): l'autore scrive la frase, l'editor propone
 * il fatto mancante e lo aggiunge allo stateSchema insieme all'effetto.
 *
 * Legge e scrive tramite due funzioni, così la stessa lista serve per le
 * conseguenze di una scelta, per quelle d'ingresso di una scena e (in futuro)
 * per gli esiti di una prova — sempre con un solo aggiornamento della storia.
 */
interface Props {
  story: Story;
  update: (fn: (s: Story) => void) => void;
  read: (s: Story) => Effect[] | undefined;
  write: (s: Story, effects: Effect[] | undefined) => void;
  title?: string;
  placeholder?: string;
}

export function EffectsEditor({ story, update, read, write, title, placeholder }: Props) {
  const view = useView();
  const [draft, setDraft] = useState("");
  const effects = read(story) ?? [];
  const parsed = parseConsequence(draft, story);

  // Per l'anteprima in lingua d'autore il fatto proposto deve già "esistere".
  const previewStory: Story = parsed?.newFact
    ? { ...story, stateSchema: { ...story.stateSchema, [parsed.newFact.key]: parsed.newFact.decl } }
    : story;

  const add = () => {
    if (!parsed) return;
    update((s) => {
      if (parsed.newFact) s.stateSchema[parsed.newFact.key] = parsed.newFact.decl;
      const list = read(s) ?? [];
      list.push(parsed.effect);
      write(s, list);
    });
    setDraft("");
  };

  const remove = (i: number) => update((s) => {
    const list = (read(s) ?? []).slice();
    list.splice(i, 1);
    write(s, list.length ? list : undefined);
  });

  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label>{title ?? (view === "autore" ? "Cosa cambia" : "Effetti")}</label>

      {effects.length === 0 && (
        <div className="summary" style={{ marginBottom: 6 }}>
          {view === "autore" ? "Nulla cambia: è solo un passaggio." : "Nessun effetto."}
        </div>
      )}

      {effects.map((e, i) => (
        <div className="row" key={i} style={{ marginBottom: 4 }}>
          <span className="summary" style={{ flex: 1 }}>
            {view === "autore" ? effectToAuthor(e, story) : <code>{summarizeEffects([e])}</code>}
          </span>
          <button className="small danger ghost" onClick={() => remove(i)} title="Togli questa conseguenza">×</button>
        </div>
      ))}

      <div className="row" style={{ marginTop: 6 }}>
        <input
          value={draft}
          placeholder={placeholder ?? (view === "autore" ? "Scrivi cosa cambia, es. «ora ha la chiave»" : "frase → effetto")}
          onChange={(ev) => setDraft(ev.target.value)}
          onKeyDown={(ev) => { if (ev.key === "Enter") { ev.preventDefault(); add(); } }}
          style={{ flex: 1 }}
        />
        <button className="small primary" disabled={!parsed} onClick={add}>Aggiungi</button>
      </div>

      {draft.trim() !== "" && (
        parsed ? (
          <div className="summary" style={{ marginTop: 6 }}>
            <span>→ {effectToAuthor(parsed.effect, previewStory)}</span>
            {parsed.newFact && (
              <div style={{ marginTop: 4, color: "var(--accent)" }}>
                Creo anche <strong>«{parsed.newFact.label}»</strong> — {FACT_KIND_LABEL[parsed.newFact.decl.type]}.
                <span className="muted"> Da qui in poi lo trovi negli elenchi.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="summary muted" style={{ marginTop: 6 }}>
            Non ho capito la frase. Prova così: {CONSEQUENCE_EXAMPLES.map((x) => `«${x}»`).join(" · ")}
          </div>
        )
      )}
    </div>
  );
}
