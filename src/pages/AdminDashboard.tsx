
import { useState, useEffect } from "react";
import { MapView } from "@/components/MapView";
import { Dashboard, HourlyTrendChart, NoiseSourcesChart } from "@/components/Dashboard";
import { Header } from "@/components/Header";
import { SidePanel } from "@/components/SidePanel";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import StatsOverview from "@/components/StatsOverview";
import NoiseHeatmap from "@/components/NoiseHeatmap";
import TrendChart from "@/components/TrendChart";
import CurrentLevelsChart from "@/components/CurrentLevelsChart";

const ADMIN_EMAIL = "jones@gmail.com";

const AdminDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [noiseData, setNoiseData] = useState([]);
  const [lastMax, setLastMax] = useState(0);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null); // Current user state
  const [users, setUsers] = useState([
    { email: "jones@gmail.com", role: "admin" },
    { email: "user1@kenya.com", role: "user" },
    { email: "user2@kenya.com", role: "user" },
    { email: "analyst@kenya.com", role: "analyst" },
  ]);
  const [notifications, setNotifications] = useState<{ name: string; level: number; type: string }[]>([]);

  const onShowSettings = () => {
    // Settings functionality can be implemented here
    console.log("Settings clicked");
  };

  const onShowNotification = () => {
    // Notification functionality can be implemented here
    console.log("Notification clicked");
  };

  const handleUsersChange = (updatedUsers: { email: string; role: string }[]) => {
    setUsers(updatedUsers);
  };

  // List of major Kenyan locations for noise monitoring
  const KENYA_LOCATIONS = [
    // Airports
    { id: 1, name: "Jomo Kenyatta International Airport", lat: -1.3192, lng: 36.9275, type: "aircraft" },
    { id: 2, name: "Moi International Airport", lat: -4.0348, lng: 39.5942, type: "aircraft" },
    { id: 3, name: "Eldoret International Airport", lat: 0.4045, lng: 35.2389, type: "aircraft" },
    { id: 4, name: "Kisumu International Airport", lat: -0.0861, lng: 34.7289, type: "aircraft" },
    { id: 5, name: "Wilson Airport", lat: -1.3217, lng: 36.8148, type: "aircraft" },
    // Major Highways
    { id: 6, name: "Mombasa Road (A109)", lat: -1.3341, lng: 36.8590, type: "traffic" },
    { id: 7, name: "Thika Superhighway (A2)", lat: -1.2107, lng: 36.9261, type: "traffic" },
    { id: 8, name: "Nairobi Southern Bypass", lat: -1.3345, lng: 36.7516, type: "traffic" },
    { id: 9, name: "Northern Corridor", lat: 0.5143, lng: 35.2698, type: "traffic" },
    // Railways
    { id: 10, name: "Nairobi Railway Station", lat: -1.2921, lng: 36.8285, type: "railway" },
    { id: 11, name: "Mombasa Railway Station", lat: -4.0435, lng: 39.6682, type: "railway" },
    { id: 12, name: "Kisumu Railway Station", lat: -0.0917, lng: 34.7594, type: "railway" },
    { id: 13, name: "Nakuru Railway Station", lat: -0.2833, lng: 36.0667, type: "railway" },
    // Ports
    { id: 14, name: "Port of Mombasa", lat: -4.0639, lng: 39.6231, type: "port" },
    // Industrial Areas
    { id: 15, name: "Nairobi Industrial Area", lat: -1.3032, lng: 36.8452, type: "industrial" },
    { id: 16, name: "Athi River Industrial Zone", lat: -1.4562, lng: 37.0064, type: "industrial" },
    { id: 17, name: "Ruaraka Industrial Area", lat: -1.2467, lng: 36.8822, type: "industrial" },
    { id: 18, name: "Mombasa Industrial Area", lat: -4.0435, lng: 39.6682, type: "industrial" },
    // Major Urban Areas
    { id: 19, name: "Nairobi CBD", lat: -1.2833, lng: 36.8167, type: "urban" },
    { id: 20, name: "Westlands", lat: -1.2647, lng: 36.8028, type: "urban" },
    { id: 21, name: "Kibera", lat: -1.3127, lng: 36.7926, type: "urban" },
    { id: 22, name: "Kisumu CBD", lat: -0.1022, lng: 34.7617, type: "urban" },
    { id: 23, name: "Mombasa CBD", lat: -4.0435, lng: 39.6682, type: "urban" },
    { id: 24, name: "Eldoret CBD", lat: 0.5204, lng: 35.2698, type: "urban" },
    { id: 25, name: "Nakuru CBD", lat: -0.3031, lng: 36.0800, type: "urban" },
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate mock noise data for all major Kenyan locations
      const mockData = KENYA_LOCATIONS.map(loc => ({
        ...loc,
        level: Math.random() * 40 + 60 + (loc.type === "industrial" ? 10 : 0) + (loc.type === "airport" ? 10 : 0),
      }));
      setNoiseData(mockData);
      // Track notifications above 75dB
      const newNotifications = mockData.filter(d => d.level > 75).map(d => ({ name: d.name, level: d.level, type: d.type }));
      setNotifications(newNotifications);
      // Spike detection: if any level > 100 and was not previously
      const maxObj = mockData.reduce((max, d) => d.level > max.level ? d : max, { level: 0, name: "" });
      if (maxObj.level > 100 && lastMax <= 100) {
        // handleNoiseSpike(maxObj.name, maxObj.level); // This function is removed
      }
      setLastMax(maxObj.level);
    }, 5000); // Update every 5 seconds for better performance
    return () => clearInterval(interval);
  }, [lastMax]);

  // Simulate getting the current user (in real app, get from auth)
  useEffect(() => {
    // For demo, set admin as logged in
    setUser({ email: ADMIN_EMAIL, role: "admin" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        onShowSettings={onShowSettings} 
        onShowNotification={onShowNotification}
        onLocationSelect={setSelectedLocation}
        noiseData={noiseData}
        users={users}
        onUsersChange={handleUsersChange}
        notifications={notifications}
      />
      <div className="flex flex-col lg:flex-row flex-1 h-full">
        <SidePanel noiseData={noiseData} selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        <div className="flex-1 flex flex-col min-h-0 p-4 space-y-4">
          {/* Stats Overview */}
          <StatsOverview noiseData={noiseData} />
          {/* Stack charts vertically */}
          <div className="flex flex-col gap-8">
            <NoiseHeatmap noiseData={noiseData} />
            <CurrentLevelsChart noiseData={noiseData} />
            <TrendChart noiseData={noiseData} />
            <NoiseSourcesChart noiseData={noiseData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
