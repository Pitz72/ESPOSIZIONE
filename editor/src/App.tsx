import { useMemo, useState } from "react";
import type { Story } from "../../core/src/index.ts";
import { validateStory } from "../../core/src/index.ts";
import { ViewContext, type View } from "./view.ts";
import { Sidebar } from "./components/Sidebar.tsx";
import { NodeInspector } from "./components/NodeInspector.tsx";
import { StateSchemaEditor } from "./components/StateSchemaEditor.tsx";
import { SetupPanel } from "./components/SetupPanel.tsx";
import { ValidationPanel } from "./components/ValidationPanel.tsx";
import { pickAndReadFile, downloadText } from "./lib/fileIO.ts";
import atrio from "../../examples/atrio-villa.iwstory.json";
import corridor from "../../examples/corridor-act1.iwstory.json";
import lemmons from "../../examples/lemmons-carli.iwstory.json";

const EXAMPLES: { label: string; data: unknown; file: string }[] = [
  { label: "Atrio della villa", data: atrio, file: "atrio-villa.iwstory.json" },
  { label: "Corridor — Atto 1", data: corridor, file: "corridor-act1.iwstory.json" },
  { label: "Lemmons — Carli", data: lemmons, file: "lemmons-carli.iwstory.json" },
];

function emptyStory(): Story {
  return {
    meta: { id: "nuova_storia", title: "Nuova storia", version: "0.1.0", formatVersion: "0.4" },
    ruleset: {},
    stateSchema: {},
    nodes: { start: { id: "start", title: "Inizio", content: [{ speaker: "Narratore", text: "" }], choices: [] } },
    entry: "start",
  };
}

export function App() {
  const [story, setStory] = useState<Story | null>(null);
  const [fileName, setFileName] = useState("storia.iwstory.json");
  const [tab, setTab] = useState<"nodi" | "stato" | "ruleset">("nodi");
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<View>("autore");

  const findings = useMemo(() => (story ? validateStory(story) : []), [story]);
  const findingsByNode = useMemo(() => {
    const map: Record<string, { errors: number; warnings: number }> = {};
    for (const f of findings) {
      const m = /^nodes\.([A-Za-z_][A-Za-z0-9_]*)/.exec(f.path);
      if (!m) continue;
      const b = (map[m[1]] ??= { errors: 0, warnings: 0 });
      if (f.severity === "error") b.errors++; else b.warnings++;
    }
    return map;
  }, [findings]);

  const update = (fn: (s: Story) => void) => {
    setStory((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  };

  const loadStory = (data: unknown, file: string) => {
    const s = data as Story;
    setStory(structuredClone(s));
    setFileName(file);
    setSelected(s.entry ?? Object.keys(s.nodes ?? {})[0] ?? null);
    setTab("nodi");
  };

  const openFile = async () => {
    const res = await pickAndReadFile();
    if (!res) return;
    try {
      loadStory(JSON.parse(res.text), res.name);
    } catch (e) {
      alert("JSON non valido: " + (e as Error).message);
    }
  };

  const save = () => { if (story) downloadText(fileName, JSON.stringify(story, null, 2)); };

  const addNode = () => update((s) => {
    let id = "nuovo_nodo";
    let i = 1;
    while (s.nodes[id]) id = `nuovo_nodo_${i++}`;
    s.nodes[id] = { id, title: "Nuovo nodo", content: [{ speaker: "Narratore", text: "" }], choices: [] };
  });

  const errors = findings.filter((f) => f.severity === "error").length;

  if (!story) {
    return (
      <div className="app">
        <div className="topbar"><span className="title">InteractiveWriter <small>Editor 0.5.1</small></span></div>
        <div className="empty" style={{ marginTop: 80 }}>
          <p>Apri un file <span className="mono">.iwstory</span> o parti da un esempio.</p>
          <div className="row" style={{ justifyContent: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button className="primary" onClick={openFile}>Apri file…</button>
            <button onClick={() => loadStory(emptyStory(), "storia.iwstory.json")}>Storia vuota</button>
          </div>
          <div className="row" style={{ justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {EXAMPLES.map((ex) => (
              <button key={ex.file} className="ghost" onClick={() => loadStory(ex.data, ex.file)}>{ex.label}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ViewContext.Provider value={view}>
    <div className="app">
      <div className="topbar">
        <span className="title">InteractiveWriter <small>{story.meta.title}</small></span>
        <span className="pill mono">{fileName}</span>
        <div className="spacer" />
        <div className="viewtoggle" title="La stessa storia, spiegata in due lingue">
          <button className={view === "autore" ? "active" : ""} onClick={() => setView("autore")}>Autore</button>
          <button className={view === "tecnica" ? "active" : ""} onClick={() => setView("tecnica")}>Tecnica</button>
        </div>
        <span className={errors ? "count-err" : "count-ok"}>
          {errors ? `${errors} da sistemare` : "tutto a posto"}
        </span>
        <button onClick={openFile}>Apri…</button>
        <button className="primary" onClick={save}>Salva</button>
      </div>

      <div className="main">
        <div className="col left">
          <Sidebar
            story={story}
            tab={tab}
            setTab={setTab}
            selectedNodeId={selected}
            onSelectNode={setSelected}
            onAddNode={addNode}
            findingsByNode={findingsByNode}
          />
        </div>

        <div className="col center">
          {tab === "nodi" && (selected && story.nodes[selected]
            ? <NodeInspector
                key={`${selected}:${story.nodes[selected].content.length}:${story.nodes[selected].choices?.length ?? 0}`}
                story={story} nodeId={selected} update={update} onRenameSelect={setSelected} />
            : <div className="empty">Seleziona un nodo a sinistra, oppure <button className="small" onClick={addNode}>creane uno</button>.</div>)}
          {tab === "stato" && <StateSchemaEditor story={story} update={update} />}
          {tab === "ruleset" && <SetupPanel story={story} update={update} />}
        </div>

        <div className="col right">
          <ValidationPanel story={story} findings={findings} onPick={(id) => { if (id) { setTab("nodi"); setSelected(id); } }} />
        </div>
      </div>
    </div>
    </ViewContext.Provider>
  );
}

