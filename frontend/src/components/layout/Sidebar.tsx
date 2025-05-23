import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  FileText,
  BarChart2,
  PhoneCall,
  Bell,
  FileEdit,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  { name: 'Therapists', path: '/admin/therapists', icon: <UserCog size={20} /> },
  { name: 'Bookings', path: '/admin/bookings', icon: <Calendar size={20} /> },
  { name: 'OTP Logs', path: '/admin/otp-logs', icon: <FileText size={20} /> },
  { name: 'Analytics', path: '/admin/analytics', icon: <BarChart2 size={20} /> },
  // { name: 'Emergency Contacts', path: '/admin/emergency', icon: <PhoneCall size={20} /> },
  // { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
  // { name: 'CMS Pages', path: '/admin/cms', icon: <FileEdit size={20} /> },
  { name: 'Learner Portal', path: '/admin/learner', icon: <BookOpen size={20} /> },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigate = useNavigate();
  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <div className=" items-center">
          <div className="text-blue-700">
            {/* Logo */}
            {/* <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-8 w-8"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg> */}

            <img src="/image/logo.png" className="rounded-[10px] w-100 h-20" />
          </div>
          {/* {!collapsed && (
            // <h1 className="ml-2 text-xl font-bold text-gray-900">LUNAR</h1>
            <img src="image/logo.png" className="rounded-[10px] w-100 h-20" />

          )} */}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700"
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center py-3 px-6 text-gray-500 hover:bg-gray-50 hover:text-blue-700 transition-colors duration-200',
                  location.pathname === item.path &&
                    'bg-blue-50 text-blue-700 border-r-4 border-red-700',
                  collapsed && 'justify-center px-0'
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0  p-6">
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            // setIsAuthenticated(false); // ✅ for rerender
            navigate('/login');
          }}
          className={cn(
            'flex items-center py-3 px-6 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 rounded-md',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
