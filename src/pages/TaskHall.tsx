import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Task type definition
type TaskCategory = 'all' | 'image' | 'text' | 'video' | 'data' | '3d' | 'code';

// Task item interface
interface TaskItem {
  id: string;
  name: string;
  category: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string;
  remainingSlots: number;
  totalSlots: number;
  description: string;
}

// Mock data for task hall
const mockTasks: TaskItem[] = [
  {
    id: 'TH202510290001',
    name: '风景图像生成',
    category: 'image',
    points: 200,
    difficulty: 'easy',
    requirements: '根据文本描述生成高质量风景图像',
    remainingSlots: 5,
    totalSlots: 10,
    description: '用户提供风景相关的文本描述，AI模型需要生成符合描述的高质量图像。要求图像清晰，色彩自然，符合现实逻辑。'
  },
  {
    id: 'TH202510290002',
    name: '产品描述撰写',
    category: 'text',
    points: 150,
    difficulty: 'easy',
    requirements: '为指定产品撰写吸引人的描述文案',
    remainingSlots: 8,
    totalSlots: 12,
    description: '根据提供的产品信息和特点，撰写能够吸引潜在客户的产品描述文案。要求语言生动，突出产品优势，符合目标受众的阅读习惯。'
  },
  {
    id: 'TH202510290003',
    name: '短视频后期处理',
    category: 'video',
    points: 350,
    difficulty: 'medium',
    requirements: '对短视频进行剪辑、调色和添加音乐',
    remainingSlots: 3,
    totalSlots: 8,
    description: '接收原始视频素材，进行专业的后期处理，包括剪辑、色彩校正、添加背景音乐和特效等。要求最终视频流畅自然，符合指定的风格和长度要求。'
  },
  {
    id: 'TH202510290004',
    name: '图像数据集标注',
    category: 'data',
    points: 120,
    difficulty: 'easy',
    requirements: '标注指定类别的图像数据',
    remainingSlots: 12,
    totalSlots: 20,
    description: '对提供的图像数据集进行分类标注，确保标注的准确性和一致性。标注内容包括物体识别、场景分类等，需要遵循给定的标注规范。'
  },
  {
    id: 'TH202510290005',
    name: '3D场景建模',
    category: '3d',
    points: 600,
    difficulty: 'hard',
    requirements: '根据参考图创建详细的3D场景模型',
    remainingSlots: 2,
    totalSlots: 5,
    description: '根据提供的参考图像和需求文档，创建高质量的3D场景模型。要求模型细节丰富，拓扑结构合理，符合行业标准，能够直接用于渲染或游戏开发。'
  },
  {
    id: 'TH202510290006',
    name: '算法代码优化',
    category: 'code',
    points: 450,
    difficulty: 'medium',
    requirements: '优化现有算法代码，提升性能',
    remainingSlots: 4,
    totalSlots: 6,
    description: '分析现有算法代码的性能瓶颈，进行针对性的优化，提高代码的执行效率和资源利用率。要求优化后的代码保持原有功能，同时提升运行速度和降低内存占用。'
  }
];

// Task statistics data
const taskStats = {
  totalTasks: 58,
  completedTasks: 42,
  inProgressTasks: 10,
  queuedTasks: 6
};

// Data for pie chart
const pieData = [
  { name: '已完成', value: taskStats.completedTasks, color: '#10b981' },
  { name: '进行中', value: taskStats.inProgressTasks, color: '#3b82f6' },
  { name: '排队中', value: taskStats.queuedTasks, color: '#f59e0b' }
];

// Category task count
const categoryCount = {
  image: 15,
  text: 12,
  video: 8,
  data: 10,
  '3d': 7,
  code: 6
};

const TaskHall: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('all');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  // Filter tasks by category
  const filteredTasks = mockTasks.filter(task => {
    if (activeCategory === 'all') return true;
    return task.category === activeCategory;
  });

  // Get category display name
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'all': '全部任务',
      'image': '图片生成',
      'text': '文本创作',
      'video': '视频剪辑',
      'data': '数据标注',
      '3d': '3D建模',
      'code': '代码生成'
    };
    return categoryMap[category] || category;
  };

  // Get difficulty display with color
  const getDifficultyDisplay = (difficulty: string) => {
    switch(difficulty) {
      case 'easy':
        return <span className="text-green-500 dark:text-green-400">简单</span>;
      case 'medium':
        return <span className="text-yellow-500 dark:text-yellow-400">中等</span>;
      case 'hard':
        return <span className="text-red-500 dark:text-red-400">困难</span>;
      default:
        return <span className="text-gray-500 dark:text-gray-400">未知</span>;
    }
  };

  // Handle view task detail
  const handleViewDetail = (task: TaskItem) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  // Handle accept task
  const handleAcceptTask = (task: TaskItem) => {
    toast(`已领取任务：${task.name}`);
    // Here you would typically call an API to accept the task
    setIsTaskDetailOpen(false);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">任务大厅</h1>
        <p className="text-gray-500 dark:text-gray-400">浏览并领取适合您的AIGC任务</p>
      </div>

      {/* Data Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tasks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">总任务数</h3>
              <p className="text-3xl font-bold mt-2">{taskStats.totalTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
              <i className="fa-solid fa-tasks text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            较昨日 <span className="text-green-500">+3</span>
          </div>
        </div>

        {/* Category Count Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">分类任务数量</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">图片生成</span>
              <span className="font-semibold">{categoryCount.image}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">文本创作</span>
              <span className="font-semibold">{categoryCount.text}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">视频剪辑</span>
              <span className="font-semibold">{categoryCount.video}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">数据标注</span>
              <span className="font-semibold">{categoryCount.data}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">3D建模</span>
              <span className="font-semibold">{categoryCount['3d']}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">代码生成</span>
              <span className="font-semibold">{categoryCount.code}</span>
            </div>
          </div>
        </div>

        {/* Status Statistics Card */}<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">任务状态统计</h3>
          <div className="flex items-center">
            <div className="w-24 h-24 mr-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm">{item.name}</span>
                  <span className="ml-2 text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === 'all' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('all')}
        >
          全部任务
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === 'image' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('image')}
        >
          图片生成
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === 'text' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('text')}
        >
          文本创作
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === 'video' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('video')}
        >
          视频剪辑
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === 'data' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('data')}
        >
          数据标注
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === '3d' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('3d')}
        >
          3D建模</button>
        <button
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeCategory === 'code' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
          onClick={() => setActiveCategory('code')}
        >
          代码生成
        </button>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleViewDetail(task)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{task.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                    {getCategoryName(task.category)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{task.requirements}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">奖励积分</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{task.points}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">难度等级</p>
                    <p className="font-medium">{getDifficultyDisplay(task.difficulty)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">剩余名额</p>
                    <p className="font-medium">{task.remainingSlots}/{task.totalSlots}</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-4">
                  <div 
                    className="bg-blue-500 h-2 rounded-full dark:bg-blue-400" 
                    style={{ width: `${(task.remainingSlots / task.totalSlots) * 100}%` }}
                  ></div>
                </div>
                
                <button 
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptTask(task);
                  }}
                >
                  领取任务
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
            <div className="text-4xl text-gray-300 dark:text-gray-600 mb-4">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">暂无任务</h3>
            <p className="text-gray-500 dark:text-gray-400">该分类下暂无可用任务，请稍后再来查看</p>
          </div>
        )}
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
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      {getCategoryName(selectedTask.category)}
                    </span>
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
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">奖励积分</h4>
                  <p className="text-green-600 dark:text-green-400 font-bold text-xl">{selectedTask.points}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">难度等级</h4>
                  <p className="text-lg font-medium">{getDifficultyDisplay(selectedTask.difficulty)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">任务要求</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedTask.requirements}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">剩余名额</h4>
                  <div className="flex items-center">
                    <p className="text-lg font-medium mr-2">{selectedTask.remainingSlots}/{selectedTask.totalSlots}</p>
                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-500 h-2 rounded-full dark:bg-blue-400" 
                        style={{ width: `${(selectedTask.remainingSlots / selectedTask.totalSlots) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsTaskDetailOpen(false)}
                >
                  关闭
                </button>
                
                <button 
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  onClick={() => handleAcceptTask(selectedTask)}
                >
                  领取任务
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHall;