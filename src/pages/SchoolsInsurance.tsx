import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, MapPin, Phone, Search, Users, CheckCircle, Star } from "lucide-react";
import { useState } from "react";

const SchoolsInsurance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("schools");

  const schools = [
    {
      id: 1,
      name: "مدرسة النصر الخاصة",
      type: "مدرسة خاصة",
      address: "شارع الجامعة، مدينة نصر",
      phone: "02-234-5678",
      students: 1200,
      services: ["فحص دوري", "تطعيمات", "إسعافات أولية", "تثقيف صحي"],
      rating: 4.7,
      partnership: "شراكة ذهبية"
    },
    {
      id: 2,
      name: "مدارس الأمل الدولية",
      type: "مدرسة دولية",
      address: "التجمع الخامس، القاهرة الجديدة",
      phone: "02-345-6789",
      students: 800,
      services: ["فحص شامل", "طب نفسي", "تغذية", "رياضة"],
      rating: 4.9,
      partnership: "شراكة بلاتينية"
    },
    {
      id: 3,
      name: "مجمع مدارس المستقبل",
      type: "مدرسة حكومية",
      address: "شارع الأهرام، الجيزة",
      phone: "02-456-7890",
      students: 2000,
      services: ["فحص أساسي", "تطعيمات", "طوارئ"],
      rating: 4.3,
      partnership: "شراكة فضية"
    },
    {
      id: 4,
      name: "أكاديمية العلوم الحديثة",
      type: "أكاديمية",
      address: "المعادي، القاهرة",
      phone: "02-567-8901",
      students: 600,
      services: ["فحص متقدم", "صحة نفسية", "تغذية متخصصة"],
      rating: 4.8,
      partnership: "شراكة ذهبية"
    }
  ];

  const insuranceCompanies = [
    {
      id: 1,
      name: "شركة التأمين الطبي المصرية",
      type: "تأمين صحي",
      coverage: "تغطية شاملة",
      phone: "19123",
      members: 500000,
      services: ["فحص دوري", "عمليات", "أدوية", "طوارئ"],
      rating: 4.5,
      partnership: "شراكة ذهبية"
    },
    {
      id: 2,
      name: "مجموعة الرعاية الصحية",
      type: "تأمين خاص",
      coverage: "تغطية متميزة",
      phone: "19456",
      members: 250000,
      services: ["فحص شامل", "استشارات", "تحاليل", "أشعة"],
      rating: 4.7,
      partnership: "شراكة بلاتينية"
    },
    {
      id: 3,
      name: "شركة الحماية الصحية",
      type: "تأمين عائلي",
      coverage: "تغطية أساسية",
      phone: "19789",
      members: 300000,
      services: ["فحص أساسي", "طوارئ", "أدوية أساسية"],
      rating: 4.2,
      partnership: "شراكة فضية"
    },
    {
      id: 4,
      name: "التأمين الطبي الشامل",
      type: "تأمين متكامل",
      coverage: "تغطية كاملة",
      phone: "19321",
      members: 400000,
      services: ["فحص شامل", "عمليات", "علاج طبيعي", "أسنان"],
      rating: 4.6,
      partnership: "شراكة ذهبية"
    }
  ];

  const currentData = activeTab === "schools" ? schools : insuranceCompanies;
  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPartnershipColor = (partnership: string) => {
    switch (partnership) {
      case "شراكة بلاتينية": return "bg-gray-100 text-gray-800";
      case "شراكة ذهبية": return "bg-yellow-100 text-yellow-800";
      case "شراكة فضية": return "bg-slate-100 text-slate-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-card py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="mx-auto w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center mb-6 shadow-medical">
              {activeTab === "schools" ? 
                <GraduationCap className="h-10 w-10 text-white" /> :
                <Shield className="h-10 w-10 text-white" />
              }
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              المدارس وشركات التأمين
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              شبكة واسعة من الشراكات مع المؤسسات التعليمية وشركات التأمين لتقديم أفضل الخدمات الصحية
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-card rounded-lg p-1 shadow-card">
              <Button
                variant={activeTab === "schools" ? "default" : "ghost"}
                className={`px-6 py-2 rounded-md ${activeTab === "schools" ? "bg-gradient-medical text-white shadow-medical" : ""}`}
                onClick={() => setActiveTab("schools")}
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                المدارس
              </Button>
              <Button
                variant={activeTab === "insurance" ? "default" : "ghost"}
                className={`px-6 py-2 rounded-md ${activeTab === "insurance" ? "bg-gradient-medical text-white shadow-medical" : ""}`}
                onClick={() => setActiveTab("insurance")}
              >
                <Shield className="h-5 w-5 mr-2" />
                شركات التأمين
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder={`ابحث عن ${activeTab === "schools" ? "مدرسة" : "شركة تأمين"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 shadow-card"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group">
                  <div className="relative h-32 bg-gradient-medical">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {activeTab === "schools" ? 
                        <GraduationCap className="h-12 w-12 text-white opacity-80" /> :
                        <Shield className="h-12 w-12 text-white opacity-80" />
                      }
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getPartnershipColor(item.partnership)}>
                        {item.partnership}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground mb-2">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mb-2">
                          {item.type}
                        </CardDescription>
                        {activeTab === "schools" ? (
                          <CardDescription className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {(item as any).address}
                          </CardDescription>
                        ) : (
                          <CardDescription className="text-muted-foreground">
                            {(item as any).coverage}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-medical-success/10 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-medical-success fill-current" />
                        <span className="text-sm font-medium text-medical-success">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {item.phone}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {activeTab === "schools" ? 
                          `${(item as any).students} طالب` :
                          `${(item as any).members.toLocaleString()} عضو`
                        }
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">الخدمات المتاحة:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.services.slice(0, 3).map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {item.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.services.length - 3} أخرى
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button className="w-full bg-gradient-medical text-white shadow-medical hover:opacity-90">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          تفعيل الشراكة
                        </Button>
                        <Button variant="outline" className="w-full">
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              {activeTab === "schools" ? 
                <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" /> :
                <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              }
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-muted-foreground">
                لم نجد {activeTab === "schools" ? "مدارس" : "شركات تأمين"} تطابق بحثك. جرب كلمات مختلفة.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              مزايا الشراكة معنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم حلول صحية متكاملة للمؤسسات التعليمية وشركات التأمين
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "تقييم دوري", description: "فحص صحي شامل ودوري للطلاب والموظفين" },
              { title: "تقارير مفصلة", description: "تقارير طبية شاملة وتحليل للبيانات الصحية" },
              { title: "استشارات طبية", description: "وصول مباشر لشبكة واسعة من الأطباء المتخصصين" },
              { title: "تكلفة مناسبة", description: "أسعار تنافسية وخطط دفع مرنة تناسب الميزانيات" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <CheckCircle className="h-12 w-12 mx-auto text-medical-success mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolsInsurance;