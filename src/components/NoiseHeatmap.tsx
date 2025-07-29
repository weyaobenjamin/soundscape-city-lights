import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const getStatusColor = (level: number) => {
  if (level >= 85) return 'bg-red-500';
  if (level >= 75) return 'bg-orange-500';
  if (level >= 65) return 'bg-yellow-500';
  return 'bg-green-500';
};
const getStatusText = (level: number) => {
  if (level >= 85) return 'Critical';
  if (level >= 75) return 'High';
  if (level >= 65) return 'Moderate';
  return 'Normal';
};

const NoiseHeatmap = ({ noiseData }: { noiseData: any[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Noise Level Heatmap</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Live Data</span>
        </div>
      </div>
      {/* Interactive Map Area */}
      <div className="relative bg-muted rounded-xl p-6 h-96 overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Noise Monitoring Points */}
        <div className="relative h-full">
          {noiseData.slice(0, 8).map((reading, index) => {
            const left = 10 + (index % 4) * 20;
            const top = 15 + Math.floor(index / 4) * 35;
            return (
              <motion.div
                key={reading.id || index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="absolute group cursor-pointer"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                {/* Pulse Animation */}
                <div className={`absolute inset-0 rounded-full ${getStatusColor(reading.level)} opacity-30 animate-ping`}></div>
                {/* Main Marker */}
                <div className={`relative w-6 h-6 ${getStatusColor(reading.level)} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}>
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-gray-700 z-10">
                  <div className="font-semibold">{reading.name}</div>
                  <div className="text-gray-300">{reading.level.toFixed(1)} dB</div>
                  <div className={`text-xs ${
                    reading.level >= 85 ? 'text-red-400' :
                    reading.level >= 75 ? 'text-orange-400' :
                    reading.level >= 65 ? 'text-yellow-400' : 'text-green-400'
                  }`}>{getStatusText(reading.level)}</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-slate-800"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Noise Levels</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Normal (&lt;65 dB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Moderate (65-75 dB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">High (75-85 dB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Critical (&gt;85 dB)</span>
            </div>
          </div>
        </div>
      </div>
      {/* Location Details */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {noiseData.slice(0, 4).map((reading, idx) => (
          <div key={reading.id || idx} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {reading.name}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {reading.level.toFixed(1)} dB
            </div>
            <div className={`text-xs ${
              reading.level >= 85 ? 'text-red-500' :
              reading.level >= 75 ? 'text-orange-500' :
              reading.level >= 65 ? 'text-yellow-500' : 'text-green-500'
            }`}>{getStatusText(reading.level)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NoiseHeatmap;