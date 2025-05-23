import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';

type DoctorFormData = {
  name: string;
  email?: string;
  phone?: string;
  duration: string;
  image: FileList;
};

interface LearnervidoesProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  isEdit: boolean;
  initialData: any | null;
}

const Learnervidoes: React.FC<LearnervidoesProps> = ({
  isOpen,
  onClose,
  apiUrl,
  isEdit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DoctorFormData>();

  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const selectedFile = watch('image');

  const token = localStorage.getItem('isAuthenticated');


  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        name: initialData.name || '',
        duration: initialData.duration || '',
        image: undefined,
      });
      setMediaPreview(initialData.videoUrl || null);
    }
  }, [isEdit, initialData, reset]);

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setMediaPreview(null);
    }
  }, [selectedFile]);

  const onSubmit = async (data: DoctorFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('duration', data.duration);

      if (data.image && data.image[0]) {
        formData.append('video', data.image[0]);
      }

      if (isEdit && initialData?.id) {
        await axios.put(`${apiUrl}/admin/learner/${initialData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${apiUrl}/admin/learner`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      reset();
      setMediaPreview(null);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Video' : 'Add Video'}</h2>

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
              type="text"
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              {...register('duration', {
                required: 'Duration is required',
              })}
              placeholder="Duration"
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
          </div>

          <div>
            <input
              className="w-full px-3 py-2 border-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              type="file"
              accept="image/*,video/*"
              {...register('image', {
                validate: (files) => {
                  if (!files.length) return true;
                  const fileType = files[0].type;
                  return (
                    fileType.startsWith('image/') ||
                    fileType.startsWith('video/') ||
                    'Only image or video files are allowed'
                  );
                },
              })}
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>

          {mediaPreview && (
            <div className="mt-2">
              {selectedFile?.[0]?.type?.startsWith('image/') ? (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded-md border"
                />
              ) : (
                <video controls src={mediaPreview} className="w-full h-48 rounded-md border" />
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loadingText={isEdit ? 'Updating...' : 'Adding...'}
            isLoading={loading}
          >
            {isEdit ? 'Update Video' : 'Add Video'}
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

export default Learnervidoes;
