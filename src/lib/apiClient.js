"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/app/components/toast/ToastContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// One refresh at a time across every component, so rotated refresh tokens
// are never reused (reuse revokes the whole session on the server).
let refreshInFlight = null;

async function refreshTokens(setTokens) {
   if (!refreshInFlight) {
      refreshInFlight = (async () => {
         const refreshToken = Cookies.get("refreshToken");
         if (!refreshToken) return null;
         try {
            const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });
            if (res.data?.accessToken) {
               setTokens(res.data.accessToken, res.data.refreshToken || refreshToken);
               return res.data.accessToken;
            }
         } catch {
            return null;
         }
         return null;
      })().finally(() => {
         setTimeout(() => { refreshInFlight = null; }, 0);
      });
   }
   return refreshInFlight;
}

const isExpired = (token) => {
   try {
      return jwtDecode(token).exp * 1000 < Date.now() + 15_000;
   } catch {
      return true;
   }
};

export const useApiClient = () => {
   const { setTokens, logout } = useAuth();
   const { showToast } = useToast();

   const api = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
      withCredentials: true,
   });

   api.interceptors.request.use(async (config) => {
      let token = Cookies.get("accessToken");
      if (token && isExpired(token)) {
         token = await refreshTokens(setTokens);
         if (!token) {
            logout();
            return Promise.reject(new axios.Cancel("Session expired"));
         }
      }
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
   });

   api.interceptors.response.use(
      (response) => response,
      async (error) => {
         if (axios.isCancel(error)) return Promise.reject(error);
         const original = error.config || {};
         if (!error.response) {
            showToast("Network error. Try again.", "error");
            return Promise.reject(error);
         }
         const status = error.response.status;
         const isAuthCall = original.url?.startsWith("/auth/login") || original.url?.startsWith("/auth/refresh");
         if (status === 401 && !original._retry && !isAuthCall) {
            original._retry = true;
            const newToken = await refreshTokens(setTokens);
            if (newToken) {
               original.headers.Authorization = `Bearer ${newToken}`;
               return api(original);
            }
            logout();
            return Promise.reject(error);
         }

         if (!original.silent) {
            const msg = error.response.data?.message || error.response.data?.error || "Something went wrong.";
            showToast(msg, "error");
         }
         return Promise.reject(error);
      }
   );

   return api;
};
