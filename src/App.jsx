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
  const [level, setLevel] = useState("90");
  const [life, setLife] = useState("2500");
  const [energyShield, setEnergyShield] = useState("0");
  const [fireResistance, setFireResistance] = useState("75");
  const [coldResistance, setColdResistance] = useState("75");
  const [lightningResistance, setLightningResistance] = useState("75");
  const [chaosResistance, setChaosResistance] = useState("0");
  const [dps, setDps] = useState("100000");
 function createAnalysis() {
  const template = analysisTemplates[goal];

  const numericBudget = Number(budget);
  const numericLevel = Number(level);
  const numericLife = Number(life);
  const numericEnergyShield = Number(energyShield);
  const numericFireResistance = Number(fireResistance);
  const numericColdResistance = Number(coldResistance);
  const numericLightningResistance = Number(lightningResistance);
  const numericChaosResistance = Number(chaosResistance);
  const numericDps = Number(dps);

  let buildScore = 100;
  const weaknesses = [];
  const recommendations = [];

  const totalEffectiveHealth = numericLife + numericEnergyShield;

  if (numericLevel >= 80 && totalEffectiveHealth < 2500) {
    buildScore -= 18;
    weaknesses.push(
      `Your combined life and energy shield is only ${totalEffectiveHealth.toLocaleString()}, which is low for higher-level content.`,
    );

    recommendations.push({
      name: "Increase life or energy shield",
      cost: "Low–Medium cost",
      impact: "High impact",
    });
  } else if (numericLevel >= 80 && totalEffectiveHealth < 3500) {
    buildScore -= 10;
    weaknesses.push(
      `Your combined life and energy shield is ${totalEffectiveHealth.toLocaleString()}, which may feel weak in endgame content.`,
    );

    recommendations.push({
      name: "Improve your primary defensive pool",
      cost: "Medium cost",
      impact: "High impact",
    });
  }

  const elementalResistances = [
    {
      name: "Fire",
      value: numericFireResistance,
    },
    {
      name: "Cold",
      value: numericColdResistance,
    },
    {
      name: "Lightning",
      value: numericLightningResistance,
    },
  ];

  elementalResistances.forEach((resistance) => {
    if (resistance.value < 75) {
      const missingAmount = 75 - resistance.value;

      buildScore -= Math.min(15, Math.ceil(missingAmount / 3));

      weaknesses.push(
        `${resistance.name} resistance is ${missingAmount}% below the 75% target.`,
      );

      recommendations.push({
        name: `Increase ${resistance.name.toLowerCase()} resistance`,
        cost: "Low cost",
        impact: "High impact",
      });
    }
  });

  if (numericChaosResistance < 0) {
    buildScore -= 15;

    weaknesses.push(
      `Chaos resistance is ${numericChaosResistance}%, leaving you vulnerable to chaos damage.`,
    );

    recommendations.push({
      name: "Raise chaos resistance above 0%",
      cost: "Low–Medium cost",
      impact: "High impact",
    });
  } else if (numericChaosResistance < 40) {
    buildScore -= 6;

    weaknesses.push(
      `Chaos resistance is only ${numericChaosResistance}%. Improving it would make the build safer.`,
    );

    recommendations.push({
      name: "Improve chaos resistance",
      cost: "Medium cost",
      impact: "Medium impact",
    });
  }

  if (numericLevel >= 80 && numericDps < 50000) {
    buildScore -= 15;

    weaknesses.push(
      `Estimated DPS is ${numericDps.toLocaleString()}, which may be low for endgame bosses.`,
    );

    recommendations.push({
      name: "Upgrade your weapon, gems, or damage multipliers",
      cost: "Medium–High cost",
      impact: "High impact",
    });
  } else if (numericLevel >= 80 && numericDps < 100000) {
    buildScore -= 7;

    weaknesses.push(
      `Estimated DPS is ${numericDps.toLocaleString()}. Damage upgrades may improve clear speed and bossing.`,
    );

    recommendations.push({
      name: "Improve damage scaling",
      cost: "Medium cost",
      impact: "Medium impact",
    });
  }

  if (goal === "damage" && numericDps < 150000) {
    buildScore -= 5;

    recommendations.push({
      name: "Prioritize your highest-value damage upgrade",
      cost:
        numericBudget <= 2
          ? "Low cost"
          : `${Math.max(1, Math.round(numericBudget * 0.5))} Divine`,
      impact: "High impact",
    });
  }

  if (goal === "defense" && totalEffectiveHealth < 4000) {
    buildScore -= 5;

    recommendations.push({
      name: "Invest more heavily in survivability",
      cost:
        numericBudget <= 2
          ? "Low cost"
          : `${Math.max(1, Math.round(numericBudget * 0.4))} Divine`,
      impact: "High impact",
    });
  }

  buildScore = Math.max(0, Math.min(100, buildScore));

  const fallbackRecommendations = [
    {
      name: template.firstUpgrade,
      cost:
        numericBudget <= 2
          ? "Low cost"
          : `${Math.max(1, Math.round(numericBudget * 0.5))} Divine`,
      impact: "High impact",
    },
    {
      name: template.secondUpgrade,
      cost:
        numericBudget <= 2
          ? "Low cost"
          : `${Math.max(1, Math.round(numericBudget * 0.3))} Divine`,
      impact: "Medium impact",
    },
    {
      name: template.thirdUpgrade,
      cost: "Free–Low cost",
      impact: "Medium impact",
    },
  ];

  const finalRecommendations = [...recommendations];

  fallbackRecommendations.forEach((recommendation) => {
    if (
      finalRecommendations.length < 3 &&
      !finalRecommendations.some(
        (existing) => existing.name === recommendation.name,
      )
    ) {
      finalRecommendations.push(recommendation);
    }
  });

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
            : buildScore >= 60
              ? "C"
              : "D",

    title: template.title,

    improvement:
      weaknesses.length === 0
        ? "No major weaknesses detected"
        : `${weaknesses.length} improvement areas found`,

    weakness:
      weaknesses.length > 0
        ? weaknesses[0]
        : "Your entered stats do not show any major weaknesses.",

    weaknesses,

    upgrades: finalRecommendations
      .slice(0, 3)
      .map((upgrade, index) => ({
        priority: index + 1,
        ...upgrade,
      })),

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

  setLevel("88");
  setLife("2300");
  setEnergyShield("250");
  setFireResistance("75");
  setColdResistance("63");
  setLightningResistance("75");
  setChaosResistance("-18");
  setDps("72000");

  setError("");
  setResult(null);
  setStatus("idle");
}

  function resetAnalysis() {
  setBuildLink("");
  setBudget("5");
  setGoal("balanced");

  setLevel("90");
  setLife("2500");
  setEnergyShield("0");
  setFireResistance("75");
  setColdResistance("75");
  setLightningResistance("75");
  setChaosResistance("0");
  setDps("100000");

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
            <div className="stats-heading">
              <h4>Character stats </h4>
              <p> Enter your current in-game values.</p>
            </div>

            <div className="form-row">
             <div className="form-group">
               <label htmlFor="level">Character level</label>
                <input
      id="level"
      type="number"
      min="1"
      max="100"
      value={level}
      onChange={(event) => setLevel(event.target.value)}
    />
  </div>

  <div className="form-group">
    <label htmlFor="life">Life</label>
    <input
      id="life"
      type="number"
      min="0"
      value={life}
      onChange={(event) => setLife(event.target.value)}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-group">
    <label htmlFor="energy-shield">Energy shield</label>
    <input
      id="energy-shield"
      type="number"
      min="0"
      value={energyShield}
      onChange={(event) => setEnergyShield(event.target.value)}
    />
  </div>

  <div className="form-group">
    <label htmlFor="dps">Estimated DPS</label>
    <input
      id="dps"
      type="number"
      min="0"
      value={dps}
      onChange={(event) => setDps(event.target.value)}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-group">
    <label htmlFor="fire-resistance">Fire resistance</label>
    <input
      id="fire-resistance"
      type="number"
      value={fireResistance}
      onChange={(event) => setFireResistance(event.target.value)}
    />
  </div>

  <div className="form-group">
    <label htmlFor="cold-resistance">Cold resistance</label>
    <input
      id="cold-resistance"
      type="number"
      value={coldResistance}
      onChange={(event) => setColdResistance(event.target.value)}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-group">
    <label htmlFor="lightning-resistance">
      Lightning resistance
    </label>
    <input
      id="lightning-resistance"
      type="number"
      value={lightningResistance}
      onChange={(event) => setLightningResistance(event.target.value)}
    />
  </div>

  <div className="form-group">
    <label htmlFor="chaos-resistance">Chaos resistance</label>
    <input
      id="chaos-resistance"
      type="number"
      value={chaosResistance}
      onChange={(event) => setChaosResistance(event.target.value)}
    />
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

<div className="character-summary">
  <h4>Character stat summary</h4>

  <div className="summary-grid">
    <div className="summary-item">
      <span>Life + Energy Shield</span>
      <strong>{Number(life) + Number(energyShield)}</strong>
      <small>
        {Number(life) + Number(energyShield) >= 3500
          ? "Strong"
          : Number(life) + Number(energyShield) >= 2500
            ? "Needs improvement"
            : "Critical"}
      </small>
    </div>

    <div className="summary-item">
      <span>Fire Resistance</span>
      <strong>{fireResistance}%</strong>
      <small>
        {Number(fireResistance) >= 75 ? "Capped" : "Below target"}
      </small>
    </div>

    <div className="summary-item">
      <span>Cold Resistance</span>
      <strong>{coldResistance}%</strong>
      <small>
        {Number(coldResistance) >= 75 ? "Capped" : "Below target"}
      </small>
    </div>

    <div className="summary-item">
      <span>Lightning Resistance</span>
      <strong>{lightningResistance}%</strong>
      <small>
        {Number(lightningResistance) >= 75 ? "Capped" : "Below target"}
      </small>
    </div>

    <div className="summary-item">
      <span>Chaos Resistance</span>
      <strong>{chaosResistance}%</strong>
      <small>
        {Number(chaosResistance) < 0
          ? "Critical"
          : Number(chaosResistance) < 40
            ? "Needs improvement"
            : "Strong"}
      </small>
    </div>

    <div className="summary-item">
      <span>Estimated DPS</span>
      <strong>{Number(dps).toLocaleString()}</strong>
      <small>
        {Number(dps) >= 150000
          ? "Strong"
          : Number(dps) >= 100000
            ? "Moderate"
            : "Needs improvement"}
      </small>
    </div>
  </div>
</div>

<div className="warning-panel">
                  <span aria-hidden="true">☠</span>

                  <div>
                    <h4>Detected weaknesses</h4>

                    <ul className="weakness-list">
                    {result.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
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