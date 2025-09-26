import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const HeartAssessment = () => {
  return (
    <Card className="shadow-card">
      <CardContent className="p-8 text-center">
        <Heart className="h-16 w-16 mx-auto text-medical-danger mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-4">فحص أمراض القلب</h3>
        <p className="text-muted-foreground">
          أمراض القلب هي مجموعة من الحالات التي تؤثر على القلب. يمكن أن تؤثر على عضلة القلب، صمامات القلب، أو الشرايين التاجية التي تزود القلب بالدم.
        </p>
        <p className="text-primary mt-4 font-semibold">قريباً - تحت التطوير</p>
      </CardContent>
    </Card>
  );
};

export default HeartAssessment;