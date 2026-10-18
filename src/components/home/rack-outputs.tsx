import { CineLogicOutput } from "./CineLogicOutput";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Expand, X } from "lucide-react";
import "./output-polish.css";

type Still = { src: string; w: number; h: number; cap: string };

/** The enlarged image mounts only while requested; Radix handles focus and Escape. */
function InspectImage({
  shot,
  className = "",
}: {
  shot: Still;
  className?: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`output-inspect ${className}`}
          aria-label={`Enlarge image: ${shot.cap}`}
        >
          <img
            src={shot.src}
            width={shot.w}
            height={shot.h}
            alt={shot.cap}
            decoding="async"
            srcSet={
              shot.w === 1500
                ? `${shot.src.replace(/\.jpg$/, "-750.jpg")} 750w, ${shot.src} 1500w`
                : undefined
            }
            sizes={
              shot.w === 1500 ? "(min-width: 1024px) 40vw, 90vw" : undefined
            }
          />
          <span className="output-expand" aria-hidden="true">
            <Expand size={13} />
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="output-lightbox-shade" />
        <Dialog.Content className="output-lightbox" data-lenis-prevent>
          <Dialog.Title className="output-lightbox-title">
            Project image
          </Dialog.Title>
          <Dialog.Description className="output-lightbox-caption">
            {shot.cap}
          </Dialog.Description>
          <Dialog.Close
            className="output-lightbox-close"
            aria-label="Close enlarged image"
          >
            <X size={20} />
          </Dialog.Close>
          <div className="output-lightbox-scroll">
            <img src={shot.src} width={shot.w} height={shot.h} alt={shot.cap} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const shots = [
  {
    src: "/projects/biotwin/overview.jpg",
    label: "Overview",
    w: 1500,
    h: 829,
    cap: "The twin answers questions about your day in plain language.",
  },
  {
    src: "/projects/biotwin/signals.jpg",
    label: "Signals",
    w: 1500,
    h: 820,
    cap: "Heart rate, sleep, calories and steps from the watch.",
  },
  {
    src: "/projects/biotwin/day-ahead.jpg",
    label: "Day ahead",
    w: 1500,
    h: 652,
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
      <InspectImage shot={s} className="output-screen" />
      <div className="shot-tabs" role="group" aria-label="BioTwin screens">
        {shots.map((t, k) => (
          <button
            key={t.label}
            type="button"
            aria-pressed={k === i}
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
    w: 696,
    h: 1500,
    alt: "The book library home screen with Romeo and Juliet ready to play",
  },
  {
    src: "/projects/playscript/story.jpg",
    w: 738,
    h: 1500,
    alt: "A story scene with narrator text over an animated Verona backdrop",
  },
  {
    src: "/projects/playscript/choices.jpg",
    w: 733,
    h: 1500,
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
          <InspectImage
            key={p.src}
            shot={{ ...p, cap: p.alt }}
            className="output-phone"
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
  if (type === "cinelogic") return <CineLogicOutput />;
  if (type === "biotwin") return <BioTwinShots />;
  if (type === "playscript") return <PlayScriptPhones />;
  if (type === "interview")
    return (
      <figure className="rack-output interview-output">
        <div className="output-topline">
          <span>AI INTERVIEWER / THE APP</span>
          <span>SESSION SETUP</span>
        </div>
        <InspectImage
          shot={{
            src: "/projects/interview/setup.jpg",
            w: 1500,
            h: 923,
            cap: "The app's interview setup: coding or behavioral, language, duration and difficulty.",
          }}
          className="output-screen"
        />
        <figcaption>
          Real app screen · choose a session, then talk through your code.
        </figcaption>
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
        <div className="output-filmstrip">
          {[
            {
              time: "015",
              label: "00:15",
              cap: "Generated Zanzibar film: an officer aboard a ship.",
            },
            {
              time: "055",
              label: "00:55",
              cap: "Rendered Zanzibar film: a map of the palace and harbor.",
            },
            {
              time: "095",
              label: "01:35",
              cap: "Generated Zanzibar film: soldiers assembled at the harbor.",
            },
          ].map((frame) => (
            <div key={frame.time}>
              <InspectImage
                shot={{
                  src: `/projects/videomaxx/zanzibar-${frame.time}.jpg`,
                  w: 640,
                  h: 360,
                  cap: frame.cap,
                }}
                className="output-film-frame"
              />
              <span>{frame.label}</span>
            </div>
          ))}
        </div>
        <div className="film-track" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <figcaption>
          Actual rendered frames · Zanzibar film · click a frame to inspect
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
