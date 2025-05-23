import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/ui/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { login_form } from '../../components/services/authServices';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting and reloading the page
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        emailOrUsername: username,
        password: password,
      };
      console.log(payload); // Now this will show in the console
      const res = await login_form(payload);
      const token = res.data.token;

      if (res.success === true) {
        localStorage.setItem('isAuthenticated', token);
        navigate('/admin');
      } else {
        navigate('/admin');

        setError(res.message);
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Panel" subtitle="Enter your credentials to access the admin panel">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div>
            <Button type="submit" className="w-full " size="lg" isLoading={isLoading}>
              Login
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
