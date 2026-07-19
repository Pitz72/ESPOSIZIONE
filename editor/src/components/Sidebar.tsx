import type { Story } from "../../../core/src/index.ts";
import { useView } from "../view.ts";
import { sceneTitle } from "../lib/authorLang.ts";

interface Props {
  story: Story;
  tab: "nodi" | "stato" | "ruleset";
  setTab: (t: "nodi" | "stato" | "ruleset") => void;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: () => void;
  findingsByNode: Record<string, { errors: number; warnings: number }>;
}

export function Sidebar({ story, tab, setTab, selectedNodeId, onSelectNode, onAddNode, findingsByNode }: Props) {
  const view = useView();
  const nodeIds = Object.keys(story.nodes);
  const labels = view === "autore"
    ? { nodi: "Scene", stato: "Cosa ricorda", ruleset: "Personaggio", count: "scene", add: "+ Scena" }
    : { nodi: "Nodi", stato: "Stato", ruleset: "Ruleset", count: "nodi", add: "+ Nodo" };

  return (
    <div>
      <div className="tabs">
        <button className={tab === "nodi" ? "active" : ""} onClick={() => setTab("nodi")}>{labels.nodi}</button>
        <button className={tab === "stato" ? "active" : ""} onClick={() => setTab("stato")}>{labels.stato}</button>
        <button className={tab === "ruleset" ? "active" : ""} onClick={() => setTab("ruleset")}>{labels.ruleset}</button>
      </div>

      {tab === "nodi" && (
        <div className="list">
          <div className="row" style={{ padding: "4px 4px 8px" }}>
            <span className="muted" style={{ fontSize: 12 }}>{nodeIds.length} {labels.count}</span>
            <div className="spacer" style={{ flex: 1 }} />
            <button className="small primary" onClick={onAddNode}>{labels.add}</button>
          </div>
          {nodeIds.map((id) => {
            const f = findingsByNode[id];
            return (
              <div
                key={id}
                className={"list-item" + (id === selectedNodeId ? " active" : "")}
                onClick={() => onSelectNode(id)}
              >
                {id === story.entry && <span className="entry-star" title="Scena d'inizio">★</span>}
                <span className={view === "autore" ? "" : "id"}>{view === "autore" ? sceneTitle(story, id) : id}</span>
                {f && f.errors > 0 && <span className="badge count-err">{f.errors}</span>}
                {f && f.errors === 0 && f.warnings > 0 && <span className="badge count-warn">{f.warnings}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
