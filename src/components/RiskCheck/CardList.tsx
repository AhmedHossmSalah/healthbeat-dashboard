import { motion } from "framer-motion";
import RiskCard from "./RiskCard";
import { RiskSection } from "./RiskCheckPage";
import { translations } from "./translations/ar";
import { TrendingUp, Heart, Activity } from "lucide-react";

interface CardListProps {
  onSectionOpen: (section: RiskSection) => void;
  progress: Record<RiskSection, number>;
}

const CardList = ({ onSectionOpen, progress }: CardListProps) => {
  const cards = [
    {
      id: "diabetes" as RiskSection,
      title: translations.sections.diabetes.title,
      description: translations.sections.diabetes.shortDescription,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      id: "hypertension" as RiskSection,
      title: translations.sections.hypertension.title,
      description: translations.sections.hypertension.shortDescription,
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950"
    },
    {
      id: "heart" as RiskSection,
      title: translations.sections.heart.title,
      description: translations.sections.heart.shortDescription,
      icon: Heart,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    }
  ];

  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12"
      >
        {translations.ui.chooseAssessment}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <RiskCard
              {...card}
              progress={progress[card.id]}
              onStart={() => onSectionOpen(card.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CardList;