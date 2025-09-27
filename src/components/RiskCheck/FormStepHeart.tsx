import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, HelpCircle } from "lucide-react";
import { translations } from "./translations/ar";
import { calculateRiskContribution } from "./utils/calculations";

interface FormStepHeartProps {
  step: number;
  initialData?: any;
  basicInfo?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const FormStepHeart = ({ step, initialData, basicInfo, onComplete, onBack }: FormStepHeartProps) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      // Lipid panel validation
      if (!formData.cholesterol && formData.cholesterol !== "unknown") {
        newErrors.cholesterol = translations.validation.required;
      } else if (formData.cholesterol !== "unknown") {
        const chol = parseFloat(formData.cholesterol);
        if (chol < 50 || chol > 500) {
          newErrors.cholesterol = "يجب أن يكون مستوى الكوليسترول بين 50 و 500 mg/dL";
        }
      }
      
      if (!formData.ldl && formData.ldl !== "unknown") {
        newErrors.ldl = translations.validation.required;
      } else if (formData.ldl !== "unknown") {
        const ldl = parseFloat(formData.ldl);
        if (ldl < 30 || ldl > 300) {
          newErrors.ldl = "يجب أن يكون مستوى LDL بين 30 و 300 mg/dL";
        }
      }
    } else if (step === 2) {
      // Lifestyle validation
      if (!formData.exercise) {
        newErrors.exercise = translations.validation.required;
      }
      if (!formData.diet) {
        newErrors.diet = translations.validation.required;
      }
      if (!formData.smoking) {
        newErrors.smoking = translations.validation.required;
      }
    } else if (step === 3) {
      // Medical history
      if (!formData.familyHistory) {
        newErrors.familyHistory = translations.validation.required;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onComplete(formData);
    }
  };

  const renderRiskIndicator = (value: string, normalRange: { min: number; max: number }, highThreshold: number) => {
    if (!value || value === "unknown") return null;
    
    const numValue = parseFloat(value);
    const risk = calculateRiskContribution(numValue, normalRange, highThreshold);
    
    return (
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">مساهمة في الخطر</span>
          <span className={`font-medium ${risk.color}`}>{risk.percentage}%</span>
        </div>
        <Progress value={risk.percentage} className="h-1" />
        <Badge variant="outline" className={`text-xs ${risk.color}`}>
          {risk.status === "normal" ? "طبيعي" : 
           risk.status === "borderline" ? "حدودي" :
           risk.status === "high" ? "مرتفع" : "مرتفع جداً"}
        </Badge>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Cholesterol */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="cholesterol">
              {translations.forms.heart.step1.fields.cholesterol.label}
            </Label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="cholesterol"
            type="number"
            placeholder={translations.forms.heart.step1.fields.cholesterol.placeholder}
            value={formData.cholesterol === "unknown" ? "" : formData.cholesterol}
            onChange={(e) => handleInputChange("cholesterol", e.target.value)}
            className={`text-right ${errors.cholesterol ? 'border-red-500' : ''}`}
            disabled={formData.cholesterol === "unknown"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.heart.step1.fields.cholesterol.normalRange}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("cholesterol", 
                formData.cholesterol === "unknown" ? "" : "unknown")}
            >
              {translations.ui.unknownOption}
            </Button>
          </div>
          {renderRiskIndicator(formData.cholesterol, { min: 100, max: 199 }, 240)}
          {errors.cholesterol && (
            <p className="text-sm text-red-500 mt-1">{errors.cholesterol}</p>
          )}
        </div>

        {/* LDL */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="ldl">
              {translations.forms.heart.step1.fields.ldl.label}
            </Label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="ldl"
            type="number"
            placeholder={translations.forms.heart.step1.fields.ldl.placeholder}
            value={formData.ldl === "unknown" ? "" : formData.ldl}
            onChange={(e) => handleInputChange("ldl", e.target.value)}
            className={`text-right ${errors.ldl ? 'border-red-500' : ''}`}
            disabled={formData.ldl === "unknown"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.heart.step1.fields.ldl.normalRange}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("ldl", 
                formData.ldl === "unknown" ? "" : "unknown")}
            >
              {translations.ui.unknownOption}
            </Button>
          </div>
          {renderRiskIndicator(formData.ldl, { min: 50, max: 99 }, 160)}
          {errors.ldl && (
            <p className="text-sm text-red-500 mt-1">{errors.ldl}</p>
          )}
        </div>

        {/* HDL */}
        <div>
          <Label htmlFor="hdl">
            {translations.forms.heart.step1.fields.hdl.label}
          </Label>
          <Input
            id="hdl"
            type="number"
            placeholder={translations.forms.heart.step1.fields.hdl.placeholder}
            value={formData.hdl || ""}
            onChange={(e) => handleInputChange("hdl", e.target.value)}
            className="text-right"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.heart.step1.fields.hdl.normalRange}
          </p>
        </div>

        {/* Triglycerides */}
        <div>
          <Label htmlFor="triglycerides">الدهون الثلاثية (mg/dL)</Label>
          <Input
            id="triglycerides"
            type="number"
            placeholder="أقل من 150"
            value={formData.triglycerides || ""}
            onChange={(e) => handleInputChange("triglycerides", e.target.value)}
            className="text-right"
          />
          <p className="text-xs text-muted-foreground mt-1">طبيعي: أقل من 150</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>مستوى النشاط البدني</Label>
          <Select 
            value={formData.exercise} 
            onValueChange={(value) => handleInputChange("exercise", value)}
          >
            <SelectTrigger className={errors.exercise ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر مستوى النشاط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="يومياً">يومياً (30+ دقيقة)</SelectItem>
              <SelectItem value="أسبوعياً">3-4 مرات أسبوعياً</SelectItem>
              <SelectItem value="نادراً">مرة أو مرتين أسبوعياً</SelectItem>
              <SelectItem value="لا أمارس">لا أمارس الرياضة</SelectItem>
            </SelectContent>
          </Select>
          {errors.exercise && (
            <p className="text-sm text-red-500 mt-1">{errors.exercise}</p>
          )}
        </div>

        <div>
          <Label>النظام الغذائي</Label>
          <Select 
            value={formData.diet} 
            onValueChange={(value) => handleInputChange("diet", value)}
          >
            <SelectTrigger className={errors.diet ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر نوع النظام الغذائي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="صحي للقلب">صحي للقلب (قليل الدهون المشبعة)</SelectItem>
              <SelectItem value="متوازن">متوازن</SelectItem>
              <SelectItem value="عالي الدهون">عالي الدهون والكوليسترول</SelectItem>
            </SelectContent>
          </Select>
          {errors.diet && (
            <p className="text-sm text-red-500 mt-1">{errors.diet}</p>
          )}
        </div>

        <div>
          <Label>التدخين</Label>
          <Select 
            value={formData.smoking} 
            onValueChange={(value) => handleInputChange("smoking", value)}
          >
            <SelectTrigger className={errors.smoking ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="نعم">نعم</SelectItem>
              <SelectItem value="لا">لا</SelectItem>
              <SelectItem value="أقلعت">أقلعت مؤخراً</SelectItem>
            </SelectContent>
          </Select>
          {errors.smoking && (
            <p className="text-sm text-red-500 mt-1">{errors.smoking}</p>
          )}
        </div>

        <div>
          <Label>مستوى التوتر</Label>
          <Select 
            value={formData.stress} 
            onValueChange={(value) => handleInputChange("stress", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مستوى التوتر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="منخفض">منخفض</SelectItem>
              <SelectItem value="متوسط">متوسط</SelectItem>
              <SelectItem value="عالي">عالي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>التاريخ العائلي لأمراض القلب</Label>
          <Select 
            value={formData.familyHistory} 
            onValueChange={(value) => handleInputChange("familyHistory", value)}
          >
            <SelectTrigger className={errors.familyHistory ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="نعم">نعم (أقارب درجة أولى)</SelectItem>
              <SelectItem value="بعيد">نعم (أقارب بعيدون)</SelectItem>
              <SelectItem value="لا">لا</SelectItem>
              <SelectItem value="غير متأكد">غير متأكد</SelectItem>
            </SelectContent>
          </Select>
          {errors.familyHistory && (
            <p className="text-sm text-red-500 mt-1">{errors.familyHistory}</p>
          )}
        </div>

        <div>
          <Label>تاريخ إصابة سابقة</Label>
          <Select 
            value={formData.previousConditions} 
            onValueChange={(value) => handleInputChange("previousConditions", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="لا يوجد">لا يوجد</SelectItem>
              <SelectItem value="ذبحة صدرية">ذبحة صدرية</SelectItem>
              <SelectItem value="جلطة قلبية">جلطة قلبية</SelectItem>
              <SelectItem value="مشاكل صمامات">مشاكل في الصمامات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>ضغط الدم الحالي</Label>
          <Input
            placeholder="مثال: 120/80"
            value={formData.currentBP || ""}
            onChange={(e) => handleInputChange("currentBP", e.target.value)}
            className="text-right"
          />
          <p className="text-xs text-muted-foreground mt-1">اتركه فارغاً إن لم تعلم</p>
        </div>

        <div>
          <Label>مستوى السكري</Label>
          <Select 
            value={formData.diabetesStatus} 
            onValueChange={(value) => handleInputChange("diabetesStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="لا يوجد">لا يوجد</SelectItem>
              <SelectItem value="مقدمات">مقدمات السكري</SelectItem>
              <SelectItem value="نوع 1">السكري النوع الأول</SelectItem>
              <SelectItem value="نوع 2">السكري النوع الثاني</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return translations.forms.heart.step1.title;
      case 2: return "نمط الحياة";
      case 3: return "التاريخ الطبي";
      default: return "";
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <Heart className="h-6 w-6 text-primary" />
            {getStepTitle()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            الخطوة {step} من 3 - {translations.sections.heart.title}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderCurrentStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {translations.ui.previous}
            </Button>
            
            <Button
              onClick={handleSubmit}
              className="gap-2"
            >
              {step === 3 ? translations.ui.calculating : translations.ui.next}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FormStepHeart;