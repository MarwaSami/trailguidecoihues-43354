import { Outlet } from "react-router-dom";
import { Header, CorporateNavigation } from "@/components/ui/navigation";

export default function CorporateLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border shadow-sm">
          <div className="p-6">
            <CorporateNavigation />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}