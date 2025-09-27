import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CardList from "./CardList";
import SectionDrawer from "./SectionDrawer";
import { translations } from "./translations/ar";

export type RiskSection = "diabetes" | "hypertension" | "heart";

const RiskCheckPage = () => {
  const [activeSection, setActiveSection] = useState<RiskSection | null>(null);
  const [progress, setProgress] = useState<Record<RiskSection, number>>({
    diabetes: 0,
    hypertension: 0,
    heart: 0
  });

  const handleSectionOpen = (section: RiskSection) => {
    setActiveSection(section);
  };

  const handleSectionClose = () => {
    setActiveSection(null);
  };

  const handleProgressUpdate = (section: RiskSection, progressValue: number) => {
    setProgress(prev => ({ ...prev, [section]: progressValue }));
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
              {translations.page.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {translations.page.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-card mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {translations.intro.whatIs.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {translations.intro.whatIs.description}
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {translations.intro.howItWorks.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {translations.intro.howItWorks.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar - Only visible when a section is active */}
      {activeSection && (
        <section className="py-4 bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {translations.sections[activeSection].title} - 
                  {translations.ui.progressText} {progress[activeSection]}%
                </span>
                <div className="w-48 bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress[activeSection]}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            {!activeSection ? (
              <CardList onSectionOpen={handleSectionOpen} progress={progress} />
            ) : (
              <SectionDrawer
                section={activeSection}
                onClose={handleSectionClose}
                onProgressUpdate={handleProgressUpdate}
                currentProgress={progress[activeSection]}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Back to Home - Only visible when no section is active */}
      {!activeSection && (
        <section className="py-8">
          <div className="container mx-auto px-4 text-center">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                {translations.ui.backToHome}
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default RiskCheckPage;