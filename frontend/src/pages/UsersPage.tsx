import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Swal from 'sweetalert2';
import { login_form } from '../components/services/authServices';
import { baseUrl } from '../utils/config';
import moment from 'moment';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'user' | 'learner' | 'therapist';
  status: 'active' | 'inactive';
  registeredDate: string;
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);

  const Userlist = async () => {
    try {
      const res = await fetch(`${baseUrl}/admin/users`); // or your API URL
      const data = await res.json();
      setUsers(
        data?.data?.users?.map((user: any) => ({
          id: user?.id,
          name: user?.name,
          email:user?.email,
          phone:user?.phone,
          type:user?.Role?.name,
          status:user.status,
          registeredDate:moment(user.createdAt).format('YYYY-MM-DD'),
        })) || []
      );
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  useEffect(() => {
    Userlist();
  }, []);

  const filteredUsers = users?.filter((user) => {
    const name = user.name?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const phone = user.phone || '';

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    switch (selectedFilter) {
      case 'all':
        return matchesSearch;
      case 'active':
        return matchesSearch && user.status === 'active';
      case 'inactive':
        return matchesSearch && user.status === 'inactive';
      case 'user':
        return matchesSearch && user.type === 'user';
      case 'learner':
        return matchesSearch && user.type === 'learner';
      case 'therapist':
        return matchesSearch && user.type === 'therapist';
      default:
        return false;
    }
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  //-------------

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          delete: id,
        };

        console.log(payload);

        const res = await login_form(payload);

        if (res.result) {
          Swal.fire({
            title: 'Deleted!',
            text: 'The item has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          Userlist();
        }

        // Optionally refresh the list here
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage user accounts and information</p>
        </div>
        {/* <Button className="mt-4 md:mt-0" size="lg">
          <Plus className="mr-2" size={18} />
          Add New User
        </Button> */}
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>All Users</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search users..."
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
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="therapist">Therapist</option>

                <option value="user">User</option>
                <option value="learner">Learner</option>
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
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={user.type === 'user' ? 'primary' : 'secondary'}>
                        {user.type === 'user'
                          ? 'User'
                          : user.type === 'learner'
                            ? 'Learner'
                            : 'Therapist'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.registeredDate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2 justify-center  flex">
                      {/* <button className="text-blue-600 hover:text-blue-800" title="Edit">
                        <Edit size={18} />
                      </button> */}
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={18} />
                      </button>
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
                {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length}{' '}
                users
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

export default UsersPage;
