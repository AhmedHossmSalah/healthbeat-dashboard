import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { translations } from "./translations/ar";

interface RiskCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  progress: number;
  onStart: () => void;
}

const RiskCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  bgColor, 
  progress, 
  onStart 
}: RiskCardProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer group">
        <CardHeader className="text-center pb-4">
          <div className={`w-16 h-16 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-center">
            {description}
          </p>
          
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {translations.ui.progress}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={onStart}
            className="w-full group-hover:bg-primary/90 transition-colors duration-300"
            size="lg"
          >
            {progress > 0 ? translations.ui.continue : translations.ui.start}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RiskCard;