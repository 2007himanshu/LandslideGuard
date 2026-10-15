
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
)

# DEMO DATA ONLY — invented illustrative examples.
# Not suitable for real-world landslide warnings.

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
    X, y, test_size=0.25, random_state=42, stratify=y
)

models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=100, random_state=42
    ),
    "Logistic Regression": LogisticRegression(
        max_iter=1000
    ),
    "Decision Tree": DecisionTreeClassifier(
        random_state=42
    ),
    "Gradient Boosting": GradientBoostingClassifier(
        random_state=42
    ),
    "SVM": SVC(
        kernel="rbf"
    ),
}

results = []
trained_models = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    results.append({
        "Model": name,
        "Accuracy": round(accuracy_score(y_test, predictions), 3),
        "Precision_macro": round(
            precision_score(y_test, predictions,
                            average="macro", zero_division=0), 3
        ),
        "Recall_macro": round(
            recall_score(y_test, predictions,
                         average="macro", zero_division=0), 3
        ),
        "F1_macro": round(
            f1_score(y_test, predictions,
                     average="macro", zero_division=0), 3
        ),
    })

    trained_models[name] = model

    print(f"\n--- {name} ---")
    print(classification_report(
        y_test, predictions, zero_division=0
    ))

comparison = pd.DataFrame(results).sort_values(
    by="F1_macro", ascending=False
)

comparison.to_csv("landslide_model_comparison.csv", index=False)

print("\n=== MODEL COMPARISON (synthetic demo data) ===")
print(comparison.to_string(index=False))
print("\nComparison saved to landslide_model_comparison.csv")
print("Existing landslide_model.joblib was NOT changed.")
print("Demo only — not suitable for real-world warnings.")
