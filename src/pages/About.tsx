import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Heart, Users, Award, Target, Shield, CheckCircle } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "الاهتمام بالمريض",
      description: "نضع المريض في المقدمة ونسعى لتقديم أفضل رعاية صحية ممكنة"
    },
    {
      icon: Shield,
      title: "الخصوصية والأمان",
      description: "نحافظ على سرية بياناتك الصحية بأعلى معايير الأمان والحماية"
    },
    {
      icon: Award,
      title: "الجودة والتميز",
      description: "نلتزم بتقديم خدمات طبية عالية الجودة وفق أحدث المعايير العالمية"
    },
    {
      icon: Users,
      title: "فريق متخصص",
      description: "يضم فريقنا نخبة من الأطباء والمتخصصين ذوي الخبرة الواسعة"
    }
  ];

  const achievements = [
    { number: "10,000+", label: "مريض راضٍ" },
    { number: "500+", label: "طبيب متخصص" },
    { number: "50+", label: "معمل تحاليل" },
    { number: "98%", label: "معدل الرضا" }
  ];

  const features = [
    "تقييم دقيق للمخاطر الصحية باستخدام الذكاء الاصطناعي",
    "شبكة واسعة من الأطباء المتخصصين",
    "معامل تحاليل معتمدة وموثوقة",
    "تقارير طبية شاملة ومفصلة",
    "متابعة مستمرة للحالة الصحية",
    "حماية كاملة لخصوصية البيانات"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-card py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mx-auto w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center mb-6 shadow-medical">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              عن موقع صحتي
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              منصة طبية شاملة تهدف إلى تقديم أفضل الخدمات الصحية وتقييم المخاطر الطبية باستخدام أحدث التقنيات
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-medical rounded-full opacity-20"></div>
                <Card className="shadow-card">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="h-8 w-8 text-primary" />
                      <h2 className="text-3xl font-bold text-foreground">رسالتنا</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      نسعى إلى تمكين الأفراد من اتخاذ قرارات صحية مدروسة من خلال توفير تقييمات طبية دقيقة وشاملة، 
                      وربطهم بشبكة موثوقة من المتخصصين والمرافق الطبية عالية الجودة.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-medical rounded-full opacity-20"></div>
                <Card className="shadow-card">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Heart className="h-8 w-8 text-medical-danger" />
                      <h2 className="text-3xl font-bold text-foreground">رؤيتنا</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      أن نكون المنصة الرائدة في مجال الرعاية الصحية الرقمية في المنطقة، 
                      ونساهم في تحسين مستوى الصحة العامة من خلال التكنولوجيا المتقدمة والخدمات المتميزة.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">قيمنا الأساسية</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نلتزم بمجموعة من القيم الأساسية التي توجه عملنا وتضمن تقديم أفضل خدمة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                لماذا تختار صحتي؟
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                نقدم مجموعة شاملة من الخدمات الطبية المتطورة التي تساعدك على الاهتمام بصحتك بشكل أفضل
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-medical-success flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                    إنجازاتنا
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold text-primary mb-2">
                          {achievement.number}
                        </div>
                        <div className="text-muted-foreground">
                          {achievement.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;