import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import TherapistModal from './AddmodalTherapist';
import AddDoctorModal from './AddmodalTherapist';
import { baseUrl } from '../../utils/config';

type Therapist = {
  rating: number;
  joinedDate: string;
  id: number | null | undefined;
  specialization: string;
  name: string;
  email: string;
  phone: string;
  status: 'approved' | 'pending' | 'rejected';
  availability: 'online' | 'offline';
};

const TherapistsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [therapists, setTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/therapists`); // or your API URL
        const data = await res.json();
        setTherapists(data?.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);

  const filteredTherapists = therapists?.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.phone.includes(searchTerm);

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'approved') return matchesSearch && therapist.status === 'approved';
    if (selectedFilter === 'pending') return matchesSearch && therapist.status === 'pending';
    if (selectedFilter === 'rejected') return matchesSearch && therapist.status === 'rejected';
    if (selectedFilter === 'online') return matchesSearch && therapist.availability === 'online';
    if (selectedFilter === 'offline') return matchesSearch && therapist.availability === 'offline';

    return false;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredTherapists.length / pageSize);
  const paginatedTherapists = filteredTherapists.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Therapists Management</h1>
          <p className="text-gray-500 mt-1">Manage therapist accounts and applications</p>
        </div>
        <Button
          className="mt-4 md:mt-0 text-[12px] md:text-[12px] "
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2" size={18} />
          Add New Therapist
        </Button>

        <AddDoctorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          apiUrl={`${baseUrl}/admin/therapists`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Therapists</p>
                <h3 className="text-2xl font-bold mt-1">{therapists.length}</h3>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <h3 className="text-2xl font-bold mt-1">
                  {therapists.filter((t) => t.status === 'pending').length}
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
                <p className="text-sm font-medium text-gray-500">Online Therapists</p>
                <h3 className="text-2xl font-bold mt-1">
                  {
                    therapists.filter((t) => t.availability === 'online' && t.status === 'approved')
                      .length
                  }
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
                    d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>All Therapists</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search therapists..."
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
                <option value="all">All Therapists</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
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
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTherapists?.map((therapist) => (
                  <tr key={therapist.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="font-medium">{therapist.name}</div>
                      <div className="text-gray-500">{therapist.specialization}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div>{therapist.email}</div>
                      <div>{therapist.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        variant={therapist.availability === 'online' ? 'success' : 'secondary'}
                      >
                        {therapist.availability.charAt(0).toUpperCase() +
                          therapist.availability.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {therapist.rating > 0 ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{therapist.rating}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-amber-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not rated</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(therapist.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {therapist.joinedDate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Edit">
                        <Edit size={18} />
                      </button>
                      {therapist.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-800" title="Reject">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {therapist.status !== 'pending' && (
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <Trash2 size={18} />
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
                {Math.min(currentPage * pageSize, filteredTherapists.length)} of{' '}
                {filteredTherapists.length} therapists
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

export default TherapistsPage;
