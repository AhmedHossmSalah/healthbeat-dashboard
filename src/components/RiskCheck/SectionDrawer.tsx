import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft } from "lucide-react";
import { RiskSection } from "./RiskCheckPage";
import MicroForm from "./MicroForm";
import FormStepSugar from "./FormStepSugar";
import FormStepBP from "./FormStepBP";
import FormStepHeart from "./FormStepHeart";
import ResultsPanel from "./ResultsPanel";
import { translations } from "./translations/ar";

interface SectionDrawerProps {
  section: RiskSection;
  onClose: () => void;
  onProgressUpdate: (section: RiskSection, progress: number) => void;
  currentProgress: number;
}

interface FormData {
  basicInfo?: {
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  step1?: Record<string, any>;
  step2?: Record<string, any>;
  step3?: Record<string, any>;
  step4?: Record<string, any>;
}

const SectionDrawer = ({ 
  section, 
  onClose, 
  onProgressUpdate, 
  currentProgress 
}: SectionDrawerProps) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = basicInfo, 1-4 = steps
  const [formData, setFormData] = useState<FormData>({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 5; // basicInfo + 4 steps

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`riskCheck_${section}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || {});
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [section]);

  // Save data to localStorage
  useEffect(() => {
    const dataToSave = {
      formData,
      currentStep,
      timestamp: Date.now()
    };
    localStorage.setItem(`riskCheck_${section}`, JSON.stringify(dataToSave));
    
    // Update progress
    const progress = Math.round((currentStep / totalSteps) * 100);
    onProgressUpdate(section, progress);
  }, [formData, currentStep, section, onProgressUpdate, totalSteps]);

  const handleStepComplete = (stepData: any) => {
    const stepKey = currentStep === 0 ? 'basicInfo' : `step${currentStep}`;
    
    setFormData(prev => ({
      ...prev,
      [stepKey]: stepData
    }));

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed, calculate results
      calculateResults();
    }
  };

  const calculateResults = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // This would be replaced with actual calculation logic
      const mockResult = {
        riskLevel: "متوسط الخطورة",
        riskPercentage: 45,
        comparison: 35,
        topFactors: [
          { name: "العمر", contribution: 25 },
          { name: "مؤشر كتلة الجسم", contribution: 15 },
          { name: "التاريخ العائلي", contribution: 12 }
        ],
        recommendations: [
          "راقب نظامك الغذائي وقلل من السكريات",
          "مارس النشاط البدني لمدة 30 دقيقة يومياً",
          "قم بفحص دوري كل 6 أشهر"
        ],
        color: "medical-warning"
      };
      
      setResult(mockResult);
      setIsLoading(false);
      onProgressUpdate(section, 100);
    }, 2000);
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setFormData({});
    setResult(null);
    localStorage.removeItem(`riskCheck_${section}`);
    onProgressUpdate(section, 0);
  };

  const renderCurrentStep = () => {
    if (result) {
      return (
        <ResultsPanel
          section={section}
          result={result}
          onReset={resetAssessment}
          onClose={onClose}
        />
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">{translations.ui.calculating}</p>
        </div>
      );
    }

    if (currentStep === 0) {
      return (
        <MicroForm
          section={section}
          initialData={formData.basicInfo}
          onComplete={handleStepComplete}
        />
      );
    }

    const stepComponents = {
      diabetes: FormStepSugar,
      hypertension: FormStepBP,
      heart: FormStepHeart
    };

    const StepComponent = stepComponents[section];

    return (
      <StepComponent
        step={currentStep}
        initialData={formData[`step${currentStep}` as keyof FormData]}
        basicInfo={formData.basicInfo}
        onComplete={handleStepComplete}
        onBack={goToPreviousStep}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {translations.sections[section].title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {translations.sections[section].description}
              </p>
            </div>
          </div>
          
          {currentStep > 0 && !result && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousStep}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {translations.ui.previous}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${section}-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SectionDrawer;