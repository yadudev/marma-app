import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const OTPInput = ({ length = 6, value, onChange, error }) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    const firstEmptyIndex = value.split('').findIndex((v) => !v);
    const indexToFocus = firstEmptyIndex !== -1 ? firstEmptyIndex : value.length - 1;

    if (indexToFocus >= 0 && indexToFocus < length) {
      inputRefs.current[indexToFocus]?.focus();
      setActiveInput(indexToFocus);
    }
  }, []);

  const handleChange = (e, index) => {
    const newValue = e.target.value;

    if (newValue.length > 1) return;

    const newOtpValue = value.split('');
    newOtpValue[index] = newValue;
    const newOtp = newOtpValue.join('');

    onChange(newOtp);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
        const newOtpValue = value.split('');
        newOtpValue[index - 1] = '';
        onChange(newOtpValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (!/^\d+$/.test(pastedData)) return;

    const trimmedData = pastedData.substring(0, length);

    const newOtpValue = value.split('');
    for (let i = 0; i < trimmedData.length; i++) {
      newOtpValue[i] = trimmedData[i];
    }

    onChange(newOtpValue.join(''));

    const nextEmptyIndex = newOtpValue.findIndex((v) => !v);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
      inputRefs.current[nextEmptyIndex]?.focus();
      setActiveInput(nextEmptyIndex);
    } else {
      inputRefs.current[length - 1]?.focus();
      setActiveInput(length - 1);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center space-x-2 md:space-x-4">
        {[...Array(length)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`
              w-12 h-14 text-center text-xl font-semibold rounded-md border 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-200
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }
            `}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
};

OTPInput.propTypes = {
  length: PropTypes.number,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default OTPInput;
