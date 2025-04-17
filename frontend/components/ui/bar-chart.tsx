import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface BarChartProps {
  data?: Array<any>;
  keys?: Array<string>;
  indexBy?: string;
  height?: number;
  colors?: Array<string>;
  className?: string;
}

export function BarChart({
  data = [],
  keys = [],
  indexBy = "name",
  height = 300,
  colors = ["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EF4444"],
  className = "",
}: BarChartProps) {
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[${height}px] bg-gray-50 dark:bg-slate-950 rounded-md ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey={indexBy}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
} 