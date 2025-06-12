import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  msg?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, msg, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            block w-full px-3 py-2 border rounded-md bg-[#2F2F2F] placeholder-gray-400
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            ${error ? "border-red-500" : "border-[#434343]"}
            ${className}
          `}
          {...props}
        />
        {msg && <p className="text-white text-[11px] font-extralight">{msg}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

export default Input;
