import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import MyTasks from "@/pages/MyTasks";
import TaskHall from "@/pages/TaskHall";
import TaskEngine from "@/pages/TaskEngine";
import RootLayout from "@/components/layout/RootLayout";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import UserCenter from "@/pages/UserCenter";
import AccountSettings from "@/pages/AccountSettings";
import PointsDetails from "@/pages/PointsDetails";

// Mock user data
const mockUserData = {
  id: "user001",
  name: "巴特用户",
  avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20cartoon%20character%20blue%20color&sign=36984e03ea7e74e4df1dfa6e6a88eb2b",
  web3Address: "0x71C9B3f8A7b9E5aB7D12c6f8B2",
  积分: 15780,
  todayEarnings: 320,
  weeklyEarnings: 1850
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState(mockUserData);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout, userData, setUserData }}
    >
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="task-hall" element={<TaskHall />} />
          <Route path="engine" element={<TaskEngine />} />
          <Route path="user-center" element={<UserCenter />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="points-details" element={<PointsDetails />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}
