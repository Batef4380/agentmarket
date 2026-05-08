export default function Footer() {
  return (
    <footer
      className="py-16 px-6 text-center"
      style={{ background: "#0F1F0F" }}
    >
      {/* Logo + name */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="7" fill="#C8A84B" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={i}
              x1="16"
              y1="16"
              x2={16 + 14 * Math.cos((deg * Math.PI) / 180)}
              y2={16 + 14 * Math.sin((deg * Math.PI) / 180)}
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <span className="font-anton text-2xl text-cream tracking-widest">
          AgentMarket
        </span>
      </div>

      <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-6">
        ETHPrague 2026
      </p>

      {/* Tech stack line */}
      <p className="font-mono text-xs text-text-muted mb-8">
        Built with ✦ on Ethereum Sepolia &nbsp;|&nbsp; ENS &nbsp;|&nbsp;
        SpaceComputer &nbsp;|&nbsp; Sourcify
      </p>

      {/* Links */}
      <div className="flex items-center justify-center gap-8 mb-8">
        {[
          { label: "GitHub", href: "https://github.com/Batef4380/agentmarket" },
          { label: "Twitter", href: "#" },
          { label: "Devfolio", href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-text-muted hover:text-gold transition-colors uppercase tracking-widest"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="font-mono text-[10px] text-text-muted/50 tracking-widest">
        © 2026 AgentMarket. Trust is the Protocol.
      </p>
    </footer>
  );
}
