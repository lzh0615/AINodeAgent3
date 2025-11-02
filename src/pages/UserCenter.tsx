import React, { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Mock data for task completion chart
const taskCompletionData = [
  { name: '1月', 完成: 3, 失败: 1 },
  { name: '2月', 完成: 5, 失败: 0 },
  { name: '3月', 完成: 4, 失败: 1 },
  { name: '4月', 完成: 6, 失败: 1 },
  { name: '5月', 完成: 7, 失败: 0 },
  { name: '6月', 完成: 8, 失败: 2 },
  { name: '7月', 完成: 6, 失败: 1 },
  { name: '8月', 完成: 9, 失败: 1 },
  { name: '9月', 完成: 10, 失败: 2 },
  { name: '10月', 完成: 7, 失败: 1 },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, type: 'task_complete', title: '完成了任务', description: '高质量图像生成', time: '20分钟前', icon: 'fa-check-circle', color: 'text-green-500' },
  { id: 2, type: 'point_earn', title: '获得积分奖励', description: '+350 积分', time: '1小时前', icon: 'fa-coins', color: 'text-yellow-500' },
  { id: 3, type: 'task_accept', title: '领取了新任务', description: '短视频剪辑', time: '3小时前', icon: 'fa-tasks', color: 'text-blue-500' },
  { id: 4, type: 'system_notice', title: '系统通知', description: '账户安全检查已完成', time: '昨天', icon: 'fa-bell', color: 'text-purple-500' },
  { id: 5, type: 'task_fail', title: '任务处理失败', description: '3D模型渲染', time: '2天前', icon: 'fa-times-circle', color: 'text-red-500' },
];

// Mock data for user stats
const userStats = {
  totalTasks: 158,
  completedTasks: 142,
  successRate: '90%',
  level: '高级贡献者',
  rank: 12,
  totalPoints: 15780,
  badges: [
    { name: '优质贡献者', icon: 'fa-award', color: 'text-yellow-500' },
    { name: '创意达人', icon: 'fa-lightbulb', color: 'text-amber-500' },
    { name: '坚持不懈', icon: 'fa-hammer', color: 'text-blue-500' },
    { name: '快速响应', icon: 'fa-bolt', color: 'text-purple-500' },
  ]
};

const UserCenter: React.FC = () => {
  const { userData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'badges'>('overview');

  // Copy wallet address function
  const copyWalletAddress = () => {
    if (userData) {
      navigator.clipboard.writeText(userData.web3Address);
      toast('地址已复制到剪贴板');
    }
  };

  if (!userData) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">用户中心</h1>
        <p className="text-gray-500 dark:text-gray-400">查看和管理您的个人信息和活动</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <i className="fa-solid fa-check text-white text-xs"></i>
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
            <p className="text-blue-500 dark:text-blue-400 mb-3">{userStats.level}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
                <i className="fa-solid fa-crown text-yellow-500 mr-2"></i>
                <span>排名 #{userStats.rank}</span>
              </div>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
                <i className="fa-solid fa-coins text-yellow-500 mr-2"></i>
                <span>{userStats.totalPoints} 积分</span>
              </div>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
                <i className="fa-solid fa-tasks mr-2"></i>
                <span>已完成 {userStats.completedTasks} 任务</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm flex items-center">
                <i className="fa-solid fa-chart-line mr-1"></i>
                成功率: {userStats.successRate}
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm flex items-center">
                <i className="fa-solid fa-calendar-check mr-1"></i>
                加入时间: 2025年1月15日
              </div>
            </div>
          </div>
        </div>
        
        {/* Web3 Account Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Web3 账户</h3>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
            <div className="flex items-center">
              <i className="fa-solid fa-link text-blue-500 mr-3"></i>
              <span className="font-medium">{userData.web3Address.substring(0, 6)}...{userData.web3Address.substring(userData.web3Address.length - 4)}</span>
            </div>
            <button 
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm flex items-center"
              onClick={copyWalletAddress}
            >
              <i className="fa-regular fa-copy mr-1.5"></i>
              复制地址
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'activities'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('activities')}
        >
          最近活动
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'badges'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('badges')}
        >
          成就徽章
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Completion Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">任务完成趋势</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="完成" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="失败" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6">关键指标</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">总任务数</h4>
                <p className="text-2xl font-bold">{userStats.totalTasks}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">完成任务</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.completedTasks}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">成功率</h4>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{userStats.successRate}</p>
                  <span className="text-green-500 text-xs mb-1">
                    <i className="fa-solid fa-arrow-up"></i> 2.5%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">总积分</h4>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
                  <span className="text-green-500 text-xs mb-1">
                    <i className="fa-solid fa-arrow-up"></i> 12.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">最近活动</h3>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors">
                <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${activity.color} mr-4 flex-shrink-0`}>
                  <i className={`fa-solid ${activity.icon}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors">
              查看更多活动 <i className="fa-solid fa-chevron-down ml-1"></i>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">成就徽章</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userStats.badges.map((badge, index) => (
              <div 
                key={index} 
                className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${badge.color} mb-4 mx-auto`}>
                  <i className={`fa-solid ${badge.icon} text-2xl`}></i>
                </div>
                <h4 className="text-center font-medium mb-1">{badge.name}</h4>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  已获得 · {Math.floor(Math.random() * 30) + 10} 天前
                </p>
              </div>
            ))}
            
            {/* Locked badges */}
            <div className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl opacity-50 cursor-not-allowed">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-4 mx-auto">
                <i className="fa-solid fa-lock text-2xl"></i>
              </div>
              <h4 className="text-center font-medium mb-1">资深专家</h4>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                完成100个高级任务解锁
              </p>
            </div>
            
            <div className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl opacity-50 cursor-not-allowed">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-4 mx-auto">
                <i className="fa-solid fa-lock text-2xl"></i>
              </div>
              <h4 className="text-center font-medium mb-1">创意大师</h4>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                获得5次优质评价解锁
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCenter;