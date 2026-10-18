import { useState } from "react";
import "./cinelogic.css";

// Recorded from the repository's synthetic fixture harness at 9f29a24 on 2026-10-18.
const fixtures = [
  { name: "Camera-only zoom", raw: 23.78, local: 2.41, verdict: "DEAD_STILL" },
  {
    name: "Moving synthetic subject",
    raw: 47.72,
    local: 46.51,
    verdict: "ACTIVE_CINEMATIC",
  },
];

export function CineLogicOutput() {
  const [view, setView] = useState<"system" | "evidence">("system");
  return (
    <figure className="rack-output cl-output">
      <div className="output-topline">
        <span>CINELOGIC / ENGINEERING THE SHOT</span>
        <span>MCP</span>
      </div>
      <div className="cl-tabs" role="group" aria-label="CineLogic preview">
        <button
          type="button"
          aria-pressed={view === "system"}
          onClick={() => setView("system")}
        >
          The system
        </button>
        <button
          type="button"
          aria-pressed={view === "evidence"}
          onClick={() => setView("evidence")}
        >
          Motion evidence
        </button>
      </div>
      <div className="cl-window">
        {view === "system" ? (
          <div className="cl-system">
            <div className="cl-system-head">
              <span>INTENT</span>
              <i aria-hidden="true">↓</i>
              <strong>A shot becomes a contract.</strong>
            </div>
            <div className="cl-servers">
              <div>
                <span>STUDIO MCP</span>
                <strong>
                  Plan. Compile.
                  <br />
                  Measure.
                </strong>
                <small>6 tools</small>
              </div>
              <div>
                <span>MOTION MCP</span>
                <strong>
                  Render. Style.
                  <br />
                  Screen.
                </strong>
                <small>3 tools</small>
              </div>
            </div>
            <p className="cl-skills">4 studio skills + a cinematics playbook</p>
          </div>
        ) : (
          <div className="cl-evidence">
            <p>Pixel change is not the same as subject motion.</p>
            {fixtures.map((f) => (
              <div key={f.name} className="cl-fixture">
                <div>
                  <b>{f.name}</b>
                  <span>{f.verdict}</span>
                </div>
                <div className="cl-bar">
                  <span>Raw</span>
                  <i>
                    <b style={{ width: `${(f.raw / 50) * 100}%` }} />
                  </i>
                  <small>{f.raw.toFixed(2)}</small>
                </div>
                <div className="cl-bar cl-bar-local">
                  <span>Residual</span>
                  <i>
                    <b style={{ width: `${(f.local / 50) * 100}%` }} />
                  </i>
                  <small>{f.local.toFixed(2)}</small>
                </div>
              </div>
            ))}
            <small className="cl-method">
              Synthetic fixtures · camera-compensated residual · local run, 18
              Oct 2026
            </small>
          </div>
        )}
      </div>
      <figcaption>
        {view === "system"
          ? "Architecture illustration · two local tool servers, one creative workflow."
          : "Recorded test results, not live telemetry or a real-film quality benchmark."}
      </figcaption>
    </figure>
  );
}
