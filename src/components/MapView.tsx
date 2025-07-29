
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
    <div className="flex-1 p-2 md:p-4 w-full min-h-0">
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
            className="relative h-[calc(100%-60px)] bg-gray-900 rounded-lg overflow-hidden mx-auto"
            style={{
              maxWidth: '600px',
              maxHeight: '400px',
              backgroundImage: `
                radial-gradient(circle at 15% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 85% 15%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 85%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 25% 75%, rgba(234, 179, 8, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 90% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
              `
            }}
          >
            {/* Simulated city grid */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute border-gray-600" style={{
                  left: `${i * 12.5}%`,
                  top: 0,
                  bottom: 0,
                  borderLeft: i % 2 === 0 ? '1px solid' : '1px dashed'
                }} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="absolute border-gray-600" style={{
                  top: `${i * 16.67}%`,
                  left: 0,
                  right: 0,
                  borderTop: i % 2 === 0 ? '1px solid' : '1px dashed'
                }} />
              ))}
            </div>

            {/* Noise data points - simplified and visible */}
            {noiseData && noiseData.length > 0 ? (
              noiseData.map((point) => {
                // Simple but effective distribution
                const x = 15 + (point.id * 3) % 70; // Spread across 70% of width
                const y = 15 + (point.id * 5) % 70; // Spread across 70% of height

                return (
                  <div
                    key={point.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                      selectedLocation?.id === point.id ? 'scale-125 z-10' : 'hover:scale-110'
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                    onClick={() => onLocationSelect(point)}
                  >
                    {/* Heat point with enhanced visibility */}
                    <div className={`w-6 h-6 rounded-full ${getNoiseColor(point.level)} animate-pulse shadow-lg relative border-2 border-white/20`}>
                      <div className="w-full h-full rounded-full bg-white/30 animate-ping absolute inset-0"></div>
                    </div>
                    
                    {/* Tooltip with brief info */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-gray-600 z-20 min-w-max">
                      <div className="font-medium text-white">{point.name}</div>
                      <div className={`font-bold ${getNoiseColor(point.level).replace('bg-', 'text-')}`}>
                        {Math.round(point.level)}dB
                      </div>
                      <div className="text-gray-300 capitalize">{point.type}</div>
                    </div>
                    
                    {/* Connection line for selected point */}
                    {selectedLocation?.id === point.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-4 bg-emerald-400"></div>
                    )}
                  </div>
                );
              })
            ) : (
              // Fallback when no data
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">No Data Available</div>
                  <div className="text-sm">Loading noise monitoring data...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
