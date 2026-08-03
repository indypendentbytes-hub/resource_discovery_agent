import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";

const INTAKE = [12, 18, 15, 22, 27, 24, 31, 29, 34, 38, 36, 41];
const AGENT = [40, 52, 48, 61, 70, 66, 74, 80, 77, 85, 90, 94];

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

export default function AdminDashboard() {
  const maxI = Math.max(...INTAKE);
  const maxA = Math.max(...AGENT);

  return (
    <div className="dash-page">
      <header className="dash-topbar">
        <div className="dash-brand">
          <BrandLogo className="h-7 w-7" />
          <span>INDYpendent Bytes</span>
          <span className="dash-badge admin">Admin</span>
        </div>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Public</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <div className="dash-shell">
        <div className="dash-kpi-row" style={{ marginBottom: "1rem" }}>
          <div className="dash-kpi">
            <div className="label">Open intakes</div>
            <div className="value">23</div>
            <div className="delta">9 cultivator · 14 land host</div>
          </div>
          <div className="dash-kpi">
            <div className="label">Agent queries (7d)</div>
            <div className="value">312</div>
            <div className="delta">+18% vs prior week</div>
          </div>
          <div className="dash-kpi">
            <div className="label">Stale resources</div>
            <div className="value">8</div>
            <div className="delta down">Needs verification</div>
          </div>
          <div className="dash-kpi">
            <div className="label">Escalations</div>
            <div className="value">3</div>
            <div className="delta down">2 eligibility · 1 zoning</div>
          </div>
        </div>

        <div className="dash-grid">
          <section className="dash-card">
            <h2>Intake pipeline</h2>
            <p className="sub">Monthly cultivator + land host form volume</p>
            <div className="dash-bars-split">
              <div>
                <p className="sub" style={{ marginBottom: 6 }}>Cultivator</p>
                <div className="dash-mini-chart" aria-hidden="true">
                  {INTAKE.map((v, i) => (
                    <div
                      key={`c-${i}`}
                      className="dash-bar"
                      style={{ height: `${Math.max(8, (v / maxI) * 100)}%` }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="sub" style={{ marginBottom: 6 }}>Agent demand</p>
                <div className="dash-mini-chart" aria-hidden="true">
                  {AGENT.map((v, i) => (
                    <div
                      key={`a-${i}`}
                      className="dash-bar alt"
                      style={{ height: `${Math.max(8, (v / maxA) * 100)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <TreeArt />
          </section>

          <section className="dash-card">
            <h2>System health</h2>
            <p className="sub">Operational signals for staff</p>
            <div className="dash-donut-wrap">
              <div
                className="dash-donut"
                style={{
                  background:
                    "conic-gradient(#2db46c 0% 72%, #c65a1e 72% 88%, #74746c 88% 100%)",
                }}
                aria-hidden="true"
              />
              <ul className="dash-legend">
                <li><span className="dash-dot" style={{ background: "#2db46c" }} /> Verified catalog — 72%</li>
                <li><span className="dash-dot" style={{ background: "#c65a1e" }} /> Needs review — 16%</li>
                <li><span className="dash-dot" style={{ background: "#74746c" }} /> Archived / closed — 12%</li>
              </ul>
            </div>
            <TreeArt className="leftish" />
          </section>

          <section className="dash-card" style={{ gridColumn: "1 / -1" }}>
            <h2>Work queue</h2>
            <p className="sub">Items requiring staff attention (sample data)</p>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Land host intake #LH-214</td>
                  <td>Intake</td>
                  <td>Unassigned</td>
                  <td><span className="dash-status warn">New</span></td>
                  <td>Today</td>
                </tr>
                <tr>
                  <td>USDA program link check</td>
                  <td>Catalog</td>
                  <td>Alyssa</td>
                  <td><span className="dash-status warn">Stale</span></td>
                  <td>2d ago</td>
                </tr>
                <tr>
                  <td>Cultivator pathway follow-up</td>
                  <td>Progress</td>
                  <td>Partner</td>
                  <td><span className="dash-status ok">In progress</span></td>
                  <td>Yesterday</td>
                </tr>
                <tr>
                  <td>Zoning escalation — Haughville</td>
                  <td>Escalation</td>
                  <td>Staff</td>
                  <td><span className="dash-status warn">Open</span></td>
                  <td>3d ago</td>
                </tr>
                <tr>
                  <td>Training cohort capacity</td>
                  <td>Resource</td>
                  <td>—</td>
                  <td><span className="dash-status muted">Monitoring</span></td>
                  <td>5d ago</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <p className="dash-footer-note">
          Admin dashboard — internal metrics. Wire to live data / auth before production use.
          Sample numbers only.
        </p>
      </div>
    </div>
  );
}
