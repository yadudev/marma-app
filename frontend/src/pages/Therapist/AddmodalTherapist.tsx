import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';

type DoctorFormData = {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  image: FileList;
};

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, apiUrl }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('isAuthenticated');

  const onSubmit = async (data: DoctorFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('specialization', data.specialization);
      formData.append('experience', data.experience);
      if (data.image[0]) {
        formData.append('file', data.image[0]);
      }

      await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder="Name"
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              })}
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="tel"
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register('phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Enter a valid phone number',
                },
              })}
              placeholder="Phone"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register('specialization', {
                required: 'Specialization is required',
              })}
              placeholder="Specialization"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">{errors.specialization.message}</p>
            )}
          </div>

          <div>
            <input
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register('experience', {
                required: 'Experience is required',
                pattern: {
                  value: /^[0-9]+( ?years?)?$/i,
                  message: "Enter experience like '5 years'",
                },
              })}
              placeholder="Experience (e.g. 5 years)"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <input
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              type="file"
              accept="image/*"
              {...register('image', {
                validate: (files) =>
                  !files.length || files[0].type.startsWith('image/')
                    ? true
                    : 'Only image files are allowed',
              })}
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loadingText="Adding..."
            isLoading={loading}
          >
            Add Doctor
          </Button>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
      1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 
      11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 
      10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddDoctorModal;
