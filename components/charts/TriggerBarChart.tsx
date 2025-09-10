
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UrgeEvent, Trigger } from '../../types';
import { ALL_TRIGGERS } from '../../constants';

interface TriggerBarChartProps {
  data: UrgeEvent[];
}

const TriggerBarChart: React.FC<TriggerBarChartProps> = ({ data }) => {
  const triggerCounts = ALL_TRIGGERS.reduce((acc, trigger) => {
    acc[trigger] = 0;
    return acc;
  }, {} as Record<Trigger, number>);

  data.forEach(event => {
    event.triggers.forEach(trigger => {
      if (triggerCounts[trigger] !== undefined) {
        triggerCounts[trigger]++;
      }
    });
  });

  const chartData = Object.entries(triggerCounts).map(([name, value]) => ({
    name,
    '回数': value,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-64">
      <h3 className="text-lg font-semibold text-primary-text mb-4">きっかけの内訳</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" allowDecimals={false} stroke="#718096"/>
          <YAxis type="category" dataKey="name" width={50} stroke="#718096" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }} />
          <Bar dataKey="回数" fill="#63B3ED" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TriggerBarChart;
