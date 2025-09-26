import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: "البيانات التي نجمعها",
      content: [
        "المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف",
        "البيانات الصحية: المعلومات الطبية التي تقدمها في النماذج",
        "بيانات الاستخدام: كيفية تفاعلك مع الموقع والخدمات",
        "معلومات تقنية: عنوان IP، نوع المتصفح، نظام التشغيل"
      ]
    },
    {
      icon: Eye,
      title: "كيف نستخدم بياناتك",
      content: [
        "تقديم الخدمات الطبية والتقييمات الصحية المطلوبة",
        "تحسين جودة الخدمات وتطوير ميزات جديدة",
        "التواصل معك بخصوص حسابك أو الخدمات",
        "إرسال تحديثات مهمة أو معلومات صحية مفيدة (بموافقتك)"
      ]
    },
    {
      icon: Lock,
      title: "حماية بياناتك",
      content: [
        "تشفير جميع البيانات الحساسة باستخدام تقنيات متقدمة",
        "استخدام بروتوكولات أمان عالية المستوى (SSL/TLS)",
        "تقييد الوصول للبيانات للموظفين المخولين فقط",
        "نسخ احتياطية آمنة ومنتظمة لحماية البيانات من الفقدان"
      ]
    },
    {
      icon: UserCheck,
      title: "مشاركة البيانات",
      content: [
        "لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة",
        "قد نشارك البيانات مع مقدمي الخدمات الطبية بموافقتك",
        "نشارك المعلومات مع السلطات عند الضرورة القانونية فقط",
        "البيانات المجمعة وغير المحددة للهوية قد تُستخدم للبحث العلمي"
      ]
    }
  ];

  const rights = [
    {
      title: "الحق في الوصول",
      description: "يمكنك طلب نسخة من جميع البيانات الشخصية التي نحتفظ بها عنك"
    },
    {
      title: "الحق في التصحيح",  
      description: "يمكنك طلب تصحيح أي بيانات غير صحيحة أو غير مكتملة"
    },
    {
      title: "الحق في الحذف",
      description: "يمكنك طلب حذف بياناتك الشخصية (مع مراعاة الالتزامات القانونية)"
    },
    {
      title: "الحق في النقل",
      description: "يمكنك طلب نقل بياناتك إلى مقدم خدمة آخر بصيغة منظمة"
    },
    {
      title: "الحق في الاعتراض",
      description: "يمكنك الاعتراض على معالجة بياناتك في ظروف معينة"
    },
    {
      title: "الحق في التحكم",
      description: "يمكنك التحكم في كيفية استخدام بياناتك لأغراض التسويق"
    }
  ];

  const cookiesInfo = [
    {
      type: "ملفات تعريف الارتباط الأساسية",
      description: "ضرورية لعمل الموقع بشكل صحيح ولا يمكن تعطيلها",
      examples: "تسجيل الدخول، تفضيلات اللغة، أمان الموقع"
    },
    {
      type: "ملفات تعريف الارتباط التحليلية",
      description: "تساعدنا في فهم كيفية استخدام المستخدمين للموقع",
      examples: "عدد الزوار، الصفحات الأكثر زيارة، مدة الزيارة"
    },
    {
      type: "ملفات تعريف الارتباط الوظيفية",
      description: "تحسن تجربة المستخدم وتوفر ميزات محسنة",
      examples: "تذكر التفضيلات، تخصيص المحتوى"
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
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نحن ملتزمون بحماية خصوصيتك وأمان بياناتك الشخصية والصحية
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

          {/* User Rights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              حقوقك كمستخدم
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 text-center">
                    <CardContent className="p-6">
                      <UserCheck className="h-12 w-12 mx-auto text-primary mb-4" />
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        {right.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {right.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cookies Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              ملفات تعريف الارتباط (Cookies)
            </h2>
            
            <div className="space-y-6">
              {cookiesInfo.map((cookie, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {cookie.type}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {cookie.description}
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>أمثلة:</strong> {cookie.examples}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-primary shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      تواصل معنا
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ترغب في ممارسة أي من حقوقك، 
                      يرجى التواصل معنا عبر:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• البريد الإلكتروني: privacy@sehty.com</li>
                      <li>• صفحة اتصل بنا على الموقع</li>
                      <li>• الهاتف: 02-123-4567 (أوقات العمل: 9 صباحاً - 6 مساءً)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      سنقوم بالرد على استفساراتك خلال 72 ساعة من تلقي طلبك.
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

export default Privacy;