import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ChevronLeft, Activity, Download, Calendar, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Measurements
  systolicBP: string;
  diastolicBP: string;
  heartRate: string;
  
  // Lifestyle
  physicalActivity: string;
  saltIntake: string;
  stress: string;
  alcohol: string;
  
  // Personal Info
  age: string;
  gender: string;
  familyHistory: string;
  weight: string;
  height: string;
}

interface Result {
  riskLevel: string;
  riskPercentage: number;
  color: string;
  recommendations: string[];
}

const HypertensionAssessment = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    physicalActivity: "",
    saltIntake: "",
    stress: "",
    alcohol: "",
    age: "",
    gender: "",
    familyHistory: "",
    weight: "",
    height: ""
  });
  const [result, setResult] = useState<Result | null>(null);

  const totalSteps = 3;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('healthbeat:assessment:draft:hypertension:anon', JSON.stringify(formData));
        toast({
          description: "تم الحفظ تلقائياً",
          duration: 1500,
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    const timer = setTimeout(saveData, 10000);
    return () => clearTimeout(timer);
  }, [formData, toast]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('healthbeat:assessment:draft:hypertension:anon');
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Load failed:', error);
    }
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRisk = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let risk = 0;
    
    // Blood pressure factor
    const systolic = parseFloat(formData.systolicBP);
    const diastolic = parseFloat(formData.diastolicBP);
    
    if (systolic >= 180 || diastolic >= 110) risk += 50;
    else if (systolic >= 140 || diastolic >= 90) risk += 35;
    else if (systolic >= 130 || diastolic >= 80) risk += 20;
    else if (systolic >= 120) risk += 10;
    
    // Lifestyle factors
    if (formData.physicalActivity === "none") risk += 15;
    if (formData.saltIntake === "high") risk += 15;
    if (formData.stress === "high") risk += 10;
    if (formData.alcohol === "high") risk += 10;
    if (formData.familyHistory === "yes") risk += 15;
    
    // Age factor
    const age = parseInt(formData.age);
    if (age >= 65) risk += 15;
    else if (age >= 45) risk += 10;
    
    // BMI calculation
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100;
    const bmi = weight / (height * height);
    if (bmi >= 30) risk += 15;
    else if (bmi >= 25) risk += 10;

    const finalRisk = Math.min(risk, 95);
    
    let riskLevel: string;
    let color: string;
    let recommendations: string[];

    if (finalRisk < 25) {
      riskLevel = "منخفض";
      color = "text-accent";
      recommendations = [
        "حافظ على نمط حياة صحي",
        "مارس الرياضة بانتظام",
        "قلل من تناول الملح",
        "راقب ضغط الدم شهرياً"
      ];
    } else if (finalRisk < 50) {
      riskLevel = "متوسط";
      color = "text-medical-warning";
      recommendations = [
        "زد من النشاط البدني اليومي",
        "اتبع نظام DASH الغذائي",
        "قلل الملح إلى أقل من 6 جرام يومياً",
        "راقب الضغط أسبوعياً وراجع الطبيب"
      ];
    } else {
      riskLevel = "عالي";
      color = "text-medical-danger";
      recommendations = [
        "استشر طبيب القلب فوراً",
        "راقب الضغط يومياً",
        "تجنب الملح والكافيين",
        "ابدأ علاج دوائي إذا لزم الأمر"
      ];
    }

    setResult({
      riskLevel,
      riskPercentage: finalRisk,
      color,
      recommendations
    });

    setIsLoading(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setFormData({
      systolicBP: "",
      diastolicBP: "",
      heartRate: "",
      physicalActivity: "",
      saltIntake: "",
      stress: "",
      alcohol: "",
      age: "",
      gender: "",
      familyHistory: "",
      weight: "",
      height: ""
    });
    setCurrentStep(1);
    setResult(null);
    localStorage.removeItem('healthbeat:assessment:draft:hypertension:anon');
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <div className="container mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="مسار التنقل">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4" />
            <Link to="/assessments" className="hover:text-primary transition-colors">الفحوصات</Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-foreground font-medium">نتائج فحص ضغط الدم</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-card border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-medical-warning/10 flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-medical-warning" />
                </div>
                <CardTitle className="text-2xl font-bold">نتائج فحص ضغط الدم</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${result.color} mb-2`}>
                    {result.riskLevel}
                  </div>
                  <div className="text-muted-foreground">مستوى المخاطر</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>نسبة المخاطر</span>
                    <span className="font-medium">{result.riskPercentage}%</span>
                  </div>
                  <Progress 
                    value={result.riskPercentage} 
                    className="h-3"
                    role="progressbar" 
                    aria-valuenow={result.riskPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-lg">التوصيات</h3>
                  <ul className="space-y-2" role="list">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button className="flex-1 gap-2" variant="default">
                    <Download className="h-4 w-4" />
                    تحميل التقرير
                  </Button>
                  <Button className="flex-1 gap-2" variant="outline">
                    <Calendar className="h-4 w-4" />
                    حجز موعد مع طبيب
                  </Button>
                  <Button 
                    onClick={resetAssessment}
                    className="flex-1 gap-2" 
                    variant="ghost"
                  >
                    <RotateCcw className="h-4 w-4" />
                    فحص جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="مسار التنقل">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="h-4 w-4" />
          <Link to="/assessments" className="hover:text-primary transition-colors">الفحوصات</Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground font-medium">فحص ضغط الدم</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-medical-warning/10 flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-medical-warning" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">فحص مخاطر ارتفاع ضغط الدم</h1>
            <p className="text-muted-foreground">تقييم مخاطر الإصابة بارتفاع ضغط الدم وأمراض القلب والأوعية الدموية</p>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>التقدم</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <Card className="shadow-card border-0 bg-background/80 backdrop-blur-sm" data-test="assessment-form">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && (
                    <div className="space-y-6" data-test="assessment-question-1">
                      <h2 className="text-xl font-bold mb-4">قياسات ضغط الدم</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="systolicBP">الضغط الانقباضي (mmHg)</Label>
                          <Input
                            id="systolicBP"
                            type="number"
                            placeholder="مثال: 120"
                            value={formData.systolicBP}
                            onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                            aria-describedby="systolic-help"
                          />
                          <p id="systolic-help" className="text-sm text-muted-foreground">
                            الطبيعي: أقل من 120 mmHg
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="diastolicBP">الضغط الانبساطي (mmHg)</Label>
                          <Input
                            id="diastolicBP"
                            type="number"
                            placeholder="مثال: 80"
                            value={formData.diastolicBP}
                            onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                            aria-describedby="diastolic-help"
                          />
                          <p id="diastolic-help" className="text-sm text-muted-foreground">
                            الطبيعي: أقل من 80 mmHg
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heartRate">معدل ضربات القلب (BPM)</Label>
                        <Input
                          id="heartRate"
                          type="number"
                          placeholder="مثال: 72"
                          value={formData.heartRate}
                          onChange={(e) => handleInputChange("heartRate", e.target.value)}
                          aria-describedby="heart-rate-help"
                        />
                        <p id="heart-rate-help" className="text-sm text-muted-foreground">
                          الطبيعي: 60-100 نبضة في الدقيقة
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6" data-test="assessment-question-2">
                      <h2 className="text-xl font-bold mb-4">نمط الحياة</h2>
                      
                      <div className="space-y-3">
                        <Label>مستوى النشاط البدني</Label>
                        <RadioGroup
                          value={formData.physicalActivity}
                          onValueChange={(value) => handleInputChange("physicalActivity", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="high" id="activity-high" />
                            <Label htmlFor="activity-high">عالي (أكثر من 150 دقيقة أسبوعياً)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="moderate" id="activity-moderate" />
                            <Label htmlFor="activity-moderate">متوسط (75-150 دقيقة أسبوعياً)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="low" id="activity-low" />
                            <Label htmlFor="activity-low">منخفض (أقل من 75 دقيقة أسبوعياً)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="none" id="activity-none" />
                            <Label htmlFor="activity-none">لا أمارس الرياضة</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label>تناول الملح</Label>
                        <Select value={formData.saltIntake} onValueChange={(value) => handleInputChange("saltIntake", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مستوى تناول الملح" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">منخفض (أقل من 3 جرام يومياً)</SelectItem>
                            <SelectItem value="moderate">متوسط (3-6 جرام يومياً)</SelectItem>
                            <SelectItem value="high">عالي (أكثر من 6 جرام يومياً)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>مستوى التوتر</Label>
                        <RadioGroup
                          value={formData.stress}
                          onValueChange={(value) => handleInputChange("stress", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="low" id="stress-low" />
                            <Label htmlFor="stress-low">منخفض</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="moderate" id="stress-moderate" />
                            <Label htmlFor="stress-moderate">متوسط</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="high" id="stress-high" />
                            <Label htmlFor="stress-high">عالي</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label>تناول الكحول</Label>
                        <RadioGroup
                          value={formData.alcohol}
                          onValueChange={(value) => handleInputChange("alcohol", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="none" id="alcohol-none" />
                            <Label htmlFor="alcohol-none">لا أشرب</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="low" id="alcohol-low" />
                            <Label htmlFor="alcohol-low">مناسبات قليلة</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="moderate" id="alcohol-moderate" />
                            <Label htmlFor="alcohol-moderate">متوسط</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="high" id="alcohol-high" />
                            <Label htmlFor="alcohol-high">بكثرة</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6" data-test="assessment-question-3">
                      <h2 className="text-xl font-bold mb-4">المعلومات الشخصية</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">العمر</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="أدخل عمرك"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight">الوزن (كجم)</Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="أدخل وزنك"
                            value={formData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="height">الطول (سم)</Label>
                          <Input
                            id="height"
                            type="number"
                            placeholder="أدخل طولك"
                            value={formData.height}
                            onChange={(e) => handleInputChange("height", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>التاريخ العائلي لارتفاع ضغط الدم</Label>
                        <RadioGroup
                          value={formData.familyHistory}
                          onValueChange={(value) => handleInputChange("familyHistory", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="no" id="family-no" />
                            <Label htmlFor="family-no">لا يوجد</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="yes" id="family-yes" />
                            <Label htmlFor="family-yes">يوجد (والدين، أشقاء)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={currentStep === 1}
                  data-test="btn-back"
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  السابق
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={calculateRisk}
                    disabled={isLoading}
                    data-test="btn-submit"
                    className="gap-2"
                  >
                    {isLoading ? "جاري الحساب..." : "احسب المخاطر"}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    data-test="btn-next"
                    className="gap-2"
                  >
                    التالي
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HypertensionAssessment;