import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

interface CustomDateInputProps {
  label?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  label,
  selected,
  onChange,
  error,
}) => {
  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione uma data"
          className={`block w-full px-4 py-3 border rounded-lg bg-[#3E3F40] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-[#434343] hover:border-gray-500"
          }`}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Calendar className="text-gray-400 w-5 h-5" />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center">
          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomDateInput;
