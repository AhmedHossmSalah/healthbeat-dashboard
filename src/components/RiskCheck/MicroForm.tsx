import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RiskSection } from "./RiskCheckPage";
import { translations } from "./translations/ar";
import { calculateBMI, getBMIClassification } from "./utils/calculations";

interface MicroFormProps {
  section: RiskSection;
  initialData?: {
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  onComplete: (data: any) => void;
}

const MicroForm = ({ section, initialData, onComplete }: MicroFormProps) => {
  const [formData, setFormData] = useState({
    age: initialData?.age || "",
    gender: initialData?.gender || "",
    height: initialData?.height || "",
    weight: initialData?.weight || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bmi, setBMI] = useState<number | null>(null);
  const [bmiClassification, setBMIClassification] = useState<string>("");

  // Calculate BMI when height and weight change
  useEffect(() => {
    if (formData.height && formData.weight) {
      const height = parseFloat(formData.height);
      const weight = parseFloat(formData.weight);
      
      if (height > 0 && weight > 0) {
        const calculatedBMI = calculateBMI(weight, height);
        setBMI(calculatedBMI);
        setBMIClassification(getBMIClassification(calculatedBMI));
      }
    } else {
      setBMI(null);
      setBMIClassification("");
    }
  }, [formData.height, formData.weight]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.age) {
      newErrors.age = translations.validation.required;
    } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = translations.validation.ageRange;
    }

    if (!formData.gender) {
      newErrors.gender = translations.validation.required;
    }

    if (!formData.height) {
      newErrors.height = translations.validation.required;
    } else if (parseFloat(formData.height) < 50 || parseFloat(formData.height) > 250) {
      newErrors.height = translations.validation.heightRange;
    }

    if (!formData.weight) {
      newErrors.weight = translations.validation.required;
    } else if (parseFloat(formData.weight) < 10 || parseFloat(formData.weight) > 500) {
      newErrors.weight = translations.validation.weightRange;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getBMIBadgeColor = (bmi: number) => {
    if (bmi < 18.5) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (bmi < 25) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (bmi < 30) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-center text-foreground">
            {translations.microForm.title}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            {translations.microForm.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <Label htmlFor="age">{translations.microForm.fields.age.label}</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder={translations.microForm.fields.age.placeholder}
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={`text-right ${errors.age ? 'border-red-500' : ''}`}
              />
              {errors.age && (
                <p className="text-sm text-red-500 mt-1">{errors.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label>{translations.microForm.fields.gender.label}</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder={translations.microForm.fields.gender.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {translations.microForm.fields.gender.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <Label htmlFor="height">{translations.microForm.fields.height.label}</Label>
              <Input
                id="height"
                type="number"
                min="50"
                max="250"
                placeholder={translations.microForm.fields.height.placeholder}
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className={`text-right ${errors.height ? 'border-red-500' : ''}`}
              />
              {errors.height && (
                <p className="text-sm text-red-500 mt-1">{errors.height}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <Label htmlFor="weight">{translations.microForm.fields.weight.label}</Label>
              <Input
                id="weight"
                type="number"
                min="10"
                max="500"
                placeholder={translations.microForm.fields.weight.placeholder}
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className={`text-right ${errors.weight ? 'border-red-500' : ''}`}
              />
              {errors.weight && (
                <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
              )}
            </div>
          </div>

          {/* BMI Display */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <h4 className="font-semibold text-foreground mb-2">
                {translations.microForm.bmi.title}
              </h4>
              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-2xl font-bold ${getBMIColor(bmi)}`}
                >
                  {bmi.toFixed(1)}
                </motion.p>
                <Badge className={getBMIBadgeColor(bmi)}>
                  {bmiClassification}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {translations.microForm.bmi.normalRange}
                </p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full"
            disabled={!formData.age || !formData.gender || !formData.height || !formData.weight}
          >
            {translations.ui.next}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MicroForm;