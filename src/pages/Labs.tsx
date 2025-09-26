import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, MapPin, Clock, Star, Phone, Search } from "lucide-react";
import { useState } from "react";

const Labs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const labs = [
    {
      id: 1,
      name: "معامل البرج الطبية",
      address: "شارع التحرير، وسط البلد",
      phone: "02-123-4567",
      rating: 4.8,
      reviews: 245,
      services: ["تحاليل دم", "أشعة", "تحاليل بول", "هرمونات"],
      hours: "8:00 ص - 10:00 م",
      price: "150-300 جنيه",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "مختبرات الفا الطبية",
      address: "شارع النصر، مدينة نصر",
      phone: "02-234-5678",
      rating: 4.6,
      reviews: 189,
      services: ["PCR", "تحاليل كوليسترول", "وظائف كبد", "سكر"],
      hours: "7:00 ص - 9:00 م",
      price: "100-250 جنيه",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "معامل المختبر المركزي",
      address: "شارع الجمهورية، الزمالك",
      phone: "02-345-6789",
      rating: 4.9,
      reviews: 312,
      services: ["تحاليل شاملة", "فيتامينات", "معادن", "مناعة"],
      hours: "6:00 ص - 11:00 م",
      price: "200-400 جنيه",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      name: "مجمع الشفاء الطبي",
      address: "شارع الهرم، الجيزة",
      phone: "02-456-7890",
      rating: 4.5,
      reviews: 156,
      services: ["تحاليل حمل", "غدة درقية", "فيروسات", "بكتيريا"],
      hours: "8:00 ص - 8:00 م",
      price: "120-280 جنيه",
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      name: "معامل الحياة الطبية",
      address: "شارع السودان، المهندسين",
      phone: "02-567-8901",
      rating: 4.7,
      reviews: 203,
      services: ["تحاليل وراثية", "خصوبة", "حساسية", "سموم"],
      hours: "7:30 ص - 9:30 م",
      price: "180-350 جنيه",
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      name: "مختبرات الأمل الطبية",
      address: "شارع الثورة، مصر الجديدة",
      phone: "02-678-9012",
      rating: 4.4,
      reviews: 127,
      services: ["تحليل دهون", "إنزيمات", "بروتينات", "عوامل تجلط"],
      hours: "9:00 ص - 7:00 م",
      price: "90-220 جنيه",
      image: "/api/placeholder/300/200"
    }
  ];

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <FlaskConical className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              معامل التحاليل الطبية
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              اعثر على أفضل معامل التحاليل الطبية في منطقتك واحجز موعدك بسهولة
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن معمل أو نوع التحليل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 shadow-card"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLabs.map((lab, index) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group">
                  <div className="relative h-48 bg-gradient-medical">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FlaskConical className="h-16 w-16 text-white opacity-80" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white backdrop-blur-sm">
                        {lab.price}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground mb-2">
                          {lab.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {lab.address}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 bg-medical-success/10 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-medical-success fill-current" />
                        <span className="text-sm font-medium text-medical-success">
                          {lab.rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {lab.hours}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {lab.phone}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">الخدمات المتاحة:</p>
                        <div className="flex flex-wrap gap-1">
                          {lab.services.slice(0, 3).map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {lab.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{lab.services.length - 3} أخرى
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button className="w-full bg-gradient-medical text-white shadow-medical hover:opacity-90">
                          احجز موعد
                        </Button>
                        <Button variant="outline" className="w-full">
                          عرض التفاصيل
                        </Button>
                      </div>

                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">
                          {lab.reviews} تقييم
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredLabs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FlaskConical className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-muted-foreground">
                لم نجد معامل تحاليل تطابق بحثك. جرب كلمات مختلفة.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Labs;