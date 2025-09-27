import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Droplets, Activity, ArrowLeft, ChevronLeft } from "lucide-react";

const AssessmentsIndex = () => {
  const assessments = [
    {
      slug: "diabetes",
      title: "فحص السكري",
      description: "تقييم شامل لمخاطر الإصابة بمرض السكري من النوع الثاني باستخدام العوامل الطبية والحياتية",
      icon: Droplets,
      color: "text-medical-danger",
      bgColor: "bg-medical-danger/10",
      estimatedTime: "10-15 دقيقة"
    },
    {
      slug: "hypertension", 
      title: "فحص ضغط الدم",
      description: "تقييم مخاطر الإصابة بارتفاع ضغط الدم وتحديد العوامل المؤثرة على صحة القلب والأوعية الدموية",
      icon: Activity,
      color: "text-medical-warning",
      bgColor: "bg-medical-warning/10",
      estimatedTime: "8-12 دقيقة"
    },
    {
      slug: "heart",
      title: "فحص صحة القلب",
      description: "تقييم صحة القلب والأوعية الدموية ومخاطر الإصابة بأمراض القلب التاجية",
      icon: Heart,
      color: "text-accent",
      bgColor: "bg-accent/10",
      estimatedTime: "12-18 دقيقة"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          aria-label="مسار التنقل"
        >
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground font-medium">الفحوصات الطبية</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            الفحوصات الطبية المتاحة
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اختر نوع الفحص المناسب لك للحصول على تقييم شامل لحالتك الصحية
          </p>
        </motion.div>

        {/* Assessment Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {assessments.map((assessment) => (
            <motion.div
              key={assessment.slug}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                scale: 1.01,
                transition: { duration: 0.18 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/assessments/${assessment.slug}`}
                className="assessment-card group block h-full"
                data-test={`assessment-card-${assessment.slug}`}
                aria-label={`ابدأ ${assessment.title}`}
              >
                <Card className="h-full shadow-card hover:shadow-hover transition-all duration-180 cursor-pointer border-0 bg-background/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${assessment.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <assessment.icon className={`h-8 w-8 ${assessment.color}`} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {assessment.title}
                    </h2>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {assessment.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>⏱️</span>
                      <span>{assessment.estimatedTime}</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-center gap-2 text-primary font-medium group-hover:text-accent transition-colors duration-300">
                        <span>ابدأ الفحص</span>
                        <ArrowLeft className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-medical p-8 rounded-2xl shadow-medical text-center text-white max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">لماذا نقوم بهذه الفحوصات؟</h2>
          <p className="text-white/90 leading-relaxed mb-6">
            الكشف المبكر عن الأمراض يساعد في الوقاية والعلاج المبكر، مما يحسن من جودة الحياة ويقلل من المضاعفات المحتملة
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-white/80">دقة التشخيص</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10 دقائق</div>
              <div className="text-white/80">متوسط وقت الفحص</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">مجاني</div>
              <div className="text-white/80">بدون أي رسوم</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentsIndex;