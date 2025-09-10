
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UrgeEvent } from '../../types';

interface UrgeStrengthChartProps {
  data: UrgeEvent[];
}

const UrgeStrengthChart: React.FC<UrgeStrengthChartProps> = ({ data }) => {
  const chartData = data.map(event => ({
    name: new Date(event.startTime).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
    '衝動の強さ': event.strength,
  })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-64">
      <h3 className="text-lg font-semibold text-primary-text mb-4">衝動の強さの推移</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#718096" />
          <YAxis domain={[0, 10]} allowDecimals={false} stroke="#718096" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}/>
          <Legend />
          <Line type="monotone" dataKey="衝動の強さ" stroke="#F6AD55" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UrgeStrengthChart;
