type QuantaraMarkProps = {
  className?: string;
};

export function QuantaraMark({ className = "" }: QuantaraMarkProps) {
  return (
    <svg
      className={`quantara-mark ${className}`.trim()}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Quantara"
    >
      <rect className="quantara-mark-bg" x="2" y="2" width="60" height="60" rx="15" />
      <path
        className="quantara-mark-ring"
        d="M43.5 42.2A18.5 18.5 0 1 1 47.4 21"
      />
      <path className="quantara-mark-cut" d="M34.5 34.5 49 49" />
      <path className="quantara-mark-signal" d="M44.5 15.5 49.5 10.5" />
    </svg>
  );
}
