import type { Story, StoryNode, Condition, ComparisonOp, Literal } from "../../../core/src/index.ts";
import { summarizeCondition, summarizeEffects } from "../lib/summarize.ts";
import { effectsToAuthor, checkToAuthor, friendlyRef, sceneTitle, conditionToAuthor } from "../lib/authorLang.ts";
import { useView, type View } from "../view.ts";

interface Props {
  story: Story;
  nodeId: string;
  update: (fn: (s: Story) => void) => void;
  onRenameSelect: (newId: string) => void;
}

const OPS: ComparisonOp[] = ["==", "!=", ">", "<", ">=", "<="];
const NUM_OPS_AUTHOR: { v: ComparisonOp; l: string }[] = [
  { v: ">=", l: "è almeno" }, { v: ">", l: "è più di" },
  { v: "<=", l: "è al massimo" }, { v: "<", l: "è meno di" },
  { v: "==", l: "è esattamente" }, { v: "!=", l: "è diverso da" },
];
const ENUM_OPS_AUTHOR: { v: ComparisonOp; l: string }[] = [{ v: "==", l: "è" }, { v: "!=", l: "non è" }];

export function NodeInspector({ story, nodeId, update }: Props) {
  const view = useView();
  const node = story.nodes[nodeId];
  if (!node) return <div className="empty">Scena non trovata.</div>;
  const nodeIds = Object.keys(story.nodes);
  const mut = (fn: (n: StoryNode) => void) => update((s) => fn(s.nodes[nodeId]));
  const gotoLabel = (id: string) => (view === "autore" ? sceneTitle(story, id) : id);

  return (
    <div>
      <div className="row" style={{ marginBottom: 14 }}>
        {view === "tecnica" && <span className="pill mono">{nodeId}</span>}
        {nodeId === story.entry ? (
          <span className="pill" style={{ color: "var(--warn)" }}>★ {view === "autore" ? "scena d'inizio" : "iniziale"}</span>
        ) : (
          <button className="small ghost" onClick={() => update((s) => { s.entry = nodeId; })}>
            {view === "autore" ? "Fai partire da qui" : "Imposta come iniziale"}
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button
          className="small danger ghost"
          onClick={() => {
            if (!confirm(`Eliminare ${view === "autore" ? `la scena «${sceneTitle(story, nodeId)}»` : `il nodo "${nodeId}"`}?`)) return;
            update((s) => { delete s.nodes[nodeId]; });
          }}
        >{view === "autore" ? "Elimina scena" : "Elimina nodo"}</button>
      </div>

      <div className="field">
        <label>{view === "autore" ? "Titolo della scena" : "Titolo (etichetta editor)"}</label>
        <input defaultValue={node.title ?? ""} onBlur={(e) => mut((n) => { n.title = e.target.value || undefined; })} />
      </div>
      <div className="field">
        <label>{view === "autore" ? "Etichette (facoltative, separate da virgola)" : "Tag (separati da virgola)"}</label>
        <input
          defaultValue={(node.tags ?? []).join(", ")}
          onBlur={(e) => mut((n) => { const t = e.target.value.split(",").map((x) => x.trim()).filter(Boolean); n.tags = t.length ? t : undefined; })}
        />
      </div>

      {(node.onFirstEnter?.length || node.onEnter?.length) && (
        <div className="summary" style={{ marginBottom: 12 }}>
          {node.onFirstEnter?.length ? (
            <div>{view === "autore" ? "Solo la prima volta: " : "onFirstEnter: "}
              <code>{view === "autore" ? effectsToAuthor(node.onFirstEnter, story) : summarizeEffects(node.onFirstEnter)}</code></div>
          ) : null}
          {node.onEnter?.length ? (
            <div>{view === "autore" ? "Ogni volta che entri: " : "onEnter: "}
              <code>{view === "autore" ? effectsToAuthor(node.onEnter, story) : summarizeEffects(node.onEnter)}</code></div>
          ) : null}
        </div>
      )}

      {/* RACCONTO */}
      <div className="section">
        <div className="row" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{view === "autore" ? `Racconto — cosa vede il lettore (${node.content.length})` : `Contenuto (${node.content.length})`}</h3>
          <div style={{ flex: 1 }} />
          <button className="small primary" onClick={() => mut((n) => { n.content.push({ speaker: "Narratore", text: "" }); })}>{view === "autore" ? "+ Testo" : "+ Blocco"}</button>
        </div>
        {node.content.map((b, i) => (
          <div className="card" key={i}>
            <div className="card-head">
              <input className="mono" style={{ flex: "0 0 180px" }} defaultValue={b.speaker} onBlur={(e) => mut((n) => { n.content[i].speaker = e.target.value; })} />
              {b.requires && (
                <span className="summary" style={{ marginLeft: 6 }}>
                  {view === "autore" ? "appare se " : "if "}
                  <code>{view === "autore" ? conditionToAuthor(b.requires, story) : summarizeCondition(b.requires)}</code>
                </span>
              )}
              <div style={{ flex: 1 }} />
              <button className="small danger ghost" onClick={() => mut((n) => { n.content.splice(i, 1); })}>×</button>
            </div>
            <textarea defaultValue={b.text} onBlur={(e) => mut((n) => { n.content[i].text = e.target.value; })} />
          </div>
        ))}
      </div>

      {/* SCELTE */}
      <div className="section">
        <div className="row" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Scelte ({node.choices?.length ?? 0})</h3>
          <div style={{ flex: 1 }} />
          <button
            className="small primary"
            onClick={() => mut((n) => {
              n.choices = n.choices ?? [];
              let id = "scelta";
              let k = 1;
              while (n.choices.some((c) => c.id === id)) id = `scelta_${k++}`;
              n.choices.push({ id, text: "", goto: nodeIds[0] });
            })}
          >+ Scelta</button>
        </div>
        {(node.choices ?? []).length === 0 && (
          <div className="empty">{view === "autore" ? "Nessuna scelta: qui la storia si ferma (un finale)." : "Nessuna scelta (nodo terminale)."}</div>
        )}
        {(node.choices ?? []).map((c, i) => {
          const check = c.check ? checkToAuthor(story, c.check) : null;
          return (
            <div className="card" key={i}>
              <div className="card-head">
                {view === "tecnica" && <span className="pill mono">{c.id}</span>}
                {c.tags?.length ? c.tags.map((t) => <span className="pill" key={t}>{t}</span>) : null}
                <div style={{ flex: 1 }} />
                <button className="small danger ghost" onClick={() => mut((n) => { n.choices!.splice(i, 1); })}>×</button>
              </div>
              <div className="field">
                <label>{view === "autore" ? "Cosa può fare il lettore" : "Testo"}</label>
                <textarea defaultValue={c.text} onBlur={(e) => mut((n) => { n.choices![i].text = e.target.value; })} />
              </div>

              {c.check ? (
                <div className="summary">
                  {check!.line}
                  {check!.pct != null && (
                    <span className="pill" style={{ marginLeft: 8, color: "var(--accent)" }}>≈ {check!.pct}% riuscita</span>
                  )}
                  <div style={{ marginTop: 4 }} className="muted">
                    {view === "autore" ? "Se riesce → " : "onSuccess → "}<code>{gotoLabel(c.check.outcomes?.success?.goto ?? c.check.onSuccess ?? "?")}</code>
                    {" · "}
                    {view === "autore" ? "se fallisce → " : "onFailure → "}<code>{gotoLabel(c.check.outcomes?.failure?.goto ?? c.check.onFailure ?? "?")}</code>
                  </div>
                </div>
              ) : (
                <div className="field">
                  <label>{view === "autore" ? "Porta a…" : "Vai a (goto)"}</label>
                  <select value={c.goto ?? ""} onChange={(e) => mut((n) => { n.choices![i].goto = e.target.value; })}>
                    {nodeIds.map((id) => <option key={id} value={id}>{gotoLabel(id)}</option>)}
                  </select>
                </div>
              )}

              <div className="field" style={{ marginBottom: c.effects?.length ? 8 : 0 }}>
                <label>{view === "autore" ? "Appare solo se…" : "Condizione (requires)"}</label>
                <LeafRequires
                  story={story}
                  view={view}
                  requires={c.requires}
                  onChange={(cond) => mut((n) => { if (cond) n.choices![i].requires = cond; else delete n.choices![i].requires; })}
                />
              </div>

              {c.effects?.length ? (
                <div className="summary">{view === "autore" ? "Cosa cambia: " : "effetti: "}
                  <code>{view === "autore" ? effectsToAuthor(c.effects, story) : summarizeEffects(c.effects)}</code></div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor di condizione a foglia — "Appare solo se…" a frase
// ---------------------------------------------------------------------------

function refOptions(story: Story): string[] {
  const opts = [...Object.keys(story.stateSchema)];
  for (const r of story.ruleset.resources ?? []) opts.push(`@resource:${r.id}`);
  for (const s of story.ruleset.skills ?? []) opts.push(`@skill:${s.id}`);
  for (const a of story.ruleset.attributes ?? []) opts.push(`@attr:${a.id}`);
  return opts;
}

function LeafRequires({ story, view, requires, onChange }: {
  story: Story;
  view: View;
  requires: Condition | undefined;
  onChange: (c: Condition | undefined) => void;
}) {
  const isLeaf = requires && "lhs" in requires;
  const complex = requires && !isLeaf;

  if (complex) {
    return (
      <div className="summary">
        <code>{view === "autore" ? conditionToAuthor(requires, story) : summarizeCondition(requires)}</code>{" "}
        <span className="muted">({view === "autore" ? "condizione articolata — la modifica a frase arriva presto" : "editor strutturale nella prossima versione"})</span>{" "}
        <button className="small ghost danger" onClick={() => onChange(undefined)}>rimuovi</button>
      </div>
    );
  }

  const opts = refOptions(story);
  if (!isLeaf) {
    return (
      <button className="small ghost" onClick={() => onChange({ lhs: opts[0] ?? "", op: "==", rhs: true })}>
        {view === "autore" ? "+ aggiungi una condizione" : "+ aggiungi condizione"}
      </button>
    );
  }

  const leaf = requires as { lhs: string; op: ComparisonOp; rhs: Literal | { var: string } };
  const decl = story.stateSchema[leaf.lhs];
  const isBool = decl?.type === "boolean";

  return (
    <div className="row">
      <select value={leaf.lhs} onChange={(e) => onChange({ ...leaf, lhs: e.target.value })} style={{ flex: "0 0 200px" }}>
        {opts.map((o) => <option key={o} value={o}>{view === "autore" ? friendlyRef(o, story) : o}</option>)}
      </select>

      {isBool && view === "autore" ? (
        <select
          value={(leaf.op === "==" && leaf.rhs === true) || (leaf.op === "!=" && leaf.rhs === false) ? "vero" : "falso"}
          onChange={(e) => onChange({ ...leaf, op: "==", rhs: e.target.value === "vero" })}
          style={{ flex: 1 }}
        >
          <option value="vero">è vero</option>
          <option value="falso">è falso</option>
        </select>
      ) : (
        <>
          <select value={leaf.op} onChange={(e) => onChange({ ...leaf, op: e.target.value as ComparisonOp })} style={{ flex: "0 0 130px" }}>
            {(view === "autore" ? (decl?.type === "enum" ? ENUM_OPS_AUTHOR : NUM_OPS_AUTHOR) : OPS.map((o) => ({ v: o, l: o }))).map((o) => (
              <option key={o.v} value={o.v}>{o.l}</option>
            ))}
          </select>
          <RhsInput decl={decl} value={leaf.rhs} onChange={(rhs) => onChange({ ...leaf, rhs })} />
        </>
      )}
      <button className="small ghost danger" onClick={() => onChange(undefined)}>×</button>
    </div>
  );
}

function RhsInput({ decl, value, onChange }: {
  decl: Story["stateSchema"][string] | undefined;
  value: Literal | { var: string };
  onChange: (v: Literal) => void;
}) {
  const v = typeof value === "object" ? "" : value;
  if (decl?.type === "boolean")
    return (
      <select value={String(v)} onChange={(e) => onChange(e.target.value === "true")} style={{ flex: 1 }}>
        <option value="true">vero</option>
        <option value="false">falso</option>
      </select>
    );
  if (decl?.type === "enum")
    return (
      <select value={String(v)} onChange={(e) => onChange(e.target.value)} style={{ flex: 1 }}>
        {decl.values.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
    );
  if (decl?.type === "number" || decl === undefined)
    return <input type="number" defaultValue={typeof v === "number" ? v : 0} onBlur={(e) => onChange(Number(e.target.value))} style={{ flex: 1 }} />;
  return <input defaultValue={String(v)} onBlur={(e) => onChange(e.target.value)} style={{ flex: 1 }} />;
}
