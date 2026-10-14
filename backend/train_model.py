
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# DEMO DATA ONLY — these are illustrative, invented examples.
# This model is NOT suitable for real landslide warnings.

data = pd.DataFrame({
    "rainfall": [
        10, 20, 25, 35, 40, 45, 50, 55, 60, 65,
        70, 75, 80, 85, 90, 95, 15, 30, 48, 68,
        78, 88, 22, 42, 58, 73, 82, 92, 33, 63
    ],
    "slope": [
        15, 20, 35, 25, 45, 30, 55, 40, 65, 50,
        70, 60, 80, 75, 85, 90, 45, 55, 25, 80,
        72, 88, 30, 68, 48, 62, 92, 78, 38, 58
    ],
    "soil_moisture": [
        20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
        70, 75, 80, 85, 90, 95, 22, 38, 48, 68,
        82, 92, 28, 42, 58, 72, 86, 88, 33, 62
    ],
    "risk": [
        "Low", "Low", "Low", "Low", "Medium",
        "Low", "Medium", "Medium", "Medium", "Medium",
        "High", "High", "High", "High", "High",
        "High", "Low", "Medium", "Medium", "High",
        "High", "High", "Low", "Medium", "Medium",
        "High", "High", "High", "Low", "Medium"
    ]
})

X = data[["rainfall", "slope", "soil_moisture"]]
y = data["risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("Demo accuracy:", round(accuracy_score(y_test, predictions), 2))
print("\nClassification report:")
print(classification_report(y_test, predictions, zero_division=0))

joblib.dump(model, "landslide_model.joblib")

print("\nModel saved successfully!")
print("Reminder: trained on synthetic demo data only.")
