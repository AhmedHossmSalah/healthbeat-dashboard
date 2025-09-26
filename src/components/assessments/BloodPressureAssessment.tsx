import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

const BloodPressureAssessment = () => {
  return (
    <Card className="shadow-card">
      <CardContent className="p-8 text-center">
        <Activity className="h-16 w-16 mx-auto text-medical-warning mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-4">فحص ارتفاع ضغط الدم</h3>
        <p className="text-muted-foreground">
          ارتفاع ضغط الدم (فرط ضغط الدم) هو حالة شائعة تزداد فيها قوة دفع الدم ضد جدران الشرايين بشكل عالٍ بما يكفي للتسبب في مشاكل صحية مع مرور الوقت.
        </p>
        <p className="text-primary mt-4 font-semibold">قريباً - تحت التطوير</p>
      </CardContent>
    </Card>
  );
};

export default BloodPressureAssessment;