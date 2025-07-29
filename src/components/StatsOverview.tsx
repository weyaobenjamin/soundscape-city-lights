import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Speaker, AlertTriangle, BarChart2, Signal } from 'lucide-react';

const StatsOverview = ({ noiseData }: { noiseData: any[] }) => {
  // Calculate stats
  const stats = useMemo(() => {
    const levels = noiseData.map(n => n.level);
    const average = levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
    const peak = levels.length ? Math.max(...levels) : 0;
    const alerts = noiseData.filter(n => n.level > 75).length;
    const compliance = levels.length ? (levels.filter(l => l < 65).length / levels.length) * 100 : 0;
    return {
      average,
      peak,
      alerts,
      compliance,
    };
  }, [noiseData]);

  const statCards = [
    {
      title: 'Average Noise',
      value: `${stats.average.toFixed(1)} dB`,
      change: '+2.1%',
      changeType: 'increase',
      icon: Speaker,
      color: 'blue',
      description: 'City-wide average',
    },
    {
      title: 'Peak Level',
      value: `${stats.peak.toFixed(1)} dB`,
      change: '+5.3%',
      changeType: 'increase',
      icon: BarChart2,
      color: 'orange',
      description: 'Highest recorded today',
    },
    {
      title: 'Active Alerts',
      value: stats.alerts.toString(),
      change: stats.alerts > 5 ? 'High' : 'Normal',
      changeType: stats.alerts > 5 ? 'increase' : 'stable',
      icon: AlertTriangle,
      color: stats.alerts > 5 ? 'red' : 'yellow',
      description: 'Require attention',
    },
    {
      title: 'Compliance Rate',
      value: `${stats.compliance.toFixed(0)}%`,
      change: stats.compliance > 80 ? 'Good' : 'Needs Improvement',
      changeType: stats.compliance > 80 ? 'stable' : 'decrease',
      icon: Signal,
      color: stats.compliance > 80 ? 'green' : 'red',
      description: 'Meeting standards',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-700 dark:text-blue-300',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        text: 'text-orange-700 dark:text-orange-300',
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-700 dark:text-red-300',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        icon: 'text-yellow-600 dark:text-yellow-400',
        text: 'text-yellow-700 dark:text-yellow-300',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-700 dark:text-green-300',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 border border-border hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.changeType === 'increase'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : stat.changeType === 'decrease'
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
            </div>
            {/* Mini trend indicator */}
            <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.random() * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                className={`h-full ${colors.bg.replace('50', '200').replace('900/20', '600')}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsOverview;