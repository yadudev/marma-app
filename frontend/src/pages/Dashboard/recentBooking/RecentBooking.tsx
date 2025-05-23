import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';

interface Booking {
  id: number;
  user: string;
  service: string;
  date: string;
  status: string;
}

const RecentBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('data/bookings.json'); // Adjust path if needed
        const data = await res.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            {status}
          </span>
        );
      case 'Upcoming':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{status}</span>
        );
      case 'Ongoing':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
        );
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <Card className="mb-50">
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                  <a href="#">View Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentBooking;
