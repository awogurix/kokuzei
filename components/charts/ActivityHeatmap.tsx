import React from 'react';
import { UrgeEvent } from '../../types';

interface ActivityHeatmapProps {
  data: UrgeEvent[];
}

const days = ['日', '月', '火', '水', '木', '金', '土'];
const timeSlots = ['朝(6-12)', '昼(12-18)', '夜(18-24)', '深夜(0-6)'];

const getTimeSlot = (hour: number) => {
  if (hour >= 6 && hour < 12) return 0; // Morning
  if (hour >= 12 && hour < 18) return 1; // Afternoon
  if (hour >= 18 && hour < 24) return 2; // Evening
  return 3; // Night
};

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  const heatmapData = Array(7).fill(0).map(() => Array(4).fill(0));
  
  data.forEach(event => {
    const date = new Date(event.startTime);
    const day = date.getDay();
    const hour = date.getHours();
    const timeSlot = getTimeSlot(hour);
    heatmapData[day][timeSlot]++;
  });

  const maxCount = Math.max(...heatmapData.flat(), 1);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    const opacity = Math.max(0.2, Math.min(1, count / maxCount));
    return `bg-accent-action/${Math.round(opacity * 100)}`;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-primary-text mb-4">活動ヒートマップ</h3>
      <div className="grid grid-cols-[auto_1fr] gap-1 text-xs text-secondary-text">
        <div></div>
        <div className="grid grid-cols-4 gap-1 text-center">
          {timeSlots.map(slot => <div key={slot}>{slot}</div>)}
        </div>
        {days.map((day, dayIndex) => (
          <React.Fragment key={day}>
            <div className="flex items-center justify-center font-semibold">{day}</div>
            <div className="grid grid-cols-4 gap-1">
              {heatmapData[dayIndex].map((count, timeIndex) => (
                <div key={`${dayIndex}-${timeIndex}`} className={`w-full aspect-square flex items-center justify-center rounded-md ${getColor(count)}`} title={`回数: ${count}`}>
                   <span className="text-white font-bold text-sm mix-blend-difference">{count > 0 ? count : ''}</span>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ActivityHeatmap;