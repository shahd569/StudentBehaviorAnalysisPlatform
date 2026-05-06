import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# تحميل النماذج
behavior_model = pickle.load(open("behavior_model.pkl", "rb"))
sentiment_model = pickle.load(open("sentiment_model.pkl", "rb"))
final_model = pickle.load(open("final_model.pkl", "rb"))

# -----------------------------------
# 🧠 1. Behavior Model
# -----------------------------------
@app.route("/predict-behavior", methods=["POST"])
def predict_behavior():
    data = request.json["features"]

    prediction = behavior_model.predict([data])

    return jsonify({
        "risk": int(prediction[0])
    })


# -----------------------------------
# 💬 2. Sentiment Model
# -----------------------------------
@app.route("/predict-sentiment", methods=["POST"])
def predict_sentiment():
    text = request.json["text"]

    prediction = sentiment_model.predict([text])

    return jsonify({
        "sentiment": int(prediction[0])
    })


# -----------------------------------
# 🧠 3. Final Model
# -----------------------------------
@app.route("/predict-final", methods=["POST"])
def predict_final():
    data = request.json["features"]

    prediction = final_model.predict([data])

    return jsonify({
        "final_status": int(prediction[0])
    })


# تشغيل السيرفر
if __name__ == "__main__":
    app.run(port=5000)