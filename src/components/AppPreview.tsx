import React from 'react';
import { Sparkles, Target, Star, MessageCircle } from 'lucide-react';

export default function AppPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          create
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-light">
          Your journey to becoming your NextSelf
        </p>
      </div>

      <div className="relative">
        {/* iPhone Frame */}
        <div className="relative w-[375px] h-[812px] bg-black rounded-[60px] p-3 shadow-2xl">
          {/* iPhone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

          {/* iPhone Screen */}
          <div className="w-full h-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 rounded-[48px] overflow-hidden relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 pt-2 z-20">
              <span className="text-sm font-semibold text-gray-800">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-3 border border-gray-800 rounded-sm"></div>
                <div className="w-1 h-2 bg-gray-800 rounded-sm"></div>
              </div>
            </div>

            {/* App Content */}
            <div className="pt-12 px-4 h-full overflow-hidden">
              {/* Header */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50 text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  NextSelf
                </h2>
                <p className="text-sm text-gray-700 font-light">
                  Transform into your best self
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-2 border border-white/50 mb-4">
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>Affirmations</span>
                  </button>
                  <button className="flex-1 py-2 px-3 bg-white/50 backdrop-blur-sm rounded-xl font-medium text-gray-700 text-sm flex items-center justify-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>Goals</span>
                  </button>
                  <button className="flex-1 py-2 px-3 bg-white/50 backdrop-blur-sm rounded-xl font-medium text-gray-700 text-sm flex items-center justify-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Coach</span>
                  </button>
                </div>
              </div>

              {/* Sample Affirmation Cards */}
              <div className="space-y-3">
                <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/50">
                  <p className="text-gray-800 font-medium text-sm mb-2">
                    I am confident and capable
                  </p>
                  <p className="text-xs text-gray-600">Today, 9:30 AM</p>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/50">
                  <p className="text-gray-800 font-medium text-sm mb-2">
                    I attract positive energy
                  </p>
                  <p className="text-xs text-gray-600">Today, 8:15 AM</p>
                </div>

                <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/50">
                  <p className="text-gray-800 font-medium text-sm mb-2">
                    Every day I grow stronger
                  </p>
                  <p className="text-xs text-gray-600">Yesterday, 7:45 PM</p>
                </div>
              </div>

              {/* Add Button */}
              <div className="absolute bottom-20 left-0 right-0 px-4">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2">
                  <span className="text-xl">+</span>
                  <span>Create Affirmation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-300/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-300/30 rounded-full blur-2xl"></div>
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-lg font-light">
          Build confidence. Set goals. Transform your life.
        </p>
      </div>
    </div>
  );
}
