import type { Story, VarDecl } from "../../../core/src/index.ts";
import { useView } from "../view.ts";
import { FACT_KIND_LABEL } from "../lib/authorLang.ts";
import { renameVarEverywhere } from "../lib/renameVar.ts";

interface Props {
  story: Story;
  update: (fn: (s: Story) => void) => void;
}

const TYPES: VarDecl["type"][] = ["boolean", "number", "string", "enum"];

function freshDecl(type: VarDecl["type"]): VarDecl {
  switch (type) {
    case "boolean": return { type: "boolean", default: false };
    case "number": return { type: "number", default: 0 };
    case "string": return { type: "string", default: "" };
    case "enum": return { type: "enum", values: ["a", "b"], default: "a" };
  }
}

export function StateSchemaEditor({ story, update }: Props) {
  const view = useView();
  const entries = Object.entries(story.stateSchema);

  const addVar = () => update((s) => {
    let name = "nuova_var";
    let i = 1;
    while (s.stateSchema[name]) name = `nuova_var_${i++}`;
    s.stateSchema[name] = { type: "boolean", default: false };
  });

  const rename = (oldKey: string, newKey: string) => update((s) => {
    if (!newKey || newKey === oldKey || s.stateSchema[newKey]) return;
    const rebuilt: Record<string, VarDecl> = {};
    for (const [k, v] of Object.entries(s.stateSchema)) rebuilt[k === oldKey ? newKey : k] = v;
    s.stateSchema = rebuilt;
    // La rinomina segue la variabile ovunque sia citata: niente riferimenti rotti.
    renameVarEverywhere(s, oldKey, newKey);
  });

  return (
    <div className="section">
      <div className="row" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>{view === "autore" ? `Cose che la storia ricorda (${entries.length})` : `Variabili di stato (${entries.length})`}</h3>
        <div style={{ flex: 1 }} />
        <button className="small primary" onClick={addVar}>{view === "autore" ? "+ Aggiungi" : "+ Variabile"}</button>
      </div>
      <p className="summary" style={{ marginTop: -4 }}>
        {view === "autore"
          ? "Fatti e valori che la storia si ricorda mentre il lettore gioca. Di solito nascono da soli mentre scrivi le conseguenze delle scelte."
          : "Le variabili di stato. Sostituiscono i flag scritti a mano; da qui l'editor genera i menù di condizioni ed effetti."}
      </p>

      {entries.length === 0 && <div className="empty">Nessuna variabile.</div>}

      {entries.map(([key, decl]) => (
        <div className="card" key={key}>
          <div className="row">
            {/* In vista Autore si modifica il NOME (etichetta); la chiave tecnica resta sotto. */}
            {view === "autore" ? (
              <input
                defaultValue={decl.label || key.replace(/_/g, " ")}
                onBlur={(e) => update((s) => {
                  const name = e.target.value.trim();
                  s.stateSchema[key] = { ...s.stateSchema[key], label: name || undefined };
                })}
                style={{ flex: "0 0 240px" }}
              />
            ) : (
              <input
                className="mono"
                defaultValue={key}
                onBlur={(e) => rename(key, e.target.value.trim())}
                style={{ flex: "0 0 200px" }}
              />
            )}
            <select
              value={decl.type}
              onChange={(e) => update((s) => {
                const label = s.stateSchema[key].label;
                s.stateSchema[key] = { ...freshDecl(e.target.value as VarDecl["type"]), label };
              })}
              style={{ flex: view === "autore" ? "0 0 180px" : "0 0 120px" }}
            >
              {TYPES.map((t) => <option key={t} value={t}>{view === "autore" ? FACT_KIND_LABEL[t] : t}</option>)}
            </select>
            <div style={{ flex: 1 }} />
            <button className="small danger ghost" onClick={() => update((s) => { delete s.stateSchema[key]; })}>Elimina</button>
          </div>

          <div className="row" style={{ marginTop: 8 }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>{view === "autore" ? "All'inizio" : "Default"}</label>
              <DefaultEditor decl={decl} onChange={(d) => update((s) => { s.stateSchema[key] = d; })} />
            </div>
            {decl.type === "number" && (
              <>
                <div className="field" style={{ flex: "0 0 90px", marginBottom: 0 }}>
                  <label>min</label>
                  <input type="number" defaultValue={decl.min ?? ""} onBlur={(e) => update((s) => {
                    const d = s.stateSchema[key]; if (d.type === "number") d.min = e.target.value === "" ? undefined : Number(e.target.value);
                  })} />
                </div>
                <div className="field" style={{ flex: "0 0 90px", marginBottom: 0 }}>
                  <label>max</label>
                  <input type="number" defaultValue={decl.max ?? ""} onBlur={(e) => update((s) => {
                    const d = s.stateSchema[key]; if (d.type === "number") d.max = e.target.value === "" ? undefined : Number(e.target.value);
                  })} />
                </div>
              </>
            )}
          </div>

          {decl.type === "enum" && (
            <div className="field" style={{ marginTop: 8, marginBottom: 0 }}>
              <label>{view === "autore" ? "Stati possibili (separati da virgola)" : "Valori (separati da virgola)"}</label>
              <input
                defaultValue={decl.values.join(", ")}
                onBlur={(e) => update((s) => {
                  const d = s.stateSchema[key];
                  if (d.type === "enum") {
                    d.values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean);
                    if (!d.values.includes(d.default ?? "")) d.default = d.values[0];
                  }
                })}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DefaultEditor({ decl, onChange }: { decl: VarDecl; onChange: (d: VarDecl) => void }) {
  if (decl.type === "boolean")
    return (
      <select value={String(decl.default ?? false)} onChange={(e) => onChange({ ...decl, default: e.target.value === "true" })}>
        <option value="false">false</option>
        <option value="true">true</option>
      </select>
    );
  if (decl.type === "number")
    return <input type="number" defaultValue={decl.default ?? 0} onBlur={(e) => onChange({ ...decl, default: Number(e.target.value) })} />;
  if (decl.type === "enum")
    return (
      <select value={decl.default ?? decl.values[0]} onChange={(e) => onChange({ ...decl, default: e.target.value })}>
        {decl.values.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
    );
  return <input defaultValue={decl.default ?? ""} onBlur={(e) => onChange({ ...decl, default: e.target.value })} />;
}
