import { useState } from "react";
import "./App.css";

const SAMPLE_BUILD =
  "https://maxroll.gg/poe2/pob/example-build-link";

const analysisTemplates = {
  damage: {
    title: "Damage Optimization",
    scoreChange: "+18% estimated damage",
    weakness: "Your weapon and critical modifiers are limiting your damage.",
    firstUpgrade: "Replace your weapon with a higher-DPS base",
    secondUpgrade: "Improve critical strike chance and critical damage",
    thirdUpgrade: "Review support gems for stronger damage multipliers",
  },

  defense: {
    title: "Survivability Optimization",
    scoreChange: "+24% estimated survivability",
    weakness: "Your defenses appear weaker than your offensive investment.",
    firstUpgrade: "Cap elemental resistances",
    secondUpgrade: "Increase life, energy shield, or primary defensive layer",
    thirdUpgrade: "Replace inefficient flask modifiers",
  },

  budget: {
    title: "Budget Upgrade Roadmap",
    scoreChange: "3 high-value upgrades found",
    weakness: "Several inexpensive upgrades may provide better value than one large purchase.",
    firstUpgrade: "Replace your weakest rare item",
    secondUpgrade: "Fix resistances through rings or gloves",
    thirdUpgrade: "Make free passive-tree and gem adjustments",
  },

  balanced: {
    title: "Balanced Build Optimization",
    scoreChange: "+11% overall build efficiency",
    weakness: "Your build is functional, but its investment is spread unevenly.",
    firstUpgrade: "Improve your weakest equipment slot",
    secondUpgrade: "Balance damage and defensive modifiers",
    thirdUpgrade: "Remove inefficient passive-tree travel points",
  },
};

function App() {
  const [buildLink, setBuildLink] = useState("");
  const [budget, setBudget] = useState("5");
  const [goal, setGoal] = useState("balanced");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function createAnalysis() {
    const template = analysisTemplates[goal];
    const numericBudget = Number(budget);

    let buildScore = 72;

    if (goal === "balanced") {
      buildScore = 81;
    } else if (goal === "damage") {
      buildScore = 76;
    } else if (goal === "defense") {
      buildScore = 68;
    } else if (goal === "budget") {
      buildScore = 79;
    }

    let budgetMessage;

    if (numericBudget <= 1) {
      budgetMessage =
        "Focus on free passive-tree changes, gems, flasks, and inexpensive rare items.";
    } else if (numericBudget <= 5) {
      budgetMessage =
        "Your budget should be enough for several meaningful equipment upgrades.";
    } else if (numericBudget <= 20) {
      budgetMessage =
        "Prioritize one major upgrade, then use the remaining budget to repair weaker slots.";
    } else {
      budgetMessage =
        "Compare expensive upgrades carefully. High cost does not always mean high value.";
    }

    return {
      score: buildScore,
      grade:
        buildScore >= 90
          ? "S"
          : buildScore >= 80
            ? "A"
            : buildScore >= 70
              ? "B"
              : "C",
      title: template.title,
      improvement: template.scoreChange,
      weakness: template.weakness,
      upgrades: [
        {
          priority: 1,
          name: template.firstUpgrade,
          cost: numericBudget <= 2 ? "Low cost" : `${Math.max(1, Math.round(numericBudget * 0.5))} Divine`,
          impact: "High impact",
        },
        {
          priority: 2,
          name: template.secondUpgrade,
          cost: numericBudget <= 2 ? "Low cost" : `${Math.max(1, Math.round(numericBudget * 0.3))} Divine`,
          impact: "Medium impact",
        },
        {
          priority: 3,
          name: template.thirdUpgrade,
          cost: "Free–Low cost",
          impact: "Medium impact",
        },
      ],
      budgetMessage,
    };
  }

  function handleAnalyze(event) {
    event.preventDefault();

    const trimmedLink = buildLink.trim();

    if (!trimmedLink) {
      setError("Enter a build link before starting the analysis.");
      setResult(null);
      return;
    }

    if (
      !trimmedLink.startsWith("http://") &&
      !trimmedLink.startsWith("https://")
    ) {
      setError("Enter a complete link beginning with http:// or https://.");
      setResult(null);
      return;
    }

    if (!budget || Number(budget) < 0) {
      setError("Enter a valid budget of zero or more.");
      setResult(null);
      return;
    }

    setError("");
    setResult(null);
    setStatus("loading");

    window.setTimeout(() => {
      setResult(createAnalysis());
      setStatus("complete");
    }, 1400);
  }

  function loadSampleBuild() {
    setBuildLink(SAMPLE_BUILD);
    setBudget("5");
    setGoal("balanced");
    setError("");
    setResult(null);
    setStatus("idle");
  }

  function resetAnalysis() {
    setBuildLink("");
    setBudget("5");
    setGoal("balanced");
    setError("");
    setResult(null);
    setStatus("idle");
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#top" aria-label="ExileIQ home">
          <span className="brand-icon" aria-hidden="true">
            ☠
          </span>

          <span>
            Exile<span>IQ</span>
          </span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#analyzer">Analyzer</a>
          <a href="#features">Features</a>
          <a href="#roadmap">Roadmap</a>
        </nav>

        <a className="github-link" href="#analyzer">
          Analyze Build
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">PATH OF EXILE 2 BUILD INTELLIGENCE</p>

          <h1>
            Build smarter.
            <span> Conquer the endgame.</span>
          </h1>

          <p className="hero-description">
            ExileIQ helps Path of Exile 2 players identify build weaknesses,
            prioritize upgrades, and make better use of every Divine Orb.
          </p>

          <ul className="hero-points">
            <li>
              <span aria-hidden="true">☠</span>
              Personalized upgrade priorities
            </li>

            <li>
              <span aria-hidden="true">☠</span>
              Build-strength and weakness reports
            </li>

            <li>
              <span aria-hidden="true">☠</span>
              Recommendations based on your budget
            </li>
          </ul>

          <a className="primary-cta" href="#analyzer">
            Analyze Your Build
          </a>
        </section>

        <section className="analyzer-section" id="analyzer">
          <div className="section-heading">
            <p className="eyebrow">BUILD DOCTOR</p>
            <h2>Find your next best upgrade</h2>
            <p>
              Enter your build information and receive a sample optimization
              roadmap.
            </p>
          </div>

          <form className="analyzer-card" onSubmit={handleAnalyze}>
            <div className="form-group full-width">
              <label htmlFor="build-link">Build link</label>

              <input
                id="build-link"
                type="url"
                value={buildLink}
                onChange={(event) => setBuildLink(event.target.value)}
                placeholder="https://maxroll.gg/poe2/pob/..."
              />

              <p className="field-help">
                Maxroll, Path of Building, or another shareable build link.
              </p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">Upgrade budget</label>

                <div className="budget-input">
                  <input
                    id="budget"
                    type="number"
                    min="0"
                    step="1"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                  />

                  <span>Divine</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="goal">Main goal</label>

                <select
                  id="goal"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                >
                  <option value="balanced">Balanced build</option>
                  <option value="damage">More damage</option>
                  <option value="defense">More survivability</option>
                  <option value="budget">Best budget upgrades</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="error-message" role="alert">
                ☠ {error}
              </p>
            )}

            <div className="form-actions">
              <button
                className="analyze-button"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Analyzing..." : "Analyze Build"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={loadSampleBuild}
                disabled={status === "loading"}
              >
                Load Example
              </button>
            </div>
          </form>

          <div className="results-area" aria-live="polite">
            {status === "idle" && !result && (
              <div className="empty-results">
                <span className="large-skull" aria-hidden="true">
                  ☠
                </span>

                <h3>Your analysis will appear here</h3>

                <p>
                  Enter a build link or use the example build to test the app.
                </p>
              </div>
            )}

            {status === "loading" && (
              <div className="loading-results">
                <div className="loader" aria-hidden="true"></div>
                <h3>Examining your build...</h3>
                <p>Reviewing gear, defenses, damage, and upgrade value.</p>
              </div>
            )}

            {status === "complete" && result && (
              <article className="analysis-report">
                <div className="report-header">
                  <div>
                    <p className="eyebrow">ANALYSIS COMPLETE</p>
                    <h3>{result.title}</h3>
                  </div>

                  <div className="score">
                    <span>{result.score}</span>
                    <small>/100</small>
                    <strong>Grade {result.grade}</strong>
                  </div>
                </div>

                <div className="report-stats">
                  <div className="stat-card">
                    <span>Estimated improvement</span>
                    <strong>{result.improvement}</strong>
                  </div>

                  <div className="stat-card">
                    <span>Available budget</span>
                    <strong>{Number(budget)} Divine</strong>
                  </div>

                  <div className="stat-card">
                    <span>Upgrade focus</span>
                    <strong>{goal[0].toUpperCase() + goal.slice(1)}</strong>
                  </div>
                </div>

                <div className="warning-panel">
                  <span aria-hidden="true">☠</span>

                  <div>
                    <h4>Primary weakness</h4>
                    <p>{result.weakness}</p>
                  </div>
                </div>

                <div className="upgrade-section">
                  <h4>Recommended upgrade order</h4>

                  <div className="upgrade-list">
                    {result.upgrades.map((upgrade) => (
                      <div className="upgrade-item" key={upgrade.priority}>
                        <span className="priority-number">
                          {upgrade.priority}
                        </span>

                        <div className="upgrade-details">
                          <strong>{upgrade.name}</strong>
                          <span>
                            {upgrade.cost} · {upgrade.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="budget-advice">
                  <h4>Budget strategy</h4>
                  <p>{result.budgetMessage}</p>
                </div>

                <p className="demo-notice">
                  This is currently a demonstration report. Real character
                  parsing and AI recommendations will be connected in a later
                  version.
                </p>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={resetAnalysis}
                >
                  Analyze Another Build
                </button>
              </article>
            )}
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">EXILEIQ FEATURES</p>
            <h2>One companion for your entire build</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon" aria-hidden="true">
                ☠
              </span>
              <h3>Build Analysis</h3>
              <p>
                Discover weak equipment slots, missing defenses, and inefficient
                build choices.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon" aria-hidden="true">
                ☠
              </span>
              <h3>Upgrade Planner</h3>
              <p>
                Find the highest-value improvements based on your available
                Divine Orb budget.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon" aria-hidden="true">
                ☠
              </span>
              <h3>Passive Review</h3>
              <p>
                Identify wasted travel points and opportunities to improve your
                passive tree.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon" aria-hidden="true">
                ☠
              </span>
              <h3>Crafting Advisor</h3>
              <p>
                Compare buying an upgrade with crafting one based on cost and
                difficulty.
              </p>
            </article>
          </div>
        </section>

        <section className="roadmap-section" id="roadmap">
          <div>
            <p className="eyebrow">PRODUCT ROADMAP</p>
            <h2>What comes next</h2>
          </div>

          <ol className="roadmap-list">
            <li>
              <span>01</span>
              <div>
                <strong>Interactive prototype</strong>
                <p>Forms, validation, loading states, and sample reports.</p>
              </div>
            </li>

            <li>
              <span>02</span>
              <div>
                <strong>Real build importing</strong>
                <p>Read equipment, gems, passives, and character statistics.</p>
              </div>
            </li>

            <li>
              <span>03</span>
              <div>
                <strong>AI recommendations</strong>
                <p>Generate personalized explanations and upgrade priorities.</p>
              </div>
            </li>

            <li>
              <span>04</span>
              <div>
                <strong>User accounts</strong>
                <p>Save builds, budgets, reports, and upgrade progress.</p>
              </div>
            </li>
          </ol>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span aria-hidden="true">☠</span>
          Exile<span>IQ</span>
        </a>

        <p>
          An independent community project. Not affiliated with or endorsed by
          Grinding Gear Games.
        </p>

        <p>© 2026 ExileIQ</p>
      </footer>
    </div>
  );
}

export default App;