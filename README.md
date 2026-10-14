# LandslideGuard 🌧️⛰️

**An AI/ML-Based Landslide Risk Monitoring Prototype**

## 📌 Overview

LandslideGuard is a web-based prototype designed to demonstrate landslide risk monitoring using sample environmental conditions. It provides an interactive dashboard, sample monitoring locations, and a demo machine learning prediction feature.

## 🎯 Features

- Interactive dashboard for landslide risk monitoring
- Map displaying sample locations in Uttarakhand and Himachal Pradesh
- Illustrative rainfall and environmental indicators
- Rule-based demo risk assessment
- Python machine learning model for demo predictions
- Flask API connecting the frontend with the ML model
- Responsive user interface

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- CSS
- Leaflet and React-Leaflet

**Backend**
- Python
- Flask
- Flask-CORS

**Machine Learning**
- scikit-learn
- Random Forest Classifier
- Joblib

**Deployment**
- Vercel (frontend)
- Render (backend API)

## ⚙️ Project Workflow

1. The user selects a sample monitoring location and environmental conditions.
2. The frontend sends the selected values to the Flask API.
3. The backend loads the trained demo machine learning model.
4. The model predicts a demo risk category.
5. The frontend displays the model output.

## 🚀 Live Demo

**Frontend:** https://landslide-guard-eight.vercel.app/

**Backend API:** https://landslideguard-g6e9.onrender.com/

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/2007himanshu/LandslideGuard.git
cd LandslideGuard
```

### 2. Run the frontend

```bash
npm install
npm run dev
```

### 3. Set up the backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors scikit-learn joblib
```

### 4. Train the demo model

```bash
python train_model.py
```

### 5. Start the backend API

```bash
python app.py
```

The local API runs at `http://127.0.0.1:5000`.

## ⚠️ Important Disclaimer

LandslideGuard is an educational and hackathon prototype. Its model uses synthetic demo data, and the dashboard uses illustrative sample values. Predictions are not scientifically validated and must not be used for real-world emergency decisions or official landslide warnings.

## 👨‍💻 Author

Himanshu

