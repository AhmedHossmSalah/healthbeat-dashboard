import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SectionDrawer from "@/components/RiskCheck/SectionDrawer";
import { translations } from "@/components/RiskCheck/translations/ar";

const HypertensionAssessment = () => {
  const [progress, setProgress] = useState(0);

  const handleProgressUpdate = (progressValue: number) => {
    setProgress(progressValue);
  };

  return (
    <div className="min-h-screen bg-gradient-card" dir="rtl">
      {/* Header */}
      <section className="bg-gradient-medical text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {translations.sections.hypertension.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {translations.sections.hypertension.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-4 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {translations.sections.hypertension.title} - 
                {translations.ui.progressText} {progress}%
              </span>
              <div className="w-48 bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <SectionDrawer
              section="hypertension"
              onClose={() => {}}
              onProgressUpdate={(_, progressValue) => handleProgressUpdate(progressValue)}
              currentProgress={progress}
            />
          </motion.div>
        </div>
      </section>

      {/* Back to Risk Assessment */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/risk-assessment">
              <ArrowLeft className="h-4 w-4" />
              {translations.ui.backToAssessment}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HypertensionAssessment;