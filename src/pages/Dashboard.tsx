import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data for points trend chart
const pointsTrendData = [
  { name: '10/23', points: 120 },
  { name: '10/24', points: 180 },
  { name: '10/25', points: 150 },
  { name: '10/26', points: 280 },
  { name: '10/27', points: 220 },
  { name: '10/28', points: 320 },
  { name: '10/29', points: 260 },
];

// Mock data for top 100 users
const generateTopUsers = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `user${index + 1}`,
    rank: index + 1,
    name: `用户${Math.floor(Math.random() * 10000)}`,
    avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20${index % 10}`,
    points: 20000 - Math.floor(Math.random() * 15000) - index * 30
  }));
};

// Mock data for platform points and usage
const platformPointsData = {
  totalPoints: 1250000,
  usedPoints: 850000,
  remainingPoints: 400000,
  usageRate: 68
};

// Mock data for computing network
const computingNetworkData = {
  nodesCount: 128,
  totalComputingPower: '2560 TFLOPS',
  totalStorage: '12.5 PB',
  loadPercentage: 42
};

// Mock data for tasks overview
const tasksOverviewData = {
  totalTasks: 1560,
  completedTasks: 1240,
  pendingTasks: 320,
  successRate: 92
};

// Data for task status pie chart
const taskStatusData = [
  { name: '已完成', value: tasksOverviewData.completedTasks, color: '#10b981' },
  { name: '排队中', value: tasksOverviewData.pendingTasks, color: '#3b82f6' }
];

const Dashboard: React.FC = () => {
  const { userData } = useContext(AuthContext);
  const { theme } = useTheme();
  const [topUsers] = useState(generateTopUsers(100));
  const [isRankingScrolling, setIsRankingScrolling] = useState(true);
  const [scrolledPosition, setScrolledPosition] = useState(0);

  // Copy wallet address function
  const copyWalletAddress = () => {
    if (userData) {
      navigator.clipboard.writeText(userData.web3Address);
      toast('地址已复制到剪贴板');
    }
  };

  // Auto-scroll ranking list
  useEffect(() => {
    if (!isRankingScrolling) return;

    const interval = setInterval(() => {
      setScrolledPosition(prev => {
        const nextPos = prev + 1;
        // Reset when reaching the end
        return nextPos >= topUsers.length * 40 ? 0 : nextPos;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRankingScrolling, topUsers.length]);

  if (!userData) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">仪表盘</h1>
        <p className="text-gray-500 dark:text-gray-400">欢迎回来，{userData.name}！查看您的任务数据和收益情况</p>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Web3 Account Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Web3 账户</CardTitle>
                <div className="flex items-center mt-2">
                  <span className="font-semibold mr-2">{userData.web3Address.substring(0, 6)}...{userData.web3Address.substring(userData.web3Address.length - 4)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyWalletAddress}
                    aria-label="复制地址"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </Button>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                <i className="fa-solid fa-link"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              完整地址: <span className="text-xs">{userData.web3Address}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">账户积分余额</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">{userData.积分.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">今日收益</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">+{userData.todayEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Points Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">平台已发放积分</h3>
              <p className="text-2xl font-bold mt-2">{platformPointsData.totalPoints.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
              <i className="fa-solid fa-coins"></i>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">积分使用情况</span>
              <span className="font-medium">{platformPointsData.usageRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-purple-500 h-2.5 rounded-full dark:bg-purple-400" 
                style={{ width: `${platformPointsData.usageRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>已使用: {platformPointsData.usedPoints.toLocaleString()}</span>
              <span>剩余: {platformPointsData.remainingPoints.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Computing Network Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">算力网络状态</h3>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-lg font-bold">{computingNetworkData.nodesCount}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">算力节点</span>
                </div>
                <div>
                  <p className="text-lg font-bold">{computingNetworkData.totalComputingPower}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">算力总量</span>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
              <i className="fa-solid fa-server"></i>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <p className="text-lg font-bold">{computingNetworkData.totalStorage}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">存储总量</span>
            </div>
            <div>
              <p className="text-lg font-bold">{computingNetworkData.loadPercentage}%</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">网络负载</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">任务概览</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">总任务数</h4>
              <p className="text-2xl font-bold">{tasksOverviewData.totalTasks}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">已完成任务</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{tasksOverviewData.completedTasks}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">排队中任务</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasksOverviewData.pendingTasks}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">成功率</h4>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{tasksOverviewData.successRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">任务状态分布</h3>
          <div className="flex items-center">
            <div className="w-32 h-32 mr-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {taskStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm">{item.name}</span>
                  <span className="ml-2 text-sm font-medium">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">总体完成率</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {(tasksOverviewData.completedTasks / tasksOverviewData.totalTasks * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">积分趋势（近7天）</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              总积分: {pointsTrendData.reduce((sum, item) => sum + item.points, 0)}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pointsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: theme === 'dark' ? '#1f2937' : '#ffffff' }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 100 Ranking */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">积分榜 TOP 100</h3>
            <button 
              className="text-sm flex items-center text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsRankingScrolling(!isRankingScrolling)}
            >
              {isRankingScrolling ? (
                <>
                  <i className="fa-solid fa-pause mr-1"></i> 暂停
                </>
              ) : (
                <>
                  <i className="fa-solid fa-play mr-1"></i> 继续
                </>
              )}
            </button>
          </div>
          <div className="relative h-64 overflow-hidden rounded-lg">
            <div 
              className="absolute w-full" 
              style={{ transform: `translateY(-${scrolledPosition}px)` }}
            >
              {topUsers.slice(0, 20).map((user, index) => (
                <div 
                  key={user.id} 
                  className={cn("flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors", 
                    index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20" : 
                    index === 1 ? "bg-gray-50 dark:bg-gray-700/30" : 
                    index === 2 ? "bg-amber-50 dark:bg-amber-900/20" : "")}
                >
                  <div className="w-6 text-center font-bold text-sm mr-2">
                    {user.rank}
                  </div>
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                  />
                  <div className="flex-1 text-sm truncate">{user.name}</div>
                  <div className="font-semibold text-sm">{user.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">最近任务</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Task Card 1 */}
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">图片生成任务</h4>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">进行中</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">生成高质量AI图像，基于用户提供的文本描述</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">+200 积分</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">60% 完成</span>
            </div>
          </div>
          
          {/* Task Card 2 */}
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">文本创作任务</h4>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">已完成</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">根据主题创作一篇高质量文章，要求500字以上</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">+350 积分</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">已发放</span>
            </div>
          </div>
          
          {/* Task Card 3 */}
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">视频剪辑任务</h4>
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">待领取</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">将多个短视频片段剪辑成一个连贯的故事</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">+500 积分</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">剩余2个名额</span>
            </div>
          </div>
          
          {/* Task Card 4 */}
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">数据标注任务</h4>
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">已失效</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">标注AI训练数据集，提升模型识别准确率</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">+150 积分</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">名额已满</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;