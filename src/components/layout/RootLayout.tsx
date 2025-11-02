import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define navigation items
interface NavItem {
  id: string;
  name: string;
  icon: string;
  path: string;
}

// Side navigation items
const sideNavItems: NavItem[] = [
  { id: 'dashboard', name: '首页仪表盘', icon: 'fa-chart-line', path: '/' },
  { id: 'task-hall', name: '任务大厅', icon: 'fa-bullhorn', path: '/task-hall' },
  { id: 'engine', name: '任务引擎', icon: 'fa-cogs', path: '/engine' },
  { id: 'tasks', name: '我的任务', icon: 'fa-list-check', path: '/tasks' },
  { id: 'points-details', name: '积分明细', icon: 'fa-coins', path: '/points-details' },
];

// Right sidebar items (recent activities)
const recentActivities = [
  { id: 1, message: '完成了任务 "市场分析报告"', time: '10分钟前', type: 'success' },
  { id: 2, message: '获得了 +350 积分奖励', time: '30分钟前', type: 'success' },
  { id: 3, message: '领取了新任务 "高质量图像生成"', time: '1小时前', type: 'info' },
  { id: 4, message: '任务 "短视频剪辑" 处理失败', time: '2小时前', type: 'error' },
  { id: 5, message: '系统维护通知：将于今晚12点进行', time: '3小时前', type: 'warning' },
];

const RootLayout: React.FC = () => {
  const { isAuthenticated, userData, logout } = useContext(AuthContext);
  const { toggleTheme, isDark } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Update current path for active nav item
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path === '/' ? '/dashboard' : path);
  }, []);

  // Handle copy wallet address
  const copyWalletAddress = () => {
    if (userData) {
      navigator.clipboard.writeText(userData.web3Address);
      toast('地址已复制到剪贴板');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast('已成功登出');
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <i className="fa-solid fa-circle-check text-green-500"></i>;
      case 'error':
        return <i className="fa-solid fa-circle-exclamation text-red-500"></i>;
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>;
      case 'info':
      default:
        return <i className="fa-solid fa-circle-info text-blue-500"></i>;
    }
  };

  // If not authenticated, show login page
  if (!isAuthenticated || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fa-solid fa-globe text-3xl text-blue-500"></i>
            </div>
            <h1 className="text-2xl font-bold">巴特星球</h1>
            <p className="text-gray-500 dark:text-gray-400">分布式AIGC任务系统</p>
          </div>
          <button 
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            登录系统
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Side Navigation - Desktop */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 transform z-30 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg
        overflow-y-auto
      `}>
        {/* Logo and brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-blue-50 dark:bg-blue-900/30 planet-animation">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 data-flow opacity-80"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">巴特星球</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AIGC任务系统</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sideNavItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    currentPath === item.path
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentPath(item.path);
                  }}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-center mr-3`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme toggle */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            onClick={toggleTheme}
          >
            <div className="flex items-center">
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} w-5 text-center mr-3`}></i>
              {isDark ? '切换到浅色模式' : '切换到深色模式'}
            </div>
            <i className="fa-solid fa-chevron-right text-xs opacity-50"></i>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-6 flex items-center justify-between z-20">
          <div className="flex items-center">
            <button 
              className="lg:hidden p-2 mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <h2 className="text-xl font-semibold">
              {sideNavItems.find(item => item.path === currentPath)?.name || '控制面板'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Web3 Account */}
            <div className="hidden md:flex items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <i className="fa-solid fa-link text-blue-500 mr-2"></i>
              <span className="text-sm mr-2">
                {userData.web3Address.substring(0, 6)}...{userData.web3Address.substring(userData.web3Address.length - 4)}
              </span>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={copyWalletAddress}
                aria-label="复制地址"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                />
                <span className="hidden md:inline text-sm font-medium">{userData.name}</span>
                <i className="fa-solid fa-chevron-down text-xs opacity-50"></i>
              </button>

              {/* User menu dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <ul className="py-1">
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          window.location.href = '/user-center';
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-user mr-2 text-gray-500"></i>
                        用户中心
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          window.location.href = '/account-settings';
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-gear mr-2 text-gray-500"></i>
                        账户设置
                      </button>
                    </li>
                    <li className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={handleLogout}
                      >
                        <i className="fa-solid fa-right-from-bracket mr-2"></i>
                        退出登录
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar - Desktop only */}
      <aside className="hidden 2xl:block w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        {/* Recent Activities */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">最近动态</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="mr-3 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">快速统计</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">总完成任务</h4>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">+12% 本周</span>
              </div>
              <p className="text-2xl font-bold">28</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">总获得积分</h4>
                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">+8% 本月</span>
              </div>
              <p className="text-2xl font-bold">{userData.积分.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">系统状态</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              正常运行
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">服务器响应</span>
              <span>234ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">当前在线用户</span>
              <span>1,256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">活跃任务</span>
              <span>342</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default RootLayout;