import React, { useEffect, useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { baseUrl } from '../utils/config';

type OtpLogs = {
  id: number;
  user: string;
  phone: string;
  purpose: 'booking' | 'login' | 'registration' | 'pickup';
  status: 'verified' | 'expired' | 'failed';
  createdAt: string;
  verifiedAt: string;
}

const OTPLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [otpLogs, setOtpLogs] = useState<OtpLogs[]>([]);

  const OtpList = async () => {
    try {
      const res = await fetch(`${baseUrl}/admin/otp/logs`); // or your API URL
      const data = await res.json();
      setOtpLogs(data?.data?.otpLogs)
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  useEffect(() => {
    OtpList();
  }, []);

    const filteredLogs = otpLogs.filter((log) => {
    const matchesSearch =
      log.phone.includes(searchTerm) || log.user.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'verified') return matchesSearch && log.status === 'verified';
    if (selectedFilter === 'expired') return matchesSearch && log.status === 'expired';
    if (selectedFilter === 'failed') return matchesSearch && log.status === 'failed';
    if (selectedFilter === 'booking') return matchesSearch && log.purpose === 'booking';
    if (selectedFilter === 'login') return matchesSearch && log.purpose === 'login';
    if (selectedFilter === 'registration') return matchesSearch && log.purpose === 'registration';
    if (selectedFilter === 'pickup') return matchesSearch && log.purpose === 'pickup';

    return false;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'expired':
        return <Badge variant="warning">Expired</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPurposeBadge = (purpose: string) => {
    switch (purpose) {
      case 'booking':
        return <Badge variant="primary">Booking</Badge>;
      case 'login':
        return <Badge variant="secondary">Login</Badge>;
      case 'registration':
        return <Badge variant="primary">Registration</Badge>;
      case 'pickup':
        return <Badge variant="warning">Service Pickup</Badge>;
      default:
        return <Badge>{purpose}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OTP Verification Logs</h1>
          <p className="text-gray-500 mt-1">View and manage all OTP verification records</p>
        </div>
        <Button className="mt-4 md:mt-0" variant="outline">
          <Download className="mr-2" size={18} />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total OTPs</p>
                <h3 className="text-2xl font-bold mt-1">{otpLogs.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <h3 className="text-2xl font-bold mt-1">
                  {otpLogs.filter((log) => log.status === 'verified').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
                <p className="text-sm font-medium text-gray-500">Expired</p>
                <h3 className="text-2xl font-bold mt-1">
                  {otpLogs.filter((log) => log.status === 'expired').length}
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
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <h3 className="text-2xl font-bold mt-1">
                  {otpLogs.filter((log) => log.status === 'failed').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>OTP Verification Logs</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search by phone or user..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} type={''} />
            </div>
            <div className="relative">
              <select
                className="h-10 rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Logs</option>
                <option value="verified">Verified</option>
                <option value="expired">Expired</option>
                <option value="failed">Failed</option>
                <option value="booking">Booking</option>
                <option value="login">Login</option>
                <option value="registration">Registration</option>
                <option value="pickup">Service Pickup</option>
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
                    ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{log.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{getPurposeBadge(log.purpose)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.createdAt}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.verifiedAt || '-'}
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
                {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length}{' '}
                logs
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

export default OTPLogsPage;
