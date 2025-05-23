import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { baseUrl } from '../utils/config';

type Bookings = {
  id: number;
  user: string;
  therapist: string;
  service: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  date: string;
  time: string;
  payment: string;
}

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [bookings, setBookings] = useState<Bookings[]>([]);

  const bookingList = async () => {
    try {
      const res = await fetch(`${baseUrl}/admin/bookings`); // or your API URL
      const data = await res.json();
      setBookings(
        data?.data?.bookings?.map((booking) => ({
          id: booking.id,
          service: booking?.service,
          status: booking?.status,
          payment: booking?.paymentStatus,
          user: booking?.user?.name || 'N/A',
          therapist: booking?.therapist?.name || 'N/A',
          date:booking?.date,
          time:booking?.time,
          createdAt: booking.createdAt, 
        }))
      );
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  useEffect(() => {
    bookingList();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.therapist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'upcoming') return matchesSearch && booking.status === 'upcoming';
    if (selectedFilter === 'ongoing') return matchesSearch && booking.status === 'ongoing';
    if (selectedFilter === 'completed') return matchesSearch && booking.status === 'completed';
    if (selectedFilter === 'cancelled') return matchesSearch && booking.status === 'cancelled';

    return false;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="primary">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="warning">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case 'completed':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge>{payment}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-500 mt-1">Manage all service bookings and appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="  flex items-center justify-between ">
              <div>
                <p className="text-sm font-medium text-gray-500">All Bookings</p>
                <h3 className="text-2xl font-bold mt-1">{bookings.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Calendar size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold mt-1">
                  {bookings.filter((b) => b.status === 'upcoming').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ongoing</p>
                <h3 className="text-2xl font-bold mt-1">
                  {bookings.filter((b) => b.status === 'ongoing').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold mt-1">
                  {bookings.filter((b) => b.status === 'completed').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>All Bookings</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="search"
                placeholder="Search bookings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="h-10 rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Therapist
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.service}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.user}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.therapist}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{booking.date}</span>
                        <span className="text-gray-500">{booking.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getPaymentBadge(booking.payment)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="View Details">
                        <Eye size={18} />
                      </button>
                      {booking.status === 'upcoming' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Started"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-800" title="Cancel">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {booking.status === 'ongoing' && (
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Completed"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredBookings.length)} of{' '}
                {filteredBookings.length} bookings
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
