import React, { useState, useEffect } from 'react';
import { Star, Trash2, Lock, MessageCircle, Target, Sparkles, Settings, Shield, FileText, Trash, Download, HelpCircle, Phone, Plus, Bell, Check, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import AppPreview from './components/AppPreview';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import CrisisResourcesModal from './components/CrisisResourcesModal';
import type { User } from '@supabase/supabase-js';
import {
  exportAffirmationsToPDF,
  exportAffirmationsToCSV,
  exportGoalsToPDF,
  exportGoalsToCSV,
  exportAllDataToPDF,
  exportAllDataToCSV
} from './utils/exportData';

export default function AffirmationApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('affirmations');
  const [affirmations, setAffirmations] = useState([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Input states
  const [inputText, setInputText] = useState('');

  // AI Chat states
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI confidence coach. I'm here to support your journey with personalized affirmations, goal-setting guidance, and positive encouragement. What would you like to work on today?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Goals states
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalType, setNewGoalType] = useState('progress'); // progress, habit, milestone
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [editingGoalId, setEditingGoalId] = useState(null);

  // Notification states
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const MAX_FREE_AFFIRMATIONS = 3;
  const MAX_PRO_AFFIRMATIONS = 20;
  const maxAffirmations = isPro ? MAX_PRO_AFFIRMATIONS : MAX_FREE_AFFIRMATIONS;

  useEffect(() => {
    // Check if user has seen preview before
    const hasSeenPreview = localStorage.getItem('hasSeenPreview');
    if (hasSeenPreview === 'true') {
      setShowPreview(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      // If user is already logged in, skip preview
      if (session?.user) {
        setShowPreview(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // If user logs in, skip preview
      if (session?.user) {
        setShowPreview(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadAffirmations();
      loadGoals();
    } else {
      setAffirmations([]);
      setGoals([]);
    }

    // Load notification settings
    const savedNotificationsEnabled = localStorage.getItem('notificationsEnabled');
    const savedNotificationTime = localStorage.getItem('notificationTime');

    if (savedNotificationTime) {
      setNotificationTime(savedNotificationTime);
    }

    // Check notification permission immediately
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setNotificationPermission(currentPermission);

      if (savedNotificationsEnabled === 'true' && currentPermission === 'granted') {
        setNotificationsEnabled(true);
      } else if (savedNotificationsEnabled === 'true' && currentPermission !== 'granted') {
        setNotificationsEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
      }
    }
  }, [user]);

  const loadAffirmations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error loading affirmations:', error);
    } else {
      setAffirmations(data || []);
    }
  };

  const loadGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
    } else {
      setGoals(data || []);
    }
  };

  const handlePremiumClick = () => {
    setShowUpgrade(true);
  };

  const handleUnlockPro = () => {
    setIsPro(true);
    setShowUpgrade(false);
  };

  const addAffirmation = async () => {
    if (!inputText.trim() || !user) {
      return;
    }

    if (affirmations.length >= maxAffirmations) {
      if (!isPro) {
        setShowUpgrade(true);
      }
      return;
    }

    const { error } = await supabase
      .from('affirmations')
      .insert([
        {
          user_id: user.id,
          text: inputText.trim(),
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error adding affirmation:', error);
      alert('Failed to add affirmation. Please try again.');
    } else {
      setInputText('');
      loadAffirmations();
    }
  };

  const deleteAffirmation = async (id) => {
    if (confirm('Delete this affirmation?')) {
      const { error } = await supabase
        .from('affirmations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting affirmation:', error);
        alert('Failed to delete affirmation. Please try again.');
      } else {
        loadAffirmations();
      }
    }
  };

  // Check current browser permission status
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      console.log('Checking notification permission:', currentPermission);
      setNotificationPermission(currentPermission);
      return currentPermission;
    }
    return 'default';
  };

  // Notification functions
  const requestNotificationPermission = async () => {
    console.log('Requesting notification permission...');

    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications. Please try a different browser.');
      return false;
    }

    // First, refresh the current permission status
    const currentPermission = checkNotificationPermission();
    console.log('Current permission status:', currentPermission);

    if (currentPermission === 'granted') {
      console.log('Permission already granted');
      return true;
    }

    if (currentPermission === 'denied') {
      console.log('Permission was previously denied');
      alert('Notifications are blocked. Please click the lock/info icon in your browser address bar and change Notifications to "Allow", then refresh this page.');
      return false;
    }

    try {
      setIsRequestingPermission(true);
      console.log('Showing permission dialog...');

      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);

      setNotificationPermission(permission);
      setIsRequestingPermission(false);

      if (permission === 'denied') {
        alert('Notifications were blocked. To enable them, click the lock icon in your browser address bar and change Notifications to "Allow".');
        return false;
      } else if (permission === 'granted') {
        console.log('Permission granted successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setIsRequestingPermission(false);
      alert('Could not request notification permission. Please check your browser settings.');
      return false;
    }
  };

  const scheduleNotification = () => {
    if (!notificationsEnabled || notificationPermission !== 'granted') {
      return;
    }

    // Calculate time until next notification
    const now = new Date();
    const [hours, minutes] = notificationTime.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Schedule the notification
    setTimeout(() => {
      showNotification();
      // Reschedule for next day
      scheduleNotification();
    }, timeUntilNotification);
  };

  const showNotification = () => {
    if (notificationPermission === 'granted') {
      const messages = [
        "Time for your daily affirmations! 💫",
        "Remember to practice your affirmations today! ✨",
        "Your NextSelf is waiting - time for affirmations! 🌟",
        "Daily reminder: You are capable of amazing things! 💪",
        "Take a moment for your affirmations today! 🌈"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      new Notification('NextSelf Reminder', {
        body: randomMessage,
        tag: 'daily-affirmation',
        requireInteraction: false
      });
    }
  };

  const testNotification = async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      new Notification('NextSelf Test', {
        body: 'Notifications are working! You will receive daily reminders at your chosen time. ✨',
        tag: 'test-notification',
        requireInteraction: false
      });
    }
  };

  const handleNotificationToggle = async (enabled) => {
    if (enabled) {
      // First check if permission was already granted
      const currentPermission = checkNotificationPermission();

      if (currentPermission === 'granted') {
        // Permission already granted, just enable
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        scheduleNotification();
        return;
      }

      // Otherwise, request permission
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        scheduleNotification();
      } else {
        setNotificationsEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  const handleNotificationTimeChange = (time) => {
    setNotificationTime(time);
    localStorage.setItem('notificationTime', time);
    if (notificationsEnabled) {
      // Reschedule with new time
      scheduleNotification();
    }
  };

  // Schedule notifications when settings change
  useEffect(() => {
    if (notificationsEnabled && notificationPermission === 'granted') {
      scheduleNotification();
    }
  }, [notificationsEnabled, notificationTime, notificationPermission]);

  const sendChatMessage = async (message = chatInput) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiTyping(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          systemPrompt: `You are a warm, supportive AI confidence coach for the NextSelf app. Your role is to help users build confidence, create affirmations, set goals, and develop positive mindsets.

Key guidelines:
- Be encouraging, empathetic, and uplifting
- Provide specific, actionable affirmations when requested
- Help users reframe negative thoughts into positive ones
- Suggest goal-setting strategies and break down big dreams into steps
- Keep responses concise and focused (2-4 sentences usually)
- Use emojis sparingly but warmly (✨💫🌟)
- Always remind users you're not a therapist if they share serious mental health concerns
- Focus on personal development, manifestation, and self-belief
- Celebrate their progress and efforts

Remember: You're here to help them meet their NextSelf!`,
          messages: [
            ...chatMessages.slice(1).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment! 💫"
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    sendChatMessage(promptText);
  };

  // Goal Management Functions
  const addGoal = async () => {
    if (!newGoalTitle.trim()) {
      alert('Please enter a goal title');
      return;
    }

    if (!user) return;

    const goalData = {
      user_id: user.id,
      title: newGoalTitle,
      description: newGoalDescription || null,
      type: newGoalType,
      target: parseInt(newGoalTarget) || (newGoalType === 'progress' ? 100 : newGoalType === 'habit' ? 30 : 5),
      current: 0,
      status: 'active',
      milestones: newGoalType === 'milestone' ? [] : null,
      habit_days: newGoalType === 'habit' ? [] : null
    };

    if (editingGoalId) {
      const { error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', editingGoalId);

      if (error) {
        console.error('Error updating goal:', error);
        alert('Failed to update goal. Please try again.');
        return;
      }
      setEditingGoalId(null);
    } else {
      const { error } = await supabase
        .from('goals')
        .insert([goalData]);

      if (error) {
        console.error('Error adding goal:', error);
        alert('Failed to add goal. Please try again.');
        return;
      }
    }

    resetGoalForm();
    loadGoals();
  };

  const resetGoalForm = () => {
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalType('progress');
    setNewGoalTarget('');
    setShowAddGoal(false);
  };

  const updateGoalProgress = async (goalId, newValue) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updateData: any = { current: newValue };
    if (newValue >= goal.target && goal.status !== 'completed') {
      updateData.status = 'completed';
    }

    const { error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal progress:', error);
    } else {
      loadGoals();
    }
  };

  const toggleHabitDay = async (goalId) => {
    const today = new Date().toISOString().split('T')[0];
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const habitDays = goal.habit_days || [];
    const hasToday = habitDays.includes(today);
    const newHabitDays = hasToday
      ? habitDays.filter(d => d !== today)
      : [...habitDays, today];

    const { error } = await supabase
      .from('goals')
      .update({
        habit_days: newHabitDays,
        current: newHabitDays.length
      })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating habit day:', error);
    } else {
      loadGoals();
    }
  };

  const addMilestone = async (goalId, milestoneText) => {
    if (!milestoneText.trim()) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const milestones = goal.milestones || [];
    const newMilestones = [...milestones, { text: milestoneText, completed: false, id: Date.now() }];

    const { error } = await supabase
      .from('goals')
      .update({
        milestones: newMilestones,
        target: newMilestones.length
      })
      .eq('id', goalId);

    if (error) {
      console.error('Error adding milestone:', error);
    } else {
      loadGoals();
    }
  };

  const toggleMilestone = async (goalId, milestoneId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const milestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = milestones.filter(m => m.completed).length;

    const { error } = await supabase
      .from('goals')
      .update({
        milestones,
        current: completedCount,
        status: completedCount === milestones.length ? 'completed' : 'active'
      })
      .eq('id', goalId);

    if (error) {
      console.error('Error toggling milestone:', error);
    } else {
      loadGoals();
    }
  };

  const deleteGoal = async (goalId) => {
    if (confirm('Delete this goal?')) {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Error deleting goal:', error);
        alert('Failed to delete goal. Please try again.');
      } else {
        loadGoals();
      }
    }
  };

  const calculateStreak = (habitDays) => {
    if (!habitDays || habitDays.length === 0) return 0;

    const sortedDays = [...habitDays].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let day of sortedDays) {
      const dayDate = new Date(day);
      dayDate.setHours(0, 0, 0, 0);

      const diffTime = currentDate - dayDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await supabase.auth.signOut();
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirmation(false);

    try {
      if (!user) return;

      // Get the current session to send the auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Session expired. Please log in again.');
        return;
      }

      // Call the edge function to delete the account
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Delete error:', result);
        alert('Unable to delete account. Please contact support at ajdenney12@gmail.com');
        return;
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();
      alert('Your account and all data have been permanently deleted.');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account. Please contact support at ajdenney12@gmail.com');
    }
  };

  const handleContinueFromPreview = () => {
    localStorage.setItem('hasSeenPreview', 'true');
    setShowPreview(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showPreview && !user) {
    return (
      <div className="relative">
        <AppPreview />
        <button
          onClick={handleContinueFromPreview}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 text-lg"
        >
          Get Started
        </button>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 relative overflow-hidden font-['Quicksand',sans-serif]">
      {/* Textured Background */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sparkle-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#9333ea" opacity="0.3"/>
              <circle cx="50" cy="30" r="1" fill="#ec4899" opacity="0.4"/>
              <circle cx="80" cy="20" r="1.2" fill="#3b82f6" opacity="0.3"/>
              <circle cx="30" cy="60" r="1" fill="#9333ea" opacity="0.2"/>
              <circle cx="70" cy="70" r="1.3" fill="#ec4899" opacity="0.3"/>
              <circle cx="20" cy="85" r="1.1" fill="#3b82f6" opacity="0.4"/>
              <path d="M40 50 L42 50 L41 48 Z" fill="#9333ea" opacity="0.2"/>
              <path d="M90 60 L92 60 L91 58 Z" fill="#ec4899" opacity="0.3"/>
              <path d="M15 40 L17 40 L16 38 Z" fill="#3b82f6" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sparkle-pattern)"/>
        </svg>
      </div>

      {/* Google Fonts Link */}
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Pacifico&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md border-b border-white/40 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight tracking-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
                    NextSelf
                  </h1>
                  <p className="text-xs text-gray-600 font-light mt-0.5">Write Your Future Into Reality</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isPro && (
                  <button
                    onClick={handlePremiumClick}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
                  >
                    ✨ Upgrade
                  </button>
                )}
                <button
                  onClick={() => {
                    checkNotificationPermission();
                    setShowSettings(true);
                  }}
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto px-4 mt-6 relative z-10">
          <div className="flex gap-2 bg-white/40 backdrop-blur-md rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('affirmations')}
              className={`flex-1 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'affirmations'
                  ? 'bg-white/70 text-purple-700'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              ✨ My Affirmations
            </button>
            <button
              onClick={() => {
                if (!isPro) {
                  handlePremiumClick();
                } else {
                  setActiveTab('chat');
                }
              }}
              className={`flex-1 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-white/70 text-purple-700'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              AI Coach
              {!isPro && <Lock className="w-4 h-4 text-purple-600" />}
            </button>
            <button
              onClick={() => {
                if (!isPro) {
                  handlePremiumClick();
                } else {
                  setActiveTab('goals');
                }
              }}
              className={`flex-1 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'goals'
                  ? 'bg-white/70 text-purple-700'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              <Target className="w-4 h-4" />
              Goals
              {!isPro && <Lock className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
          {activeTab === 'affirmations' && (
            <div className="space-y-6">
              {/* Affirmations List */}
              {affirmations.length > 0 && (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/50">
                  <h3 className="text-3xl font-semibold text-gray-800 text-center mb-6">My Affirmations</h3>
                  <div className="space-y-4">
                    {affirmations.map((affirmation) => (
                      <div
                        key={affirmation.id}
                        className="flex items-start gap-4"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                        <p className="text-3xl font-semibold text-purple-600 leading-relaxed flex-1 italic">
                          {affirmation.text}
                        </p>
                        <button
                          onClick={() => deleteAffirmation(affirmation.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create New Affirmation */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  ✍️ Write Your Affirmation
                </h3>
                <p className="text-sm text-gray-700 font-light mb-4">
                  Create up to 3 affirmations, or unlimited with upgrade version
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="I am confident and capable..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAffirmation()}
                    className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light text-lg"
                  />
                  <button
                    onClick={addAffirmation}
                    disabled={!inputText.trim() || affirmations.length >= maxAffirmations}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>

              {affirmations.length === 0 && (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/50 text-center">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Start Your Journey</h3>
                  <p className="text-gray-700 font-light mb-6">Create your first affirmation to begin manifesting your dreams</p>
                  <p className="text-sm text-gray-600 font-light mb-4">👇 Use the form below to write your affirmation</p>
                </div>
              )}
            </div>
          )}

          {/* Premium Upgrade Modal */}
          {showUpgrade && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>

                  {/* Pricing at Top */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                    <p className="text-3xl font-bold text-purple-900 mb-1">$9.99</p>
                    <p className="text-sm font-medium text-purple-700">One-Time Payment</p>
                    <p className="text-xs text-gray-600 mt-1">Unlock forever • No subscription</p>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontFamily: 'Poppins, sans-serif'}}>Unlock Pro Features</h2>
                  <p className="text-gray-600 font-light">Enhance your journey with AI-powered tools</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">20 Affirmations</p>
                      <p className="text-sm text-gray-600 font-light">Create up to 20 affirmations (vs 3 free)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">AI Confidence Coach</p>
                      <p className="text-sm text-gray-600 font-light">Get personalized affirmations and motivational support</p>
                      <p className="text-xs text-gray-500 mt-1 italic">⚠️ AI is not a therapist or mental health professional</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Smart Goal Tracker</p>
                      <p className="text-sm text-gray-600 font-light">Track and achieve your dreams with AI-powered insights</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-xs">
                  <p className="text-amber-900 font-medium mb-1">🛡️ Important Information:</p>
                  <p className="text-amber-800 font-light">By purchasing, you agree to our Terms of Service and Privacy Policy. The AI coach provides general motivational content only and is not a substitute for professional advice.</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleUnlockPro}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                  >
                    ✨ Unlock Pro for $9.99
                  </button>
                  <button
                    onClick={() => setShowUpgrade(false)}
                    className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Continue with Free Version
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                  <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Daily Notifications Setting */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Daily Reminders</p>
                        <p className="text-xs text-gray-600">Get daily notifications for affirmations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(e) => handleNotificationToggle(e.target.checked)}
                          disabled={isRequestingPermission}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${isRequestingPermission ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                      </label>
                    </div>

                    {/* Browser Permission Status */}
                    <div className="ml-8 mb-3">
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700">Browser Permission:</span>
                          <span className={`text-xs font-bold ${
                            notificationPermission === 'granted' ? 'text-green-600' :
                            notificationPermission === 'denied' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {notificationPermission === 'granted' ? '✓ Allowed' :
                             notificationPermission === 'denied' ? '✗ Blocked' :
                             '? Not Set'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const permission = checkNotificationPermission();
                            if (permission === 'granted' && !notificationsEnabled) {
                              setNotificationsEnabled(true);
                              localStorage.setItem('notificationsEnabled', 'true');
                              scheduleNotification();
                            }
                          }}
                          className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {isRequestingPermission && (
                      <div className="ml-8 mt-2 text-xs text-blue-600 bg-blue-50 p-3 rounded animate-pulse">
                        <p className="font-medium">Waiting for permission...</p>
                        <p className="mt-1">Please check your browser for a notification permission popup and click "Allow"</p>
                      </div>
                    )}

                    {notificationsEnabled && !isRequestingPermission && (
                      <div className="ml-8 mt-2 space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 font-medium">✓ Notifications Enabled</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Set Reminder Time</label>
                          <input
                            type="time"
                            value={notificationTime}
                            onChange={(e) => handleNotificationTimeChange(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base"
                          />
                          <p className="text-xs text-gray-600 mt-1">You'll receive a reminder at this time every day</p>
                        </div>
                        <button
                          onClick={testNotification}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Bell className="w-4 h-4" />
                          Send Test Notification
                        </button>
                      </div>
                    )}

                    {notificationPermission === 'denied' && !isRequestingPermission && (
                      <div className="ml-8 mt-3 space-y-3">
                        <div className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200">
                          <p className="font-semibold mb-2">⚠️ Notifications are blocked</p>
                          <p className="mb-2 font-medium">To enable notifications, you need to change your browser settings:</p>

                          <div className="space-y-2 mt-2">
                            <p className="font-semibold">Chrome/Edge/Brave:</p>
                            <ol className="list-decimal ml-4 space-y-1">
                              <li>Look for an icon in the address bar (might be a lock 🔒, info ⓘ, or settings icon)</li>
                              <li>Click it and find "Notifications"</li>
                              <li>Change to "Allow"</li>
                            </ol>

                            <p className="font-semibold mt-2">Safari:</p>
                            <ol className="list-decimal ml-4 space-y-1">
                              <li>Go to Safari menu → Settings → Websites</li>
                              <li>Click "Notifications" in the left sidebar</li>
                              <li>Find this website and change to "Allow"</li>
                            </ol>

                            <p className="font-semibold mt-2">Firefox:</p>
                            <ol className="list-decimal ml-4 space-y-1">
                              <li>Click the icon left of the address (lock or info icon)</li>
                              <li>Click "More Information"</li>
                              <li>Go to Permissions tab and allow Notifications</li>
                            </ol>
                          </div>

                          <p className="mt-3 font-medium">After changing the setting, click "Refresh" above or the button below.</p>
                        </div>
                        <button
                          onClick={() => {
                            const permission = checkNotificationPermission();
                            if (permission === 'granted') {
                              setNotificationsEnabled(true);
                              localStorage.setItem('notificationsEnabled', 'true');
                              scheduleNotification();
                              alert('Great! Notifications are now enabled.');
                            } else if (permission === 'denied') {
                              alert('Still blocked. Make sure you saved the browser setting change, then try clicking Refresh again.');
                            } else {
                              requestNotificationPermission().then(granted => {
                                if (granted) {
                                  setNotificationsEnabled(true);
                                  localStorage.setItem('notificationsEnabled', 'true');
                                  scheduleNotification();
                                }
                              });
                            }
                          }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Bell className="w-4 h-4" />
                          Check Permission Status
                        </button>
                      </div>
                    )}

                    {notificationPermission === 'default' && !notificationsEnabled && !isRequestingPermission && (
                      <div className="ml-8 mt-3 space-y-3">
                        <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="font-medium mb-2">📝 How to enable notifications:</p>
                          <p className="mb-2">You have two options:</p>
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold">Option 1: Use the toggle above</p>
                              <p>Toggle the switch and click "Allow" in the popup</p>
                            </div>
                            <div>
                              <p className="font-semibold">Option 2: Use the button below</p>
                              <p>Click to manually request permission</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            console.log('Manual permission request clicked');
                            const granted = await requestNotificationPermission();
                            if (granted) {
                              setNotificationsEnabled(true);
                              localStorage.setItem('notificationsEnabled', 'true');
                              scheduleNotification();
                            }
                          }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Bell className="w-4 h-4" />
                          Request Notification Permission
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Privacy Policy</p>
                      <p className="text-xs text-gray-600">How we handle your data</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowTermsOfService(true)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Terms of Service</p>
                      <p className="text-xs text-gray-600">Usage guidelines and policies</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <Download className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Export My Data</p>
                      <p className="text-xs text-gray-600">Download your {isPro ? 'affirmations and goals' : 'affirmations'}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCrisisResources(true)}
                    className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left border-2 border-red-200"
                  >
                    <Phone className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Crisis Resources</p>
                      <p className="text-xs text-red-600">24/7 mental health support</p>
                    </div>
                  </button>

                  <button
                    onClick={() => window.location.href = 'mailto:ajdenney12@gmail.com?subject=NextSelf Support Request'}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Help & Support</p>
                      <p className="text-xs text-gray-600">Email ajdenney12@gmail.com for assistance</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left"
                  >
                    <Trash className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Delete Account & Data</p>
                      <p className="text-xs text-red-600">Permanently remove all information</p>
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-gray-700" />
                    <div>
                      <p className="font-medium text-gray-800">Log Out</p>
                      <p className="text-xs text-gray-600">Sign out of your account</p>
                    </div>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500 font-light">
                    NextSelf v1.0.0<br/>
                    All data synced to your account
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* AI Coach Tab */}
          {activeTab === 'chat' && isPro && (
            <div className="space-y-6">
              {/* AI Coach Header */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/50 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{fontFamily: 'Poppins, sans-serif'}}>
                  Your AI Coach
                </h2>
                <p className="text-lg text-gray-700 font-light leading-relaxed">
                  I'm here to help you meet your NextSelf through personalized guidance, affirmations, and support on your journey to confidence and manifestation.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Quick Prompts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickPrompt("Help me build confidence and believe in myself more")}
                    className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/40 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-800 mb-1">💪 Build Confidence</p>
                    <p className="text-sm text-gray-600 font-light">Get affirmations to boost your self-belief</p>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt("I want to set meaningful goals. Can you help me create a plan?")}
                    className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/40 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-800 mb-1">🎯 Set Goals</p>
                    <p className="text-sm text-gray-600 font-light">Create actionable steps for your dreams</p>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt("Give me some positive affirmations to start my day")}
                    className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/40 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-800 mb-1">🌟 Daily Positivity</p>
                    <p className="text-sm text-gray-600 font-light">Start your day with uplifting energy</p>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt("How can I transform into my best self? What should I focus on?")}
                    className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/40 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-800 mb-1">🦋 Personal Growth</p>
                    <p className="text-sm text-gray-600 font-light">Explore strategies for transformation</p>
                  </button>
                </div>
              </div>

              {/* Chat Box */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-white/40">
                  <h3 className="text-lg font-semibold text-gray-800">💬 Chat with Your Coach</h3>
                </div>

                {/* Chat Messages Area */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`rounded-2xl p-4 border max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 rounded-tr-none'
                          : 'bg-white/40 backdrop-blur-sm border-white/30 rounded-tl-none'
                      }`}>
                        <p className={`font-light ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                          {message.content}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">You</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {isAiTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/40 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-white/50">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/40">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Ask me anything about affirmations, goals, or confidence..."
                      className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light"
                      disabled={isAiTyping}
                    />
                    <button
                      onClick={() => sendChatMessage()}
                      disabled={isAiTyping || !chatInput.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 font-light mt-2 text-center">
                    ⚠️ AI provides general motivational content. Not a substitute for professional advice.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab Placeholder */}
          {activeTab === 'goals' && isPro && (
            <div className="space-y-6">
              {/* Goals Header */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/50 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{fontFamily: 'Poppins, sans-serif'}}>
                  Your Goals
                </h2>
                <p className="text-lg text-gray-700 font-light leading-relaxed">
                  Set meaningful goals and track your progress in a way that works for you
                </p>
              </div>

              {/* Add Goal Button */}
              {!showAddGoal && (
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Goal
                </button>
              )}

              {/* Add/Edit Goal Form */}
              {showAddGoal && (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">
                    {editingGoalId ? '✏️ Edit Goal' : '🎯 Create New Goal'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                      <input
                        type="text"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        placeholder="e.g., Read 12 books this year"
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                      <textarea
                        value={newGoalDescription}
                        onChange={(e) => setNewGoalDescription(e.target.value)}
                        placeholder="Add details about your goal..."
                        rows={2}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Method</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setNewGoalType('progress')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            newGoalType === 'progress'
                              ? 'border-purple-500 bg-purple-100/50'
                              : 'border-white/30 bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          <p className="font-medium text-gray-800 text-sm mb-1">📊 Progress</p>
                          <p className="text-xs text-gray-600 font-light">Track % completion</p>
                        </button>
                        <button
                          onClick={() => setNewGoalType('habit')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            newGoalType === 'habit'
                              ? 'border-purple-500 bg-purple-100/50'
                              : 'border-white/30 bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          <p className="font-medium text-gray-800 text-sm mb-1">📅 Habit</p>
                          <p className="text-xs text-gray-600 font-light">Daily check-ins</p>
                        </button>
                        <button
                          onClick={() => setNewGoalType('milestone')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            newGoalType === 'milestone'
                              ? 'border-purple-500 bg-purple-100/50'
                              : 'border-white/30 bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          <p className="font-medium text-gray-800 text-sm mb-1">✅ Milestones</p>
                          <p className="text-xs text-gray-600 font-light">Step-by-step</p>
                        </button>
                      </div>
                    </div>

                    {newGoalType === 'progress' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target (Optional)</label>
                        <input
                          type="number"
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                          placeholder="100"
                          className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light"
                        />
                        <p className="text-xs text-gray-600 mt-1 font-light">Default is 100%</p>
                      </div>
                    )}

                    {newGoalType === 'habit' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Goal (Days)</label>
                        <input
                          type="number"
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                          placeholder="30"
                          className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light"
                        />
                        <p className="text-xs text-gray-600 mt-1 font-light">How many days do you want to maintain this habit?</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={addGoal}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                      >
                        {editingGoalId ? 'Update Goal' : 'Create Goal'}
                      </button>
                      <button
                        onClick={resetGoalForm}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals List */}
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
                            {goal.status === 'completed' && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-sm text-gray-600 font-light mb-3">{goal.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Progress Bar Type */}
                      {goal.type === 'progress' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-semibold text-purple-700">{goal.current}%</span>
                          </div>
                          <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                              style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={goal.target}
                            value={goal.current}
                            onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}

                      {/* Habit Tracker Type */}
                      {goal.type === 'habit' && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Current Streak: </span>
                              <span className="text-lg font-bold text-purple-700">{calculateStreak(goal.habit_days)} days 🔥</span>
                            </div>
                            <span className="text-sm text-gray-600">{goal.current} / {goal.target} days</span>
                          </div>
                          <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-4">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                              style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                            />
                          </div>
                          <button
                            onClick={() => toggleHabitDay(goal.id)}
                            className={`w-full py-3 rounded-xl font-medium transition-all ${
                              goal.habit_days?.includes(new Date().toISOString().split('T')[0])
                                ? 'bg-green-500 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                            }`}
                          >
                            {goal.habitDays?.includes(new Date().toISOString().split('T')[0])
                              ? '✓ Completed Today!'
                              : 'Mark Today Complete'}
                          </button>
                        </div>
                      )}

                      {/* Milestone Type */}
                      {goal.type === 'milestone' && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Milestones</span>
                            <span className="text-sm text-gray-600">{goal.current} / {goal.milestones?.length || 0}</span>
                          </div>
                          <div className="space-y-2 mb-3">
                            {goal.milestones?.map((milestone) => (
                              <div
                                key={milestone.id}
                                onClick={() => toggleMilestone(goal.id, milestone.id)}
                                className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 cursor-pointer hover:bg-white/40 transition-colors"
                              >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  milestone.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-400'
                                }`}>
                                  {milestone.completed && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className={`text-sm font-light ${
                                  milestone.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                }`}>
                                  {milestone.text}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a milestone..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  addMilestone(goal.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-gray-600 font-light text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : !showAddGoal && (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/50 text-center">
                  <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Goals Yet</h3>
                  <p className="text-gray-700 font-light mb-6">Start manifesting your dreams by creating your first goal</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Health Disclaimer Banner */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-xl p-4 text-xs text-gray-800 shadow-lg">
            <p className="font-medium mb-1">💙 Wellness Notice:</p>
            <p className="font-light">This app is for personal development and is not a substitute for professional mental health care. If you're experiencing a crisis, please contact a mental health professional or crisis hotline.</p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        isOpen={showTermsOfService}
        onClose={() => setShowTermsOfService(false)}
      />

      {/* Crisis Resources Modal */}
      <CrisisResourcesModal
        isOpen={showCrisisResources}
        onClose={() => setShowCrisisResources(false)}
      />

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Export My Data</h2>
              <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Download your data in PDF or CSV format. {!isPro && 'Upgrade to Pro to export goals.'}
            </p>

            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Affirmations
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      exportAffirmationsToPDF(affirmations);
                      setShowExportModal(false);
                    }}
                    disabled={affirmations.length === 0}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                  >
                    <span>Download as PDF</span>
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      exportAffirmationsToCSV(affirmations);
                      setShowExportModal(false);
                    }}
                    disabled={affirmations.length === 0}
                    className="w-full py-3 px-4 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                  >
                    <span>Download as CSV</span>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                {affirmations.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">No affirmations to export</p>
                )}
              </div>

              {isPro && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Goals
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          exportGoalsToPDF(goals);
                          setShowExportModal(false);
                        }}
                        disabled={goals.length === 0}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                      >
                        <span>Download as PDF</span>
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          exportGoalsToCSV(goals);
                          setShowExportModal(false);
                        }}
                        disabled={goals.length === 0}
                        className="w-full py-3 px-4 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                      >
                        <span>Download as CSV</span>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    {goals.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">No goals to export</p>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-600" />
                      Complete Data
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          exportAllDataToPDF(affirmations, goals);
                          setShowExportModal(false);
                        }}
                        disabled={affirmations.length === 0 && goals.length === 0}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                      >
                        <span>Download All as PDF</span>
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          exportAllDataToCSV(affirmations, goals);
                          setShowExportModal(false);
                        }}
                        disabled={affirmations.length === 0 && goals.length === 0}
                        className="w-full py-3 px-4 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between"
                      >
                        <span>Download All as CSV</span>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    {affirmations.length === 0 && goals.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">No data to export</p>
                    )}
                  </div>
                </>
              )}

              {!isPro && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 mb-1">Upgrade to Pro</p>
                  <p className="text-xs text-gray-600 mb-3">Export your goals and complete data with Pro</p>
                  <button
                    onClick={() => {
                      setShowExportModal(false);
                      handlePremiumClick();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow text-sm"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <Trash className="w-6 h-6" />
                Delete Account
              </h2>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  ⚠️ Warning: This action cannot be undone!
                </p>
                <p className="text-sm text-red-700">
                  Deleting your account will permanently remove:
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
                  <li>All your affirmations</li>
                  <li>All your goals and progress</li>
                  <li>Your account information</li>
                  <li>All chat history</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  💡 Recommended: Export your data first
                </p>
                <p className="text-sm text-blue-700 mb-3">
                  Save a copy of your affirmations and goals before deleting your account.
                </p>
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setShowExportModal(true);
                  }}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export My Data
                </button>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
