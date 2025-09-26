import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowRight, ArrowLeft, FileDown, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface FormData {
  // Step 1 - Blood Pressure Measurements
  currentSystolic: string;
  currentDiastolic: string;
  morningReading: string;
  eveningReading: string;
  frequencyCheck: string;
  
  // Step 2 - Lifestyle
  saltIntake: string;
  physicalActivity: string;
  stress: string;
  smoking: string;
  alcohol: string;
  familyHistory: string;
  
  // Step 3 - Personal Info
  age: string;
  gender: string;
  weight: string;
  height: string;
  medications: string;
}

interface Result {
  riskLevel: string;
  riskPercentage: number;
  comparison: number;
  recommendations: string[];
  color: string;
}

const BloodPressureAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    currentSystolic: "",
    currentDiastolic: "",
    morningReading: "",
    eveningReading: "",
    frequencyCheck: "",
    saltIntake: "",
    physicalActivity: "",
    stress: "",
    smoking: "",
    alcohol: "",
    familyHistory: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    medications: "",
  });
  const [result, setResult] = useState<Result | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRisk = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let riskScore = 0;
    
    // Blood pressure measurements scoring
    const systolic = parseFloat(formData.currentSystolic);
    const diastolic = parseFloat(formData.currentDiastolic);
    
    if (systolic >= 180 || diastolic >= 110) riskScore += 40;
    else if (systolic >= 160 || diastolic >= 100) riskScore += 30;
    else if (systolic >= 140 || diastolic >= 90) riskScore += 20;
    else if (systolic >= 130 || diastolic >= 80) riskScore += 10;
    
    // Lifestyle scoring
    if (formData.saltIntake === "high") riskScore += 15;
    if (formData.physicalActivity === "low") riskScore += 15;
    if (formData.stress === "high") riskScore += 10;
    if (formData.smoking === "yes") riskScore += 20;
    if (formData.alcohol === "high") riskScore += 10;
    if (formData.familyHistory === "yes") riskScore += 15;
    
    // Personal info scoring
    if (parseInt(formData.age) > 65) riskScore += 15;
    else if (parseInt(formData.age) > 45) riskScore += 10;
    
    if (formData.medications === "yes") riskScore += 25;
    
    const bmi = parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2);
    if (bmi > 30) riskScore += 15;

    let riskLevel: string;
    let color: string;
    let recommendations: string[];
    
    if (riskScore < 25) {
      riskLevel = "منخفض";
      color = "text-medical-success";
      recommendations = [
        "ضغط الدم ضمن المعدل الطبيعي - أحسنت!",
        "حافظ على نظام غذائي قليل الملح",
        "استمر في ممارسة الرياضة بانتظام",
        "راقب ضغط الدم مرة كل 6 أشهر"
      ];
    } else if (riskScore < 60) {
      riskLevel = "متوسط";
      color = "text-medical-warning";
      recommendations = [
        "قد تكون في مرحلة ما قبل ارتفاع ضغط الدم",
        "قلل من تناول الملح إلى أقل من 2.3 غرام يومياً",
        "مارس التمارين الهوائية 30 دقيقة يومياً",
        "تعلم تقنيات إدارة التوتر والاسترخاء",
        "راقب ضغط الدم أسبوعياً"
      ];
    } else {
      riskLevel = "مرتفع";
      color = "text-medical-danger";
      recommendations = [
        "يجب استشارة الطبيب فوراً لعلاج ارتفاع ضغط الدم",
        "قد تحتاج لأدوية للتحكم في ضغط الدم",
        "اتبع نظام DASH الغذائي بصرامة",
        "تجنب الصوديوم نهائياً واقرأ ملصقات الطعام",
        "راقب ضغط الدم يومياً وسجل القراءات",
        "توقف عن التدخين إذا كنت مدخناً"
      ];
    }

    const riskPercentage = Math.min(riskScore, 100);
    const ageGroup = parseInt(formData.age);
    const comparison = ageGroup > 65 ? 75 : ageGroup > 45 ? 50 : 30;

    setResult({
      riskLevel,
      riskPercentage,
      comparison,
      recommendations,
      color
    });
    
    setIsLoading(false);
    toast.success("تم حساب تقييم مخاطر ضغط الدم بنجاح!");
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRisk();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setResult(null);
    setFormData({
      currentSystolic: "",
      currentDiastolic: "",
      morningReading: "",
      eveningReading: "",
      frequencyCheck: "",
      saltIntake: "",
      physicalActivity: "",
      stress: "",
      smoking: "",
      alcohol: "",
      familyHistory: "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      medications: "",
    });
  };

  const downloadReport = () => {
    toast.success("تم تحميل تقرير ضغط الدم بصيغة PDF!");
  };

  const bookDoctor = () => {
    toast.info("سيتم توجيهك لحجز موعد لمتابعة ضغط الدم");
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Activity className="h-8 w-8 text-medical-warning" />
              نتائج تقييم مخاطر ارتفاع ضغط الدم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2">
                مستوى الخطر: <span className={result.color}>{result.riskLevel}</span>
              </h3>
              <p className="text-muted-foreground">تقييم شامل لضغط الدم وعوامل الخطر</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>نسبة خطر ارتفاع ضغط الدم</span>
                  <span className="font-bold">{result.riskPercentage}%</span>
                </div>
                <Progress value={result.riskPercentage} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>مقارنة مع فئتك العمرية</span>
                  <span className="font-bold">{result.comparison}%</span>
                </div>
                <Progress value={result.comparison} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">
                  متوسط مخاطر ضغط الدم للفئة العمرية من {parseInt(formData.age) - 5} إلى {parseInt(formData.age) + 5} سنة
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                توصيات للتحكم في ضغط الدم
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowLeft className="h-4 w-4 text-medical-warning mt-1 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={downloadReport} className="flex-1 gap-2">
                <FileDown className="h-4 w-4" />
                تحميل تقرير ضغط الدم
              </Button>
              <Button onClick={bookDoctor} variant="outline" className="flex-1">
                حجز موعد للمتابعة
              </Button>
              <Button onClick={resetAssessment} variant="secondary">
                إجراء تقييم جديد
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Activity className="h-12 w-12 text-medical-warning" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">فحص مخاطر ارتفاع ضغط الدم</h3>
                <p className="text-muted-foreground">
                  ارتفاع ضغط الدم (فرط ضغط الدم) هو حالة شائعة تزداد فيها قوة دفع الدم ضد جدران الشرايين 
                  بشكل عالٍ بما يكفي للتسبب في مشاكل صحية مع مرور الوقت.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Indicator */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">الخطوة {currentStep + 1} من 3</span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 0 && "قياسات ضغط الدم"}
              {currentStep === 1 && "العادات اليومية"}
              {currentStep === 2 && "المعلومات الشخصية"}
            </span>
          </div>
          <Progress value={(currentStep + 1) * 33.33} className="h-2" />
        </CardContent>
      </Card>

      {/* Assessment Form */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">قياسات ضغط الدم</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentSystolic">ضغط الدم الانقباضي الحالي (mmHg)</Label>
                      <Input
                        id="currentSystolic"
                        type="number"
                        placeholder="120 طبيعي"
                        value={formData.currentSystolic}
                        onChange={(e) => handleInputChange("currentSystolic", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        طبيعي: أقل من 120 | مرتفع: 130+ | خطر: 140+
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="currentDiastolic">ضغط الدم الانبساطي الحالي (mmHg)</Label>
                      <Input
                        id="currentDiastolic"
                        type="number"
                        placeholder="80 طبيعي"
                        value={formData.currentDiastolic}
                        onChange={(e) => handleInputChange("currentDiastolic", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        طبيعي: أقل من 80 | مرتفع: 80+ | خطر: 90+
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="morningReading">قراءة الصباح المعتادة (الانقباضي)</Label>
                      <Input
                        id="morningReading"
                        type="number"
                        placeholder="قياس الصباح"
                        value={formData.morningReading}
                        onChange={(e) => handleInputChange("morningReading", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="eveningReading">قراءة المساء المعتادة (الانقباضي)</Label>
                      <Input
                        id="eveningReading"
                        type="number"
                        placeholder="قياس المساء"
                        value={formData.eveningReading}
                        onChange={(e) => handleInputChange("eveningReading", e.target.value)}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>كم مرة تقيس ضغط الدم؟</Label>
                      <Select value={formData.frequencyCheck} onValueChange={(value) => handleInputChange("frequencyCheck", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التكرار" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">يومياً</SelectItem>
                          <SelectItem value="weekly">أسبوعياً</SelectItem>
                          <SelectItem value="monthly">شهرياً</SelectItem>
                          <SelectItem value="rarely">نادراً</SelectItem>
                          <SelectItem value="never">لا أقيس</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">العادات اليومية وعوامل الخطر</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>تناول الملح يومياً</Label>
                      <Select value={formData.saltIntake} onValueChange={(value) => handleInputChange("saltIntake", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="كمية الملح" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">قليل (أتجنب الملح)</SelectItem>
                          <SelectItem value="moderate">معتدل (ملح طبيعي)</SelectItem>
                          <SelectItem value="high">كثير (أحب الطعام المالح)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>مستوى النشاط البدني</Label>
                      <Select value={formData.physicalActivity} onValueChange={(value) => handleInputChange("physicalActivity", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="مستوى النشاط" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">عالي (رياضة منتظمة)</SelectItem>
                          <SelectItem value="moderate">متوسط (نشاط خفيف)</SelectItem>
                          <SelectItem value="low">منخفض (قليل الحركة)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>مستوى التوتر</Label>
                      <Select value={formData.stress} onValueChange={(value) => handleInputChange("stress", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="مستوى التوتر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض</SelectItem>
                          <SelectItem value="moderate">متوسط</SelectItem>
                          <SelectItem value="high">مرتفع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>التدخين</Label>
                      <Select value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="حالة التدخين" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">لا أدخن</SelectItem>
                          <SelectItem value="yes">أدخن حالياً</SelectItem>
                          <SelectItem value="former">مدخن سابق</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>شرب الكحول</Label>
                      <Select value={formData.alcohol} onValueChange={(value) => handleInputChange("alcohol", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="استهلاك الكحول" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">لا أشرب</SelectItem>
                          <SelectItem value="moderate">معتدل</SelectItem>
                          <SelectItem value="high">كثير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>التاريخ العائلي لضغط الدم</Label>
                      <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange("familyHistory", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="تاريخ عائلي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">لا يوجد</SelectItem>
                          <SelectItem value="yes">نعم (أقارب مباشرين)</SelectItem>
                          <SelectItem value="distant">تاريخ عائلي بعيد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">المعلومات الشخصية</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">العمر (بالسنوات)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="أدخل عمرك"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>الجنس</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="weight">الوزن (كيلوغرام)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="أدخل وزنك"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="height">الطول (سنتيمتر)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="أدخل طولك"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>هل تتناول أدوية لضغط الدم؟</Label>
                      <Select value={formData.medications} onValueChange={(value) => handleInputChange("medications", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="الأدوية الحالية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">لا</SelectItem>
                          <SelectItem value="yes">نعم</SelectItem>
                          <SelectItem value="sometimes">أحياناً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                "جاري التحليل..."
              ) : currentStep === 2 ? (
                "احسب مخاطر ضغط الدم"
              ) : (
                <>
                  التالي
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressureAssessment;