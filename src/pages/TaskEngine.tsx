import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define engine status type
type EngineStatus = 'running' | 'stopped' | 'error';

// Define log level type
type LogLevel = 'INFO' | 'WARN' | 'ERROR';

// Define log entry interface
interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
}

// Mock log data
const generateMockLogs = (count: number = 50) => {
  const levels: LogLevel[] = ['INFO', 'WARN', 'ERROR'];
  const messages = [
    'Engine started successfully',
    'Task processing started: T202510290001',
    'GPU memory usage: 65%',
    'Network connection established',
    'Model loaded: stable-diffusion-v1.5',
    'Warning: High CPU usage detected',
    'Task completed: T202510290002',
    'Error: Failed to connect to database',
    'Retrying database connection...',
    'Database connection restored',
    'New task received: T202510290003',
    'Task queue status: 3 tasks pending',
    'Warning: Low disk space',
    'Engine performance metrics updated',
    'Error: Task processing failed for T202510290004',
    'System update available',
    'Cache cleared successfully',
    'Warning: Network latency increased',
    'Task prioritized: T202510290005',
    'Resource allocation optimized'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: count - index,
    timestamp: new Date(Date.now() - index * 10000).toLocaleString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)]
  }));
};

const TaskEngine: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('running');
  const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs());
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time log updates
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (engineStatus === 'running') {
      interval = setInterval(() => {
        const newLog: LogEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)] as LogLevel,
          message: 'System log entry - ' + Math.random().toString(36).substring(2, 8)
        };
        
        setLogs(prev => [newLog, ...prev.slice(0, 99)]);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [engineStatus]);

  // Apply log filters
  useEffect(() => {
    let result = logs;
    
    // Filter by log level
    if (selectedLevel !== 'all') {
      result = result.filter(log => log.level === selectedLevel);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.message.toLowerCase().includes(query) || 
        log.timestamp.toLowerCase().includes(query)
      );
    }
    
    setFilteredLogs(result);
  }, [logs, selectedLevel, searchQuery]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (isAutoScrolling && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [filteredLogs, isAutoScrolling]);

  // Toggle engine status
  const toggleEngineStatus = () => {
    if (engineStatus === 'running') {
      // Show confirmation before stopping
      setIsConfirming(true);
    } else {
      // Start the engine without confirmation
      setEngineStatus('running');
      toast('任务引擎已启动');
    }
  };

  // Confirm stopping the engine
  const confirmStopEngine = () => {
    setEngineStatus('stopped');
    setIsConfirming(false);
    toast('任务引擎已停止');
  };

  // Cancel stopping the engine
  const cancelStopEngine = () => {
    setIsConfirming(false);
  };

  // Export logs as CSV
  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Message'],
      ...filteredLogs.map(log => [log.timestamp, log.level, log.message])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `engine_logs_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast('日志已导出为CSV文件');
  };

  // Get status indicator style
  const getStatusIndicator = () => {
    switch(engineStatus) {
      case 'running':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-600 dark:text-green-400 font-medium">运行中</span>
          </div>
        );
      case 'stopped':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-red-600 dark:text-red-400 font-medium">已关闭</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">异常</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Get log level badge style
  const getLogLevelBadge = (level: LogLevel) => {
    switch(level) {
      case 'INFO':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">INFO</span>;
      case 'WARN':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">WARN</span>;
      case 'ERROR':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">ERROR</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">任务引擎</h1>
        <p className="text-gray-500 dark:text-gray-400">管理和监控AIGC任务引擎的运行状态</p>
      </div>

      {/* Status Indicator Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Engine Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">引擎状态</h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl">{getStatusIndicator()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              最后更新: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Control Panel Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">控制面板</h3>
          <div>
            <button
              className={cn(
                'w-full py-3 text-lg font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                engineStatus === 'running'
                  ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                  : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
              )}
              onClick={toggleEngineStatus}
            >
              {engineStatus === 'running' ? '关闭引擎' : '启动引擎'}
            </button>
          </div>
        </div>

        {/* System Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">系统信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">CPU 使用率</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div className="bg-blue-500 h-2 rounded-full dark:bg-blue-400" style={{ width: '42%' }}></div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">内存使用</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div className="bg-purple-500 h-2 rounded-full dark:bg-purple-400" style={{ width: '68%' }}></div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">GPU 使用率</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div className="bg-green-500 h-2 rounded-full dark:bg-green-400" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">引擎日志</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Auto-scroll toggle */}
              <button
                className={cn(
                  'flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors',
                  isAutoScrolling
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              >
                <i className="fa-solid fa-arrow-down-to-line mr-1"></i>
                {isAutoScrolling ? '自动滚动' : '停止滚动'}
              </button>
              
              {/* Log level filter */}
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
              >
                <option value="all">所有级别</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
              
              {/* Export logs button */}
              <button
                className="flex items-center px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/40 transition-colors"
                onClick={exportLogs}
              >
                <i className="fa-solid fa-download mr-1"></i>
                导出日志
              </button>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索日志..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                <i className="fa-solid fa-search"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logs container */}
        <div 
          className="h-[400px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
          ref={logContainerRef}
        >
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0 last:mb-0"
              >
                <div className="flex flex-wrap items-start gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                  {getLogLevelBadge(log.level)}
                  <span className="text-gray-900 dark:text-gray-100 flex-1">{log.message}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <i className="fa-solid fa-file-lines text-3xl mb-2"></i>
              <p>没有找到匹配的日志</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">性能指标</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">任务处理速度</h4>
            <p className="text-xl font-bold">2.4 任务/分钟</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">平均处理时间</h4>
            <p className="text-xl font-bold">25.3 秒</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">成功率</h4>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">97.8%</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">队列等待时间</h4>
            <p className="text-xl font-bold">3.2 秒</p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">确认关闭引擎</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                关闭引擎将会中断所有正在处理的任务，确定要继续吗？
              </p>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={cancelStopEngine}
                >
                  取消
                </button>
                
                <button 
                  className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                  onClick={confirmStopEngine}
                >
                  确认关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskEngine;