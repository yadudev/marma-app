import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../../components/ui/AuthLayout';
import OTPInput from '../../components/ui/OTPInput';
import Button from '../../components/ui/Button';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  // Redirect if no username was provided
  useEffect(() => {
    if (!username) {
      navigate('/forgot-password');
    }
  }, [username, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      setIsLoading(false);
      return;
    }

    // Simulate OTP verification
    setTimeout(() => {
      // For demo, accept any 6-digit OTP
      if (otp.length === 6) {
        navigate('/reset-password', { state: { username, verified: true } });
      } else {
        setError('Invalid verification code. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    setCanResend(false);
    setCountdown(30);
    setError('');

    // Simulate resending OTP
    setTimeout(() => {
      // In a real app, send a new OTP
    }, 1000);
  };

  return (
    <AuthLayout
      title="Verify your identity"
      subtitle="Enter the 6-digit code we sent to your email"
    >
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              error={error ? ' ' : undefined} // Use space to preserve layout but not show duplicate error
            />

            <div className="text-sm text-gray-600">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-800 transition duration-150"
                >
                  Resend verification code
                </button>
              ) : (
                <span>Resend code in {countdown} seconds</span>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Verify Code
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
            >
              Back to password reset
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OTPVerificationPage;
