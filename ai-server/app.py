# import pickle
import joblib
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# تحميل النماذج
behavior_model = joblib.load("behavior_model.pkl")
sentiment_model = joblib.load("sentiment_model.pkl")
final_model = joblib.load("final_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
# -----------------------------------
# 🧠 1. Behavior Model
# -----------------------------------
@app.route("/predict-behavior", methods=["POST"])
def predict_behavior():
    try:
        data = request.json["features"]
        
        # التأكد من أن البيانات مصفوفة
        if not isinstance(data, list):
            data = [data]
        
        prediction = behavior_model.predict([data])
        
        return jsonify({
            "risk": int(prediction[0])
        })
    except Exception as e:
        print(f"Behavior prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 400


# -----------------------------------
# 💬 2. Sentiment Model
# -----------------------------------
@app.route("/predict-sentiment", methods=["POST"])
def predict_sentiment():
    try:
        text = request.json["text"]
        
        if isinstance(text, list):
            text = " ".join(text)
        
        if not isinstance(text, str):
            text = str(text)
        
        text_vec = vectorizer.transform([text])

        prediction = sentiment_model.predict(text_vec)
        
        return jsonify({
            "sentiment": int(prediction[0])
        })
    except Exception as e:
        print(f"Sentiment prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 400


# -----------------------------------
# 🧠 3. Final Model
# -----------------------------------
@app.route("/predict-final", methods=["POST"])
def predict_final():
    try:
        data = request.json["features"]
        
        # التأكد من أن البيانات مصفوفة
        if not isinstance(data, list):
            data = [data]
        
        prediction = final_model.predict([data])
        
        return jsonify({
            "final_status": int(prediction[0])
        })
    except Exception as e:
        print(f"Final prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 400



@app.route("/predict-progress", methods=["POST"])
def predict_progress():

    try:

        data = request.get_json()

        history = [[
            data["day_1"],
            data["day_2"],
            data["day_3"],
            data["day_4"],
            data["day_5"],
            data["day_6"],
            data["day_7"]
        ]]

        result = explain_prediction(
            model,
            history
        )

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400


# تشغيل السيرفر
if __name__ == "__main__":
    app.run(port=5000)