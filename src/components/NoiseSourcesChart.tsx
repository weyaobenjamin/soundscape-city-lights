import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#F472B6'];

const NoiseSourcesChart = ({ noiseData }: { noiseData: any[] }) => {
  // Group by type and sum
  const typeTotals: Record<string, number> = {};
  let total = 0;
  noiseData.forEach((item) => {
    typeTotals[item.type] = (typeTotals[item.type] || 0) + item.level;
    total += item.level;
  });
  const chartData = Object.entries(typeTotals).map(([type, value], i) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: Number(((value / total) * 100).toFixed(1)),
    color: COLORS[i % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
          <p className="text-gray-900 dark:text-white font-medium">{data.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="500">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Noise Sources Breakdown</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">City-wide Analysis</div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {chartData.map((source, index) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
          >
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: source.color }}></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{source.value}% of total noise</div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Insights</h3>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          <li>• Traffic remains the dominant noise source</li>
          <li>• Construction activity increased this month</li>
          <li>• Industrial noise concentrated in southeastern areas</li>
          <li>• Aircraft noise peaks during morning hours</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default NoiseSourcesChart;