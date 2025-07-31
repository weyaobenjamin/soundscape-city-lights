import { useState, useEffect } from "react";
import { Bell, Sun, Moon, Settings, User, LogOut, MapPin, ChevronDown, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const THEME_KEY = "urban_noise_theme";

const mockNotifications = [
  { name: "Nairobi CBD", level: 88, type: "urban" },
  { name: "JKIA", level: 92, type: "aircraft" },
  { name: "Industrial Area", level: 85, type: "industrial" },
];

export default function UserHeader({ onSettingsClick }: { onSettingsClick?: () => void }) {
  const [notifCount, setNotifCount] = useState(mockNotifications.length);
  const { theme, setTheme } = useTheme();
  const [location] = useState("Nairobi, Kenya");
  const { userData } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLocation, setReportLocation] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reports = JSON.parse(localStorage.getItem("noise_reports") || "[]");
    reports.push({ location: reportLocation, description: reportDesc, date: new Date().toISOString() });
    localStorage.setItem("noise_reports", JSON.stringify(reports));
    setReportOpen(false);
    setReportLocation("");
    setReportDesc("");
  };

  return (
    <header className="w-full flex items-center justify-between bg-gray-900 px-4 py-2 sticky top-0 z-50 gap-2">
      {/* Logo and Title */}
      <div className="flex items-center gap-2 mr-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle"><polyline points="3 12 6 12 9 21 15 3 18 12 21 12" /></svg>
        <span className="text-white font-bold text-lg tracking-tight">Urban Noise Monitor</span>
      </div>
      {/* Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-xs">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search for places in Kenya..."
            className="pl-10 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-2-2"/></svg>
          </span>
        </div>
      </div>
      {/* Location */}
      <div className="flex items-center gap-1 text-gray-200 text-sm font-medium mx-2">
        <MapPin className="w-4 h-4 text-emerald-400" />
        {location}
      </div>
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="text-yellow-400 hover:bg-gray-800"
        aria-label="Theme"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>
      {/* Notification Bell */}
      <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-gray-200 hover:text-white" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </Button>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">{notifCount}</span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Noise Alerts Above 75dB</DialogTitle>
            <DialogDescription>
              {mockNotifications.length === 0 ? (
                <span className="text-gray-400">No high noise alerts at this time.</span>
              ) : (
                <ul className="space-y-2 mt-2 max-h-72 overflow-y-auto">
                  {mockNotifications.map((notif, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-700 rounded px-3 py-2">
                      <div>
                        <div className="font-medium text-white">{notif.name}</div>
                        <div className="text-xs text-gray-300 capitalize">{notif.type}</div>
                      </div>
                      <div className={`font-bold text-lg ${notif.level > 90 ? 'text-red-400' : notif.level > 80 ? 'text-orange-400' : 'text-yellow-400'}`}>{Math.round(notif.level)}dB</div>
                    </li>
                  ))}
                </ul>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Report Noise Icon */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-600" aria-label="Report Noise">
            <Megaphone className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Report Noise Pollution</DialogTitle>
            <DialogDescription>
              Please provide details about the noise pollution incident.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm mb-1">Location</label>
              <Input value={reportLocation} onChange={e => setReportLocation(e.target.value)} placeholder="e.g. Nairobi CBD" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} className="w-full rounded bg-gray-700 border border-gray-600 p-2 text-white" rows={3} placeholder="Describe the issue..." required />
            </div>
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">Submit Report</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Settings */}
      <Button variant="ghost" size="icon" className="text-gray-200 hover:text-white" aria-label="Settings" onClick={onSettingsClick}>
        <Settings className="w-5 h-5" />
      </Button>
      {/* Logout */}
      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" aria-label="Logout" onClick={handleLogout}>
        <LogOut className="w-5 h-5" />
      </Button>
    </header>
  );
}