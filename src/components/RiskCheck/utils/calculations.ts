// BMI Calculations
export const calculateBMI = (weight: number, heightInCm: number): number => {
  const heightInM = heightInCm / 100;
  return weight / (heightInM * heightInM);
};

export const getBMIClassification = (bmi: number): string => {
  if (bmi < 18.5) return "نقص في الوزن";
  if (bmi < 25) return "وزن طبيعي";
  if (bmi < 30) return "زيادة في الوزن";
  return "سمنة";
};

// Blood Pressure Calculations
export const calculateAverageBP = (readings: Array<{systolic: number, diastolic: number}>): {systolic: number, diastolic: number} => {
  if (readings.length === 0) return { systolic: 0, diastolic: 0 };
  
  const totalSystolic = readings.reduce((sum, reading) => sum + reading.systolic, 0);
  const totalDiastolic = readings.reduce((sum, reading) => sum + reading.diastolic, 0);
  
  return {
    systolic: Math.round(totalSystolic / readings.length),
    diastolic: Math.round(totalDiastolic / readings.length)
  };
};

export const getBPClassification = (systolic: number, diastolic: number): {
  category: string;
  level: "normal" | "elevated" | "high1" | "high2" | "crisis";
  color: string;
} => {
  if (systolic >= 180 || diastolic >= 120) {
    return { 
      category: "أزمة ضغط الدم", 
      level: "crisis", 
      color: "text-red-700" 
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { 
      category: "ارتفاع ضغط الدم (المرحلة الثانية)", 
      level: "high2", 
      color: "text-red-600" 
    };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { 
      category: "ارتفاع ضغط الدم (المرحلة الأولى)", 
      level: "high1", 
      color: "text-orange-600" 
    };
  }
  if (systolic >= 120) {
    return { 
      category: "ضغط مرتفع", 
      level: "elevated", 
      color: "text-yellow-600" 
    };
  }
  return { 
    category: "ضغط طبيعي", 
    level: "normal", 
    color: "text-green-600" 
  };
};

// Unit Conversions
export const convertGlucose = (value: number, from: "mg/dl" | "mmol/l", to: "mg/dl" | "mmol/l"): number => {
  if (from === to) return value;
  
  if (from === "mg/dl" && to === "mmol/l") {
    return value / 18.0182;
  }
  if (from === "mmol/l" && to === "mg/dl") {
    return value * 18.0182;
  }
  
  return value;
};

// Risk Factor Calculations
export const calculateRiskContribution = (
  value: number, 
  normalRange: { min: number; max: number }, 
  highRiskThreshold: number
): {
  percentage: number;
  status: "normal" | "borderline" | "high" | "very_high";
  color: string;
} => {
  let percentage = 0;
  let status: "normal" | "borderline" | "high" | "very_high" = "normal";
  let color = "text-green-600";

  if (value <= normalRange.max) {
    percentage = 5;
    status = "normal";
    color = "text-green-600";
  } else if (value <= highRiskThreshold) {
    percentage = 15;
    status = "borderline";
    color = "text-yellow-600";
  } else if (value <= highRiskThreshold * 1.5) {
    percentage = 30;
    status = "high";
    color = "text-orange-600";
  } else {
    percentage = 45;
    status = "very_high";
    color = "text-red-600";
  }

  return { percentage, status, color };
};

// Age Risk Factor
export const calculateAgeRisk = (age: number, gender: string): number => {
  let baseRisk = 0;
  
  if (gender === "ذكر") {
    if (age >= 65) baseRisk = 25;
    else if (age >= 55) baseRisk = 15;
    else if (age >= 45) baseRisk = 10;
    else if (age >= 35) baseRisk = 5;
  } else {
    if (age >= 65) baseRisk = 25;
    else if (age >= 55) baseRisk = 20;
    else if (age >= 45) baseRisk = 10;
    else if (age >= 35) baseRisk = 5;
  }
  
  return baseRisk;
};

// Family History Risk
export const calculateFamilyHistoryRisk = (familyHistory: string): number => {
  switch (familyHistory) {
    case "نعم (أقارب درجة أولى)": return 20;
    case "نعم (أقارب بعيدون)": return 10;
    case "غير متأكد": return 5;
    default: return 0;
  }
};

// Lifestyle Risk Factors
export const calculateLifestyleRisk = (factors: {
  exercise: string;
  diet: string;
  smoking: string;
  alcohol?: string;
}): number => {
  let risk = 0;
  
  // Exercise
  switch (factors.exercise) {
    case "لا أمارس": risk += 20; break;
    case "نادراً": risk += 15; break;
    case "أسبوعياً": risk += 5; break;
    default: risk += 0;
  }
  
  // Diet
  switch (factors.diet) {
    case "غير صحي": risk += 15; break;
    case "عادي": risk += 8; break;
    default: risk += 0;
  }
  
  // Smoking
  switch (factors.smoking) {
    case "نعم": risk += 15; break;
    case "أقلعت": risk += 5; break;
    default: risk += 0;
  }
  
  // Alcohol (if applicable)
  if (factors.alcohol === "نعم") {
    risk += 10;
  }
  
  return Math.min(risk, 50); // Cap at 50%
};

// Calculate total risk percentage
export const calculateTotalRisk = (factors: {
  age: number;
  gender: string;
  bmi: number;
  labValues: Record<string, number>;
  familyHistory: string;
  lifestyle: {
    exercise: string;
    diet: string;
    smoking: string;
    alcohol?: string;
  };
}): {
  totalRisk: number;
  riskLevel: "منخفض" | "متوسط" | "عالي" | "عالي جداً";
  color: string;
  comparison: number;
} => {
  let totalRisk = 0;
  
  // Age and gender
  totalRisk += calculateAgeRisk(factors.age, factors.gender);
  
  // BMI
  if (factors.bmi >= 35) totalRisk += 25;
  else if (factors.bmi >= 30) totalRisk += 20;
  else if (factors.bmi >= 25) totalRisk += 10;
  
  // Family history
  totalRisk += calculateFamilyHistoryRisk(factors.familyHistory);
  
  // Lifestyle
  totalRisk += calculateLifestyleRisk(factors.lifestyle);
  
  // Lab values (varies by condition)
  // This would be customized based on the specific condition being assessed
  
  // Cap at 100%
  totalRisk = Math.min(totalRisk, 100);
  
  let riskLevel: "منخفض" | "متوسط" | "عالي" | "عالي جداً";
  let color: string;
  let comparison: number;
  
  if (totalRisk < 20) {
    riskLevel = "منخفض";
    color = "text-green-600";
    comparison = 15;
  } else if (totalRisk < 40) {
    riskLevel = "متوسط";
    color = "text-yellow-600";
    comparison = 35;
  } else if (totalRisk < 70) {
    riskLevel = "عالي";
    color = "text-orange-600";
    comparison = 65;
  } else {
    riskLevel = "عالي جداً";
    color = "text-red-600";
    comparison = 85;
  }
  
  return { totalRisk, riskLevel, color, comparison };
};