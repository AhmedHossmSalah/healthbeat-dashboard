import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
    setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">اتصل بنا</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              نحن هنا لمساعدتك. تواصل معنا في أي وقت وسنقوم بالرد عليك في أقرب وقت ممكن
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-8">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-medical rounded-lg">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">الهاتف</h3>
                        <p className="text-muted-foreground">+966 50 123 4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-medical rounded-lg">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">البريد الإلكتروني</h3>
                        <p className="text-muted-foreground">info@sehti.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-medical rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">العنوان</h3>
                        <p className="text-muted-foreground">الرياض، المملكة العربية السعودية</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-medical rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">ساعات العمل</h3>
                        <div className="space-y-1 text-muted-foreground">
                          <p>السبت - الخميس: 8:00 ص - 10:00 م</p>
                          <p>الجمعة: 2:00 م - 10:00 م</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-3xl text-foreground flex items-center gap-3">
                    <Send className="h-8 w-8 text-primary" />
                    أرسل لنا رسالة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          الاسم الكامل *
                        </label>
                        <Input
                          placeholder="أدخل اسمك الكامل"
                          value={contactForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          رقم الهاتف
                        </label>
                        <Input
                          placeholder="رقم الهاتف"
                          value={contactForm.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          placeholder="البريد الإلكتروني"
                          value={contactForm.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          الموضوع
                        </label>
                        <Input
                          placeholder="موضوع الرسالة"
                          value={contactForm.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        الرسالة *
                      </label>
                      <Textarea
                        placeholder="اكتب رسالتك هنا..."
                        value={contactForm.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="text-right min-h-32"
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-medical text-white font-semibold py-6 text-lg shadow-medical hover:shadow-hover"
                    >
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;