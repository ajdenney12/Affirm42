import React from 'react';
import { X } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Terms of Service</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Last Updated: February 1, 2026</p>
            <p className="text-sm text-gray-600">App Name: NextSelf</p>
            <p className="text-sm text-gray-600">Operated by: NextWell AI</p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            By downloading, accessing, or using NextSelf ("the App"), you agree to these Terms of Service. If you do not agree, please do not use the App.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">1. Description of Service</h3>
            <p className="text-gray-700 leading-relaxed">
              NextSelf is a personal wellness and affirmations application that allows users to create accounts, set goals, and save affirmations or reflective content for personal use.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The App is intended for self-improvement and general wellness purposes only.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              It is not a medical or mental health service.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">2. Eligibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 13 years old to use the App.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using the App, you confirm that you meet this requirement.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">3. Accounts</h3>
            <p className="text-gray-700 leading-relaxed">
              To use certain features, you may create an account.
            </p>
            <p className="text-gray-700 leading-relaxed">You agree to:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Provide accurate information</li>
              <li>Keep login credentials secure</li>
              <li>Be responsible for activity under your account</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              You are responsible for maintaining the confidentiality of your account.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">4. Your Content</h3>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of the content you create, including:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Goals</li>
              <li>Affirmations</li>
              <li>Journal entries</li>
              <li>Notes</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              We do not claim ownership of your personal content.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You grant us a limited license to store and process your content only as needed to operate the App.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              We will never sell or publicly share your private entries.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">5. Acceptable Use</h3>
            <p className="text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Use the App for illegal purposes</li>
              <li>Attempt to hack or disrupt the service</li>
              <li>Upload harmful or malicious content</li>
              <li>Harass or abuse other users</li>
              <li>Reverse engineer the software</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              We may suspend or terminate accounts that violate these rules.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">6. Wellness Disclaimer (Important)</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              The App provides self-help and motivational tools only.
            </p>
            <p className="text-gray-700 leading-relaxed">It:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Is not therapy</li>
              <li>Is not medical or psychological treatment</li>
              <li>Does not diagnose or treat conditions</li>
              <li>Does not replace professional healthcare</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2 font-medium">
              If you are experiencing a mental health crisis, contact a licensed professional or emergency services immediately.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Use of the App is at your own discretion and risk.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">7. HIPAA & Health Information Notice</h3>
            <p className="text-gray-700 leading-relaxed">
              NextSelf is not a HIPAA-covered healthcare provider.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Although we apply strong privacy and security safeguards similar to healthcare standards, the App is not intended to store protected health information for clinical purposes.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              Do not use the App to transmit emergency or medical information.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">8. Service Availability</h3>
            <p className="text-gray-700 leading-relaxed">
              We strive to keep the App available and reliable, but we do not guarantee:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Continuous availability</li>
              <li>Error-free operation</li>
              <li>Permanent storage without interruption</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              Features may change or be discontinued at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">9. Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law:
            </p>
            <p className="text-gray-700 leading-relaxed">NextSelf is not liable for:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Loss of data</li>
              <li>Emotional or personal outcomes</li>
              <li>Indirect or incidental damages</li>
              <li>Service interruptions</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2 font-medium">
              Your use of the App is at your own risk.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">10. Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              You may delete your account at any time.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate accounts that violate these Terms or misuse the service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your access to the App will stop and your data may be deleted according to our Privacy Policy.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">11. Intellectual Property</h3>
            <p className="text-gray-700 leading-relaxed">
              All App software, design, branding, and features are owned by NextWell AI and protected by copyright and intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not copy, modify, or redistribute the App without permission.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">12. Changes to These Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms occasionally. Continued use of the App after updates means you accept the revised Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">13. Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of Virginia, USA, without regard to conflict of law principles.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">14. Contact</h3>
            <p className="text-gray-700 leading-relaxed">If you have questions:</p>
            <p className="text-gray-700 leading-relaxed mt-2">
              NextWell AI<br />
              Email: ajdenney12@gmail.com
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-amber-900 font-medium mb-2">Important Reminder:</p>
            <p className="text-sm text-amber-800">
              NextSelf is a wellness and personal development tool. It is not a replacement for professional mental health services. If you are experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
