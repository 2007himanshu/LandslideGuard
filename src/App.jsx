import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const locations = [
  {
    name: "Chamoli",
    state: "Uttarakhand",
    risk: "High",
    rain: 86,
    slope: 72,
    position: [30.402, 79.320],
  },
  {
    name: "Rudraprayag",
    state: "Uttarakhand",
    risk: "Medium",
    rain: 54,
    slope: 61,
    position: [30.285, 78.981],
  },
  {
    name: "Mandi",
    state: "Himachal Pradesh",
    risk: "High",
    rain: 79,
    slope: 83,
    position: [31.708, 76.932],
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    risk: "Low",
    rain: 24,
    slope: 38,
    position: [31.104, 77.173],
  },
];

function MapFocus({ position }) {
  const map = useMap();
  map.setView(position, 8);
  return null;
}

function App() {
  const [selected, setSelected] = useState(locations[0]);
  const [rainfall, setRainfall] = useState(locations[0].rain);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");

  function selectLocation(name) {
    const location = locations.find((item) => item.name === name);
    if (location) {
      setSelected(location);
      setRainfall(location.rain);
      setMlPrediction(null);
      setMlError("");
    }
  }

  function calculateRisk() {
    if (rainfall >= 75 && selected.slope >= 65) return "High";
    if (rainfall >= 40 || selected.slope >= 60) return "Medium";
    return "Low";
  }

  async function predictWithModel() {
    setMlLoading(true);
    setMlError("");
    setMlPrediction(null);

    try {
      const response = await fetch("https://landslideguard-g6e9.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rainfall,
          slope: selected.slope,
          soil_moisture: 60,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Prediction request failed");
      }

      setMlPrediction(result);
    } catch (error) {
      setMlError(
        "API se connect nahi ho paya. Check karo ki Flask server running hai (http://127.0.0.1:5000)."
      );
    } finally {
      setMlLoading(false);
    }
  }

  const risk = calculateRisk();

  const riskColors = {
    High: "#ff626c",
    Medium: "#ffbd4a",
    Low: "#43d9a3",
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">⛰️</span>
          <div>
            <h2>LandslideGuard</h2>
            <p>AI RISK INTELLIGENCE</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ &nbsp; Overview</div>
        <div className="nav-item">⌖ &nbsp; Risk Explorer</div>
        <div className="nav-item">◷ &nbsp; Monitoring</div>
        <div className="nav-item">▤ &nbsp; Data &amp; Reports</div>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          Prototype environment
          <p>Decision support · Demo only</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">DISASTER INTELLIGENCE / INDIA</p>
            <h1>Landslide Risk Dashboard</h1>
          </div>
          <div className="live-badge">
            <span />
            DEMO MODE
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">TERRAIN MONITORING SYSTEM</p>
            <h2>
              Understand the terrain.
              <br />
              Anticipate the risk.
            </h2>
            <p>
              Explore mountain-region sample data and learn how rainfall and
              terrain slope can influence landslide susceptibility.
            </p>
          </div>
          <div className="mountain-art" aria-hidden="true">🏔️</div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span>REGIONS IN DEMO</span>
            <strong>04</strong>
            <small>Sample locations</small>
          </article>

          <article className="stat-card">
            <span>HIGH-RISK SAMPLES</span>
            <strong>{locations.filter((item) => item.risk === "High").length}</strong>
            <small>Illustrative classifications</small>
          </article>

          <article className="stat-card">
            <span>DATA STATUS</span>
            <strong className="data-status">DEMO</strong>
            <small>No live sensors connected</small>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel map-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">REGIONAL EXPLORER</p>
                <h3>Mountain Risk Overview</h3>
              </div>
              <span className="tag">SAMPLE DATA</span>
            </div>

            <div className="region-list">
              {locations.map((location) => (
                <button
                  key={location.name}
                  className={`region ${selected.name === location.name ? "selected" : ""}`}
                  onClick={() => selectLocation(location.name)}
                  type="button"
                >
                  <span className="region-pin">⌖</span>
                  <span className="region-info">
                    <strong>{location.name}</strong>
                    <small>{location.state}</small>
                  </span>
                  <span className={`risk-pill ${location.risk.toLowerCase()}`}>
                    {location.risk}
                  </span>
                </button>
              ))}
            </div>

            <div className="interactive-map">
              <MapContainer
                center={selected.position}
                zoom={7}
                scrollWheelZoom
                className="leaflet-map"
              >
                <MapFocus position={selected.position} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location) => (
                  <CircleMarker
                    key={location.name}
                    center={location.position}
                    radius={selected.name === location.name ? 12 : 8}
                    pathOptions={{
                      color: riskColors[location.risk],
                      fillColor: riskColors[location.risk],
                      fillOpacity: 0.8,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => selectLocation(location.name),
                    }}
                  >
                    <Popup>
                      <strong>{location.name}</strong>
                      <br />
                      {location.state}
                      <br />
                      Demo category: {location.risk}
                      <br />
                      <small>Illustrative data only</small>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            <p className="map-note">
              Select a region or marker to explore it. Map markers show
              illustrative categories, not verified danger levels.
            </p>
          </article>

          <article className="panel analysis-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">RISK SIMULATOR</p>
                <h3>Explore Conditions</h3>
              </div>
              <span className="slider-icon">⌁</span>
            </div>

            <label className="field-label" htmlFor="location">
              MONITORING LOCATION
            </label>
            <select
              id="location"
              value={selected.name}
              onChange={(event) => selectLocation(event.target.value)}
            >
              {locations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}, {location.state}
                </option>
              ))}
            </select>

            <div className="rain-heading">
              <label className="field-label" htmlFor="rainfall">
                RAINFALL INDEX
              </label>
              <strong>{rainfall}/100</strong>
            </div>

            <input
              id="rainfall"
              type="range"
              min="0"
              max="100"
              value={rainfall}
              onChange={(event) => {
                setRainfall(Number(event.target.value));
                setMlPrediction(null);
                setMlError("");
              }}
            />

            <div className="range-labels">
              <span>Lower</span>
              <span>Higher</span>
            </div>

            <div className="factor">
              <span>Terrain slope index</span>
              <strong>{selected.slope}/100</strong>
            </div>
            <div className="progress">
              <div style={{ width: `${selected.slope}%` }} />
            </div>

            <div className={`result ${risk.toLowerCase()}`}>
              <span>RULE-BASED DEMO RESULT</span>
              <strong>{risk} Risk</strong>
              <p>
                {risk === "High"
                  ? "Elevated demo indicators. Verify using authoritative data."
                  : risk === "Medium"
                  ? "Some demo indicators are elevated. Further assessment is needed."
                  : "Lower demo indicators do not mean zero landslide risk."}
              </p>
            </div>

            <p className="disclaimer">
              This simulator uses illustrative values and simple rules. The
              rule-based result above is separate from the trained demo ML model.
            </p>

            <div className="ml-demo">
              <p className="eyebrow">PYTHON MODEL CONNECTION</p>
              <h3>AI/ML Demo Prediction</h3>
              <p>
                Send the selected sample conditions to your Flask API and view
                the model's output.
              </p>

              <button
                className="ml-predict-button"
                onClick={predictWithModel}
                disabled={mlLoading}
                type="button"
              >
                {mlLoading ? "Predicting..." : "Run ML Prediction"}
              </button>

              {mlError && (
                <p className="ml-error" role="alert">
                  {mlError}
                </p>
              )}

              {mlPrediction && (
                <div className="ml-output" aria-live="polite">
                  <span>MODEL OUTPUT · DEMO ONLY</span>
                  <h3>{mlPrediction.predicted_demo_category} Category</h3>
                  <p>{mlPrediction.warning}</p>
                </div>
              )}
            </div>
          </article>
        </section>

        <footer>
          <span>LANDSLIDEGUARD · HACKATHON MVP</span>
          <span>Research prototype · Not an official warning service</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
