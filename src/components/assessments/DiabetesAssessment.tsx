import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DiabetesAssessment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Lab Tests
    fastingGlucose: "",
    hba1c: "",
    cholesterol: "",
    triglycerides: "",
    
    // Step 2: Lifestyle
    exercise: "",
    diet: "",
    smoking: "",
    alcohol: "",
    familyHistory: "",
    
    // Step 3: Personal Info
    age: "",
    gender: "",
    weight: "",
    height: "",
    previousDiagnosis: ""
  });

  const [result, setResult] = useState<{
    riskLevel: string;
    riskPercentage: number;
    comparison: number;
    recommendations: string[];
    color: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRisk = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let risk = 0;
      let recommendations = [];
      const age = parseInt(formData.age);
      const fastingGlucose = parseInt(formData.fastingGlucose);
      const hba1c = parseFloat(formData.hba1c);
      
      // Age factor
      if (age > 45) risk += 20;
      else if (age > 35) risk += 10;

      // Lab values
      if (fastingGlucose > 126) {
        risk += 40;
        recommendations.push("مستوى السكر مرتفع - استشر طبيب فوراً");
      } else if (fastingGlucose > 100) {
        risk += 25;
        recommendations.push("مستوى السكر في المنطقة الحدية - راقب نظامك الغذائي");
      }

      if (hba1c > 6.5) {
        risk += 35;
        recommendations.push("مستوى HbA1c مرتفع - يشير لخطر السكري");
      } else if (hba1c > 5.7) {
        risk += 20;
        recommendations.push("مستوى HbA1c في المنطقة الحدية");
      }

      // Lifestyle factors
      if (formData.exercise === "نادراً") {
        risk += 15;
        recommendations.push("زيادة النشاط البدني ضروري لتقليل المخاطر");
      }

      if (formData.familyHistory === "نعم") {
        risk += 20;
        recommendations.push("التاريخ العائلي يزيد المخاطر - متابعة دورية مطلوبة");
      }

      if (formData.smoking === "نعم") {
        risk += 15;
        recommendations.push("التدخين يزيد مخاطر السكري - ننصح بالإقلاع");
      }

      // Calculate BMI
      const height = parseInt(formData.height) / 100;
      const weight = parseInt(formData.weight);
      const bmi = weight / (height * height);
      
      if (bmi > 30) {
        risk += 25;
        recommendations.push("السمنة عامل خطر مهم - ننصح بفقدان الوزن");
      } else if (bmi > 25) {
        risk += 15;
        recommendations.push("الوزن الزائد يزيد المخاطر - حافظ على نظام غذائي صحي");
      }

      risk = Math.min(risk, 100);
      
      let riskLevel, color, comparison;
      if (risk < 30) {
        riskLevel = "منخفض الخطورة";
        color = "medical-success";
        comparison = 15; // أقل من 15% من الفئة العمرية
      } else if (risk < 60) {
        riskLevel = "متوسط الخطورة";
        color = "medical-warning";
        comparison = 35; // حوالي 35% من الفئة العمرية
      } else {
        riskLevel = "عالي الخطورة";
        color = "medical-danger";
        comparison = 70; // أعلى من 70% من الفئة العمرية
      }

      if (recommendations.length === 0) {
        recommendations.push("حافظ على نمط حياتك الصحي الحالي");
      }

      setResult({
        riskLevel,
        riskPercentage: risk,
        comparison,
        recommendations,
        color
      });

      setIsLoading(false);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetAssessment = () => {
    setCurrentStep(1);
    setFormData({
      fastingGlucose: "", hba1c: "", cholesterol: "", triglycerides: "",
      exercise: "", diet: "", smoking: "", alcohol: "", familyHistory: "",
      age: "", gender: "", weight: "", height: "", previousDiagnosis: ""
    });
    setResult(null);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Results Card */}
        <Card className={`shadow-hover border-2 border-${result.color}`}>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <TrendingUp className={`h-16 w-16 mx-auto text-${result.color} mb-4`} />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              تقييم خطر الإصابة بالسكري
            </h2>

            <Badge className={`bg-${result.color} text-white text-lg px-6 py-2 mb-6`}>
              {result.riskLevel}
            </Badge>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">مستوى الخطر</span>
                  <span className="font-bold text-lg">{result.riskPercentage}%</span>
                </div>
                <Progress value={result.riskPercentage} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">مقارنة بالفئة العمرية</span>
                  <span className="font-bold text-lg">{result.comparison}%</span>
                </div>
                <Progress value={result.comparison} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">التوصيات الطبية للسكري</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-medical-light-blue rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-medical text-white px-8 py-6 text-lg">
            <Link to="/doctors" className="flex items-center gap-3">
              احجز مع دكتور
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            onClick={resetAssessment}
            variant="secondary"
            className="px-8 py-6 text-lg"
          >
            إجراء تقييم جديد
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Disease Info */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-3">خطر الإصابة بالسكري</h3>
          <p className="text-muted-foreground leading-relaxed">
            السكري هو مرض مزمن يؤثر على كيفية استخدام جسمك للسكر في الدم، وهو مصدر رئيسي للطاقة. 
            يمكن أن يؤدي ارتفاع مستويات السكر في الدم لفترات طويلة إلى مضاعفات صحية خطيرة.
          </p>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-20 h-1 mx-2 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            {currentStep === 1 && "المرحلة الأولى: التحاليل الطبية"}
            {currentStep === 2 && "المرحلة الثانية: نمط الحياة"}
            {currentStep === 3 && "المرحلة الثالثة: المعلومات الشخصية"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fastingGlucose">السكر الصائم (mg/dL)</Label>
                  <Input
                    id="fastingGlucose"
                    type="number"
                    placeholder="70-100 طبيعي"
                    value={formData.fastingGlucose}
                    onChange={(e) => handleInputChange("fastingGlucose", e.target.value)}
                    className="text-right"
                  />
                  <p className="text-xs text-muted-foreground mt-1">طبيعي: أقل من 100</p>
                </div>
                <div>
                  <Label htmlFor="hba1c">HbA1c (%)</Label>
                  <Input
                    id="hba1c"
                    type="number"
                    step="0.1"
                    placeholder="4.0-5.6 طبيعي"
                    value={formData.hba1c}
                    onChange={(e) => handleInputChange("hba1c", e.target.value)}
                    className="text-right"
                  />
                  <p className="text-xs text-muted-foreground mt-1">طبيعي: أقل من 5.7</p>
                </div>
                <div>
                  <Label htmlFor="cholesterol">الكوليسترول (mg/dL)</Label>
                  <Input
                    id="cholesterol"
                    type="number"
                    placeholder="أقل من 200"
                    value={formData.cholesterol}
                    onChange={(e) => handleInputChange("cholesterol", e.target.value)}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="triglycerides">الدهون الثلاثية (mg/dL)</Label>
                  <Input
                    id="triglycerides"
                    type="number"
                    placeholder="أقل من 150"
                    value={formData.triglycerides}
                    onChange={(e) => handleInputChange("triglycerides", e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>مستوى النشاط البدني</Label>
                  <Select value={formData.exercise} onValueChange={(value) => handleInputChange("exercise", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مستوى النشاط" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="يومياً">يومياً (30+ دقيقة)</SelectItem>
                      <SelectItem value="أسبوعياً">3-4 مرات أسبوعياً</SelectItem>
                      <SelectItem value="نادراً">مرة أو مرتين أسبوعياً</SelectItem>
                      <SelectItem value="لا أمارس">لا أمارس الرياضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>نوع النظام الغذائي</Label>
                  <Select value={formData.diet} onValueChange={(value) => handleInputChange("diet", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع النظام الغذائي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="صحي">صحي ومتوازن</SelectItem>
                      <SelectItem value="عادي">عادي</SelectItem>
                      <SelectItem value="غير صحي">كثير الدهون والسكريات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>التدخين</Label>
                  <Select value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نعم">نعم</SelectItem>
                      <SelectItem value="لا">لا</SelectItem>
                      <SelectItem value="أقلعت">أقلعت مؤخراً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>التاريخ العائلي للسكري</Label>
                  <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange("familyHistory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نعم">نعم (أقارب درجة أولى)</SelectItem>
                      <SelectItem value="بعيد">نعم (أقارب بعيدون)</SelectItem>
                      <SelectItem value="لا">لا</SelectItem>
                      <SelectItem value="غير متأكد">غير متأكد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age">العمر</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="أدخل عمرك"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
                <div>
                  <Label>الجنس</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ذكر">ذكر</SelectItem>
                      <SelectItem value="أنثى">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">الوزن (كجم)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="الوزن"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="height">الطول (سم)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="الطول"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>إصابة سابقة بمقدمات السكري</Label>
                  <Select value={formData.previousDiagnosis} onValueChange={(value) => handleInputChange("previousDiagnosis", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نعم">نعم</SelectItem>
                      <SelectItem value="لا">لا</SelectItem>
                      <SelectItem value="غير متأكد">غير متأكد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !formData.fastingGlucose) ||
                  (currentStep === 2 && !formData.exercise) ||
                  (currentStep === 3 && (!formData.age || !formData.weight || !formData.height))
                }
                className="bg-gradient-medical text-white gap-2"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={calculateRisk}
                disabled={isLoading || !formData.age || !formData.weight || !formData.height}
                className="bg-gradient-medical text-white px-8 gap-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري التحليل...
                  </div>
                ) : (
                  <>
                    احسب النتيجة
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiabetesAssessment;