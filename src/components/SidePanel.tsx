
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Activity, AlertTriangle, Clock } from "lucide-react";

interface NoiseDataPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  level: number;
  type: string;
}

interface SidePanelProps {
  noiseData: NoiseDataPoint[];
  selectedLocation: NoiseDataPoint | null;
  onLocationSelect: (location: NoiseDataPoint) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const SidePanel = ({ 
  noiseData, 
  selectedLocation, 
  onLocationSelect, 
  timeRange, 
  onTimeRangeChange 
}: SidePanelProps) => {
  const getNoiseColor = (level: number) => {
    if (level < 45) return "text-green-400";
    if (level < 55) return "text-yellow-400";
    if (level < 70) return "text-orange-400";
    return "text-red-400";
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "traffic": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "construction": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "industrial": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "aircraft": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const sortedData = [...noiseData].sort((a, b) => b.level - a.level);
  const avgLevel = noiseData.reduce((sum, point) => sum + point.level, 0) / noiseData.length;
  const maxLevel = Math.max(...noiseData.map(point => point.level));
  const alertCount = noiseData.filter(point => point.level > 70).length;

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Time Range</label>
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gray-700 border-gray-600 p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-300">Average</span>
            </div>
            <div className="text-lg font-bold text-white">{avgLevel.toFixed(1)}dB</div>
          </Card>
          <Card className="bg-gray-700 border-gray-600 p-3">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-gray-300">Peak</span>
            </div>
            <div className="text-lg font-bold text-white">{maxLevel.toFixed(1)}dB</div>
          </Card>
        </div>
        {alertCount > 0 && (
          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">{alertCount} high noise alerts</span>
            </div>
          </div>
        )}
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Monitoring Locations</h3>
          <div className="space-y-2">
            {sortedData.map((point) => (
              <Card
                key={point.id}
                className={`p-3 cursor-pointer transition-all duration-200 ${
                  selectedLocation?.id === point.id 
                    ? 'bg-gray-600 border-gray-500' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                }`}
                onClick={() => onLocationSelect(point)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{point.name}</span>
                  </div>
                  <div className={`text-sm font-bold ${getNoiseColor(point.level)}`}>
                    {Math.round(point.level)}dB
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getTypeBadgeColor(point.type)}>
                    {point.type}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>Live</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
