import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getBarColor = (level: number) => {
  if (level >= 85) return '#EF4444';
  if (level >= 75) return '#F59E0B';
  if (level >= 65) return '#EAB308';
  return '#10B981';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
        <p className="text-gray-900 dark:text-white font-medium">{data.name}</p>
        <p className="text-gray-600 dark:text-gray-300">{data.level.toFixed(1)} dB</p>
        <p className={`text-xs capitalize ${
          data.level >= 85 ? 'text-red-500' :
          data.level >= 75 ? 'text-orange-500' :
          data.level >= 65 ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {data.type}
        </p>
      </div>
    );
  }
  return null;
};

const CurrentLevelsChart = ({ noiseData }: { noiseData: any[] }) => {
  const chartData = noiseData.slice(0, 8).map(reading => ({
    name: reading.name.split(' ')[0],
    fullName: reading.name,
    level: reading.level,
    type: reading.type
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Current Noise Levels
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis 
              dataKey="name" 
              stroke="#e2e8f0"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#e2e8f0"
              fontSize={12}
              domain={[0, 100]}
              label={{ value: 'dB', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="level" 
              radius={[4, 4, 0, 0]}
              fill="#10B981"
            >
              {chartData.map((entry, index) => (
                <motion.rect
                  key={`bar-${index}`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  fill={getBarColor(entry.level)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Status Indicators */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Normal (&lt;65 dB)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Moderate (65-75 dB)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">High (75-85 dB)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Critical (&gt;85 dB)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentLevelsChart;