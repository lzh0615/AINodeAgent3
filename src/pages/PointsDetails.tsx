import React, { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

// Transaction type
type TransactionType = 'all' | 'earn' | 'spend' | 'transfer';

// Transaction item interface
interface TransactionItem {
  id: string;
  type: 'earn' | 'spend' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// Mock transaction data
const generateMockTransactions = (): TransactionItem[] => {
  const types: ('earn' | 'spend' | 'transfer')[] = ['earn', 'spend', 'transfer'];
  const descriptions = {
    earn: [
      '完成任务：高质量图像生成',
      '完成任务：市场分析报告',
      '邀请新用户注册奖励',
      '任务审核通过奖励',
      '每日签到奖励'
    ],
    spend: [
      '兑换奖励：高级会员',
      '兑换奖励：AI模型使用权',
      '支付任务加速费用',
      '平台服务费用',
      '购买高级功能'
    ],
    transfer: [
      '转账至钱包地址',
      '从钱包转账至平台',
      '积分转赠给好友',
      '活动奖励转账',
      '系统补偿'
    ]
  };
  
  const transactions: TransactionItem[] = [];
  
  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 500) + 50;
    const descriptionList = descriptions[type];
    const description = descriptionList[Math.floor(Math.random() * descriptionList.length)];
    const date = new Date(Date.now() - i * 86400000 * (Math.floor(Math.random() * 5) + 1)).toISOString().split('T')[0];
    
    transactions.push({
      id: `TX${Date.now().toString().slice(-6)}${i}`,
      type,
      amount: type === 'earn' || type === 'transfer' && Math.random() > 0.5 ? amount : -amount,
      description,
      date,
      status: 'completed'
    });
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock data for points trend chart
const pointsTrendData = [
  { name: '10/23', points: 14500 },
  { name: '10/24', points: 14700 },
  { name: '10/25', points: 14900 },
  { name: '10/26', points: 15200 },
  { name: '10/27', points: 15450 },
  { name: '10/28', points: 15680 },
  { name: '10/29', points: 15780 },
];

const PointsDetails: React.FC = () => {
  const { userData } = useContext(AuthContext);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TransactionType>('all');
  const [transactions] = useState<TransactionItem[]>(generateMockTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Filter transactions by type and search query
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (activeTab !== 'all' && transaction.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query)
      );
    }
    
    return true;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, TransactionItem[]>);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  // Get transaction type icon and color
  const getTransactionTypeInfo = (type: string, amount: number) => {
    if (amount > 0) {
      return {
        icon: 'fa-plus-circle',
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30'
      };
    } else {
      return {
        icon: 'fa-minus-circle',
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30'
      };
    }
  };

  // Export transaction history
  const exportTransactions = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      toast('交易记录已导出为CSV文件');
      setIsExporting(false);
    }, 1500);
  };

  if (!userData) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">积分明细</h1>
        <p className="text-gray-500 dark:text-gray-400">查看您的积分收支记录和历史交易</p>
      </div>

      {/* Current Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">当前可用积分</h3>
              <p className="text-3xl font-bold mt-2">{userData.积分.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-500">
              <i className="fa-solid fa-coins text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            较上周 <span className="text-green-500">+12.5%</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">本月收入</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">+3,250</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
              <i className="fa-solid fa-arrow-down text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            较上月 <span className="text-green-500">+8.3%</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">本月支出</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">-1,500</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
              <i className="fa-solid fa-arrow-up text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            较上月 <span className="text-red-500">-2.1%</span>
          </div>
        </div>
      </div>

      {/* Points Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">积分趋势（近7天）</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            总积分变化: +1,280
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pointsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} /><XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
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
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: theme === 'dark' ? '#1f2937' : '#ffffff' }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'all' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          全部交易
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'earn' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('earn')}
        >
          收入
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'spend' 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('spend')}
        >
          支出
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'transfer' 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('transfer')}
        >
          转账
        </button>
        
        <div className="ml-auto flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索交易..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '200px' }}
            />
            <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
              <i className="fa-solid fa-search"></i>
            </div>
          </div>
          
          <button
            className={`ml-2 px-3 py-2 rounded-lg text-sm flex items-center transition-colors ${
              isExporting
                ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/40'
            }`}
            onClick={exportTransactions}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                导出中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-download mr-1"></i>
                导出记录
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(date => (
            <div key={date} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-medium">{formatDate(date)}</h4>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {groupedTransactions[date].map(transaction => {
                  const typeInfo = getTransactionTypeInfo(transaction.type, transaction.amount);
                  const isPositive = transaction.amount > 0;
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-full ${typeInfo.bgColor} flex items-center justify-center ${typeInfo.color} mr-4 flex-shrink-0`}>
                          <i className={`fa-solid ${typeInfo.icon}`}></i>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start">
                            <h5 className="font-medium">{transaction.description}</h5>
                            <span className={`font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isPositive ? '+' : ''}{transaction.amount}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap justify-between items-center mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.id}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                              {transaction.status === 'completed' ? '已完成' : 
                               transaction.status === 'pending' ? '处理中' : '失败'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="text-4xl text-gray-300 dark:text-gray-600 mb-4">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无交易记录</h3>
            <p className="text-gray-500 dark:text-gray-400">
              没有找到符合条件的交易记录，请尝试调整筛选条件
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsDetails;