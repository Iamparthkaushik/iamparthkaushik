export default function Home() {
  return (
    <main className="hero-container">
      {/* Background Elements */}
      <div className="glow-effect purple-glow"></div>
      <div className="glow-effect blue-glow"></div>

      {/* Content */}
      <div className="content-wrapper">
        <h2 className="subtitle">
          Portfolio
        </h2>
        <h1 className="title">
          PARTH <br className="break-md" /> KAUSHIK
        </h1>
        <p className="description">
          Crafting digital experiences with precision and passion.
        </p>

        {/* Social / Action Links - Styled minimally */}
        <div className="button-group">
          <a
            href="https://github.com/iamparthkaushik"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button"
          >
            GitHub
          </a>
          <a
            href="mailto:iamparthkaushik@gmail.com"
            className="glass-button"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Decorative Footer */}
      <div className="footer-label">
        Based in India • Open to Work
      </div>
    </main>
  );
}
