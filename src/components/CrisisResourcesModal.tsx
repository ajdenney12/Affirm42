import React from 'react';
import { Phone, X } from 'lucide-react';

interface CrisisResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisResourcesModal({ isOpen, onClose }: CrisisResourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Crisis Resources</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-900 mb-2">
              If you are in immediate danger or having a mental health emergency, please call 911 or go to your nearest emergency room.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                988 Suicide & Crisis Lifeline (USA)
              </h3>
              <div className="space-y-2 mb-3">
                <p className="text-gray-800">
                  <span className="font-semibold">Call or Text:</span> <a href="tel:988" className="text-red-600 font-bold text-xl hover:underline">988</a>
                </p>
                <p className="text-sm text-gray-700">
                  Available 24/7. Free and confidential support for people in distress, crisis resources, and prevention.
                </p>
              </div>
              <a
                href="https://988lifeline.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                Visit 988lifeline.org
              </a>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Crisis Text Line
              </h3>
              <div className="space-y-2 mb-3">
                <p className="text-gray-800">
                  <span className="font-semibold">Text:</span> <span className="text-blue-600 font-bold text-xl">HOME</span> to <a href="sms:741741" className="text-blue-600 font-bold text-xl hover:underline">741741</a>
                </p>
                <p className="text-sm text-gray-700">
                  Free 24/7 crisis support via text message. Trained crisis counselors available to support you.
                </p>
              </div>
              <a
                href="https://www.crisistextline.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Visit crisistextline.org
              </a>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-600" />
                SAMHSA National Helpline
              </h3>
              <div className="space-y-2 mb-3">
                <p className="text-gray-800">
                  <span className="font-semibold">Call:</span> <a href="tel:1-800-662-4357" className="text-purple-600 font-bold text-xl hover:underline">1-800-662-4357</a>
                </p>
                <p className="text-sm text-gray-700">
                  24/7 treatment referral and information service for mental health and substance abuse. Free and confidential.
                </p>
              </div>
              <a
                href="https://www.samhsa.gov/find-help/national-helpline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline"
              >
                Visit samhsa.gov
              </a>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                International Resources
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  If you're outside the United States, the International Association for Suicide Prevention provides a directory of crisis centers by country.
                </p>
              </div>
              <a
                href="https://www.iasp.info/resources/Crisis_Centres/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline inline-block mt-3"
              >
                Find international crisis centers
              </a>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Remember:</span> These resources are staffed by trained professionals who care about you. Reaching out for help is a sign of strength, not weakness. You are not alone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
