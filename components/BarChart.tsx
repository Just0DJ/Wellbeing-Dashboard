
import React from 'react';
import { DailyUsage } from '../types';

interface BarChartProps {
  data: DailyUsage[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.minutes));
  const currentDay = 'F'; // Just for visual consistency with screenshot

  return (
    <div className="flex h-[200px] items-end justify-between gap-3 relative z-10 w-full px-2">
      {data.map((item, idx) => {
        const heightPercent = (item.minutes / maxVal) * 100;
        const isCurrent = item.day === currentDay;
        
        return (
          <div key={idx} className="flex flex-1 flex-col items-center gap-2 group/bar h-full">
            <div className="relative w-full rounded-t-full bg-slate-200 dark:bg-surface-dark-highlight overflow-hidden h-full flex items-end">
              <div 
                className={`w-full transition-all duration-500 rounded-t-full ${
                  isCurrent 
                    ? 'bg-primary shadow-[0_0_15px_rgba(19,236,164,0.4)]' 
                    : 'bg-primary/40 group-hover/bar:bg-primary/60'
                }`}
                style={{ height: `${heightPercent}%` }}
              ></div>
            </div>
            <span className={`text-xs font-bold ${isCurrent ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
};
