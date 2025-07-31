import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const defaultSettings = {
  darkTheme: true,
  highContrast: false,
  fontSize: "medium",
  emailAlerts: true,
  pushNotifications: true,
  alertThreshold: 75,
  updateFrequency: 30,
  measurementUnit: "dB",
  language: "English",
  dataSharing: true,
  analytics: true,
  profile: {
    name: "Admin User",
    email: "jones@gmail.com",
    picture: "https://ui-avatars.com/api/?name=Admin+User"
  }
};

const SETTINGS_KEY = "urban_noise_settings";

export default function SettingsDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [settings, setSettings] = useState(defaultSettings);
  const { theme, setTheme } = useTheme();
  const { userData } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const savedSettings = JSON.parse(saved);
      // Update profile with current user data if available
      if (userData) {
        savedSettings.profile = {
          name: userData.name,
          email: userData.email,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`
        };
      }
      setSettings(savedSettings);
    } else if (userData) {
      // If no saved settings, initialize with user data
      const userSettings = {
        ...defaultSettings,
        profile: {
          name: userData.name,
          email: userData.email,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`
        }
      };
      setSettings(userSettings);
    }
  }, [open, userData]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };
  const handleProfileChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  };
  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setOpen(false);
  };
  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-gray-800 z-10 p-6 pb-2">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form className="p-6 pt-2 space-y-8">
          {/* Profile Section */}
          <section>
            <h3 className="font-semibold text-lg mb-2">Profile</h3>
            <div className="flex items-center gap-4 mb-4">
              <img src={settings.profile.picture} alt="Profile" className="w-16 h-16 rounded-full border-2 border-emerald-400 object-cover" />
              <div className="flex-1 space-y-2">
                <Input
                  value={settings.profile.name}
                  onChange={e => handleProfileChange("name", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Name"
                />
                <Input
                  value={settings.profile.email}
                  onChange={e => handleProfileChange("email", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Email"
                  type="email"
                />
                <Input
                  value={settings.profile.picture}
                  onChange={e => handleProfileChange("picture", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Profile Picture URL"
                />
              </div>
            </div>
          </section>

          {/* Display Settings */}
          <section>
            <h3 className="font-semibold text-lg mb-2">Display Settings</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Dark Theme</span>
              <input type="checkbox" checked={settings.darkTheme} onChange={e => handleChange("darkTheme", e.target.checked)} className="accent-emerald-500 w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>High Contrast</span>
              <input type="checkbox" checked={settings.highContrast} onChange={e => handleChange("highContrast", e.target.checked)} className="accent-emerald-500 w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Font Size</span>
              <select value={settings.fontSize} onChange={e => handleChange("fontSize", e.target.value)} className="bg-gray-700 border-gray-600 rounded p-1">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Theme</span>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value as "light" | "dark")}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Email Alerts</span>
              <input type="checkbox" checked={settings.emailAlerts} onChange={e => handleChange("emailAlerts", e.target.checked)} className="accent-emerald-500 w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Push Notifications</span>
              <input type="checkbox" checked={settings.pushNotifications} onChange={e => handleChange("pushNotifications", e.target.checked)} className="accent-emerald-500 w-5 h-5" />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Alert Threshold</label>
              <input
                type="range"
                min={60}
                max={100}
                value={settings.alertThreshold}
                onChange={e => handleChange("alertThreshold", Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>60 dB</span>
                <span>{settings.alertThreshold} dB</span>
                <span>100 dB</span>
              </div>
            </div>
          </section>

          {/* Data Settings */}
          <section>
            <h3 className="font-semibold text-lg mb-2">Data Settings</h3>
            <div className="mb-2">
              <label className="block mb-1">Update Frequency</label>
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={settings.updateFrequency}
                onChange={e => handleChange("updateFrequency", Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10s</span>
                <span>{settings.updateFrequency}s</span>
                <span>2min</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Measurement Unit</span>
              <select value={settings.measurementUnit} onChange={e => handleChange("measurementUnit", e.target.value)} className="bg-gray-700 border-gray-600 rounded p-1">
                <option value="dB">dB</option>
                <option value="sone">Sone</option>
              </select>
            </div>
          </section>

          {/* Language & Privacy */}
          <section>
            <h3 className="font-semibold text-lg mb-2">Language & Privacy</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Language</span>
              <select value={settings.language} onChange={e => handleChange("language", e.target.value)} className="bg-gray-700 border-gray-600 rounded p-1">
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
              </select>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Data Sharing</span>
              <input type="checkbox" checked={settings.dataSharing} onChange={e => handleChange("dataSharing", e.target.checked)} className="accent-emerald-500 w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Analytics</span>
              <input type="checkbox" checked={settings.analytics} onChange={e => handleChange("analytics", e.target.checked)} className="accent-emerald-500 w-5 h-5" />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-4 border-t border-gray-700">
            <Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={handleReset}>Reset Defaults</Button>
            <Button type="button" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>Save Settings</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}