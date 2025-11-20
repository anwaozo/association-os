'use client';
import { createContext, useReducer, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const initialState = {
   accessToken: "",
   refreshToken: "",
   user: null,
   isAuthenticated: false,
   isLoading: true
};

function authReducer(state, action) {
   switch (action.type) {
      case 'SET_TOKENS':
         return {
            ...state,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken,
            isAuthenticated: true
         };

      case 'SET_USER':
         return { ...state, user: action.payload };
      
      case 'FINISH_LOADING':
         return { ...state, isLoading: false };

      case 'LOGOUT':
         return {
            accessToken: "",
            refreshToken: "",
            user: null,
            isAuthenticated: false,
            isLoading: false
         };

      default:
         return state;
   }
}

export function AuthProvider({ children }) {
   const [state, dispatch] = useReducer(authReducer, initialState);

   useEffect(() => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const userCookie = Cookies.get('user');
      const user = userCookie ? JSON.parse(userCookie) : null;

      if (accessToken && refreshToken && user) {
         try {
            const decoded = jwtDecode(accessToken);
            if (decoded.exp * 1000 < Date.now()) {
               dispatch({ type: 'LOGOUT' });
            } else {
               dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
               dispatch({ type: 'SET_USER', payload:  user  });
            }
         } catch (err) {
            dispatch({ type: 'LOGOUT' });
         }
      }
      dispatch({ type: "FINISH_LOADING" });
   }, []);

   const setTokens = (accessToken, refreshToken) => {
      Cookies.set('accessToken', accessToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 1 });
      dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } });
   };

   const setUser = (user) => {
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      dispatch({ type: 'SET_USER', payload: user });
   };

   const logout = () => {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      dispatch({ type: 'LOGOUT' });
   };

   return (
      <AuthContext.Provider value={{ state, setTokens, setUser, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
