import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Stethoscope, UserCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "الرئيسية", path: "/", slug: "home" },
    { name: "الفحوصات", path: "/assessments", slug: "assessments" },
    { name: "الأطباء", path: "/doctors", slug: "doctors" },
    { name: "معامل التحاليل", path: "/labs", slug: "labs" },
    { name: "المدارس والتأمين", path: "/schools-insurance", slug: "schools-insurance" },
    { name: "اتصل بنا", path: "/contact", slug: "contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-card"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gradient-medical rounded-lg shadow-medical"
            >
              <Stethoscope className="h-8 w-8 text-white" />
            </motion.div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-primary">صحتي</h1>
              <p className="text-sm text-muted-foreground">نظام الكشف الطبي</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50">
              تخطي إلى المحتوى
            </a>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item group inline-flex items-center px-3 py-2 rounded-md font-semibold transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-medical"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
                data-test={`nav-item-${item.slug}`}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className={`nav-indicator ml-2 w-0 h-full bg-gradient-to-b from-primary to-accent rounded transition-all duration-200 ${
                  isActive(item.path) ? "w-1" : "group-hover:w-1"
                }`} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:flex gap-2" asChild>
              <Link to="/auth">
                <UserCircle className="h-5 w-5" />
                الملف الشخصي
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-border"
          >
            <div className="flex flex-col gap-2 pt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item group inline-flex items-center justify-end px-3 py-2 rounded-md font-semibold transition-all duration-150 ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  data-test={`nav-item-${item.slug}`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`nav-indicator mr-2 w-0 h-full bg-gradient-to-b from-primary to-accent rounded transition-all duration-200 ${
                    isActive(item.path) ? "w-1" : "group-hover:w-1"
                  }`} />
                  {item.name}
                </Link>
              ))}
              <Button variant="outline" className="justify-end mt-2 gap-2" asChild>
                <Link to="/auth">
                  <UserCircle className="h-5 w-5" />
                  الملف الشخصي
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;