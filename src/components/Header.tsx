
import { Activity, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

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
          <Dialog>
            <DialogTrigger asChild>
              <button className="ml-2 focus:outline-none">
                <Avatar />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 border-none shadow-2xl p-8 rounded-2xl max-w-md text-white futuristic-glow">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-wide mb-2 text-emerald-400 drop-shadow">User Settings</DialogTitle>
                <DialogDescription className="mb-6 text-gray-300">
                  Manage your profile and account settings below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 border-4 border-emerald-400 shadow-lg" />
                  <div>
                    <div className="font-semibold text-lg">Username</div>
                    <button className="text-emerald-400 hover:underline text-sm mt-1">Set Username</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-emerald-700 hover:bg-emerald-600 transition rounded-lg px-4 py-2 font-medium shadow">Change Password</button>
                  <button className="bg-gray-700 hover:bg-gray-600 transition rounded-lg px-4 py-2 font-medium shadow">Update Profile Picture</button>
                  <button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 transition rounded-lg px-4 py-2 font-medium shadow">Other Settings</button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

// Add a custom class for a futuristic glow effect
// In your global CSS (e.g., index.css or App.css), add:
// .futuristic-glow {
//   box-shadow: 0 0 32px 4px #34d39955, 0 0 8px 2px #10b98199;
//   border: 1px solid #10b98133;
// }
