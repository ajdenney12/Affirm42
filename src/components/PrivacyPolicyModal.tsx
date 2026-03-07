import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
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
            Your privacy, trust, and emotional safety are extremely important to us.
          </p>

          <p className="text-gray-700 leading-relaxed">
            NextSelf is designed as a personal wellness and affirmations app. We collect only the minimum information necessary to provide the app's features and we never sell your data.
          </p>

          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy explains what information we collect, how we use it, and how we protect it.
          </p>

          <p className="text-gray-700 leading-relaxed font-medium">
            By using the app, you agree to this policy.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">1. Information We Collect</h3>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Information You Provide</h4>
              <p className="text-gray-700 leading-relaxed mb-2">When you use the app, you may provide:</p>
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                <li>Email address or login credentials</li>
                <li>Personal goals</li>
                <li>Affirmations</li>
                <li>Journal-style or reflective wellness entries</li>
                <li>Optional profile preferences</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                This content may relate to your personal well-being or mental wellness and is treated as private, sensitive personal information.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Automatically Collected Information</h4>
              <p className="text-gray-700 leading-relaxed mb-2">To improve performance and reliability, we may collect:</p>
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                <li>Device type and OS version</li>
                <li>App usage statistics</li>
                <li>Crash logs</li>
                <li>Anonymous analytics</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                This data does not directly identify you.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">2. How We Use Your Information</h3>
            <p className="text-gray-700 leading-relaxed">We use your information only to:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Create and manage your account</li>
              <li>Save and sync your goals and affirmations</li>
              <li>Provide personalized app features</li>
              <li>Maintain security</li>
              <li>Fix bugs and improve performance</li>
              <li>Respond to support requests</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3 font-medium">We do not:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Sell your data</li>
              <li>Share your content for advertising</li>
              <li>Use your affirmations or journal entries for marketing</li>
              <li>Train AI models on your personal content</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2 font-medium">
              Your entries remain private to you.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">3. Mental Wellness & Sensitive Information Protections</h3>
            <p className="text-gray-700 leading-relaxed">
              Although NextSelf is not a medical provider and is not a HIPAA-covered healthcare entity, we apply HIPAA-style privacy and security safeguards to protect your wellness information.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We treat your goals, affirmations, and reflections as sensitive data and:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Limit access to only necessary systems</li>
              <li>Encrypt data in transit and at rest</li>
              <li>Store the minimum amount of information needed</li>
              <li>Never sell or disclose personal wellness content</li>
              <li>Allow you to delete your data at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              This means your personal reflections are handled with protections similar to health information.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">4. Data Storage & Security</h3>
            <p className="text-gray-700 leading-relaxed mb-2">Your information is securely stored using:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Bolt secure backend infrastructure</li>
              <li>Encrypted databases</li>
              <li>HTTPS/TLS data transmission</li>
              <li>Access controls and authentication</li>
              <li>Regular security updates</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We follow industry-standard technical and organizational safeguards to prevent unauthorized access, loss, or misuse.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              No system is 100% secure, but we take reasonable steps to protect your information.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">5. Data Sharing</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              We do not sell, rent, or trade your personal information.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              We only share limited data with trusted service providers necessary to operate the app, such as:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Bolt hosting/database services</li>
              <li>Cloud infrastructure providers</li>
              <li>Analytics tools (anonymous only)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              These providers are contractually required to protect your data and may not use it for their own purposes.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              We may disclose information if required by law.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">6. Your Privacy Rights & Control</h3>
            <p className="text-gray-700 leading-relaxed">
              You are always in control of your information.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">You may:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Edit or delete goals and affirmations anytime</li>
              <li>Update your account details</li>
              <li>Request a copy of your data</li>
              <li>Request permanent account deletion</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">To request deletion or export:</p>
            <p className="text-gray-700 leading-relaxed">Email: ajdenney12@gmail.com</p>
            <p className="text-gray-700 leading-relaxed mt-2">
              When you delete your account, your personal content is permanently removed from our systems within a reasonable timeframe.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">7. Data Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              We keep your information only while your account is active or as needed to provide services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Deleted content and accounts are permanently erased and not retained for marketing or analytics purposes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">8. Not Medical or Clinical Advice</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              NextSelf is a self-help and wellness tool only.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">It:</p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>Is not medical care</li>
              <li>Does not provide therapy or diagnosis</li>
              <li>Is not a substitute for professional healthcare</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              If you are experiencing a mental health crisis, please contact a qualified professional or local emergency services.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">9. Children's Privacy</h3>
            <p className="text-gray-700 leading-relaxed">
              The app is not intended for children under 13.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              We do not knowingly collect personal information from children. If such information is discovered, we will delete it promptly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">10. Third-Party Services</h3>
            <p className="text-gray-700 leading-relaxed">
              The app may use trusted third-party tools solely to operate and improve functionality (e.g., hosting or analytics). These services follow their own privacy and security standards.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              We do not allow third parties to access or read your affirmations or journal content.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">11. Changes to This Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy occasionally. Updates will be posted here with a revised "Last Updated" date. Continued use of the app means you accept the changes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">12. Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about privacy or your data:
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              NextWell AI<br />
              Email: ajdenney12@gmail.com<br />
              Website: www.nextwellai.com
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
