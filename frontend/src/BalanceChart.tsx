import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BalanceRecord {
  id: number;
  address: string;
  balance: number;
  timestamp: string;
}

interface BalanceChartProps {
  data: BalanceRecord[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatYAxis = (value: number) => {
    return value.toFixed(4);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={sortedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          interval="preserveStartEnd"
          tick={{ fontSize: 12 }}
          label={{ value: "Time", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          tickFormatter={formatYAxis}
          domain={["auto", "auto"]}
          tick={{ fontSize: 12 }}
          label={{
            value: "ETH Balance",
            angle: -90,
            position: "insideLeft",
            offset: 0,
          }}
        />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleString()}
          formatter={(value: number) => [value.toFixed(6) + " ETH", "Balance"]}
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#8884d8"
          dot={false}
          activeDot={{ r: 6 }}
          name="ETH Balance"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
