"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/app/components/toast/ToastContext";

export const useApiClient = () => {
   const { state, setTokens, logout } = useAuth();
   const { showToast } = useToast();

   const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
         "Content-Type": "application/json",
      },
      timeout: 8000,
   });

   // ---------------------------------------------------
   // REQUEST INTERCEPTOR
   // Auto attach token + detect JWT expiry
   // ---------------------------------------------------
   api.interceptors.request.use(
      async (config) => {
         const token = state.accessToken;

         if (token) {
            try {
               const decoded = jwtDecode(token);
               if (decoded.exp * 1000 < Date.now()) {
                  // EXPIRED → Try refreshing
                  const newToken = await refreshAccessToken();
                  if (!newToken) {
                     logout();
                     return Promise.reject("Session expired");
                  }
                  config.headers.Authorization = `Bearer ${newToken}`;
               } else {
                  config.headers.Authorization = `Bearer ${token}`;
               }
            } catch (err) {
               logout();
            }
         }
         return config;
      },
      (error) => Promise.reject(error)
   );

   // ---------------------------------------------------
   // RESPONSE INTERCEPTOR
   // Auto refresh token + retry + global errors
   // ---------------------------------------------------
   api.interceptors.response.use(
      (response) => response,
      async (error) => {
         const original = error.config;
         if (!error.response) {
            showToast("Network error. Try again.", "error");
            return Promise.reject(error);
         }
         const status = error.response.status;
         if (status === 401 && !original._retry) {
            original._retry = true;
            const newToken = await refreshAccessToken();
            if (newToken) {
               original.headers.Authorization = `Bearer ${newToken}`;
               return api(original);
            } else {
               logout();
            }
         }

         const msg =
         error.response.data?.message ||
         error.response.data?.error ||
         "Something went wrong.";
         showToast(msg, "error");
         return Promise.reject(error);
      }
   );

   // ---------------------------------------------------
   // REFRESH TOKEN FUNCTION
   // ---------------------------------------------------
   const refreshAccessToken = async () => {
      try {
         const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
         {
            refreshToken: state.refreshToken,
         },
         { withCredentials: true }
         );

         if (res.data?.accessToken) {
            setTokens(res.data.accessToken, state.refreshToken);
            return res.data.accessToken;
         }
      } catch (err) {
         return null;
      }

      return null;
   };

   return api;
};
