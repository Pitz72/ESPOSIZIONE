import { useState } from "react";
import type { Story, Attribute, Skill, Resource, CharacterPreset } from "../../../core/src/index.ts";
import { useView } from "../view.ts";
import { slugify } from "../lib/factLang.ts";

/**
 * CONFIGURAZIONE INIZIALE — il lavoro che l'autore fa PRIMA di scrivere le scene
 * (docs/author-experience.md §7, ROADMAP §6.4). Quattro domande in fila:
 *   1. Di che storia si tratta?   → story.setting
 *   2. Chi è il personaggio?      → ruleset.presets (personaggi pronti)
 *   3. Cosa può portare?          → ruleset.inventory
 *   4. Di che cosa è fatto?       → ruleset.attributes/skills/resources/check
 * Prima era tutto invisibile: il formato 0.4 lo prevede, l'interfaccia no.
 */
interface Props {
  story: Story;
  update: (fn: (s: Story) => void) => void;
}

type Sec = "storia" | "chi" | "porta" | "scheda";

export function SetupPanel({ story, update }: Props) {
  const view = useView();
  const [open, setOpen] = useState<Sec>("storia");
  const L = (autore: string, tecnica: string) => (view === "autore" ? autore : tecnica);

  const tab = (id: Sec, label: string) => (
    <button className={open === id ? "active" : ""} onClick={() => setOpen(id)}>{label}</button>
  );

  return (
    <div>
      <div className="tabs" style={{ padding: 0, border: "none", marginBottom: 16 }}>
        {tab("storia", L("La storia", "Meta"))}
        {tab("chi", L("Chi sei", "Presets"))}
        {tab("porta", L("Cosa puoi portare", "Inventory"))}
        {tab("scheda", L("Di che cosa sei fatto", "Ruleset"))}
      </div>

      {open === "storia" && <StorySection story={story} update={update} />}
      {open === "chi" && <PresetsSection story={story} update={update} />}
      {open === "porta" && <InventorySection story={story} update={update} />}
      {open === "scheda" && <SheetSection story={story} update={update} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. La storia
// ---------------------------------------------------------------------------

function StorySection({ story, update }: Props) {
  const view = useView();
  const set = (k: "world" | "tone" | "protagonist" | "notes", v: string) => update((s) => {
    s.setting = { ...s.setting, [k]: v || undefined };
    if (Object.values(s.setting).every((x) => x === undefined)) delete s.setting;
  });

  return (
    <div className="section">
      <p className="summary" style={{ marginTop: 0 }}>
        {view === "autore"
          ? "Nulla di quello che scrivi qui compare nel gioco: serve a te, all'editor e — più avanti — all'assistente di scrittura, per non perdere di vista che storia stai facendo."
          : "story.setting — metadati d'autore, ignorati dal motore."}
      </p>

      <div className="field">
        <label>{view === "autore" ? "Titolo" : "meta.title"}</label>
        <input defaultValue={story.meta.title} onBlur={(e) => update((s) => { s.meta.title = e.target.value; })} />
      </div>
      <div className="field">
        <label>{view === "autore" ? "Dove e quando siamo" : "setting.world"}</label>
        <textarea defaultValue={story.setting?.world ?? ""} onBlur={(e) => set("world", e.target.value)} />
      </div>
      <div className="field">
        <label>{view === "autore" ? "Che aria tira (tono, riferimenti)" : "setting.tone"}</label>
        <textarea defaultValue={story.setting?.tone ?? ""} onBlur={(e) => set("tone", e.target.value)} />
      </div>
      <div className="field">
        <label>{view === "autore" ? "Chi è il protagonista, in una riga" : "setting.protagonist"}</label>
        <textarea defaultValue={story.setting?.protagonist ?? ""} onBlur={(e) => set("protagonist", e.target.value)} />
      </div>
      <div className="field">
        <label>{view === "autore" ? "Appunti per te" : "setting.notes"}</label>
        <textarea defaultValue={story.setting?.notes ?? ""} onBlur={(e) => set("notes", e.target.value)} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Chi sei — personaggi pronti
// ---------------------------------------------------------------------------

/** Posti occupati e disponibili con un dato equipaggiamento iniziale. */
export function previewLoad(story: Story, items: Record<string, number> | undefined) {
  let carried = 0, bonus = 0;
  for (const [id, qty] of Object.entries(items ?? {})) {
    const decl = story.items?.[id];
    carried += (decl?.size ?? 1) * qty;
    bonus += (decl?.capacityBonus ?? 0) * qty;
  }
  const capacity = (story.ruleset.inventory?.baseCapacity ?? 0) + bonus;
  return { carried, capacity };
}

function PresetsSection({ story, update }: Props) {
  const view = useView();
  const presets = story.ruleset.presets ?? [];
  const rs = story.ruleset;
  const unit = rs.inventory?.unitLabel ?? "posti";

  const mut = (i: number, fn: (p: CharacterPreset) => void) =>
    update((s) => { fn(s.ruleset.presets![i]); });

  const addPreset = () => update((s) => {
    const list = (s.ruleset.presets ??= []);
    const name = `Personaggio ${list.length + 1}`;
    let id = slugify(name);
    let k = 2;
    while (list.some((p) => p.id === id)) id = `${slugify(name)}_${k++}`;
    list.push({ id, name, default: list.length === 0 });
  });

  return (
    <div className="section">
      <div className="row" style={{ marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>
          {view === "autore" ? `Personaggi pronti (${presets.length})` : `ruleset.presets (${presets.length})`}
        </h3>
        <div style={{ flex: 1 }} />
        <button className="small primary" onClick={addPreset}>{view === "autore" ? "+ Crea personaggio" : "+ Preset"}</button>
      </div>
      <p className="summary" style={{ marginTop: -4 }}>
        {view === "autore"
          ? "Un personaggio pronto serve a due cose insieme: è il punto di partenza predefinito della storia, ed è uno degli archetipi che il gioco potrà far scegliere al lettore."
          : "Base applicata da newGame. Precedenza: build esplicito > preset > default della dichiarazione."}
      </p>

      {presets.length === 0 && (
        <div className="empty">
          {view === "autore"
            ? "Nessun personaggio pronto: si parte con i valori base della scheda."
            : "Nessun preset."}
        </div>
      )}

      {presets.map((p, i) => {
        const load = previewLoad(story, p.items);
        return (
          <div className="card" key={p.id}>
            <div className="card-head">
              <input
                defaultValue={p.name}
                onBlur={(e) => mut(i, (x) => { x.name = e.target.value || x.id; })}
                style={{ flex: 1, fontWeight: 600 }}
              />
              {view === "tecnica" && <span className="pill mono">{p.id}</span>}
              <button
                className={"small" + (p.default ? " primary" : " ghost")}
                title={view === "autore" ? "Il personaggio da cui parte la storia se il gioco non ne fa scegliere nessuno" : "default: true (uno solo)"}
                onClick={() => update((s) => {
                  for (const q of s.ruleset.presets!) delete q.default;
                  s.ruleset.presets![i].default = true;
                })}
              >{p.default ? "★ predefinito" : "rendi predefinito"}</button>
              <button className="small danger ghost" onClick={() => update((s) => { s.ruleset.presets!.splice(i, 1); })}>×</button>
            </div>

            <div className="field">
              <label>{view === "autore" ? "Com'è, in una riga" : "description"}</label>
              <input defaultValue={p.description ?? ""} onBlur={(e) => mut(i, (x) => { x.description = e.target.value || undefined; })} />
            </div>

            <StatGrid
              label={view === "autore" ? "Caratteristiche" : "attributes"}
              decls={rs.attributes ?? []}
              values={p.attributes}
              onSet={(id, v) => mut(i, (x) => { x.attributes = setOrDelete(x.attributes, id, v); })}
            />
            <StatGrid
              label={view === "autore" ? "Abilità" : "skills"}
              decls={rs.skills ?? []}
              values={p.skills}
              onSet={(id, v) => mut(i, (x) => { x.skills = setOrDelete(x.skills, id, v); })}
            />
            <StatGrid
              label={view === "autore" ? "Indicatori" : "resources"}
              decls={rs.resources ?? []}
              values={p.resources}
              onSet={(id, v) => mut(i, (x) => { x.resources = setOrDelete(x.resources, id, v); })}
            />

            <div className="field" style={{ marginBottom: 0 }}>
              <label>
                {view === "autore" ? "Cosa ha già addosso" : "items"}
                {rs.inventory && (
                  <span className={load.carried > load.capacity ? "count-err" : "muted"} style={{ marginLeft: 8 }}>
                    {load.carried} di {load.capacity} {unit}
                    {load.carried > load.capacity ? " — è sovraccarico" : ""}
                  </span>
                )}
              </label>
              {Object.keys(story.items ?? {}).length === 0 ? (
                <div className="summary">
                  {view === "autore" ? "Non hai ancora creato nessun oggetto." : "story.items vuoto."}
                </div>
              ) : (
                <div className="row" style={{ flexWrap: "wrap" }}>
                  {Object.entries(story.items ?? {}).map(([id, it]) => {
                    const qty = p.items?.[id] ?? 0;
                    return (
                      <button
                        key={id}
                        className={"small" + (qty ? " primary" : " ghost")}
                        title={it.description}
                        onClick={() => mut(i, (x) => { x.items = setOrDelete(x.items, id, qty ? 0 : 1); })}
                      >{it.name}{qty > 1 ? ` ×${qty}` : ""}</button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function setOrDelete(map: Record<string, number> | undefined, id: string, v: number) {
  const next = { ...(map ?? {}) };
  if (v === 0) delete next[id]; else next[id] = v;
  return Object.keys(next).length ? next : undefined;
}

/** Griglia compatta "nome + valore" per le statistiche di un personaggio pronto. */
function StatGrid({ label, decls, values, onSet }: {
  label: string;
  decls: { id: string; name: string; default?: number; min?: number; max?: number }[];
  values: Record<string, number> | undefined;
  onSet: (id: string, v: number) => void;
}) {
  if (decls.length === 0) return null;
  return (
    <div className="field">
      <label>{label}</label>
      <div className="row" style={{ flexWrap: "wrap", gap: 10 }}>
        {decls.map((d) => {
          const v = values?.[d.id];
          return (
            <label key={d.id} className="summary" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {d.name}
              <input
                type="number"
                value={v ?? d.default ?? 0}
                min={d.min}
                max={d.max}
                onChange={(e) => onSet(d.id, Number(e.target.value))}
                style={{ width: 62 }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Cosa puoi portare
// ---------------------------------------------------------------------------

function InventorySection({ story, update }: Props) {
  const view = useView();
  const inv = story.ruleset.inventory;

  return (
    <div className="section">
      <h3>{view === "autore" ? "Cosa puoi portare addosso" : "ruleset.inventory"}</h3>
      <p className="summary" style={{ marginTop: -4 }}>
        {view === "autore"
          ? "Se accendi questo limite, ogni oggetto occupa dello spazio e chi porta uno zaino o un cappotto ne ha di più. Se lo lasci spento, il personaggio può portare qualsiasi cosa."
          : "Capacità = baseCapacity + Σ capacityBonus degli oggetti posseduti. overflow: block = ciò che non ci sta non entra."}
      </p>

      <div className="row" style={{ marginBottom: 12 }}>
        <button
          className={inv ? "small primary" : "small ghost"}
          onClick={() => update((s) => {
            if (s.ruleset.inventory) delete s.ruleset.inventory;
            else s.ruleset.inventory = { baseCapacity: 2, overflow: "block", unitLabel: "tasche" };
          })}
        >{inv ? "✓ c'è un limite" : "nessun limite"}</button>
        <span className="summary">
          {inv
            ? (view === "autore" ? "Clicca per togliere il limite." : "Clicca per rimuovere ruleset.inventory.")
            : (view === "autore" ? "Clicca per introdurre l'ingombro." : "Clicca per aggiungere ruleset.inventory.")}
        </span>
      </div>

      {inv && (
        <div className="card">
          <div className="row">
            <div className="field" style={{ flex: "0 0 200px", marginBottom: 0 }}>
              <label>{view === "autore" ? "Posti a mani nude" : "baseCapacity"}</label>
              <input
                type="number" min={0} value={inv.baseCapacity}
                onChange={(e) => update((s) => { s.ruleset.inventory!.baseCapacity = Math.max(0, Number(e.target.value)); })}
              />
            </div>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <label>{view === "autore" ? "Come li chiami" : "unitLabel"}</label>
              <input
                defaultValue={inv.unitLabel ?? ""}
                placeholder="tasche, posti, slot…"
                onBlur={(e) => update((s) => { s.ruleset.inventory!.unitLabel = e.target.value || undefined; })}
              />
            </div>
          </div>
          <div className="field" style={{ marginTop: 10, marginBottom: 0 }}>
            <label>{view === "autore" ? "Se non c'è spazio" : "overflow"}</label>
            <select
              value={inv.overflow ?? "block"}
              onChange={(e) => update((s) => { s.ruleset.inventory!.overflow = e.target.value as "block" | "allow"; })}
            >
              <option value="block">{view === "autore" ? "l'oggetto non entra" : "block"}</option>
              <option value="allow">{view === "autore" ? "entra lo stesso (il limite è solo indicativo)" : "allow"}</option>
            </select>
          </div>
          <p className="summary" style={{ marginBottom: 0, marginTop: 10 }}>
            {view === "autore"
              ? "Nelle condizioni puoi chiedere «lo spazio libero è almeno 2» per far apparire una scelta solo a chi ha posto."
              : "Refs disponibili nelle condizioni: @free, @carried, @capacity."}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Di che cosa sei fatto — la scheda (ex RulesetPanel, ora modificabile)
// ---------------------------------------------------------------------------

function SheetSection({ story, update }: Props) {
  const view = useView();
  const rs = story.ruleset;

  const addStat = (kind: "attributes" | "skills" | "resources") => update((s) => {
    const list = (s.ruleset[kind] ??= [] as never);
    const name = kind === "attributes" ? "Nuova caratteristica" : kind === "skills" ? "Nuova abilità" : "Nuovo indicatore";
    let id = slugify(name);
    let k = 2;
    while ((list as { id: string }[]).some((x) => x.id === id)) id = `${slugify(name)}_${k++}`;
    if (kind === "skills") {
      (list as Skill[]).push({ id, name, attribute: s.ruleset.attributes?.[0]?.id ?? "", default: 0, min: 0, max: 6 });
    } else if (kind === "attributes") {
      (list as Attribute[]).push({ id, name, default: 1, min: 1, max: 6 });
    } else {
      (list as Resource[]).push({ id, name, default: 0, min: 0, max: 10 });
    }
  });

  const statRows = (kind: "attributes" | "skills" | "resources", label: string, addLabel: string) => {
    const list = (rs[kind] ?? []) as { id: string; name: string; default?: number; min?: number; max?: number; attribute?: string }[];
    return (
      <div className="section">
        <div className="row" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{label} ({list.length})</h3>
          <div style={{ flex: 1 }} />
          <button className="small primary" onClick={() => addStat(kind)}>{addLabel}</button>
        </div>
        {list.length === 0 && <div className="summary">{view === "autore" ? "nessuno" : "vuoto"}</div>}
        {list.map((x, i) => (
          <div className="card" key={x.id}>
            <div className="row">
              <input
                defaultValue={x.name}
                onBlur={(e) => update((s) => { (s.ruleset[kind] as { name: string }[])[i].name = e.target.value || x.id; })}
                style={{ flex: 1 }}
              />
              {view === "tecnica" && <span className="pill mono">{x.id}</span>}
              <button
                className="small danger ghost"
                onClick={() => update((s) => { (s.ruleset[kind] as unknown[]).splice(i, 1); })}
              >×</button>
            </div>
            <div className="row" style={{ marginTop: 8 }}>
              {kind === "skills" && (
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label>{view === "autore" ? "Dipende da" : "attribute"}</label>
                  <select
                    value={x.attribute ?? ""}
                    onChange={(e) => update((s) => { (s.ruleset.skills!)[i].attribute = e.target.value; })}
                  >
                    {(rs.attributes ?? []).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              )}
              {(["default", "min", "max"] as const).map((f) => (
                <div className="field" key={f} style={{ flex: "0 0 90px", marginBottom: 0 }}>
                  <label>{view === "autore" ? { default: "all'inizio", min: "minimo", max: "massimo" }[f] : f}</label>
                  <input
                    type="number"
                    defaultValue={x[f] ?? ""}
                    onBlur={(e) => update((s) => {
                      const item = (s.ruleset[kind] as unknown as Record<string, number | undefined>[])[i];
                      item[f] = e.target.value === "" ? undefined : Number(e.target.value);
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <p className="summary" style={{ marginTop: 0 }}>
        {view === "autore"
          ? "Di che cosa è fatto un personaggio in questa storia. Se la tua storia non ha prove di abilità, puoi lasciare tutto vuoto."
          : "ruleset — tutto opzionale (storie checkless/statless)."}
      </p>

      {statRows("attributes", view === "autore" ? "Caratteristiche" : "attributes", view === "autore" ? "+ Caratteristica" : "+ attribute")}
      {statRows("skills", view === "autore" ? "Abilità" : "skills", view === "autore" ? "+ Abilità" : "+ skill")}
      {statRows("resources", view === "autore" ? "Indicatori" : "resources", view === "autore" ? "+ Indicatore" : "+ resource")}

      <div className="section">
        <div className="row" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{view === "autore" ? "Come si tirano i dadi" : "ruleset.check"}</h3>
          <div style={{ flex: 1 }} />
          <button
            className="small ghost"
            onClick={() => update((s) => {
              if (s.ruleset.check) delete s.ruleset.check;
              else s.ruleset.check = { dice: "2d6", adds: ["skill", "modifiers"], compare: ">=" };
            })}
          >{rs.check ? (view === "autore" ? "togli le prove" : "rimuovi") : (view === "autore" ? "+ usa le prove di abilità" : "+ check")}</button>
        </div>
        {rs.check ? (
          <div className="card">
            <div className="row">
              <div className="field" style={{ flex: "0 0 120px", marginBottom: 0 }}>
                <label>{view === "autore" ? "Dadi" : "dice"}</label>
                <input
                  defaultValue={rs.check.dice}
                  onBlur={(e) => update((s) => { if (/^\d+d\d+$/.test(e.target.value.trim())) s.ruleset.check!.dice = e.target.value.trim(); })}
                />
              </div>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                <label>{view === "autore" ? "Si riesce quando il totale…" : "compare"}</label>
                <select
                  value={rs.check.compare}
                  onChange={(e) => update((s) => { s.ruleset.check!.compare = e.target.value as ">=" | ">" | "<=" | "<"; })}
                >
                  <option value=">=">{view === "autore" ? "arriva almeno alla difficoltà" : ">="}</option>
                  <option value=">">{view === "autore" ? "supera la difficoltà" : ">"}</option>
                  <option value="<=">{view === "autore" ? "resta sotto o pari alla difficoltà" : "<="}</option>
                  <option value="<">{view === "autore" ? "resta sotto la difficoltà" : "<"}</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="summary">{view === "autore" ? "Questa storia non usa prove di abilità." : "nessuna formula."}</div>
        )}
      </div>
    </div>
  );
}
