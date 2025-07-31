import { useState, useEffect } from "react";
import { MapView } from "@/components/MapView";
import StatsOverview from "@/components/StatsOverview";
import NoiseHeatmap from "@/components/NoiseHeatmap";
import CurrentLevelsChart from "@/components/CurrentLevelsChart";
import TrendChart from "@/components/TrendChart";
import NoiseSourcesChart from "@/components/NoiseSourcesChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
import SettingsDialog from "@/components/SettingsDialog";
import { useAuth } from "@/contexts/AuthContext";

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

const UserDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [noiseData, setNoiseData] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const mockData = KENYA_LOCATIONS.map(loc => ({
        ...loc,
        level: Math.random() * 40 + 60 + (loc.type === "aircraft" ? 10 : 0),
      }));
      setNoiseData(mockData);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4">
      <UserHeader onSettingsClick={() => setSettingsOpen(true)} />
      <SettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
      {/* Divider between header and welcome banner */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="border-b border-border my-2" />
      </div>
      {/* Welcome Banner */}
      <div className="w-full max-w-6xl mt-4 mb-6">
        <div className="bg-emerald-500 text-white rounded-2xl px-8 py-6 text-left shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {userData?.name || 'User'}!</h2>
          <p className="text-base">Track noise levels in your area and report any concerns to local authorities.</p>
        </div>
      </div>
      <div className="w-full max-w-6xl space-y-6">
        <StatsOverview noiseData={noiseData} />
        <div className="flex flex-col gap-8">
          <NoiseHeatmap noiseData={noiseData} />
          <CurrentLevelsChart noiseData={noiseData} />
          <TrendChart noiseData={noiseData} />
          <NoiseSourcesChart noiseData={noiseData} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;