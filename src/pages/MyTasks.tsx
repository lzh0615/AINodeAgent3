import React, { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define task types
type TaskStatus = 'all' | 'in-progress' | 'completed' | 'expired';
type TaskItem = {
  id: string;
  name: string;
  type: string;
  submitTime: string;
  progress: number;
  points: number;
  status: 'in-progress' | 'completed' | 'failed' | 'expired';
  description: string;
};

// Mock tasks data
const mockTasks: TaskItem[] = [
  {
    id: 'T202510290001',
    name: '高质量图像生成',
    type: 'image-generation',
    submitTime: '2025-10-28 14:30:22',
    progress: 60,
    points: 200,
    status: 'in-progress',
    description: '根据用户提供的文本描述生成高质量AI图像，要求细节丰富，色彩自然'
  },
  {
    id: 'T202510290002',
    name: '市场分析报告',
    type: 'text-analysis',
    submitTime: '2025-10-27 09:15:36',
    progress: 100,
    points: 350,
    status: 'completed',
    description: '基于提供的市场数据撰写一份详细的分析报告，包括趋势预测和建议'
  },
  {
    id: 'T202510290003',
    name: '短视频剪辑',
    type: 'video-editing',
    submitTime: '2025-10-26 16:42:18',
    progress: 0,
    points: 180,
    status: 'failed',
    description: '将多个短视频片段剪辑成一个连贯的故事，添加适当的音乐和过渡效果'
  },
  {
    id: 'T202510290004',
    name: '数据集标注',
    type: 'data-labeling',
    submitTime: '2025-10-25 11:08:45',
    progress: 100,
    points: 120,
    status: 'completed',
    description: '标注AI训练数据集，确保数据准确性和一致性'
  },
  {
    id: 'T202510290005',
    name: '3D模型渲染',
    type: '3d-rendering',
    submitTime: '2025-10-24 13:22:50',
    progress: 100,
    points: 500,
    status: 'expired',
    description: '根据提供的3D模型文件生成高质量渲染图像，调整光照和材质参数'
  },
  {
    id: 'T202510290006',
    name: '代码生成与优化',
    type: 'code-generation',
    submitTime: '2025-10-23 10:15:30',
    progress: 45,
    points: 300,
    status: 'in-progress',
    description: '根据需求文档生成并优化一段特定功能的代码，确保性能和可维护性'
  }
];

const MyTasks: React.FC = () => {
  const { userData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TaskStatus>('all');
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  // Filter tasks by status
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  // Handle task detail view
  const handleViewDetail = (task: TaskItem) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  // Handle resubmit failed task
  const handleResubmit = (taskId: string) => {
    toast('任务重新提交中，请稍候...');
    // Simulate resubmit
    setTimeout(() => {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: 'in-progress', progress: 0 } : task
      );
      setTasks(updatedTasks);
      toast('任务已重新提交');
    }, 1000);
  };

  // Handle download results
  const handleDownload = () => {
    toast('结果文件下载中...');
    // Simulate download
    setTimeout(() => {
      toast('结果文件已下载');
    }, 1000);
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in-progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">进行中</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">已完成</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">失败</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">已失效</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">未知</span>;
    }
  };

  // Get task type label
  const getTaskTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'image-generation': '图像生成',
      'text-analysis': '文本分析',
      'video-editing': '视频剪辑',
      'data-labeling': '数据标注',
      '3d-rendering': '3D渲染',
      'code-generation': '代码生成'
    };
    return typeMap[type] || type;
  };

  // Get发放状态
  const getRewardStatus = (task: TaskItem) => {
    if (task.status === 'completed') {
      return <span className="text-green-500 dark:text-green-400">已发放</span>;
    } else if (task.status === 'in-progress') {
      return <span className="text-yellow-500 dark:text-yellow-400">待发放</span>;
    } else {
      return <span className="text-gray-500 dark:text-gray-400">未发放</span>;
    }
  };

  if (!userData) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">我的任务</h1>
        <p className="text-gray-500 dark:text-gray-400">查看和管理您参与的所有AIGC任务</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeTab === 'all' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveTab('all')}
        >
          全部
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeTab === 'in-progress' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveTab('in-progress')}
        >
          进行中
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeTab === 'completed' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveTab('completed')}
        >
          已完成
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeTab === 'expired' 
              ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveTab('expired')}
        >
          已失效
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">任务ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">任务名称</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">任务类型</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">提交时间</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">完成进度</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">积分奖励</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">发放状态</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getTaskTypeLabel(task.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.submitTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div 
                              className="bg-blue-500 h-2 rounded-full dark:bg-blue-400" 
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{task.progress}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">+{task.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRewardStatus(task)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          onClick={() => handleViewDetail(task)}
                        >
                          查看详情
                        </button>
                        {task.status === 'failed' && (
                          <button 
                            className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                            onClick={() => handleResubmit(task.id)}
                          >
                            重新提交
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button 
                            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            onClick={() => handleDownload(task.id)}
                          >
                            下载结果
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fa-solid fa-box-open text-3xl mb-2"></i>
                      <p>暂无任务</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      {isTaskDetailOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setIsTaskDetailOpen(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTask.name}</h3>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedTask.id}</span>
                    {getStatusBadge(selectedTask.status)}
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  onClick={() => setIsTaskDetailOpen(false)}
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">任务描述</h4>
                <p className="text-gray-900 dark:text-gray-100">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">任务类型</h4>
                  <p className="text-gray-900 dark:text-gray-100">{getTaskTypeLabel(selectedTask.type)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">提交时间</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedTask.submitTime}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">积分奖励</h4>
                  <p className="text-green-600 dark:text-green-400 font-semibold">+{selectedTask.points}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">发放状态</h4>
                  <p>{getRewardStatus(selectedTask)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">完成进度</h4>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div 
                    className={`h-3 rounded-full ${
                      selectedTask.status === 'completed' 
                        ? 'bg-green-500 dark:bg-green-400' 
                        : 'bg-blue-500 dark:bg-blue-400'
                    }`} 
                    style={{ width: `${selectedTask.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">0%</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedTask.progress}%</span>
                  <span className="text-gray-500 dark:text-gray-400">100%</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsTaskDetailOpen(false)}
                >
                  关闭
                </button>
                
                {selectedTask.status === 'failed' && (
                  <button 
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                    onClick={() => {
                      handleResubmit(selectedTask.id);
                      setIsTaskDetailOpen(false);
                    }}
                  >
                    重新提交
                  </button>
                )}
                
                {selectedTask.status === 'completed' && (
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
                    onClick={() => {
                      handleDownload(selectedTask.id);
                      setIsTaskDetailOpen(false);
                    }}
                  >
                    下载结果
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;