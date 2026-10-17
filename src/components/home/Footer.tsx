import { useRef } from "react";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import {
  gsap,
  ScrollTrigger,
  setDarkStage,
  SCRUB,
  gate,
  scrollToY,
} from "@/lib/motion";
import { Chars, Reveal, readThrough, useScene } from "./reveal";
import "./reading.css";

export const Footer = () => {
  const root = useRef<HTMLElement>(null);

  useScene(
    root,
    ({ q, one }) => {
      const stage = one(".ct-stage");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
          pin: true,
          scrub: SCRUB,
          refreshPriority: 5,
          invalidateOnRefresh: true,
          onUpdate: (self) => setDarkStage("contact", self.progress > 0.12),
        },
      });
      tl.fromTo(stage, { "--dark": 0 }, { "--dark": 1, duration: 1.2 }, 0)
        .from(
          q(".boot-rails i"),
          {
            scaleX: 0,
            transformOrigin: "right center",
            stagger: 0.06,
            duration: 1,
          },
          0.3,
        )
        .from(
          q(".ct-title .jx-char"),
          {
            yPercent: 120,
            rotate: 5,
            stagger: 0.03,
            duration: 0.8,
            ease: "power3.out",
          },
          0.8,
        );
      const end = readThrough(tl, one(".ct-sub .rd"), 1.8, 1.4);
      tl.from(
        q(".ct-links a"),
        {
          opacity: 0,
          y: 30,
          scale: 0.92,
          stagger: 0.2,
          duration: 0.6,
          ease: "back.out(1.6)",
        },
        end,
      )
        .from(one(".ct-legal"), { opacity: 0, duration: 0.5 }, end + 0.4)
        .to({}, { duration: 0.8 });
      return () => setDarkStage("contact", false);
    },
    [],
  );

  return (
    <footer id="contact" ref={root} className="ct">
      <div className="ct-stage">
        <div className="boot-rails" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ top: `${((i + 0.5) / 14) * 100}%` }} />
          ))}
        </div>
        <p className="ct-label">04 · Contact</p>
        <h2 className="ct-title">
          <span className="sr-only">Tell me about your next project</span>
          <span className="ct-line" aria-hidden="true">
            <Chars text="Tell me about your" />
          </span>
          <span className="ct-line" aria-hidden="true">
            <em>
              <Chars text="next project" />
            </em>
          </span>
        </h2>
        <p className="ct-sub">
          <Reveal text="Research collaborations, internships, or just a good *systems conversation*. My inbox is open." />
        </p>
        <div className="ct-links">
          <a href="mailto:rizsaurav@gmail.com" className="ct-primary">
            rizsaurav@gmail.com <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/Rizsaurav"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/saurav-rijal-08082a261/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        </div>
        <div className="ct-legal">
          <span>© 2026 Saurav Rijal</span>
          <button
            type="button"
            className="ct-replay"
            onClick={() => scrollToY(0)}
          >
            Replay from the top ↑
          </button>
          <span>San Marcos, Texas</span>
        </div>
      </div>
    </footer>
  );
};
