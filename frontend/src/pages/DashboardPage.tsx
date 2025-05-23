import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ActivityChartComponent } from '../components/activityComponent/activityComponent';
import RecentBooking from './Dashboard/recentBooking/RecentBooking';

interface StatCardData {
  title: string;
  value: string | number;
  icon: keyof typeof iconMap;
  trend?: { value: string; positive: boolean };
  color: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={24} className="text-white" />,
  UserCheck: <UserCheck size={24} className="text-white" />,
  Calendar: <Calendar size={24} className="text-white" />,
  CheckCircle: <CheckCircle size={24} className="text-white" />,
};

const StatCard = ({
  title,
  value,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  color: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p className={`text-xs mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value} since last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentBookingsTable = () => {
  return <RecentBooking />;
};

const ActivityChart = () => {
  return <ActivityChartComponent />;
};

const DashboardPage = () => {
  const [stats, setStats] = useState<StatCardData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/admin/dashboard'); // or your API URL
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to CP's Reflex Marma Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.icon]}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button>Manage Users</Button>
            <Button>Manage Therapists</Button>
            <Button>View Bookings</Button>
            <Button>Send Notifications</Button>
          </div>
        </div>
      </div>

      <RecentBookingsTable />
    </div>
  );
};

export default DashboardPage;
