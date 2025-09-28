from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()

def calculate_risk(disease: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate risk score for given disease and input data.
    This is a rule-based fallback implementation.
    In production, this would call an ML model service.
    """
    
    if disease == "diabetes":
        return calculate_diabetes_risk(data)
    elif disease == "hypertension":
        return calculate_hypertension_risk(data)
    elif disease == "heart":
        return calculate_heart_risk(data)
    else:
        raise ValueError(f"Unknown disease: {disease}")

def calculate_diabetes_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate diabetes risk using rule-based approach"""
    risk_score = 0.0
    risk_factors = []
    
    # Age factor
    age = data.get("age", 0)
    if age > 65:
        risk_score += 0.25
        risk_factors.append("العمر فوق 65 سنة")
    elif age > 45:
        risk_score += 0.15
        risk_factors.append("العمر فوق 45 سنة")
    
    # BMI factor
    weight = data.get("weight", 0)
    height = data.get("height", 0)
    if weight and height:
        bmi = weight / ((height / 100) ** 2)
        if bmi > 30:
            risk_score += 0.20
            risk_factors.append("السمنة (BMI > 30)")
        elif bmi > 25:
            risk_score += 0.10
            risk_factors.append("زيادة الوزن (BMI > 25)")
    
    # Lab values
    fasting_glucose = data.get("fastingGlucose")
    if fasting_glucose and fasting_glucose != "unknown":
        glucose_val = float(fasting_glucose)
        if glucose_val >= 126:
            risk_score += 0.40
            risk_factors.append("سكر الصيام مرتفع (≥126)")
        elif glucose_val >= 100:
            risk_score += 0.20
            risk_factors.append("سكر الصيام حدودي (100-125)")
    
    hba1c = data.get("hba1c")
    if hba1c and hba1c != "unknown":
        hba1c_val = float(hba1c)
        if hba1c_val >= 6.5:
            risk_score += 0.35
            risk_factors.append("HbA1c مرتفع (≥6.5%)")
        elif hba1c_val >= 5.7:
            risk_score += 0.15
            risk_factors.append("HbA1c حدودي (5.7-6.4%)")
    
    # Family history
    if data.get("familyHistory") == "نعم":
        risk_score += 0.15
        risk_factors.append("تاريخ عائلي للسكري")
    
    # Lifestyle factors
    if data.get("exercise") == "لا أمارس":
        risk_score += 0.10
        risk_factors.append("قلة النشاط البدني")
    
    if data.get("smoking") == "نعم":
        risk_score += 0.10
        risk_factors.append("التدخين")
    
    # Cap at 1.0
    risk_score = min(risk_score, 1.0)
    
    # Determine risk bucket
    if risk_score < 0.3:
        risk_bucket = "low"
        risk_level = "منخفض"
    elif risk_score < 0.6:
        risk_bucket = "medium"
        risk_level = "متوسط"
    else:
        risk_bucket = "high"
        risk_level = "عالي"
    
    # Generate recommendations
    recommendations = generate_diabetes_recommendations(risk_score, risk_factors, data)
    
    return {
        "risk_score": risk_score,
        "risk_bucket": risk_bucket,
        "risk_level": risk_level,
        "model_version": "rule_based_v1.0",
        "clinical_data": {
            "pred_class": "positive" if risk_score > 0.5 else "negative",
            "decision_threshold": 0.5,
            "calibration_method": "none",
            "pre_diabetes_flag": risk_score > 0.3 and risk_score < 0.6
        },
        "recommendations": recommendations,
        "risk_factors": risk_factors
    }

def calculate_hypertension_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate hypertension risk"""
    risk_score = 0.0
    risk_factors = []
    
    # Blood pressure readings
    bp_readings = data.get("bpReadings", [])
    if bp_readings:
        systolic_values = []
        diastolic_values = []
        
        for reading in bp_readings:
            if reading.get("systolic") and reading.get("diastolic"):
                systolic_values.append(int(reading["systolic"]))
                diastolic_values.append(int(reading["diastolic"]))
        
        if systolic_values and diastolic_values:
            avg_systolic = sum(systolic_values) / len(systolic_values)
            avg_diastolic = sum(diastolic_values) / len(diastolic_values)
            
            if avg_systolic >= 180 or avg_diastolic >= 110:
                risk_score += 0.50
                risk_factors.append("ضغط الدم مرتفع جداً")
            elif avg_systolic >= 140 or avg_diastolic >= 90:
                risk_score += 0.35
                risk_factors.append("ضغط الدم مرتفع")
            elif avg_systolic >= 130 or avg_diastolic >= 80:
                risk_score += 0.20
                risk_factors.append("ضغط الدم حدودي")
    
    # Age and gender
    age = data.get("age", 0)
    gender = data.get("gender", "")
    if age > 65:
        risk_score += 0.20
        risk_factors.append("العمر فوق 65 سنة")
    elif age > 45:
        risk_score += 0.10
        risk_factors.append("العمر فوق 45 سنة")
    
    # Lifestyle factors
    if data.get("salt") == "كثير":
        risk_score += 0.15
        risk_factors.append("استهلاك ملح عالي")
    
    if data.get("exercise") == "لا أمارس":
        risk_score += 0.15
        risk_factors.append("قلة النشاط البدني")
    
    if data.get("smoking") == "نعم":
        risk_score += 0.15
        risk_factors.append("التدخين")
    
    if data.get("familyHistory") == "نعم":
        risk_score += 0.15
        risk_factors.append("تاريخ عائلي لضغط الدم")
    
    risk_score = min(risk_score, 1.0)
    
    # Determine risk bucket
    if risk_score < 0.3:
        risk_bucket = "low"
    elif risk_score < 0.6:
        risk_bucket = "medium"
    else:
        risk_bucket = "high"
    
    recommendations = generate_hypertension_recommendations(risk_score, risk_factors, data)
    
    return {
        "risk_score": risk_score,
        "risk_bucket": risk_bucket,
        "model_version": "rule_based_v1.0",
        "clinical_data": {
            "systolic_mmhg": int(bp_readings[0]["systolic"]) if bp_readings and bp_readings[0].get("systolic") else None,
            "diastolic_mmhg": int(bp_readings[0]["diastolic"]) if bp_readings and bp_readings[0].get("diastolic") else None,
            "medications": data.get("medications")
        },
        "recommendations": recommendations,
        "risk_factors": risk_factors
    }

def calculate_heart_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate heart disease risk"""
    risk_score = 0.0
    risk_factors = []
    
    # Age and gender
    age = data.get("age", 0)
    gender = data.get("gender", "")
    if gender == "ذكر" and age > 55:
        risk_score += 0.20
        risk_factors.append("ذكر فوق 55 سنة")
    elif gender == "أنثى" and age > 65:
        risk_score += 0.20
        risk_factors.append("أنثى فوق 65 سنة")
    
    # Cholesterol levels
    cholesterol = data.get("cholesterol")
    if cholesterol and cholesterol != "unknown":
        chol_val = float(cholesterol)
        if chol_val > 240:
            risk_score += 0.25
            risk_factors.append("كوليسترول مرتفع (>240)")
        elif chol_val > 200:
            risk_score += 0.15
            risk_factors.append("كوليسترول حدودي (200-240)")
    
    ldl = data.get("ldl")
    if ldl and ldl != "unknown":
        ldl_val = float(ldl)
        if ldl_val > 160:
            risk_score += 0.20
            risk_factors.append("LDL مرتفع (>160)")
        elif ldl_val > 130:
            risk_score += 0.10
            risk_factors.append("LDL حدودي (130-160)")
    
    hdl = data.get("hdl")
    if hdl and hdl != "unknown":
        hdl_val = float(hdl)
        if hdl_val < 40:
            risk_score += 0.15
            risk_factors.append("HDL منخفض (<40)")
    
    # Lifestyle factors
    if data.get("smoking") == "نعم":
        risk_score += 0.25
        risk_factors.append("التدخين")
    
    if data.get("exercise") == "لا أمارس":
        risk_score += 0.15
        risk_factors.append("قلة النشاط البدني")
    
    if data.get("familyHistory") == "نعم":
        risk_score += 0.20
        risk_factors.append("تاريخ عائلي لأمراض القلب")
    
    # Diabetes status
    if data.get("diabetesStatus") in ["نوع 1", "نوع 2"]:
        risk_score += 0.20
        risk_factors.append("مرض السكري")
    
    risk_score = min(risk_score, 1.0)
    
    # Determine risk bucket
    if risk_score < 0.3:
        risk_bucket = "low"
    elif risk_score < 0.6:
        risk_bucket = "medium"
    else:
        risk_bucket = "high"
    
    recommendations = generate_heart_recommendations(risk_score, risk_factors, data)
    
    return {
        "risk_score": risk_score,
        "risk_bucket": risk_bucket,
        "model_version": "rule_based_v1.0",
        "clinical_data": {
            "cholesterol_mgdl": float(cholesterol) if cholesterol and cholesterol != "unknown" else None,
            "ldl_mgdl": float(ldl) if ldl and ldl != "unknown" else None,
            "hdl_mgdl": float(hdl) if hdl and hdl != "unknown" else None,
            "family_history": data.get("familyHistory") == "نعم",
            "smoking": data.get("smoking") == "نعم",
            "obesity": False  # Calculate from BMI if available
        },
        "recommendations": recommendations,
        "risk_factors": risk_factors
    }

def generate_diabetes_recommendations(risk_score: float, risk_factors: List[str], data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate diabetes-specific recommendations"""
    recommendations = []
    
    if risk_score < 0.3:
        recommendations.extend([
            {"title": "حافظ على نمط حياتك الصحي", "details": "استمر في العادات الصحية الحالية", "priority": "low"},
            {"title": "فحص دوري كل سنتين", "details": "أجري فحص سكر دوري كل سنتين للمتابعة", "priority": "low"}
        ])
    elif risk_score < 0.6:
        recommendations.extend([
            {"title": "تحسين النظام الغذائي", "details": "قلل من السكريات والكربوهيدرات المكررة", "priority": "med"},
            {"title": "زيادة النشاط البدني", "details": "مارس الرياضة 30 دقيقة يومياً على الأقل", "priority": "med"},
            {"title": "فحص دوري كل 6 أشهر", "details": "متابعة مستوى السكر كل 6 أشهر", "priority": "med"}
        ])
    else:
        recommendations.extend([
            {"title": "استشارة طبية عاجلة", "details": "راجع طبيب متخصص في أقرب وقت", "priority": "high"},
            {"title": "فحص شامل للسكري", "details": "أجري فحص شامل يشمل HbA1c وفحص المضاعفات", "priority": "high"},
            {"title": "تغيير نمط الحياة", "details": "تطبيق نظام غذائي صارم وبرنامج رياضي", "priority": "high"}
        ])
    
    return recommendations

def generate_hypertension_recommendations(risk_score: float, risk_factors: List[str], data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate hypertension-specific recommendations"""
    recommendations = []
    
    if risk_score < 0.3:
        recommendations.extend([
            {"title": "حافظ على ضغط الدم الطبيعي", "details": "استمر في نمط حياتك الصحي", "priority": "low"},
            {"title": "قياس دوري لضغط الدم", "details": "قس ضغط الدم مرة كل 6 أشهر", "priority": "low"}
        ])
    elif risk_score < 0.6:
        recommendations.extend([
            {"title": "تقليل الملح", "details": "قلل استهلاك الصوديوم إلى أقل من 2.3 غرام يومياً", "priority": "med"},
            {"title": "ممارسة الرياضة", "details": "تمارين هوائية منتظمة 30 دقيقة يومياً", "priority": "med"},
            {"title": "مراقبة أسبوعية", "details": "قس ضغط الدم أسبوعياً وسجل القراءات", "priority": "med"}
        ])
    else:
        recommendations.extend([
            {"title": "استشارة طبية فورية", "details": "راجع طبيب القلب أو الباطنة فوراً", "priority": "high"},
            {"title": "نظام غذائي صارم", "details": "اتبع نظام DASH الغذائي بدقة", "priority": "high"},
            {"title": "مراقبة يومية", "details": "قس ضغط الدم يومياً وسجل النتائج", "priority": "high"}
        ])
    
    return recommendations

def generate_heart_recommendations(risk_score: float, risk_factors: List[str], data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate heart disease-specific recommendations"""
    recommendations = []
    
    if risk_score < 0.3:
        recommendations.extend([
            {"title": "حافظ على صحة القلب", "details": "استمر في العادات الصحية للقلب", "priority": "low"},
            {"title": "فحص دوري للقلب", "details": "فحص قلب شامل كل سنتين", "priority": "low"}
        ])
    elif risk_score < 0.6:
        recommendations.extend([
            {"title": "تحسين مستوى الكوليسترول", "details": "اتبع نظام غذائي قليل الدهون المشبعة", "priority": "med"},
            {"title": "تمارين القلب", "details": "تمارين هوائية منتظمة لتقوية القلب", "priority": "med"},
            {"title": "فحص دوري للدهون", "details": "فحص مستوى الكوليسترول كل 6 أشهر", "priority": "med"}
        ])
    else:
        recommendations.extend([
            {"title": "استشارة طبيب القلب", "details": "راجع طبيب قلب متخصص فوراً", "priority": "high"},
            {"title": "فحص شامل للقلب", "details": "أجري تخطيط قلب وإيكو وفحص شرايين", "priority": "high"},
            {"title": "علاج الكوليسترول", "details": "قد تحتاج لأدوية للتحكم في الكوليسترول", "priority": "high"}
        ])
    
    return recommendations