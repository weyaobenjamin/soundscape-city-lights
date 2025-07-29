
import { Activity, Settings, Bell, LogOut, Search, Users, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/sonner";
import SettingsDialog from "./SettingsDialog";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

// List of searchable Kenyan locations
const SEARCHABLE_LOCATIONS = [
  { name: "Jomo Kenyatta International Airport", lat: -1.3192, lng: 36.9275, type: "aircraft" },
  { name: "Moi International Airport", lat: -4.0348, lng: 39.5942, type: "aircraft" },
  { name: "Eldoret International Airport", lat: 0.4045, lng: 35.2389, type: "aircraft" },
  { name: "Kisumu International Airport", lat: -0.0861, lng: 34.7289, type: "aircraft" },
  { name: "Wilson Airport", lat: -1.3217, lng: 36.8148, type: "aircraft" },
  { name: "Mombasa Road (A109)", lat: -1.3341, lng: 36.8590, type: "traffic" },
  { name: "Thika Superhighway (A2)", lat: -1.2107, lng: 36.9261, type: "traffic" },
  { name: "Nairobi Southern Bypass", lat: -1.3345, lng: 36.7516, type: "traffic" },
  { name: "Northern Corridor", lat: 0.5143, lng: 35.2698, type: "traffic" },
  { name: "Nairobi Railway Station", lat: -1.2921, lng: 36.8285, type: "railway" },
  { name: "Mombasa Railway Station", lat: -4.0435, lng: 39.6682, type: "railway" },
  { name: "Kisumu Railway Station", lat: -0.0917, lng: 34.7594, type: "railway" },
  { name: "Nakuru Railway Station", lat: -0.2833, lng: 36.0667, type: "railway" },
  { name: "Port of Mombasa", lat: -4.0639, lng: 39.6231, type: "port" },
  { name: "Nairobi Industrial Area", lat: -1.3032, lng: 36.8452, type: "industrial" },
  { name: "Athi River Industrial Zone", lat: -1.4562, lng: 37.0064, type: "industrial" },
  { name: "Ruaraka Industrial Area", lat: -1.2467, lng: 36.8822, type: "industrial" },
  { name: "Mombasa Industrial Area", lat: -4.0435, lng: 39.6682, type: "industrial" },
  { name: "Nairobi CBD", lat: -1.2833, lng: 36.8167, type: "urban" },
  { name: "Westlands", lat: -1.2647, lng: 36.8028, type: "urban" },
  { name: "Kibera", lat: -1.3127, lng: 36.7926, type: "urban" },
  { name: "Kisumu CBD", lat: -0.1022, lng: 34.7617, type: "urban" },
  { name: "Mombasa CBD", lat: -4.0435, lng: 39.6682, type: "urban" },
  { name: "Eldoret CBD", lat: 0.5204, lng: 35.2698, type: "urban" },
  { name: "Nakuru CBD", lat: -0.3031, lng: 36.0800, type: "urban" },
];

export const Header = ({ 
  onShowSettings, 
  onShowNotification, 
  onLocationSelect,
  noiseData,
  users,
  onUsersChange,
  notifications
}: { 
  onShowSettings?: () => void; 
  onShowNotification?: () => void;
  onLocationSelect?: (location: any) => void;
  noiseData?: any[];
  users?: { email: string; role: string }[];
  onUsersChange?: (users: { email: string; role: string }[]) => void;
  notifications?: { name: string; level: number; type: string }[];
}) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [claimsOpen, setClaimsOpen] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);
  // Load claims from localStorage
  useEffect(() => {
    setClaims(JSON.parse(localStorage.getItem("noise_reports") || "[]"));
  }, [claimsOpen]);

  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleNotification = () => {
    if (onShowNotification) {
      onShowNotification();
    } else {
      toast("Noise spike detected!", {
        description: "A sudden spike in noise levels was detected in the city.",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = SEARCHABLE_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    setShowSearchResults(false);
    setSearchQuery("");
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    // Show toast notification instead of popup
    toast("Location Selected", {
      description: `Viewing ${location.name} on the map.`,
    });
  };

  const handleRemoveUser = (email: string) => {
    if (users && onUsersChange) {
      const updatedUsers = users.filter(user => user.email !== email);
      onUsersChange(updatedUsers);
      toast("User removed", {
        description: `${email} has been removed from the system.`,
      });
    }
  };

  const handleTogglePrivilege = (email: string) => {
    if (users && onUsersChange) {
      const updatedUsers = users.map(user => 
        user.email === email 
          ? { ...user, role: user.role === "user" ? "analyst" : "user" }
          : user
      );
      onUsersChange(updatedUsers);
      toast("Privilege updated", {
        description: `${email} role changed to ${updatedUsers.find(u => u.email === email)?.role}.`,
      });
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Urban Noise Monitor</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for places in Kenya..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white border-b border-gray-600 last:border-b-0"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-400 capitalize">{location.type}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Notification Icon with Dot */}
          <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-gray-800 animate-pulse"></span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Noise Alerts Above 75dB</DialogTitle>
                <DialogDescription>
                  {(!notifications || notifications.length === 0) ? (
                    <span className="text-gray-400">No high noise alerts at this time.</span>
                  ) : (
                    <ul className="space-y-2 mt-2 max-h-72 overflow-y-auto">
                      {notifications.map((notif, idx) => (
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
          
          {/* Admin Users Management */}
          {users && users.length > 0 && (
            <Dialog open={adminPanelOpen} onOpenChange={setAdminPanelOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" aria-label="User Management">
                  <Users className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Active Users & Privileges</DialogTitle>
                  <DialogDescription>
                    Manage user accounts and their access privileges.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-emerald-300">
                        <th className="py-2">Email</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.email} className="border-b border-gray-700">
                          <td className="py-2">{user.email}</td>
                          <td className="py-2 capitalize">{user.role}</td>
                          <td className="py-2 space-x-2">
                            {user.email !== "jones@gmail.com" && (
                              <>
                                <button
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                                  onClick={() => handleRemoveUser(user.email)}
                                >
                                  Remove
                                </button>
                                <button
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-white text-xs"
                                  onClick={() => handleTogglePrivilege(user.email)}
                                >
                                  Toggle Privilege
                                </button>
                              </>
                            )}
                            {user.email === "jones@gmail.com" && <span className="text-xs text-gray-400">(admin)</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Claims Icon */}
          <Dialog open={claimsOpen} onOpenChange={setClaimsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-600" aria-label="View Claims">
                <Megaphone className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Reported Noise Pollution Claims</DialogTitle>
                <DialogDescription>
                  {claims.length === 0 ? (
                    <span className="text-gray-400">No reports submitted yet.</span>
                  ) : (
                    <ul className="space-y-2 mt-2 max-h-72 overflow-y-auto">
                      {claims.map((claim, idx) => (
                        <li key={idx} className="bg-gray-700 rounded px-3 py-2">
                          <div className="font-medium text-white">{claim.location}</div>
                          <div className="text-xs text-gray-300 mb-1">{new Date(claim.date).toLocaleString()}</div>
                          <div className="text-sm text-gray-200">{claim.description}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Settings Dialog (only accessible from settings icon) */}
          <SettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" aria-label="Settings" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-400 hover:bg-gray-800"
            aria-label="Theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
