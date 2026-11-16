'use client';
import { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const initialState = {
   accessToken: '',
   refreshToken: '',
   user: null,
   organization: null,
   isAuthenticated: false,
   isLoading: true,
};

const COOKIE_OPTS = { expires: 30, sameSite: 'lax', secure: typeof window !== 'undefined' && window.location.protocol === 'https:' };

function authReducer(state, action) {
   switch (action.type) {
      case 'SET_TOKENS':
         return {
            ...state,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken,
            isAuthenticated: true,
         };
      case 'SET_USER':
         return { ...state, user: action.payload };
      case 'SET_ORG':
         return { ...state, organization: action.payload };
      case 'FINISH_LOADING':
         return { ...state, isLoading: false };
      case 'LOGOUT':
         return { ...initialState, isLoading: false };
      default:
         return state;
   }
}

const readJson = (name) => {
   try {
      const v = Cookies.get(name);
      return v ? JSON.parse(v) : null;
   } catch {
      return null;
   }
};

export function AuthProvider({ children }) {
   const [state, dispatch] = useReducer(authReducer, initialState);

   useEffect(() => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const user = readJson('user');
      const organization = readJson('org');

      if (accessToken && refreshToken && user) {
         try {
            const decoded = jwtDecode(accessToken);
            // Sessions from before multi-tenancy have no organization: log out.
            if (!decoded.organizationId) {
               dispatch({ type: 'LOGOUT' });
            } else {
               // An expired access token is fine: the API client refreshes it.
               dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
               dispatch({ type: 'SET_USER', payload: user });
               if (organization) dispatch({ type: 'SET_ORG', payload: organization });
            }
         } catch {
            dispatch({ type: 'LOGOUT' });
         }
      }
      dispatch({ type: 'FINISH_LOADING' });
   }, []);

   const setTokens = useCallback((accessToken, refreshToken) => {
      Cookies.set('accessToken', accessToken, COOKIE_OPTS);
      Cookies.set('refreshToken', refreshToken, COOKIE_OPTS);
      dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
   }, []);

   const setUser = useCallback((user) => {
      Cookies.set('user', JSON.stringify(user), COOKIE_OPTS);
      dispatch({ type: 'SET_USER', payload: user });
   }, []);

   const setOrganization = useCallback((organization) => {
      Cookies.set('org', JSON.stringify(organization), COOKIE_OPTS);
      dispatch({ type: 'SET_ORG', payload: organization });
   }, []);

   const logout = useCallback(() => {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken && process.env.NEXT_PUBLIC_API_URL) {
         // Revoke the session server-side; ignore network errors.
         fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ refreshToken }),
         }).catch(() => {});
      }
      ['accessToken', 'refreshToken', 'user', 'org'].forEach((c) => Cookies.remove(c));
      dispatch({ type: 'LOGOUT' });
   }, []);

   return (
      <AuthContext.Provider value={{ state, setTokens, setUser, setOrganization, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
