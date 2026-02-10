
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ChartCircleProps {
  percentage: number;
  centerLabel: string;
  centerValue: string;
  subValue: string;
  color?: string;
}

export const ChartCircle: React.FC<ChartCircleProps> = ({ percentage, centerLabel, centerValue, subValue, color = "var(--primary-color)" }) => {
  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];

  return (
    <div className="relative size-72 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="80%"
            outerRadius="95%"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#23483c" opacity={0.15} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-slate-500 text-sm font-medium mb-1 tracking-tight">{centerLabel}</span>
        <h2 className="text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">{centerValue}</h2>
        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full mt-4 border border-primary/20">
          <span className="material-symbols-outlined text-primary text-[14px]">trending_down</span>
          <span className="text-primary text-[10px] font-bold uppercase tracking-wider">{subValue}</span>
        </div>
      </div>
    </div>
  );
};
