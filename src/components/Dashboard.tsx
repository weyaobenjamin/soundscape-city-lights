
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface NoiseDataPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  level: number;
  type: string;
}

interface DashboardProps {
  noiseData: NoiseDataPoint[];
  timeRange: string;
}

// Individual chart components
export const CurrentNoiseLevelsChart = ({ noiseData }: { noiseData: NoiseDataPoint[] }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 p-4 h-full">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Current Noise Levels</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={noiseData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#9CA3AF" fontSize={10} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F3F4F6'
            }} 
          />
          <Bar dataKey="level" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const HourlyTrendChart = ({ timeRange }: { timeRange: string }) => {
  // Generate historical data for charts
  const generateHistoricalData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      return {
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        average: Math.random() * 20 + 50,
        peak: Math.random() * 15 + 70,
      };
    });
    return hours;
  };

  const historicalData = generateHistoricalData();

  return (
    <Card className="bg-gray-800 border-gray-700 p-4 h-full">
      <h3 className="text-sm font-medium text-gray-300 mb-3">24-Hour Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            fontSize={10}
            interval={3}
          />
          <YAxis stroke="#9CA3AF" fontSize={10} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F3F4F6'
            }} 
          />
          <Line type="monotone" dataKey="average" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="peak" stroke="#EF4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const NoiseSourcesChart = ({ noiseData }: { noiseData: NoiseDataPoint[] }) => {
  // Prepare data for type distribution
  const typeDistribution = noiseData.reduce((acc, point) => {
    acc[point.type] = (acc[point.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#06B6D4'];

  return (
    <Card className="bg-gray-800 border-gray-700 p-4 h-full">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Noise Sources</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F3F4F6'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {pieData.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-1 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-300 capitalize">{entry.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const Dashboard = ({ noiseData, timeRange }: DashboardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      <CurrentNoiseLevelsChart noiseData={noiseData} />
      <HourlyTrendChart timeRange={timeRange} />
      <NoiseSourcesChart noiseData={noiseData} />
    </div>
  );
};
