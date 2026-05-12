export default function Footer() {
  return (
    <footer
      className="py-16 px-6 text-center"
      style={{ background: "#0F1F0F" }}
    >
      {/* Logo + name */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <line x1="50" y1="4"  x2="50" y2="96" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
          <line x1="4"  y1="50" x2="96" y2="50" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
          <line x1="15" y1="15" x2="85" y2="85" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
          <line x1="85" y1="15" x2="15" y2="85" stroke="#C8A84B" strokeWidth="8" strokeLinecap="round"/>
          <circle cx="50" cy="50" r="22" fill="#1A2E1A"/>
        </svg>
        <span className="font-anton text-2xl text-cream tracking-widest">
          Stovera
        </span>
      </div>

      <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-6">
        Colosseum 2026
      </p>

      {/* Tech stack line */}
      <p className="font-mono text-xs text-text-muted mb-8">
        Built with ✦ on Solana &nbsp;|&nbsp; 8004-Solana &nbsp;|&nbsp; Supabase
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
        © 2026 Stovera. Trust is the Protocol.
      </p>
    </footer>
  );
}
