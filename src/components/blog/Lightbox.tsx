import { useEffect, useRef, useState } from "react";

/** Native <dialog> viewer: focus trap, Esc and backdrop click come for free. */
export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    return () => d?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className="bl-lightbox"
      aria-label={alt || "Figure"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="bl-lightbox-bar">
        <span className="bl-small">{alt}</span>
        <span>
          <button type="button" className="bl-btn" onClick={() => setFull((f) => !f)}>
            {full ? "Fit to screen" : "Actual size"}
          </button>
          <button type="button" className="bl-btn" onClick={onClose} autoFocus>
            Close
          </button>
        </span>
      </div>
      <div className={`bl-lightbox-view ${full ? "is-full" : ""}`}>
        <img src={src} alt={alt} />
      </div>
    </dialog>
  );
}
