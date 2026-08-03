import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";

const MONTHLY = [42, 55, 48, 61, 70, 66, 78, 84, 91, 88, 96, 104];
const PATHWAYS = [28, 36, 31, 44, 52, 49, 58];

function TreeArt({ className = "" }) {
  return (
    <svg className={`dash-tree ${className}`} viewBox="0 0 200 220" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="198" rx="48" ry="10" fill="rgba(0,0,0,0.35)" />
      <path d="M100 70c-28 8-48 36-48 70 0 8 1 16 4 23 12-18 28-28 44-28s32 10 44 28c3-7 4-15 4-23 0-34-20-62-48-70z" fill="#1f6b3a" />
      <circle cx="100" cy="78" r="46" fill="#2d9b4e" />
      <circle cx="72" cy="96" r="28" fill="#238b53" />
      <circle cx="128" cy="94" r="30" fill="#35a85a" />
      <circle cx="100" cy="108" r="34" fill="#2db46c" opacity="0.9" />
      <rect x="94" y="120" width="12" height="72" rx="3" fill="#5c4033" />
      <path d="M100 145c-10 4-16 14-16 24" stroke="#3d2a22" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 155c10 5 16 12 18 22" stroke="#3d2a22" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function PublicDashboard() {
  const maxM = Math.max(...MONTHLY);
  const maxP = Math.max(...PATHWAYS);

  return (
    <div className="dash-page">
      <header className="dash-topbar">
        <div className="dash-brand">
          <BrandLogo className="h-7 w-7" />
          <span>INDYpendent Bytes</span>
          <span className="dash-badge">Public</span>
        </div>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <div className="dash-shell">
        <div className="dash-kpi-row" style={{ marginBottom: "1rem" }}>
          <div className="dash-kpi">
            <div className="label">Active pathways</div>
            <div className="value">128</div>
            <div className="delta">+12% this quarter</div>
          </div>
          <div className="dash-kpi">
            <div className="label">Cultivators engaged</div>
            <div className="value">64</div>
            <div className="delta">+8 new</div>
          </div>
          <div className="dash-kpi">
            <div className="label">Land hosts</div>
            <div className="value">37</div>
            <div className="delta">+5 listed</div>
          </div>
          <div className="dash-kpi">
            <div className="label">Resources verified</div>
            <div className="value">214</div>
            <div className="delta">92% fresh</div>
          </div>
        </div>

        <div className="dash-grid">
          <section className="dash-card">
            <h2>Regional activity</h2>
            <p className="sub">Guided resource sessions over the last 12 months</p>
            <div className="dash-chart" aria-hidden="true">
              {MONTHLY.map((v, i) => (
                <div
                  key={i}
                  className="dash-bar"
                  style={{ height: `${Math.max(12, (v / maxM) * 100)}%` }}
                  title={`${v}`}
                />
              ))}
            </div>
            <TreeArt />
          </section>

          <section className="dash-card">
            <h2>Who we serve</h2>
            <p className="sub">Share of pathway participants by role</p>
            <div className="dash-donut-wrap">
              <div className="dash-donut" aria-hidden="true" />
              <ul className="dash-legend">
                <li><span className="dash-dot" style={{ background: "#2db46c" }} /> Cultivators — 42%</li>
                <li><span className="dash-dot" style={{ background: "#435ee5" }} /> Land hosts — 26%</li>
                <li><span className="dash-dot" style={{ background: "#c65a1e" }} /> Buyers / partners — 18%</li>
                <li><span className="dash-dot" style={{ background: "#5c4033" }} /> Community — 14%</li>
              </ul>
            </div>
            <TreeArt className="leftish" />
          </section>

          <section className="dash-card">
            <h2>Pathway momentum</h2>
            <p className="sub">Completed next-steps this week</p>
            <div className="dash-metrics">
              <div className="dash-metric-chip">Intake starts<strong>41</strong></div>
              <div className="dash-metric-chip">Agent matches<strong>96</strong></div>
              <div className="dash-metric-chip">Land connections<strong>12</strong></div>
              <div className="dash-metric-chip">Training referrals<strong>19</strong></div>
            </div>
            <div className="dash-chart" style={{ height: 88, maxWidth: "52%" }} aria-hidden="true">
              {PATHWAYS.map((v, i) => (
                <div
                  key={i}
                  className="dash-bar alt"
                  style={{ height: `${Math.max(10, (v / maxP) * 100)}%` }}
                />
              ))}
            </div>
            <TreeArt />
          </section>

          <section className="dash-card">
            <h2>Community snapshot</h2>
            <p className="sub">Illustrative public metrics — not individual data</p>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Focus</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Land activation</td>
                  <td><span className="dash-status ok">Growing</span></td>
                  <td>+14%</td>
                </tr>
                <tr>
                  <td>Cultivator readiness</td>
                  <td><span className="dash-status ok">Steady</span></td>
                  <td>+6%</td>
                </tr>
                <tr>
                  <td>Resource freshness</td>
                  <td><span className="dash-status warn">Watch</span></td>
                  <td>8 stale</td>
                </tr>
                <tr>
                  <td>Partner coverage</td>
                  <td><span className="dash-status ok">On track</span></td>
                  <td>+3 orgs</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <p className="dash-footer-note">
          Public dashboard — aggregated, non-identifying metrics for regional food system coordination.
        </p>
      </div>
    </div>
  );
}
