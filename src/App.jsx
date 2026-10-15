
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const API_BASE = "https://landslideguard-g6e9.onrender.com";

const locations = [
  {
    name: "Chamoli",
    state: "Uttarakhand",
    risk: "High",
    rain: 86,
    slope: 72,
    position: [30.402, 79.32],
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

const modelResults = [
  { name: "Random Forest", accuracy: 100, precision: 100, recall: 100, f1: 100 },
  { name: "Decision Tree", accuracy: 100, precision: 100, recall: 100, f1: 100 },
  { name: "SVM", accuracy: 100, precision: 100, recall: 100, f1: 100 },
  { name: "Logistic Regression", accuracy: 87.5, precision: 88.9, recall: 88.9, f1: 86.7 },
  { name: "Gradient Boosting", accuracy: 87.5, precision: 88.9, recall: 88.9, f1: 86.7 },
];

const riskColors = {
  High: "#dc2626",
  Medium: "#d97706",
  Low: "#059669",
};

function MapFocus({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 8);
  }, [map, position]);

  return null;
}

function App() {
  const [selected, setSelected] = useState(locations[0]);
  const [rainfall, setRainfall] = useState(locations[0].rain);

  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");

  const [searchQuery, setSearchQuery] = useState(
    "recent landslide reports in India"
  );
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  function selectLocation(name) {
    const location = locations.find((item) => item.name === name);

    if (!location) return;

    setSelected(location);
    setRainfall(location.rain);
    setMlPrediction(null);
    setMlError("");
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
      const response = await fetch(`${API_BASE}/predict`, {
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
        throw new Error(result.error || "Prediction request failed.");
      }

      setMlPrediction(result);
    } catch (error) {
      setMlError(
        error.message || "Could not connect to the demo prediction API."
      );
    } finally {
      setMlLoading(false);
    }
  }

  async function searchLandslideInfo(event) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      setSearchError("Please enter a search query.");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const response = await fetch(`${API_BASE}/landslide-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Search request failed (${response.status}).`
        );
      }

      setSearchResults(result);
    } catch (error) {
      setSearchError(
        error.message || "Could not retrieve web information. Try again."
      );
    } finally {
      setSearchLoading(false);
    }
  }

  const risk = calculateRisk();

  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href="#overview">
          <span className="brand-icon">⛰️</span>
          <span>
            <strong>LandslideGuard</strong>
            <small>AI RISK INTELLIGENCE</small>
          </span>
        </a>

        <p className="nav-label">WORKSPACE</p>
        <a className="nav-item active" href="#overview">▦ &nbsp; Overview</a>
        <a className="nav-item" href="#explorer">⌖ &nbsp; Risk Explorer</a>
        <a className="nav-item" href="#prediction">◷ &nbsp; ML Prediction</a>
        <a className="nav-item" href="#comparison">▤ &nbsp; Model Reports</a>
        <a className="nav-item" href="#research">⌕ &nbsp; Web Research</a>

        <div className="sidebar-bottom">
          <span className="status-dot" />
          Prototype environment
          <p>Decision support · Demo only</p>
        </div>
      </aside>

      <main className="main" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">DISASTER INTELLIGENCE / INDIA</p>
            <h1>Landslide Risk Dashboard</h1>
            <p className="subheading">
              Explore sample terrain conditions and ML demo predictions.
            </p>
          </div>
          <span className="live-badge">
            <span /> DEMO MODE
          </span>
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
              Explore illustrative mountain-region data and learn how rainfall
              and terrain slope can influence landslide susceptibility.
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
            <small>Illustrative categories</small>
          </article>
          <article className="stat-card">
            <span>DATA STATUS</span>
            <strong className="data-status">DEMO</strong>
            <small>No live sensors connected</small>
          </article>
        </section>

        <section className="panel search-panel" id="research">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">TINYFISH WEB SEARCH</p>
              <h3>Landslide Information</h3>
            </div>
            <span className="tag">WEB RESEARCH</span>
          </div>

          <p className="body-copy">
            Search for publicly available landslide reports and related
            information for research and exploration.
          </p>

          <form onSubmit={searchLandslideInfo} className="search-form">
            <label className="field-label" htmlFor="landslide-query">
              SEARCH QUERY
            </label>
            <div className="search-row">
              <input
                id="landslide-query"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="e.g. landslide reports in Uttarakhand"
                required
              />
              <button
                className="primary-button"
                type="submit"
                disabled={searchLoading}
              >
                {searchLoading ? "Searching..." : "Search Web"}
              </button>
            </div>
          </form>

          {searchError && <p className="error-message" role="alert">{searchError}</p>}

          {searchResults && (
            <div className="response-box" aria-live="polite">
              <span className="response-label">WEB SEARCH RESPONSE</span>
              <h3>Results for: {searchResults.query || searchQuery}</h3>
              <pre className="response-data">
                {JSON.stringify(searchResults.results, null, 2)}
              </pre>
              {searchResults.note && <p>{searchResults.note}</p>}
            </div>
          )}

          <p className="disclaimer">
            Web results are for research only. They are not verified emergency
            alerts or official landslide warnings.
          </p>
        </section>

        <section className="content-grid" id="explorer">
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
              Select a region or marker to explore it. Markers show illustrative
              categories, not verified danger levels.
            </p>
          </article>

          <article className="panel analysis-panel" id="prediction">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">RISK SIMULATOR</p>
                <h3>Explore Conditions</h3>
              </div>
              <span className="tag">INTERACTIVE</span>
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
              This simulator uses illustrative values and simple rules. Its
              result is separate from the trained demo ML model.
            </p>

            <div className="ml-demo">
              <p className="eyebrow">PYTHON MODEL CONNECTION</p>
              <h3>AI/ML Demo Prediction</h3>
              <p className="body-copy">
                Run the connected backend model using the selected sample
                conditions.
              </p>

              <button
                className="primary-button full-button"
                onClick={predictWithModel}
                disabled={mlLoading}
                type="button"
              >
                {mlLoading ? "Predicting..." : "Run ML Prediction"}
              </button>

              {mlError && <p className="error-message" role="alert">{mlError}</p>}

              {mlPrediction && (
                <div className="response-box" aria-live="polite">
                  <span className="response-label">MODEL OUTPUT · DEMO ONLY</span>
                  <h3>
                    {mlPrediction.predicted_demo_category || "Prediction"} Category
                  </h3>
                  {mlPrediction.warning && <p>{mlPrediction.warning}</p>}
                  <pre className="response-data">
                    {JSON.stringify(mlPrediction, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="panel model-comparison" id="comparison">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">MODEL EVALUATION</p>
              <h3>ML Model Comparison</h3>
            </div>
            <span className="tag">SYNTHETIC DATA</span>
          </div>

          <p className="body-copy">
            Demo evaluation on 8 held-out samples from a synthetic dataset.
            These scores do not represent real-world landslide prediction
            performance.
          </p>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-score</th>
                </tr>
              </thead>
              <tbody>
                {modelResults.map((model) => (
                  <tr key={model.name}>
                    <td>{model.name}</td>
                    <td>{model.accuracy.toFixed(1)}%</td>
                    <td>{model.precision.toFixed(1)}%</td>
                    <td>{model.recall.toFixed(1)}%</td>
                    <td>{model.f1.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="disclaimer">
            Results may change with a different dataset or split. No model shown
            here is validated for operational warnings or emergency decisions.
          </p>
        </section>

        <footer>
          <span>LANDSLIDEGUARD</span>
          <span>Research prototype · Not an official warning service</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
