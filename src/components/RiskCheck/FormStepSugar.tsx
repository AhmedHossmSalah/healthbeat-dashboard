import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, HelpCircle } from "lucide-react";
import { translations } from "./translations/ar";
import { calculateRiskContribution } from "./utils/calculations";

interface FormStepSugarProps {
  step: number;
  initialData?: any;
  basicInfo?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const FormStepSugar = ({ step, initialData, basicInfo, onComplete, onBack }: FormStepSugarProps) => {
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
      // Lab values validation
      if (!formData.fastingGlucose && formData.fastingGlucose !== "unknown") {
        newErrors.fastingGlucose = translations.validation.required;
      } else if (formData.fastingGlucose !== "unknown") {
        const glucose = parseFloat(formData.fastingGlucose);
        if (glucose < 20 || glucose > 600) {
          newErrors.fastingGlucose = translations.validation.glucoseRange;
        }
      }
      
      if (!formData.hba1c && formData.hba1c !== "unknown") {
        newErrors.hba1c = translations.validation.required;
      } else if (formData.hba1c !== "unknown") {
        const hba1c = parseFloat(formData.hba1c);
        if (hba1c < 3.0 || hba1c > 15.0) {
          newErrors.hba1c = translations.validation.hba1cRange;
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
      // Family history validation
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
        {/* Fasting Glucose */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="fastingGlucose">
              {translations.forms.diabetes.step1.fields.fastingGlucose.label}
            </Label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="fastingGlucose"
            type="number"
            placeholder={translations.forms.diabetes.step1.fields.fastingGlucose.placeholder}
            value={formData.fastingGlucose === "unknown" ? "" : formData.fastingGlucose}
            onChange={(e) => handleInputChange("fastingGlucose", e.target.value)}
            className={`text-right ${errors.fastingGlucose ? 'border-red-500' : ''}`}
            disabled={formData.fastingGlucose === "unknown"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.diabetes.step1.fields.fastingGlucose.normalRange}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("fastingGlucose", 
                formData.fastingGlucose === "unknown" ? "" : "unknown")}
            >
              {translations.ui.unknownOption}
            </Button>
          </div>
          {renderRiskIndicator(formData.fastingGlucose, { min: 70, max: 99 }, 126)}
          {errors.fastingGlucose && (
            <p className="text-sm text-red-500 mt-1">{errors.fastingGlucose}</p>
          )}
        </div>

        {/* HbA1c */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="hba1c">
              {translations.forms.diabetes.step1.fields.hba1c.label}
            </Label>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="hba1c"
            type="number"
            step="0.1"
            placeholder={translations.forms.diabetes.step1.fields.hba1c.placeholder}
            value={formData.hba1c === "unknown" ? "" : formData.hba1c}
            onChange={(e) => handleInputChange("hba1c", e.target.value)}
            className={`text-right ${errors.hba1c ? 'border-red-500' : ''}`}
            disabled={formData.hba1c === "unknown"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.diabetes.step1.fields.hba1c.normalRange}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("hba1c", 
                formData.hba1c === "unknown" ? "" : "unknown")}
            >
              {translations.ui.unknownOption}
            </Button>
          </div>
          {renderRiskIndicator(formData.hba1c, { min: 4.0, max: 5.6 }, 6.5)}
          {errors.hba1c && (
            <p className="text-sm text-red-500 mt-1">{errors.hba1c}</p>
          )}
        </div>

        {/* Optional fields */}
        <div>
          <Label htmlFor="cholesterol">
            {translations.forms.diabetes.step1.fields.cholesterol.label}
          </Label>
          <Input
            id="cholesterol"
            type="number"
            placeholder={translations.forms.diabetes.step1.fields.cholesterol.placeholder}
            value={formData.cholesterol || ""}
            onChange={(e) => handleInputChange("cholesterol", e.target.value)}
            className="text-right"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.diabetes.step1.fields.cholesterol.normalRange}
          </p>
        </div>

        <div>
          <Label htmlFor="triglycerides">
            {translations.forms.diabetes.step1.fields.triglycerides.label}
          </Label>
          <Input
            id="triglycerides"
            type="number"
            placeholder={translations.forms.diabetes.step1.fields.triglycerides.placeholder}
            value={formData.triglycerides || ""}
            onChange={(e) => handleInputChange("triglycerides", e.target.value)}
            className="text-right"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {translations.forms.diabetes.step1.fields.triglycerides.normalRange}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>{translations.forms.diabetes.step2.fields.exercise.label}</Label>
          <Select 
            value={formData.exercise} 
            onValueChange={(value) => handleInputChange("exercise", value)}
          >
            <SelectTrigger className={errors.exercise ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر مستوى النشاط" />
            </SelectTrigger>
            <SelectContent>
              {translations.forms.diabetes.step2.fields.exercise.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.exercise && (
            <p className="text-sm text-red-500 mt-1">{errors.exercise}</p>
          )}
        </div>

        <div>
          <Label>{translations.forms.diabetes.step2.fields.diet.label}</Label>
          <Select 
            value={formData.diet} 
            onValueChange={(value) => handleInputChange("diet", value)}
          >
            <SelectTrigger className={errors.diet ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر نوع النظام الغذائي" />
            </SelectTrigger>
            <SelectContent>
              {translations.forms.diabetes.step2.fields.diet.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.diet && (
            <p className="text-sm text-red-500 mt-1">{errors.diet}</p>
          )}
        </div>

        <div>
          <Label>{translations.forms.diabetes.step2.fields.smoking.label}</Label>
          <Select 
            value={formData.smoking} 
            onValueChange={(value) => handleInputChange("smoking", value)}
          >
            <SelectTrigger className={errors.smoking ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {translations.forms.diabetes.step2.fields.smoking.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.smoking && (
            <p className="text-sm text-red-500 mt-1">{errors.smoking}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>{translations.forms.diabetes.step3.fields.familyHistory.label}</Label>
          <Select 
            value={formData.familyHistory} 
            onValueChange={(value) => handleInputChange("familyHistory", value)}
          >
            <SelectTrigger className={errors.familyHistory ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {translations.forms.diabetes.step3.fields.familyHistory.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.familyHistory && (
            <p className="text-sm text-red-500 mt-1">{errors.familyHistory}</p>
          )}
        </div>

        <div>
          <Label>{translations.forms.diabetes.step3.fields.previousDiagnosis.label}</Label>
          <Select 
            value={formData.previousDiagnosis} 
            onValueChange={(value) => handleInputChange("previousDiagnosis", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              {translations.forms.diabetes.step3.fields.previousDiagnosis.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return translations.forms.diabetes.step1.title;
      case 2: return translations.forms.diabetes.step2.title;
      case 3: return translations.forms.diabetes.step3.title;
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
            <TrendingUp className="h-6 w-6 text-primary" />
            {getStepTitle()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            الخطوة {step} من 3 - {translations.sections.diabetes.title}
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

export default FormStepSugar;