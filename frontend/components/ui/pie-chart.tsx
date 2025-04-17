import * as React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface PieChartProps {
  data?: Array<{ name: string; value: number }>;
  height?: number;
  colors?: Array<string>;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  dataKey?: string;
  nameKey?: string;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export function PieChart({
  data = [],
  height = 300,
  colors = ["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EF4444"],
  className = "",
  innerRadius = 0,
  outerRadius = 80,
  dataKey = "value",
  nameKey = "name",
  showTooltip = true,
  showLegend = true,
}: PieChartProps) {
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
        <RechartsPieChart>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              }}
            />
          )}
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 12 }}
            />
          )}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
} 