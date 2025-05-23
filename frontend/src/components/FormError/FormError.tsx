// components/ui/FormError.tsx
import React from 'react';

type Props = {
  message?: string;
};

const FormError = ({ message }: Props) => {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
};

export default FormError;
