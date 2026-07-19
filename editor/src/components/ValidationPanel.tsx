import type { Finding, Story } from "../../../core/src/index.ts";
import { useView } from "../view.ts";
import { friendlyFinding } from "../lib/authorLang.ts";

interface Props {
  story: Story;
  findings: Finding[];
  onPick: (nodeId: string | null) => void;
}

function nodeIdFromPath(path: string): string | null {
  const m = /^nodes\.([A-Za-z_][A-Za-z0-9_]*)/.exec(path);
  return m ? m[1] : null;
}

export function ValidationPanel({ story, findings, onPick }: Props) {
  const view = useView();
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const ok = errors.length === 0;

  return (
    <div>
      <div className="vp-head">
        <span className="dot" style={{ background: ok ? "var(--ok)" : "var(--err)" }} />
        <strong>{view === "autore" ? "Come va la storia" : "Validazione"}</strong>
        <div style={{ flex: 1 }} />
        {errors.length > 0 && <span className="count-err">{errors.length}</span>}
        <span className="count-warn">{warnings.length}</span>
        {ok && warnings.length === 0 && <span className="count-ok">tutto a posto</span>}
      </div>
      <div className="vp-list">
        {findings.length === 0 && (
          <div className="empty">{view === "autore" ? "Nessun consiglio: fila tutto liscio." : "Nessun problema."}</div>
        )}
        {[...errors, ...warnings].map((f, i) => (
          <div key={i} className={"finding " + f.severity} onClick={() => onPick(nodeIdFromPath(f.path))}>
            {view === "autore" ? (
              <div className="msg">{friendlyFinding(f, story)}</div>
            ) : (
              <>
                <div className="row">
                  <span className="code">{f.code}</span>
                  <span className="path">{f.path}</span>
                </div>
                <div className="msg">{f.message}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
