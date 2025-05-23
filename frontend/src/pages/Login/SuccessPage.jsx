import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { CheckCircle } from 'lucide-react';
import AuthLayout from '../../components/ui/AuthLayout';
import Button from '../../components/ui/Button';

const SuccessPage = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  // Auto-redirect after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/login');
    }
  }, [countdown, navigate]);

  return (
    <AuthLayout title="Password Reset Successful">
      <div className="flex flex-col items-center space-y-6 py-4 animate-fadeIn">
        <div className="text-green-500 animate-bounce">
          <CheckCircle size={64} />
        </div>

        <div className="text-center space-y-2">
          <p className="text-gray-700">Your password has been reset successfully.</p>
          <p className="text-gray-500">
            You will be redirected to the login page in {countdown} seconds.
          </p>
        </div>

        <Button as={Link} to="/login" className="w-full mt-4" size="lg">
          Return to Login Now
        </Button>
      </div>
    </AuthLayout>
  );
};

export default SuccessPage;
