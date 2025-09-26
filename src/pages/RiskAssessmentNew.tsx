import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Activity, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DiabetesAssessment from "@/components/assessments/DiabetesAssessment";
import HeartAssessment from "@/components/assessments/HeartAssessment";
import BloodPressureAssessment from "@/components/assessments/BloodPressureAssessment";

const RiskAssessmentNew = () => {
  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <section className="bg-gradient-medical text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">تقييم المخاطر الصحية</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              احصل على تقييم ذكي لحالتك الصحية باستخدام أحدث تقنيات الذكاء الاصطناعي
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
                <h2 className="text-2xl font-bold text-foreground mb-4">ما هو فحص المخاطر الطبية؟</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  يقدم لك هذا الفحص تقييماً مبدئياً لمخاطر إصابتك ببعض الأمراض المزمنة بناءً على بياناتك الصحية وعاداتك اليومية.
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-3">كيف يعمل الفحص؟</h3>
                <p className="text-muted-foreground leading-relaxed">
                  من خلال خطوات بسيطة، ستجيب على مجموعة من الأسئلة. تعتمد خوارزمياتنا المتقدمة على أحدث الدراسات الطبية لتحليل بياناتك وتقديم تقرير شامل.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Assessment Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <Tabs defaultValue="diabetes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="diabetes" className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  خطر السكري
                </TabsTrigger>
                <TabsTrigger value="heart" className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  خطر أمراض القلب
                </TabsTrigger>
                <TabsTrigger value="blood-pressure" className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  خطر ارتفاع ضغط الدم
                </TabsTrigger>
              </TabsList>

              <TabsContent value="diabetes" className="mt-8">
                <DiabetesAssessment />
              </TabsContent>

              <TabsContent value="heart" className="mt-8">
                <HeartAssessment />
              </TabsContent>

              <TabsContent value="blood-pressure" className="mt-8">
                <BloodPressureAssessment />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RiskAssessmentNew;