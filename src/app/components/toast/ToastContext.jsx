"use client";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
   const [toast, setToast] = useState(null);

   const showToast = (message, type = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
   };

   return (
      <ToastContext.Provider value={{ showToast }}>
         {children}
         {toast && (
         <div
            className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white text-sm z-50 transition-all
               ${
               toast.type === "success"
                  ? "bg-green-600"
                  : toast.type === "error"
                  ? "bg-red-600"
                  : "bg-gray-600"
               }`}
         >
            {toast.message}
         </div>
         )}
      </ToastContext.Provider>
   );
};

export const useToast = () => useContext(ToastContext);
