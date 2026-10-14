
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import requests

app = Flask(__name__)
CORS(app)

# Load the existing demo model
model = joblib.load("landslide_model.joblib")


@app.route("/")
def home():
    return jsonify({
        "message": "LandslideGuard ML API is running",
        "model_type": "Demo model using synthetic data only",
        "tinyfish_feature": "Web search endpoint available"
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Please send JSON input"}), 400

    try:
        rainfall = float(data["rainfall"])
        slope = float(data["slope"])
        soil_moisture = float(data["soil_moisture"])
    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Send numeric rainfall, slope, and soil_moisture values"
        }), 400

    if not (
        0 <= rainfall <= 500
        and 0 <= slope <= 90
        and 0 <= soil_moisture <= 100
    ):
        return jsonify({
            "error": "Input is outside the accepted demo range"
        }), 400

    features = [[rainfall, slope, soil_moisture]]
    prediction = model.predict(features)[0]

    return jsonify({
        "predicted_demo_category": str(prediction),
        "warning": "Demo output only. Not a real-world landslide warning."
    })


@app.route("/landslide-info", methods=["POST"])
def landslide_info():
    api_key = os.environ.get("TINYFISH_API_KEY")

    if not api_key:
        return jsonify({
            "error": "TinyFish API key is not configured on the server"
        }), 500

    data = request.get_json(silent=True) or {}
    query = data.get(
        "query",
        "recent landslide reports in India"
    )

    if not isinstance(query, str) or not query.strip():
        return jsonify({"error": "Please provide a search query"}), 400

    try:
        response = requests.get(
            "https://api.search.tinyfish.ai",
            headers={"X-API-Key": api_key},
            params={"query": query.strip()},
            timeout=20
        )

        try:
            result = response.json()
        except ValueError:
            return jsonify({
                "error": "TinyFish returned an unexpected response",
                "status_code": response.status_code
            }), 502

        if not response.ok:
            return jsonify({
                "error": "TinyFish API request failed",
                "details": result
            }), response.status_code

        return jsonify({
            "query": query.strip(),
            "results": result,
            "note": (
                "Collected web information is for research only. "
                "It is not a verified landslide warning."
            )
        })

    except requests.RequestException:
        return jsonify({
            "error": "Could not connect to TinyFish"
        }), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)
