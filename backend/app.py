
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load the trained demo model
model = joblib.load("landslide_model.joblib")


@app.route("/")
def home():
    return jsonify({
        "message": "LandslideGuard ML API is running",
        "model_type": "Demo model using synthetic data only"
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
        "predicted_demo_category": prediction,
        "warning": "Demo output only. Not a real-world landslide warning."
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
