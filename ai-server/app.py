# app.py
import joblib
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

behavior_model = joblib.load("behavior_model.pkl")
sentiment_model = joblib.load("sentiment_model.pkl")
final_model = joblib.load("final_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
progress = joblib.load("progress_model.pkl")

progress_model = progress  


features = ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7"]

def explain_prediction(model, input_data):
    prediction = model.predict(input_data)[0]
    proba = model.predict_proba(input_data)[0]

    explanation = []
    days_arabic = ["اليوم الأول", "اليوم الثاني", "اليوم الثالث", "اليوم الرابع", "اليوم الخامس", "اليوم السادس", "اليوم السابع"]

    # استخراج مصفوفة تفاعلات الطالب الفعلية الممررة
    student_days = input_data[0]
    total_interactions = sum(student_days)

    # 1. حساب أهمية الميزات مع ربطها بتفاعل الطالب الفعلي لمنع التناقض
    try:
        importance = model.feature_importances_
        sorted_idx = np.argsort(importance)[::-1]
        
        for i in sorted_idx:
            if i < len(days_arabic) and importance[i] > 0.05:
                # ✨ إضافة شرط ذكي: لا تذكر اليوم كسبب إلا إذا كان الطالب قد تفاعل فيه بالفعل!
                if student_days[i] > 0:
                    day_name_ar = days_arabic[i]
                    explanation.append(f"أثرت معدلات التفاعل في ({day_name_ar}) بشكل قوي على تحديد مستوى الطالب.")
    except AttributeError:
        pass

    # 2. تحويل النتيجة الرقمية إلى حالة نصية
    if prediction == 0:
        status = "Good"
    elif prediction == 1:
        status = "Average"
    else:
        status = "At Risk"

    # 3. التحقق من الخمول التام أو الضعف الشديد بناءً على المدخلات الحقيقية
    if total_interactions == 0:
        explanation.clear() # تفريغ أي أسباب مضللة ناتجة عن أوزان النموذج الثابتة
        explanation.append("الطالب خامل تماماً على المنصة ولم يسجل أي تفاعل خلال هذه الفترة.")
        # تعويض التنبؤ يدوياً لحالة الخمول إذا كان النموذج غبياً بسبب الأصفار
        status = "At Risk" 
    elif total_interactions < 3:
        explanation.append("معدل التفاعل الإجمالي للطالب منخفض جداً ويحتاج إلى متابعة.")

    # التحقق من وجود تراجع في الأيام الأخيرة
    if len(student_days) >= 2 and student_days[-1] < student_days[-2]:
        explanation.append("يوجد تراجع ملحوظ في تفاعل الطالب في الأيام الأخيرة مقارنة بما قبلها.")

    # إذا كان الطالب ممتازاً ونشيطاً ولم تظهر أي علامات سلبية
    if total_interactions > 10 and prediction == 0:
        explanation.append("يظهر الطالب نمطاً تعليمياً ممتازاً ومستقراً عبر الجلسات الدراسية.")

    return {
        "prediction": status,
        "confidence": round(float(max(proba)), 2) if total_interactions > 0 else 1.0,
        "reasons": explanation
    }

# -----------------------------------
# الروت الجديد الخاص بالتقدم
# -----------------------------------
# 🧠 الروت المصحح لاستقبال البيانات بالشكل الصحيح من Next.js
@app.route("/predict-progress", methods=["POST"])
def predict_progress():
    try:
        data = request.get_json()
        
        # Next.js يرسل البيانات داخل قائمة باسم features تحتوي على الأيام الـ 5
        # مثال القادم من الفرونت: {"features": [0, 2, 4, 1, 0]}
        if "features" in data:
            raw_features = data["features"]
            # التأكد من أنها مصفوفة ثنائية الأبعاد يتوقعها نموذج السيكيت ليرن
            history = [raw_features]
        else:
            # حل احتياطي في حال أرسلت كأيام منفصلة
            history = [[
                int(data.get("day_1", 0)),
                int(data.get("day_2", 0)),
                int(data.get("day_3", 0)),
                int(data.get("day_4", 0)),
                int(data.get("day_5", 0)),
                int(data.get("day_6", 0)),
                int(data.get("day_7", 0))
            ]]

        # تنفيذ التنبؤ والتفسير بناءً على بيانات الطالب الفعلية
        result = explain_prediction(progress_model, history)
        return jsonify(result)

    except Exception as e:
        print(f"Progress prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 400

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



# @app.route("/predict-progress", methods=["POST"])
# def predict_progress():

#     try:

#         data = request.get_json()

#         history = [[
#             data["day_1"],
#             data["day_2"],
#             data["day_3"],
#             data["day_4"],
#             data["day_5"],
#             data["day_6"],
#             data["day_7"]
#         ]]

#         result = explain_prediction(
#             model,
#             history
#         )

#         return jsonify(result)

#     except Exception as e:

#         return jsonify({
#             "error": str(e)
#         }), 400


# تشغيل السيرفر
if __name__ == "__main__":
    app.run(port=5000)