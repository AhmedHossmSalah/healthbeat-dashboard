import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا سيتم إرسال الرسالة (يحتاج إلى backend)
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <footer className="bg-gradient-medical text-white">
      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              نحن هنا لمساعدتك. تواصل معنا في أي وقت وسنقوم بالرد عليك في أقرب وقت ممكن
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-hover">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <Send className="h-8 w-8" />
                    أرسل لنا رسالة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        placeholder="الاسم الكامل"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="رسالتك"
                        value={contactForm.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/70 min-h-32"
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                    >
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">معلومات التواصل</h3>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">الهاتف</p>
                    <p className="text-white/80">+966 50 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">البريد الإلكتروني</p>
                    <p className="text-white/80">info@sehti.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">العنوان</p>
                    <p className="text-white/80">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold">ساعات العمل</h4>
                <div className="space-y-2">
                  <p className="text-white/90">السبت - الخميس: 8:00 ص - 10:00 م</p>
                  <p className="text-white/90">الجمعة: 2:00 م - 10:00 م</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="border-t border-white/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">صحتي</h1>
                  <p className="text-sm text-white/70">نظام الكشف الطبي</p>
                </div>
              </Link>
              <p className="text-white/80 text-sm">
                منصة طبية ذكية لفحص المخاطر الصحية والاستشارات الطبية
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/80 hover:text-white transition-colors">الرئيسية</Link></li>
                <li><Link to="/doctors" className="text-white/80 hover:text-white transition-colors">الأطباء</Link></li>
                <li><Link to="/risk-assessment" className="text-white/80 hover:text-white transition-colors">فحص المخاطر</Link></li>
                <li><Link to="/labs" className="text-white/80 hover:text-white transition-colors">معامل التحاليل</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">خدماتنا</h4>
              <ul className="space-y-2">
                <li><span className="text-white/80">فحص السكري</span></li>
                <li><span className="text-white/80">فحص أمراض القلب</span></li>
                <li><span className="text-white/80">فحص ضغط الدم</span></li>
                <li><span className="text-white/80">استشارات طبية</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">القانونية</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-white/80 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
                <li><Link to="/terms" className="text-white/80 hover:text-white transition-colors">الشروط والأحكام</Link></li>
                <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">عن الموقع</Link></li>
                <li><Link to="/contact" className="text-white/80 hover:text-white transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8">
            <div className="text-center">
              <p className="text-white/70">
                © 2024 صحتي - جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;