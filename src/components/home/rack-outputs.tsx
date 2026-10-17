import { useState } from "react";

const shots = [
  {
    src: "/projects/biotwin/overview.jpg",
    label: "Overview",
    w: 1280,
    h: 708,
    cap: "The twin answers questions about your day in plain language.",
  },
  {
    src: "/projects/biotwin/signals.jpg",
    label: "Signals",
    w: 1280,
    h: 700,
    cap: "Heart rate, sleep, calories and steps from the watch.",
  },
  {
    src: "/projects/biotwin/day-ahead.jpg",
    label: "Day ahead",
    w: 2048,
    h: 891,
    cap: "Forecast Body Battery with the best training window marked.",
  },
];

/** Real screenshots of the app; tabs switch between them. */
function BioTwinShots() {
  const [i, setI] = useState(0);
  const s = shots[i];
  return (
    <figure className="rack-output shots-output">
      <div className="output-topline">
        <span>BIOTWIN / THE APP</span>
        <span>HACKRICE</span>
      </div>
      <img
        src={s.src}
        width={s.w}
        height={s.h}
        alt={s.cap}
       
        decoding="async"
        className="shot-main"
      />
      <div className="shot-tabs" role="tablist" aria-label="BioTwin screens">
        {shots.map((t, k) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={k === i}
            className={k === i ? "is-on" : ""}
            onClick={() => setI(k)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <figcaption>{s.cap}</figcaption>
    </figure>
  );
}

const phones = [
  {
    src: "/projects/playscript/library.jpg",
    w: 484,
    h: 1042,
    alt: "The book library home screen with Romeo and Juliet ready to play",
  },
  {
    src: "/projects/playscript/story.jpg",
    w: 524,
    h: 1064,
    alt: "A story scene with narrator text over an animated Verona backdrop",
  },
  {
    src: "/projects/playscript/choices.jpg",
    w: 562,
    h: 1150,
    alt: "A decision screen: let your heart answer",
  },
];

function PlayScriptPhones() {
  return (
    <figure className="rack-output phones-output">
      <div className="output-topline">
        <span>PLAYSCRIPT / THE GAME</span>
        <span>TXST SHIPATHON</span>
      </div>
      <div className="phones-row">
        {phones.map((p) => (
          <img
            key={p.src}
            src={p.src}
            width={p.w}
            height={p.h}
            alt={p.alt}
           
            decoding="async"
          />
        ))}
      </div>
      <figcaption>
        Library, a played scene and a decision. The screens are from the app.
      </figcaption>
    </figure>
  );
}

export function Output({ type }: { type: string }) {
  if (type === "biotwin") return <BioTwinShots />;
  if (type === "playscript") return <PlayScriptPhones />;
  if (type === "interview")
    return (
      <figure className="rack-output interview-output">
        <div className="output-topline">
          <span>AI INTERVIEWER / SESSION LOOP</span>
          <span>LIVE</span>
        </div>
        <ol className="iv-rows">
          <li>
            <span>01</span>
            <div>
              <b>You talk it through</b>
              <p>
                Contextual questions by voice, and cross-questions based on what
                you actually said.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <b>Your code syncs every second</b>
              <p>
                It reads your implementation in real time and asks targeted
                follow-ups about it.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <b>Hire or No Hire</b>
              <p>
                Communication, code quality and problem solving, judged like a
                senior engineer.
              </p>
            </div>
          </li>
        </ol>
        <figcaption>Session flow · Next.js, FastAPI and Gemini</figcaption>
      </figure>
    );
  if (type === "research")
    return (
      <figure className="rack-output research-output">
        <div className="output-topline">
          <span>HF ECOSYSTEM / RESEARCH RESULTS</span>
          <span>n = 20,000</span>
        </div>
        <div className="research-display">
          <div className="mini-server" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i}>
                <i />
                <b />
                <span>U{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <div className="research-numbers">
            <strong>
              48.4<span>%</span>
            </strong>
            <p>of downloads go to the top 100 models</p>
            <div className="result-bar">
              <i />
            </div>
            <span>
              Top 100 <span className="float-right">All other models</span>
            </span>
          </div>
        </div>
        <figcaption>Audit result · Hugging Face model downloads</figcaption>
      </figure>
    );
  if (type === "film")
    return (
      <figure className="rack-output film-output">
        <div className="output-topline">
          <span>VIDEOMAXX / PRODUCTION SYSTEM</span>
          <span>15 stages</span>
        </div>
        <div className="film-stages">
          {["Research", "Verify", "Narrate", "Render"].map((s, i) => (
            <div key={s}>
              <span>0{i + 1}</span>
              <div className={`film-glyph film-glyph-${i}`} aria-hidden="true">
                {i === 0 ? "≋" : i === 1 ? "✓" : i === 2 ? "▂▅▃▇▅▂" : "▷"}
              </div>
              <b>{s}</b>
            </div>
          ))}
        </div>
        <div className="film-track" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <figcaption>
          Pipeline schematic · research → verified script → narrated video
        </figcaption>
      </figure>
    );
  if (type === "documents")
    return (
      <figure className="rack-output document-output">
        <div className="output-topline">
          <span>SORTIFY / DOCUMENT FLOW</span>
          <span>RAG</span>
        </div>
        <div className="document-flow">
          <div className="document-stack" aria-hidden="true">
            <i />
            <i />
            <i>
              <span>LECTURE NOTES</span>
              <b />
              <b />
              <b />
            </i>
          </div>
          <span className="flow-arrow" aria-hidden="true">
            →
          </span>
          <div className="document-answer">
            <span>01 / CLASSIFY</span>
            <strong>Everything in its place.</strong>
            <hr />
            <span>02 / RETRIEVE + ANSWER</span>
            <p>
              Ask your documents.
              <br />
              Find the relevant context.
            </p>
          </div>
        </div>
        <figcaption>
          Workflow illustration · FastAPI / PGVector / Sentence Transformers
        </figcaption>
      </figure>
    );
  return (
    <figure className="rack-output chess-output">
      <div className="output-topline">
        <span>CHESS COACH / EDGE AI</span>
        <span>800–1800 ELO</span>
      </div>
      <div className="chess-display">
        <div className="chess-board" aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => (
            <span
              key={i}
              className={(Math.floor(i / 8) + i) % 2 ? "square-dark" : ""}
            >
              {
                (
                  {
                    4: "♚",
                    12: "♟",
                    18: "♞",
                    35: "♙",
                    42: "♘",
                    60: "♔",
                  } as Record<number, string>
                )[i]
              }
            </span>
          ))}
        </div>
        <div>
          <span className="rack-label">ON-DEMAND COACHING</span>
          <strong>
            Your move.
            <br />A little wiser.
          </strong>
          <p>
            Local move analysis.
            <br />
            Llama 3.3 explanations.
          </p>
        </div>
      </div>
      <figcaption>
        Illustrated position · explore the actual app via Live demo
      </figcaption>
    </figure>
  );
}
