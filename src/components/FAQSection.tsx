import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "هل يمكنني الوثوق بدقة النتائج؟",
      answer: "نعم، تعتمد خوارزمياتنا على دراسات طبية معتمدة وبيانات من آلاف الحالات. لكن تذكر أن النتائج استرشادية وليست تشخيصاً طبياً نهائياً."
    },
    {
      question: "هل بياناتي الصحية آمنة؟",
      answer: "نعم، نحن ملتزمون بأعلى معايير الأمان والخصوصية. جميع البيانات مشفرة ولا نشاركها مع أطراف ثالثة إلا بموافقتك الصريحة."
    },
    {
      question: "كم من الوقت يستغرق التقييم؟",
      answer: "يستغرق التقييم من 3-5 دقائق فقط. النموذج مقسم إلى خطوات بسيطة ويمكنك حفظ التقدم والعودة لاحقاً."
    },
    {
      question: "هل يمكنني استخدام النتائج مع طبيبي؟",
      answer: "نعم، يمكنك تحميل تقرير PDF شامل وعرضه على طبيبي. سيساعده هذا في فهم حالتك بشكل أفضل واتخاذ قرارات طبية مناسبة."
    },
    {
      question: "كم مرة يجب أن أعيد التقييم؟",
      answer: "ننصح بإعادة التقييم كل 3-6 شهور أو عند تغيير نمط حياتك. ستحصل على تذكيرات دورية إذا رغبت في ذلك."
    }
  ];

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
            الأسئلة الشائعة
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            إجابات على أهم الأسئلة حول خدماتنا الطبية
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg shadow-card hover:shadow-hover transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-right text-lg font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground text-right leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;