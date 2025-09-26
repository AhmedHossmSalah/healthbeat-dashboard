import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AlertTriangle, Heart, TrendingUp, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RiskAssessment = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    systolicBP: "",
    diastolicBP: "",
    cholesterol: "",
    bloodSugar: "",
    smoking: "",
    familyHistory: "",
    exercise: "",
    weight: "",
    height: ""
  });

  const [result, setResult] = useState<{
    riskLevel: string;
    riskPercentage: number;
    confidenceLevel: number;
    recommendations: string[];
    color: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRisk = () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock risk calculation based on inputs
      const age = parseInt(formData.age);
      const systolic = parseInt(formData.systolicBP);
      const diastolic = parseInt(formData.diastolicBP);
      const cholesterol = parseInt(formData.cholesterol);
      const bloodSugar = parseInt(formData.bloodSugar);
      
      let risk = 0;
      let recommendations = [];

      // Age factor
      if (age > 65) risk += 25;
      else if (age > 45) risk += 15;
      else if (age > 35) risk += 5;

      // Blood pressure
      if (systolic > 140 || diastolic > 90) {
        risk += 30;
        recommendations.push("ضرورة متابعة ضغط الدم مع طبيب متخصص");
      } else if (systolic > 120 || diastolic > 80) {
        risk += 15;
        recommendations.push("مراقبة ضغط الدم بانتظام");
      }

      // Cholesterol
      if (cholesterol > 240) {
        risk += 25;
        recommendations.push("مراجعة نظامك الغذائي وتقليل الدهون المشبعة");
      } else if (cholesterol > 200) {
        risk += 10;
        recommendations.push("الحفاظ على نظام غذائي صحي");
      }

      // Blood sugar
      if (bloodSugar > 126) {
        risk += 30;
        recommendations.push("ضرورة متابعة مستوى السكر مع طبيب مختص");
      } else if (bloodSugar > 100) {
        risk += 15;
        recommendations.push("مراقبة مستوى السكر في الدم");
      }

      // Lifestyle factors
      if (formData.smoking === "نعم") {
        risk += 20;
        recommendations.push("الإقلاع عن التدخين فوراً لتحسين صحتك");
      }

      if (formData.familyHistory === "نعم") {
        risk += 15;
        recommendations.push("المتابعة الدورية نظراً للتاريخ العائلي");
      }

      if (formData.exercise === "نادراً") {
        risk += 15;
        recommendations.push("زيادة النشاط البدني إلى 30 دقيقة يومياً");
      }

      // Cap risk at 100%
      risk = Math.min(risk, 100);

      let riskLevel, color;
      if (risk < 30) {
        riskLevel = "منخفض الخطورة";
        color = "medical-success";
        recommendations.push("حافظ على نمط حياتك الصحي الحالي");
      } else if (risk < 60) {
        riskLevel = "متوسط الخطورة";
        color = "medical-warning";
        recommendations.push("يُنصح بإجراء فحوصات دورية كل 6 شهور");
      } else {
        riskLevel = "عالي الخطورة";
        color = "medical-danger";
        recommendations.push("ضرورة استشارة طبيب متخصص في أقرب وقت");
      }

      setResult({
        riskLevel,
        riskPercentage: risk,
        confidenceLevel: 92,
        recommendations,
        color
      });

      setIsLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      age: "",
      gender: "",
      systolicBP: "",
      diastolicBP: "",
      cholesterol: "",
      bloodSugar: "",
      smoking: "",
      familyHistory: "",
      exercise: "",
      weight: "",
      height: ""
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <section className="bg-gradient-medical text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">تقييم المخاطر الصحية</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              احصل على تقييم ذكي لحالتك الصحية باستخدام أحدث تقنيات الذكاء الاصطناعي
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!result ? (
            /* Assessment Form */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-foreground flex items-center justify-center gap-3">
                    <Heart className="h-8 w-8 text-primary" />
                    بيانات التقييم الصحي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">المعلومات الأساسية</h3>
                      
                      <div>
                        <Label htmlFor="age">العمر</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="أدخل عمرك"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender">الجنس</Label>
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

                      <div className="grid grid-cols-2 gap-3">
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
                      </div>
                    </div>

                    {/* Medical Data */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">البيانات الطبية</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="systolic">ضغط الدم العلوي</Label>
                          <Input
                            id="systolic"
                            type="number"
                            placeholder="120"
                            value={formData.systolicBP}
                            onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                            className="text-right"
                          />
                        </div>
                        <div>
                          <Label htmlFor="diastolic">ضغط الدم السفلي</Label>
                          <Input
                            id="diastolic"
                            type="number"
                            placeholder="80"
                            value={formData.diastolicBP}
                            onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                            className="text-right"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cholesterol">الكوليسترول (mg/dL)</Label>
                        <Input
                          id="cholesterol"
                          type="number"
                          placeholder="200"
                          value={formData.cholesterol}
                          onChange={(e) => handleInputChange("cholesterol", e.target.value)}
                          className="text-right"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bloodSugar">السكر في الدم (mg/dL)</Label>
                        <Input
                          id="bloodSugar"
                          type="number"
                          placeholder="100"
                          value={formData.bloodSugar}
                          onChange={(e) => handleInputChange("bloodSugar", e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle Factors */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">نمط الحياة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>هل تدخن؟</Label>
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
                        <Label>تاريخ عائلي للأمراض</Label>
                        <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange("familyHistory", value)}>
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

                      <div>
                        <Label>ممارسة الرياضة</Label>
                        <Select value={formData.exercise} onValueChange={(value) => handleInputChange("exercise", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="يومياً">يومياً</SelectItem>
                            <SelectItem value="أسبوعياً">أسبوعياً</SelectItem>
                            <SelectItem value="نادراً">نادراً</SelectItem>
                            <SelectItem value="لا أمارس">لا أمارس</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <Button
                      onClick={calculateRisk}
                      disabled={isLoading || !formData.age || !formData.systolicBP}
                      className="bg-gradient-medical text-white px-12 py-6 text-lg shadow-medical hover:shadow-hover"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          جاري التحليل...
                        </div>
                      ) : (
                        "ابدأ التقييم"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Risk Level Card */}
              <Card className={`shadow-hover border-2 border-${result.color}`}>
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    {result.riskLevel === "منخفض الخطورة" && <CheckCircle className={`h-16 w-16 mx-auto text-${result.color} mb-4`} />}
                    {result.riskLevel === "متوسط الخطورة" && <TrendingUp className={`h-16 w-16 mx-auto text-${result.color} mb-4`} />}
                    {result.riskLevel === "عالي الخطورة" && <AlertTriangle className={`h-16 w-16 mx-auto text-${result.color} mb-4`} />}
                  </div>

                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    نتيجة التقييم
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
                        <span className="text-sm text-muted-foreground">مستوى الثقة</span>
                        <span className="font-bold text-lg">{result.confidenceLevel}%</span>
                      </div>
                      <Progress value={result.confidenceLevel} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">التوصيات الطبية</CardTitle>
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
                
                <Button asChild variant="outline" className="px-8 py-6 text-lg">
                  <Link to="/labs">
                    ابحث عن معمل تحاليل
                  </Link>
                </Button>

                <Button 
                  onClick={resetForm}
                  variant="secondary"
                  className="px-8 py-6 text-lg"
                >
                  إجراء تقييم جديد
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;