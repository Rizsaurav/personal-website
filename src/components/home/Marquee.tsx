const items = [
  "Agentic pipelines",
  "LLM evaluation",
  "Edge AI",
  "Full-stack engineering",
  "NLP",
  "Real-time systems",
];

export const Marquee = () => {
  const row = [...items, ...items];
  return (
    <div
      aria-hidden
      className="overflow-hidden bg-text-primary text-background border-y hairline select-none"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap py-3">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="label-caps mx-6 flex items-center gap-6">
                {item}
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
