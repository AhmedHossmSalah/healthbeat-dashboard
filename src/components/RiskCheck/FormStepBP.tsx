import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, Plus, Trash2 } from "lucide-react";
import { translations } from "./translations/ar";
import { calculateAverageBP, getBPClassification } from "./utils/calculations";

interface FormStepBPProps {
  step: number;
  initialData?: any;
  basicInfo?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const FormStepBP = ({ step, initialData, basicInfo, onComplete, onBack }: FormStepBPProps) => {
  const [formData, setFormData] = useState(initialData || {
    bpReadings: [{ systolic: "", diastolic: "" }]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBPChange = (index: number, field: "systolic" | "diastolic", value: string) => {
    const newReadings = [...formData.bpReadings];
    newReadings[index] = { ...newReadings[index], [field]: value };
    setFormData(prev => ({ ...prev, bpReadings: newReadings }));
    
    // Clear errors
    if (errors[`bp${index}`]) {
      setErrors(prev => ({ ...prev, [`bp${index}`]: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addBPReading = () => {
    if (formData.bpReadings.length < 5) {
      setFormData(prev => ({
        ...prev,
        bpReadings: [...prev.bpReadings, { systolic: "", diastolic: "" }]
      }));
    }
  };

  const removeBPReading = (index: number) => {
    if (formData.bpReadings.length > 1) {
      const newReadings = formData.bpReadings.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, bpReadings: newReadings }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      // Validate at least one BP reading
      let hasValidReading = false;
      formData.bpReadings.forEach((reading, index) => {
        if (reading.systolic && reading.diastolic) {
          const systolic = parseInt(reading.systolic);
          const diastolic = parseInt(reading.diastolic);
          
          if (systolic >= 60 && systolic <= 300 && diastolic >= 40 && diastolic <= 200) {
            hasValidReading = true;
          } else {
            newErrors[`bp${index}`] = "قيم ضغط الدم غير صحيحة";
          }
        }
      });
      
      if (!hasValidReading) {
        newErrors.bpReadings = "يرجى إدخال قراءة ضغط دم صحيحة واحدة على الأقل";
      }
    } else if (step === 2) {
      // Lifestyle validation for BP
      if (!formData.exercise) {
        newErrors.exercise = translations.validation.required;
      }
      if (!formData.diet) {
        newErrors.diet = translations.validation.required;
      }
      if (!formData.smoking) {
        newErrors.smoking = translations.validation.required;
      }
      if (!formData.salt) {
        newErrors.salt = translations.validation.required;
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
      // Calculate average BP if multiple readings
      if (step === 1 && formData.bpReadings.length > 1) {
        const validReadings = formData.bpReadings
          .filter(r => r.systolic && r.diastolic)
          .map(r => ({ systolic: parseInt(r.systolic), diastolic: parseInt(r.diastolic) }));
        
        if (validReadings.length > 0) {
          const avgBP = calculateAverageBP(validReadings);
          setFormData(prev => ({ ...prev, averageBP: avgBP }));
        }
      }
      
      onComplete(formData);
    }
  };

  const renderBPIndicator = (systolic: string, diastolic: string) => {
    if (!systolic || !diastolic) return null;
    
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const classification = getBPClassification(sys, dia);
    
    return (
      <div className="mt-2">
        <Badge variant="outline" className={`${classification.color} text-xs`}>
          {classification.category}
        </Badge>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-foreground">قراءات ضغط الدم</h4>
          {formData.bpReadings.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBPReading}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة قراءة
            </Button>
          )}
        </div>
        
        {formData.bpReadings.map((reading, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Label>القراءة {index + 1}</Label>
              {formData.bpReadings.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBPReading(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">الانقباضي</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={reading.systolic}
                  onChange={(e) => handleBPChange(index, "systolic", e.target.value)}
                  className={`text-center ${errors[`bp${index}`] ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <Label className="text-sm">الانبساطي</Label>
                <Input
                  type="number"
                  placeholder="80"
                  value={reading.diastolic}
                  onChange={(e) => handleBPChange(index, "diastolic", e.target.value)}
                  className={`text-center ${errors[`bp${index}`] ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
            
            {renderBPIndicator(reading.systolic, reading.diastolic)}
            
            {errors[`bp${index}`] && (
              <p className="text-sm text-red-500">{errors[`bp${index}`]}</p>
            )}
          </motion.div>
        ))}
        
        {errors.bpReadings && (
          <p className="text-sm text-red-500">{errors.bpReadings}</p>
        )}
      </div>
      
      {/* Average BP Display */}
      {formData.bpReadings.length > 1 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium text-foreground mb-2">المتوسط المحسوب</h5>
          <p className="text-sm text-muted-foreground">
            سيتم حساب المتوسط تلقائياً من القراءات المدخلة
          </p>
        </div>
      )}
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
              <SelectItem value="قليل الملح">قليل الملح والدهون</SelectItem>
              <SelectItem value="متوازن">متوازن</SelectItem>
              <SelectItem value="عالي الملح">عالي الملح والدهون</SelectItem>
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
          <Label>استهلاك الملح</Label>
          <Select 
            value={formData.salt} 
            onValueChange={(value) => handleInputChange("salt", value)}
          >
            <SelectTrigger className={errors.salt ? 'border-red-500' : ''}>
              <SelectValue placeholder="اختر مستوى الاستهلاك" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="قليل">قليل</SelectItem>
              <SelectItem value="عادي">عادي</SelectItem>
              <SelectItem value="كثير">كثير</SelectItem>
            </SelectContent>
          </Select>
          {errors.salt && (
            <p className="text-sm text-red-500 mt-1">{errors.salt}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>التاريخ العائلي لارتفاع ضغط الدم</Label>
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
          <Label>الأدوية الحالية</Label>
          <Select 
            value={formData.medications} 
            onValueChange={(value) => handleInputChange("medications", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="لا يوجد">لا أتناول أدوية</SelectItem>
              <SelectItem value="ضغط">أدوية ضغط الدم</SelectItem>
              <SelectItem value="أخرى">أدوية أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return translations.forms.hypertension.step1.title;
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
            <Activity className="h-6 w-6 text-primary" />
            {getStepTitle()}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            الخطوة {step} من 3 - {translations.sections.hypertension.title}
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

export default FormStepBP;