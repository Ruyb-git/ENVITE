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
      <div className="">
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
            block w-full px-3 py-2 border rounded-md bg-[#3E3F40]  placeholder-gray-400
            focus:outline-none focus:ring-indigo-500 text-gray-400 focus:border-indigo-500 sm:text-sm
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

// import React, { forwardRef, InputHTMLAttributes, useRef } from "react";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   msg?: string;
//   icon?: React.ReactNode;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ label, error, className = "", id, msg, icon, ...props }, ref) => {
//     const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
//     const internalRef = useRef<HTMLInputElement>(null);

//     const handleIconClick = () => {
//       const input =
//         internalRef.current ||
//         (ref as React.RefObject<HTMLInputElement>)?.current;
//       if (input) {
//         input.focus();
//         input.click(); // importante para abrir o calendário ou relógio nativo
//       }
//     };

//     const isDateOrTime = props.type === "date" || props.type === "time";

//     return (
//       <div className="mb-4 relative">
//         {label && (
//           <label
//             htmlFor={inputId}
//             className="block text-sm font-medium text-white mb-1"
//           >
//             {label}
//           </label>
//         )}

//         <div className="relative">
//           <input
//             id={inputId}
//             ref={(node) => {
//               if (typeof ref === "function") ref(node);
//               else if (ref)
//                 (ref as React.MutableRefObject<HTMLInputElement>).current =
//                   node;
//               internalRef.current = node;
//             }}
//             className={`
//               block w-full px-3 py-2 pr-10 border rounded-md bg-[#3E3F40] placeholder-gray-400
//               focus:outline-none focus:ring-indigo-500 text-white focus:border-indigo-500 sm:text-sm
//               ${error ? "border-red-500" : "border-[#434343]"}
//               ${className}
//               ${isDateOrTime ? "remove-native-icon" : ""}
//             `}
//             {...props}
//           />

//           {icon && (
//             <div
//               onClick={handleIconClick}
//               className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-indigo-400 cursor-pointer"
//             >
//               {icon}
//             </div>
//           )}
//         </div>

//         {msg && <p className="text-white text-[11px] font-extralight">{msg}</p>}
//         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//       </div>
//     );
//   }
// );

// export default Input;
