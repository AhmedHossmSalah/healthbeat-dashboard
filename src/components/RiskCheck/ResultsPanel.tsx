import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, Heart, Download, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { RiskSection } from "./RiskCheckPage";
import { translations } from "./translations/ar";

interface ResultsPanelProps {
  section: RiskSection;
  result: {
    riskLevel: string;
    riskPercentage: number;
    comparison: number;
    topFactors: Array<{ name: string; contribution: number }>;
    recommendations: string[];
    color: string;
  };
  onReset: () => void;
  onClose: () => void;
}

const ResultsPanel = ({ section, result, onReset, onClose }: ResultsPanelProps) => {
  const getSectionIcon = () => {
    switch (section) {
      case "diabetes": return TrendingUp;
      case "hypertension": return Activity;
      case "heart": return Heart;
      default: return TrendingUp;
    }
  };

  const getSectionColor = () => {
    switch (section) {
      case "diabetes": return "text-blue-500";
      case "hypertension": return "text-red-500";
      case "heart": return "text-purple-500";
      default: return "text-blue-500";
    }
  };

  const getRiskLevelColor = () => {
    if (result.riskPercentage < 30) return "text-green-600 bg-green-50 border-green-200";
    if (result.riskPercentage < 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressColor = () => {
    if (result.riskPercentage < 30) return "bg-green-500";
    if (result.riskPercentage < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const SectionIcon = getSectionIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Results Card */}
      <Card className="shadow-hover border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <SectionIcon className={`h-10 w-10 ${getSectionColor()}`} />
          </div>
          
          <CardTitle className="text-2xl text-foreground mb-2">
            {translations.results.title}
          </CardTitle>
          
          <p className="text-muted-foreground">
            {translations.sections[section].title}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Risk Level Badge */}
          <div className="text-center">
            <Badge 
              className={`text-lg px-6 py-2 font-bold ${getRiskLevelColor()}`}
            >
              {result.riskLevel}
            </Badge>
          </div>

          {/* Risk Percentage */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {translations.results.riskPercentage}
              </span>
              <span className="text-2xl font-bold text-foreground">
                {result.riskPercentage}%
              </span>
            </div>
            
            <div className="relative">
              <Progress value={result.riskPercentage} className="h-4" />
              <div 
                className={`absolute top-0 right-0 h-4 rounded-r-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${result.riskPercentage}%` }}
              />
            </div>
          </div>

          {/* Age Group Comparison */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {translations.results.comparison}
              </span>
              <span className="text-lg font-semibold text-foreground">
                {result.comparison}%
              </span>
            </div>
            
            <Progress value={result.comparison} className="h-2" />
            
            <p className="text-xs text-muted-foreground text-center">
              من الأشخاص في فئتك العمرية لديهم نفس مستوى الخطر أو أعلى
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Risk Factors */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {translations.results.topFactors}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.topFactors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <span className="font-medium text-foreground">{factor.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{factor.contribution}%</span>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.contribution}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${getProgressColor()}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {translations.results.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground leading-relaxed">{recommendation}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-gradient-medical text-white px-8 py-6 text-lg">
          <Link to="/doctors" className="flex items-center gap-3">
            {translations.ui.bookDoctor}
            <Heart className="h-5 w-5" />
          </Link>
        </Button>
        
        <Button 
          variant="outline"
          className="px-8 py-6 text-lg gap-3"
          onClick={() => {
            // Placeholder for PDF download functionality
            alert("سيتم تنفيذ تحميل التقرير قريباً");
          }}
        >
          <Download className="h-5 w-5" />
          {translations.ui.downloadReport}
        </Button>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
        <Button 
          variant="secondary"
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {translations.ui.newAssessment}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClose}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          {translations.ui.close}
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 border border-muted rounded-lg p-4">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          <strong>تنبيه:</strong> هذا التقييم هو لأغراض إعلامية فقط وليس بديلاً عن الاستشارة الطبية المهنية. 
          يرجى استشارة طبيب مختص للحصول على تشخيص وعلاج دقيق.
        </p>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;