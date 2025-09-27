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
import { ChevronLeft, Heart, Download, Calendar, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Cardiovascular Tests
  cholesterolTotal: string;
  cholesterolLDL: string;
  cholesterolHDL: string;
  triglycerides: string;
  
  // Lifestyle
  physicalActivity: string;
  diet: string;
  smoking: string;
  chestPain: string;
  
  // Personal Info
  age: string;
  gender: string;
  familyHistory: string;
  weight: string;
  height: string;
  bloodPressure: string;
}

interface Result {
  riskLevel: string;
  riskPercentage: number;
  color: string;
  recommendations: string[];
}

const HeartAssessment = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    cholesterolTotal: "",
    cholesterolLDL: "",
    cholesterolHDL: "",
    triglycerides: "",
    physicalActivity: "",
    diet: "",
    smoking: "",
    chestPain: "",
    age: "",
    gender: "",
    familyHistory: "",
    weight: "",
    height: "",
    bloodPressure: ""
  });
  const [result, setResult] = useState<Result | null>(null);

  const totalSteps = 3;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('healthbeat:assessment:draft:heart:anon', JSON.stringify(formData));
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
      const saved = localStorage.getItem('healthbeat:assessment:draft:heart:anon');
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
    
    // Cholesterol factors
    const totalChol = parseFloat(formData.cholesterolTotal);
    const ldl = parseFloat(formData.cholesterolLDL);
    const hdl = parseFloat(formData.cholesterolHDL);
    const trigly = parseFloat(formData.triglycerides);
    
    if (totalChol >= 240) risk += 25;
    else if (totalChol >= 200) risk += 15;
    
    if (ldl >= 160) risk += 25;
    else if (ldl >= 130) risk += 15;
    
    if (hdl < 40) risk += 20;
    else if (hdl < 50) risk += 10;
    
    if (trigly >= 200) risk += 15;
    
    // Lifestyle factors
    if (formData.physicalActivity === "none") risk += 20;
    else if (formData.physicalActivity === "low") risk += 10;
    
    if (formData.diet === "poor") risk += 15;
    if (formData.smoking === "current") risk += 25;
    else if (formData.smoking === "former") risk += 10;
    
    if (formData.chestPain === "frequent") risk += 30;
    else if (formData.chestPain === "sometimes") risk += 15;
    
    if (formData.familyHistory === "yes") risk += 20;
    
    // Age and gender factors
    const age = parseInt(formData.age);
    if (formData.gender === "male") {
      if (age >= 45) risk += 15;
    } else {
      if (age >= 55) risk += 15;
    }
    
    // BMI calculation
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100;
    const bmi = weight / (height * height);
    if (bmi >= 30) risk += 15;
    else if (bmi >= 25) risk += 10;
    
    // Blood pressure
    if (formData.bloodPressure === "high") risk += 20;
    else if (formData.bloodPressure === "borderline") risk += 10;

    const finalRisk = Math.min(risk, 95);
    
    let riskLevel: string;
    let color: string;
    let recommendations: string[];

    if (finalRisk < 25) {
      riskLevel = "منخفض";
      color = "text-accent";
      recommendations = [
        "حافظ على نمط حياة صحي",
        "مارس الرياضة 150 دقيقة أسبوعياً",
        "تناول غذاء غني بالأوميجا 3",
        "فحص دوري للقلب كل عامين"
      ];
    } else if (finalRisk < 50) {
      riskLevel = "متوسط";
      color = "text-medical-warning";
      recommendations = [
        "زد النشاط البدني إلى 300 دقيقة أسبوعياً",
        "اتبع نظام البحر المتوسط الغذائي",
        "راقب مستوى الكوليسترول شهرياً",
        "استشر طبيب القلب كل 6 أشهر"
      ];
    } else {
      riskLevel = "عالي";
      color = "text-medical-danger";
      recommendations = [
        "استشر طبيب القلب فوراً",
        "ابدأ علاج الكوليسترول إذا لزم",
        "غير نمط حياتك جذرياً",
        "إجراء فحوصات شاملة للقلب"
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
      cholesterolTotal: "",
      cholesterolLDL: "",
      cholesterolHDL: "",
      triglycerides: "",
      physicalActivity: "",
      diet: "",
      smoking: "",
      chestPain: "",
      age: "",
      gender: "",
      familyHistory: "",
      weight: "",
      height: "",
      bloodPressure: ""
    });
    setCurrentStep(1);
    setResult(null);
    localStorage.removeItem('healthbeat:assessment:draft:heart:anon');
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
            <span className="text-foreground font-medium">نتائج فحص القلب</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-card border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold">نتائج فحص صحة القلب</CardTitle>
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
          <span className="text-foreground font-medium">فحص القلب</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">فحص صحة القلب والأوعية الدموية</h1>
            <p className="text-muted-foreground">تقييم شامل لصحة القلب ومخاطر الإصابة بأمراض القلب التاجية</p>
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
                      <h2 className="text-xl font-bold mb-4">فحوصات القلب والأوعية الدموية</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cholesterolTotal">الكوليسترول الكلي (mg/dL)</Label>
                          <Input
                            id="cholesterolTotal"
                            type="number"
                            placeholder="مثال: 180"
                            value={formData.cholesterolTotal}
                            onChange={(e) => handleInputChange("cholesterolTotal", e.target.value)}
                            aria-describedby="total-chol-help"
                          />
                          <p id="total-chol-help" className="text-sm text-muted-foreground">
                            المثالي: أقل من 200 mg/dL
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cholesterolLDL">الكوليسترول الضار LDL (mg/dL)</Label>
                          <Input
                            id="cholesterolLDL"
                            type="number"
                            placeholder="مثال: 100"
                            value={formData.cholesterolLDL}
                            onChange={(e) => handleInputChange("cholesterolLDL", e.target.value)}
                            aria-describedby="ldl-help"
                          />
                          <p id="ldl-help" className="text-sm text-muted-foreground">
                            المثالي: أقل من 100 mg/dL
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cholesterolHDL">الكوليسترول المفيد HDL (mg/dL)</Label>
                          <Input
                            id="cholesterolHDL"
                            type="number"
                            placeholder="مثال: 50"
                            value={formData.cholesterolHDL}
                            onChange={(e) => handleInputChange("cholesterolHDL", e.target.value)}
                            aria-describedby="hdl-help"
                          />
                          <p id="hdl-help" className="text-sm text-muted-foreground">
                            المثالي: أكثر من 40 للرجال، 50 للنساء
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="triglycerides">الدهون الثلاثية (mg/dL)</Label>
                          <Input
                            id="triglycerides"
                            type="number"
                            placeholder="مثال: 120"
                            value={formData.triglycerides}
                            onChange={(e) => handleInputChange("triglycerides", e.target.value)}
                            aria-describedby="trigly-help"
                          />
                          <p id="trigly-help" className="text-sm text-muted-foreground">
                            الطبيعي: أقل من 150 mg/dL
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6" data-test="assessment-question-2">
                      <h2 className="text-xl font-bold mb-4">نمط الحياة والأعراض</h2>
                      
                      <div className="space-y-3">
                        <Label>مستوى النشاط البدني</Label>
                        <RadioGroup
                          value={formData.physicalActivity}
                          onValueChange={(value) => handleInputChange("physicalActivity", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="high" id="activity-high" />
                            <Label htmlFor="activity-high">عالي (أكثر من 300 دقيقة أسبوعياً)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="moderate" id="activity-moderate" />
                            <Label htmlFor="activity-moderate">متوسط (150-300 دقيقة أسبوعياً)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="low" id="activity-low" />
                            <Label htmlFor="activity-low">منخفض (أقل من 150 دقيقة أسبوعياً)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="none" id="activity-none" />
                            <Label htmlFor="activity-none">لا أمارس الرياضة</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label>جودة النظام الغذائي</Label>
                        <Select value={formData.diet} onValueChange={(value) => handleInputChange("diet", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر جودة نظامك الغذائي" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">ممتاز (البحر المتوسط)</SelectItem>
                            <SelectItem value="good">جيد (غني بالخضار والفواكه)</SelectItem>
                            <SelectItem value="fair">مقبول (متنوع نوعاً ما)</SelectItem>
                            <SelectItem value="poor">ضعيف (وجبات سريعة ودهون)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>التدخين</Label>
                        <RadioGroup
                          value={formData.smoking}
                          onValueChange={(value) => handleInputChange("smoking", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="never" id="smoking-never" />
                            <Label htmlFor="smoking-never">لم أدخن أبداً</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="former" id="smoking-former" />
                            <Label htmlFor="smoking-former">مدخن سابق</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="current" id="smoking-current" />
                            <Label htmlFor="smoking-current">أدخن حالياً</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label>ألم أو ضيق في الصدر</Label>
                        <RadioGroup
                          value={formData.chestPain}
                          onValueChange={(value) => handleInputChange("chestPain", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="none" id="chest-none" />
                            <Label htmlFor="chest-none">لا يوجد</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="sometimes" id="chest-sometimes" />
                            <Label htmlFor="chest-sometimes">أحياناً عند المجهود</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="frequent" id="chest-frequent" />
                            <Label htmlFor="chest-frequent">متكرر حتى في الراحة</Label>
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
                        <Label>التاريخ العائلي لأمراض القلب</Label>
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

                      <div className="space-y-3">
                        <Label>ضغط الدم</Label>
                        <RadioGroup
                          value={formData.bloodPressure}
                          onValueChange={(value) => handleInputChange("bloodPressure", value)}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="normal" id="bp-normal" />
                            <Label htmlFor="bp-normal">طبيعي (أقل من 120/80)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="borderline" id="bp-borderline" />
                            <Label htmlFor="bp-borderline">حدي (120-139/80-89)</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="high" id="bp-high" />
                            <Label htmlFor="bp-high">مرتفع (أكثر من 140/90)</Label>
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

export default HeartAssessment;