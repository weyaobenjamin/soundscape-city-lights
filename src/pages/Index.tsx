
import { useState, useEffect } from "react";
import { MapView } from "@/components/MapView";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";
import { SidePanel } from "@/components/SidePanel";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [noiseData, setNoiseData] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate mock noise data for different city locations
      const mockData = [
        { id: 1, name: "Downtown Core", lat: 40.7589, lng: -73.9851, level: Math.random() * 40 + 60, type: "traffic" },
        { id: 2, name: "Financial District", lat: 40.7074, lng: -74.0113, level: Math.random() * 30 + 50, type: "ambient" },
        { id: 3, name: "Construction Zone", lat: 40.7505, lng: -73.9934, level: Math.random() * 20 + 80, type: "construction" },
        { id: 4, name: "Residential Area", lat: 40.7282, lng: -73.7949, level: Math.random() * 25 + 35, type: "ambient" },
        { id: 5, name: "Industrial Zone", lat: 40.6892, lng: -74.0445, level: Math.random() * 35 + 65, type: "industrial" },
        { id: 6, name: "Airport Vicinity", lat: 40.6413, lng: -73.7781, level: Math.random() * 30 + 70, type: "aircraft" },
      ];
      setNoiseData(mockData);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <SidePanel 
          noiseData={noiseData}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <div className="flex-1 flex flex-col">
          <MapView 
            noiseData={noiseData}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
          <Dashboard 
            noiseData={noiseData}
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
