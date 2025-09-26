import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Shield, Users } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: "تعريفات أساسية",
      content: [
        "الموقع: يشير إلى منصة 'صحتي' الإلكترونية وجميع خدماتها",
        "المستخدم: أي شخص يصل إلى الموقع أو يستخدم خدماته",
        "الخدمات: جميع الخدمات المقدمة عبر المنصة بما في ذلك تقييم المخاطر والاستشارات",
        "البيانات الصحية: أي معلومات تتعلق بالحالة الصحية للمستخدم"
      ]
    },
    {
      icon: Users,
      title: "قبول الشروط",
      content: [
        "استخدام هذا الموقع يعني موافقتك على جميع الشروط والأحكام المذكورة",
        "إذا كنت لا توافق على أي من هذه الشروط، يجب عدم استخدام الموقع",
        "نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق",
        "استمرار استخدامك للموقع بعد التعديل يعتبر موافقة على الشروط الجديدة"
      ]
    },
    {
      icon: Shield,
      title: "استخدام الخدمات",
      content: [
        "الخدمات المقدمة لأغراض المعلومات والإرشاد فقط وليست بديلاً عن الاستشارة الطبية",
        "يجب استشارة طبيب مختص قبل اتخاذ أي قرار طبي بناءً على المعلومات المقدمة",
        "لا يجوز استخدام الموقع لأغراض غير قانونية أو ضارة",
        "يحظر نشر أو مشاركة محتوى مضلل أو ضار عبر المنصة"
      ]
    },
    {
      icon: AlertTriangle,
      title: "المسؤوليات والضمانات",
      content: [
        "لا نضمن دقة أو اكتمال المعلومات المقدمة عبر الموقع",
        "لا نتحمل المسؤولية عن أي أضرار قد تنتج عن استخدام الموقع",
        "المستخدم مسؤول عن حماية بيانات حسابه وكلمة المرور",
        "نحتفظ بالحق في إيقاف أو تعديل الخدمات في أي وقت"
      ]
    }
  ];

  const additionalTerms = [
    {
      title: "الملكية الفكرية",
      description: "جميع المحتويات والعلامات التجارية على الموقع مملوكة لنا أو لشركائنا. يحظر نسخ أو توزيع المحتوى دون إذن مسبق."
    },
    {
      title: "الخصوصية",
      description: "نلتزم بحماية خصوصيتك وفقاً لسياسة الخصوصية المنشورة على الموقع. يرجى مراجعة سياسة الخصوصية لفهم كيفية جمع واستخدام بياناتك."
    },
    {
      title: "إنهاء الخدمة",
      description: "يحق لنا إنهاء أو تعليق حسابك في حالة انتهاك الشروط والأحكام. كما يحق لك إنهاء حسابك في أي وقت."
    },
    {
      title: "القانون المطبق",
      description: "تخضع هذه الشروط والأحكام للقوانين المعمول بها في جمهورية مصر العربية. أي نزاع يحل وفقاً للقضاء المصري."
    },
    {
      title: "التواصل",
      description: "لأي استفسارات حول الشروط والأحكام، يمكنك التواصل معنا عبر صفحة 'اتصل بنا' أو البريد الإلكتروني المتاح على الموقع."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mx-auto w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center mb-6 shadow-medical">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              الشروط والأحكام
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام موقع صحتي وخدماته
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              آخر تحديث: {new Date().toLocaleDateString('ar-EG', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-12 h-12 bg-gradient-medical rounded-lg flex items-center justify-center">
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              شروط إضافية مهمة
            </h2>
            
            {additionalTerms.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {term.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {term.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="border-medical-warning shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-medical-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      إشعار مهم
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      المعلومات والخدمات المقدمة على هذا الموقع لأغراض التثقيف والإرشاد الصحي فقط، 
                      وليست بديلاً عن الاستشارة الطبية المباشرة. يجب دائماً استشارة طبيب مؤهل قبل اتخاذ 
                      أي قرارات تتعلق بصحتك أو علاجك. لا نتحمل أي مسؤولية عن النتائج المترتبة على 
                      استخدام المعلومات المقدمة دون استشارة طبية مناسبة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;