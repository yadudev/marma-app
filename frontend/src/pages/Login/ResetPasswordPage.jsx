import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { Lock } from 'lucide-react';
import AuthLayout from '../../components/ui/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { username, verified } = location.state || {};

  useEffect(() => {
    if (!verified) {
      navigate('/forgot-password');
    }
  }, [verified, navigate]);

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const passedChecks = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (passedChecks <= 2) setPasswordStrength('weak');
    else if (passedChecks <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      navigate('/reset-success');
      setIsLoading(false);
    }, 1500);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Your new password must be different from previously used passwords"
    >
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <div className="space-y-5">
          <div>
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              icon={<Lock size={18} className="text-gray-400" />}
              required
            />

            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{
                        width:
                          passwordStrength === 'weak'
                            ? '33%'
                            : passwordStrength === 'medium'
                              ? '66%'
                              : passwordStrength === 'strong'
                                ? '100%'
                                : '0%',
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium capitalize">
                    {passwordStrength || 'none'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            icon={<Lock size={18} className="text-gray-400" />}
            required
          />

          <div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Reset Password
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
            >
              Back to login
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
