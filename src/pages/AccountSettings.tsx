import React, { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

// Security level types
type SecurityLevel = 'low' | 'medium' | 'high';

const AccountSettings: React.FC = () => {
  const { userData, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'wallet'>('profile');
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('medium');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: 'user@example.com',
    bio: '热爱AI技术和内容创作的探索者',
    avatar: userData?.avatar || '',
  });
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    taskUpdates: true,
    rewardNotifications: true,
    systemAnnouncements: true,
    marketingEmails: false,
    dailySummary: true,
  });

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle notification setting change
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  // Save profile changes
  const saveProfileChanges = () => {
    toast('个人资料已更新');
  };

  // Save password changes
  const savePasswordChanges = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast('新密码与确认密码不匹配');
      return;
    }
    
    // Validate password strength
    if (passwordForm.newPassword.length < 8) {
      toast('新密码长度至少为8个字符');
      return;
    }
    
    toast('密码已成功更改');
    setIsChangingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    toast('通知设置已更新');
  };

  // Calculate security level
  const calculateSecurityLevel = () => {
    let level: SecurityLevel = 'low';
    let points = 0;
    
    // Check if 2FA is enabled (mock)
    points += 1;
    
    // Check if password is strong (mock)
    points += 1;
    
    // Check if email is verified (mock)
    points += 0;
    
    if (points >= 2) level = 'medium';
    if (points >= 3) level = 'high';
    
    setSecurityLevel(level);
  };

  // Get security level color
  const getSecurityLevelColor = () => {
    switch(securityLevel) {
      case 'high':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
      default:
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  // Get security level text
  const getSecurityLevelText = () => {
    switch(securityLevel) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
      default:
        return '低';
    }
  };

  // Recalculate security level on mount
  React.useEffect(() => {
    if (userData) {
      calculateSecurityLevel();
    }
  }, [userData]);

  if (!userData) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">账户设置</h1>
        <p className="text-gray-500 dark:text-gray-400">管理您的账户信息、安全设置和通知偏好</p>
      </div>

      {/* Settings Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          个人资料
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'security'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('security')}
        >
          安全设置
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'notifications'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          通知设置
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === 'wallet'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('wallet')}
        >
          钱包管理
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative mb-3">
                <img 
                  src={formData.avatar} 
                  alt={formData.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <i className="fa-solid fa-camera text-white text-xs"></i>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
                支持 JPG, PNG 格式，文件大小不超过 2MB
              </p>
            </div>
            
            {/* Profile Form */}
            <div className="flex-1">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    个人简介
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    onClick={saveProfileChanges}
                  >
                    保存更改
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          {/* Security Level Indicator */}
          <div className={`p-4 rounded-xl mb-6 flex items-center justify-between ${getSecurityLevelColor()}`}>
            <div className="flex items-center">
              <i className="fa-solid fa-shield-alt mr-3 text-lg"></i>
              <div>
                <h3 className="font-medium">账户安全等级: {getSecurityLevelText()}</h3>
                <p className="text-xs">
                  {securityLevel === 'low' ? '建议开启双重验证以提高账户安全性' : 
                   securityLevel === 'medium' ? '您的账户安全性良好，可以进一步优化' : 
                   '您的账户安全性很高，继续保持'}
                </p>
              </div>
            </div>
            <button className="text-sm font-medium hover:underline">
              提升等级
            </button>
          </div>
          
          {/* Security Options */}
          <div className="space-y-6">
            {/* Password Change */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">登录密码</h4>
                {!isChangingPassword ? (
                  <button 
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    更改密码
                  </button>
                ) : (
                  <button 
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    取消
                  </button>
                )}
              </div>
              
              {isChangingPassword && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      当前密码
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      新密码
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      密码长度至少为8个字符，包含字母和数字
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      确认新密码
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <button 
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                      onClick={savePasswordChanges}
                    >
                      确认更改
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Two-Factor Authentication */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">双重验证</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    开启后登录时需要额外的验证步骤
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="toggle2FA" 
                    className="sr-only" 
                  />
                  <label 
                    htmlFor="toggle2FA" 
                    className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-600"
                  >
                    <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-0 dark:translate-x-4"></span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Login History */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">登录历史</h4>
                <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                  查看全部
                </button>
              </div>
              
              <div className="space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">当前设备</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Chrome 118.0.0 · Windows · 北京
                    </p>
                  </div>
                  <span className="text-xs text-green-500 dark:text-green-400">
                    在线
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">移动设备</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Safari · iOS · 上海
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2小时前
                  </span>
                </div>
              </div>
            </div>
            
            {/* Logout All Devices */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button 
                className="w-full py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors flex items-center justify-center"
                onClick={() => {
                  logout();
                  toast('已从所有设备登出');
                }}
              >
                <i className="fa-solid fa-sign-out-alt mr-2"></i>
                从所有设备登出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="space-y-6">
            {/* General Notifications */}
            <div>
              <h3 className="font-medium mb-4">通知类型</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">任务状态更新</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      接收任务处理完成、失败等状态通知
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="taskUpdates" 
                      checked={notificationSettings.taskUpdates}
                      onChange={handleNotificationChange}
                      name="taskUpdates"
                      className="sr-only" 
                    />
                    <label 
                      htmlFor="taskUpdates" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        notificationSettings.taskUpdates 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        notificationSettings.taskUpdates 
                          ? 'translate-x-4' 
                          : 'translate-x-0 dark:translate-x-4'
                      }`}></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">奖励通知</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      接收积分到账、奖励发放等通知
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="rewardNotifications" 
                      checked={notificationSettings.rewardNotifications}
                      onChange={handleNotificationChange}
                      name="rewardNotifications"
                      className="sr-only" 
                    />
                    <label 
                      htmlFor="rewardNotifications" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        notificationSettings.rewardNotifications 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        notificationSettings.rewardNotifications 
                          ? 'translate-x-4' 
                          : 'translate-x-0 dark:translate-x-4'
                      }`}></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">系统公告</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      接收平台更新、维护通知等重要信息
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="systemAnnouncements" 
                      checked={notificationSettings.systemAnnouncements}
                      onChange={handleNotificationChange}
                      name="systemAnnouncements"
                      className="sr-only" 
                    />
                    <label 
                      htmlFor="systemAnnouncements" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        notificationSettings.systemAnnouncements 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        notificationSettings.systemAnnouncements 
                          ? 'translate-x-4' 
                          : 'translate-x-0 dark:translate-x-4'
                      }`}></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">营销邮件</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      接收新功能、活动优惠等营销信息
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="marketingEmails" 
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationChange}
                      name="marketingEmails"
                      className="sr-only" 
                    />
                    <label 
                      htmlFor="marketingEmails" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        notificationSettings.marketingEmails 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        notificationSettings.marketingEmails 
                          ? 'translate-x-4' 
                          : 'translate-x-0 dark:translate-x-4'
                      }`}></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">每日总结</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      每日接收任务完成情况和收益汇总
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="dailySummary" 
                      checked={notificationSettings.dailySummary}
                      onChange={handleNotificationChange}
                      name="dailySummary"
                      className="sr-only" 
                    />
                    <label 
                      htmlFor="dailySummary" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        notificationSettings.dailySummary 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        notificationSettings.dailySummary 
                          ? 'translate-x-4' 
                          : 'translate-x-0 dark:translate-x-4'
                      }`}></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Theme Selection */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium mb-4">外观主题</h3>
              
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                    <span>浅色模式</span>
                  </div>
                </button>
                
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 dark:bg-gray-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-700 mr-2"></div>
                    <span>深色模式</span>
                  </div>
                </button>
                
                <button
                  className={`px-4 py-2 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors`}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 mr-2"></div>
                    <span>跟随系统</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="pt-4">
              <button 
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                onClick={saveNotificationSettings}
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Management */}
      {activeTab === 'wallet' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="space-y-6">
            {/* Current Wallet */}
            <div>
              <h3 className="font-medium mb-4">当前钱包</h3>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-3">
                      <i className="fa-solid fa-link"></i>
                    </div>
                    <div>
                      <p className="font-medium">Web3 钱包</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {userData.web3Address.substring(0, 6)}...{userData.web3Address.substring(userData.web3Address.length - 4)}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm flex items-center"
                    onClick={() => {
                      navigator.clipboard.writeText(userData.web3Address);
                      toast('地址已复制到剪贴板');
                    }}
                  >
                    <i className="fa-regular fa-copy mr-1.5"></i>
                    复制
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">链上资产</span>
                    <span>0.542 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">链上积分</span>
                    <span>1,250 巴特币</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">绑定时间</span>
                    <span>2025年3月12日</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wallet Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium mb-4">钱包操作</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mr-3">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                  <div>
                    <p className="font-medium">绑定新钱包</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      添加其他区块链钱包
                    </p>
                  </div>
                </button>
                
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mr-3">
                    <i className="fa-solid fa-exchange-alt"></i>
                  </div>
                  <div>
                    <p className="font-medium">资产提现</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      将积分提现到钱包
                    </p>
                  </div>
                </button>
                
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-3">
                    <i className="fa-solid fa-history"></i>
                  </div>
                  <div>
                    <p className="font-medium">交易记录</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      查看所有钱包交易
                    </p>
                  </div>
                </button>
                
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-500 mr-3">
                    <i className="fa-solid fa-shield-alt"></i>
                  </div>
                  <div>
                    <p className="font-medium">安全设置</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      管理钱包安全选项
                    </p>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Wallet Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium mb-3">钱包安全提示</h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-3 flex-shrink-0">
                    <i className="fa-solid fa-info"></i>
                  </div>
                  <div>
                    <p className="text-sm">
                      请妥善保管您的钱包私钥和助记词，平台不会以任何理由索要您的私钥信息。如遇账户异常，请立即联系客服。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;