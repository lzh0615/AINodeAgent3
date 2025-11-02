import { createContext } from "react";

interface UserData {
  id: string;
  name: string;
  avatar: string;
  web3Address: string;
 积分: number;
  todayEarnings: number;
  weeklyEarnings: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
  userData: null,
  setUserData: () => {},
});