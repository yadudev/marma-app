import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

// Sample data for the chart
// const chartData = [
//   { name: 'Jan', bookings: 65, registrations: 28, serviceUsage: 50 },
//   { name: 'Feb', bookings: 59, registrations: 48, serviceUsage: 55 },
//   { name: 'Mar', bookings: 80, registrations: 40, serviceUsage: 60 },
//   { name: 'Apr', bookings: 81, registrations: 47, serviceUsage: 70 },
//   { name: 'May', bookings: 56, registrations: 36, serviceUsage: 72 },
//   { name: 'Jun', bookings: 55, registrations: 27, serviceUsage: 63 },
//   { name: 'Jul', bookings: 60, registrations: 23, serviceUsage: 55 },
//   { name: 'Aug', bookings: 110, registrations: 42, serviceUsage: 95 },
//   { name: 'Sep', bookings: 93, registrations: 35, serviceUsage: 82 },
//   { name: 'Oct', bookings: 90, registrations: 38, serviceUsage: 85 },
//   { name: 'Nov', bookings: 95, registrations: 42, serviceUsage: 88 },
//   { name: 'Dec', bookings: 125, registrations: 65, serviceUsage: 110 }
// ];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const ToggleButton = ({ active, color, onClick, children }) => {
  return (
    <button
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        active ? 'opacity-100' : 'opacity-50'
      }`}
      style={{
        backgroundColor: active ? `${color}20` : 'transparent',
        color: color,
        border: `1px solid ${color}`,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ActivityChartComponent = () => {
  const [visibleSeries, setVisibleSeries] = useState({
    bookings: true,
    registrations: true,
    serviceUsage: true,
  });

  const toggleSeries = (series) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  const seriesColors = {
    bookings: '#3B82F6',
    registrations: '#8B5CF6',
    serviceUsage: '#10B981',
  };

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const ChartDetail = async () => {
      try {
        const res = await fetch('/data/activityOverview.json'); // or your API URL
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    ChartDetail();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Activity Overview</CardTitle>
        <div className="flex flex-wrap gap-2">
          <ToggleButton
            active={visibleSeries.bookings}
            color={seriesColors.bookings}
            onClick={() => toggleSeries('bookings')}
          >
            Bookings
          </ToggleButton>
          <ToggleButton
            active={visibleSeries.registrations}
            color={seriesColors.registrations}
            onClick={() => toggleSeries('registrations')}
          >
            Registrations
          </ToggleButton>
          <ToggleButton
            active={visibleSeries.serviceUsage}
            color={seriesColors.serviceUsage}
            onClick={() => toggleSeries('serviceUsage')}
          >
            Service Usage
          </ToggleButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(value) => value.toString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={() => null} />
              {visibleSeries.bookings && (
                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke={seriesColors.bookings}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: seriesColors.bookings }}
                  animationDuration={1500}
                />
              )}
              {visibleSeries.registrations && (
                <Line
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke={seriesColors.registrations}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: seriesColors.registrations }}
                  animationDuration={1500}
                />
              )}
              {visibleSeries.serviceUsage && (
                <Line
                  type="monotone"
                  dataKey="serviceUsage"
                  name="Service Usage"
                  stroke={seriesColors.serviceUsage}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: seriesColors.serviceUsage }}
                  animationDuration={1500}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
