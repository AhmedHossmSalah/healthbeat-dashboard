import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-card">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-8xl mb-6">🩺</div>
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          الصفحة غير موجودة
        </h2>
        <p className="mb-8 text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-medical text-white px-8 py-6 text-lg">
            <Link to="/" className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="px-8 py-6 text-lg">
            <Link to="/doctors" className="flex items-center gap-3">
              تصفح الأطباء
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-medical-light-blue rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            هل تحتاج مساعدة؟
          </h3>
          <p className="text-muted-foreground">
            يمكنك البدء بفحص المخاطر الصحية أو البحث عن أطباء متخصصين
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
