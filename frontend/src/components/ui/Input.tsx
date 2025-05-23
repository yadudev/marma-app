import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  label?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string; // <-- added here
  accept?: string; // <-- add accept prop
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  accept,
  className = '', // <-- default empty string
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <input
        type={isPassword && showPassword ? 'text' : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 ${className}`}
      />
      {isPassword && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      )}
    </div>
  );
};

export default Input;
