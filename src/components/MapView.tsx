
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface NoiseDataPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  level: number;
  type: string;
}

interface MapViewProps {
  noiseData: NoiseDataPoint[];
  selectedLocation: NoiseDataPoint | null;
  onLocationSelect: (location: NoiseDataPoint) => void;
}

export const MapView = ({ noiseData, selectedLocation, onLocationSelect }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getNoiseColor = (level: number) => {
    if (level < 45) return "bg-green-500";
    if (level < 55) return "bg-yellow-500";
    if (level < 70) return "bg-orange-500";
    return "bg-red-500";
  };

  const getNoiseLabel = (level: number) => {
    if (level < 45) return "Quiet";
    if (level < 55) return "Moderate";
    if (level < 70) return "Loud";
    return "Very Loud";
  };

  return (
    <div className="flex-1 p-4">
      <Card className="h-full bg-gray-800 border-gray-700">
        <div className="p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Noise Level Heatmap</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Quiet (&lt;45dB)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Moderate (45-55dB)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Loud (55-70dB)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Very Loud (&gt;70dB)</span>
              </div>
            </div>
          </div>
          
          <div 
            ref={mapRef} 
            className="relative h-[calc(100%-60px)] bg-gray-900 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 60% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 30% 70%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)
              `
            }}
          >
            {/* Simulated city grid */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="absolute border-gray-600" style={{
                  left: `${i * 10}%`,
                  top: 0,
                  bottom: 0,
                  borderLeft: i % 2 === 0 ? '1px solid' : '1px dashed'
                }} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute border-gray-600" style={{
                  top: `${i * 12.5}%`,
                  left: 0,
                  right: 0,
                  borderTop: i % 2 === 0 ? '1px solid' : '1px dashed'
                }} />
              ))}
            </div>

            {/* Noise data points */}
            {noiseData.map((point) => (
              <div
                key={point.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                  selectedLocation?.id === point.id ? 'scale-125 z-10' : 'hover:scale-110'
                }`}
                style={{
                  left: `${((point.lng + 74.1) * 500) % 100}%`,
                  top: `${((40.8 - point.lat) * 800) % 100}%`,
                }}
                onClick={() => onLocationSelect(point)}
              >
                <div className={`w-6 h-6 rounded-full ${getNoiseColor(point.level)} animate-pulse`}>
                  <div className={`w-12 h-12 rounded-full ${getNoiseColor(point.level)} opacity-30 animate-ping absolute -inset-3`}></div>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap border border-gray-600">
                  <div className="font-medium">{point.name}</div>
                  <div className={`text-xs ${getNoiseColor(point.level).replace('bg-', 'text-')}`}>
                    {Math.round(point.level)}dB - {getNoiseLabel(point.level)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
