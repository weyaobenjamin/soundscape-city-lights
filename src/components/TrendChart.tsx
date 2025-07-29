import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ noiseData }: { noiseData: any[] }) => {
  // Generate trend data for a few key locations
  const data = useMemo(() => {
    // Simulate 24-hour trend for 4 locations
    const locations = ['Nairobi CBD', 'Westlands', 'Industrial Area', 'Jomo Kenyatta International Airport'];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return hours.map((time) => {
      const entry: any = { time };
      locations.forEach((loc) => {
        // Find the current level for this location
        const found = noiseData.find(n => n.name.includes(loc));
        // Simulate a trend around the current value
        const base = found ? found.level : 60 + Math.random() * 20;
        entry[loc] = base + Math.sin(Number(time.split(':')[0]) / 24 * Math.PI * 2) * 8 + (Math.random() - 0.5) * 4;
      });
      return entry;
    });
  }, [noiseData]);

  const chartTheme = {
    background: '#1e293b',
    text: '#e2e8f0',
    grid: '#475569',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">24-Hour Noise Trends</h2>
        <div className="flex items-center space-x-4">
          <select className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last Week</option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis dataKey="time" stroke={chartTheme.text} fontSize={12} interval="preserveStartEnd" />
            <YAxis stroke={chartTheme.text} fontSize={12} domain={[40, 100]} />
            <Tooltip contentStyle={{ backgroundColor: chartTheme.background, border: `1px solid ${chartTheme.grid}`, borderRadius: '8px', color: chartTheme.text }} formatter={(value: number, name: string) => [ `${value.toFixed(1)} dB`, name ]} />
            <Legend />
            <Line type="monotone" dataKey="Nairobi CBD" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Westlands" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Industrial Area" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Jomo Kenyatta International Airport" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Peak Hour</div>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">8:00 AM</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">Quietest</div>
          <div className="text-lg font-bold text-green-700 dark:text-green-300">3:00 AM</div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Average</div>
          <div className="text-lg font-bold text-orange-700 dark:text-orange-300">72.4 dB</div>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-sm text-red-600 dark:text-red-400 font-medium">Alerts</div>
          <div className="text-lg font-bold text-red-700 dark:text-red-300">4 Today</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendChart;