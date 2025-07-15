
import { Activity, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">UrbanSound Monitor</h1>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Live Data
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
