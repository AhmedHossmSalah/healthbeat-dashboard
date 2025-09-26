import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, FlaskConical, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import doctorIcon from "@/assets/doctor-icon.png";
import labIcon from "@/assets/lab-icon.png";
import riskIcon from "@/assets/risk-icon.png";

const FeaturesSection = () => {
  const features = [
    {
      icon: riskIcon,
      title: "فحص المخاطر الطبية",
      description: "تقييم ذكي للمخاطر الصحية باستخدام أحدث تقنيات الذكاء الاصطناعي",
      color: "medical-danger",
      link: "/risk-assessment",
      buttonText: "ابدأ الفحص"
    },
    {
      icon: doctorIcon,
      title: "استشارات الأطباء",
      description: "تواصل مع أفضل الأطباء المتخصصين واحجز موعدك بسهولة",
      color: "primary",
      link: "/doctors",
      buttonText: "تصفح الأطباء"
    },
    {
      icon: labIcon,
      title: "معامل التحاليل",
      description: "ابحث عن أقرب معامل التحاليل واحجز موعدك للفحوصات الطبية",
      color: "accent",
      link: "/labs",
      buttonText: "ابحث عن معمل"
    },
    {
      icon: MessageSquare,
      title: "الاستشارات الفورية",
      description: "احصل على استشارة طبية فورية من خلال نظام الدردشة المتقدم",
      color: "medical-blue",
      link: "/consultations",
      buttonText: "ابدأ الاستشارة"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            خدماتنا الطبية
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم لك مجموعة شاملة من الخدمات الطبية المتطورة لضمان صحتك وسلامتك
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="h-full bg-background/80 backdrop-blur-sm border-0 shadow-card hover:shadow-hover transition-all duration-300 group">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    {typeof feature.icon === 'string' ? (
                      <img 
                        src={feature.icon} 
                        alt={feature.title}
                        className="w-16 h-16 mx-auto"
                      />
                    ) : (
                      <div className={`w-16 h-16 mx-auto bg-${feature.color} rounded-full flex items-center justify-center`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </motion.div>

                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                    {feature.description}
                  </p>

                  <Button 
                    asChild
                    className="w-full bg-gradient-medical text-white shadow-medical hover:shadow-hover group"
                  >
                    <Link to={feature.link} className="flex items-center justify-center gap-2">
                      {feature.buttonText}
                      <ArrowLeft className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-medical p-8 rounded-2xl shadow-medical max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              جاهز لبدء رحلتك نحو صحة أفضل؟
            </h3>
            <p className="text-white/90 text-lg mb-6">
              انضم إلى آلاف المرضى الذين وثقوا بنا في رحلتهم الصحية
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold"
            >
              <Link to="/risk-assessment">
                ابدأ التقييم المجاني الآن
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;