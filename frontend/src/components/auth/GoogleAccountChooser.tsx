import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoogleAccount {
  name: string;
  email: string;
  avatar: 'nature' | 'teal' | 'custom';
}

interface GoogleAccountChooserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatar: string }) => void;
}

export const GoogleAccountChooser: React.FC<GoogleAccountChooserProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [showDifferentInput, setShowDifferentInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    onSelectAccount({
      name,
      email: customEmail.trim(),
      avatar: 'custom',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Google White Card Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[440px] bg-white rounded-3xl p-7 shadow-2xl text-left border border-gray-100 font-sans"
          >
            {/* Top Google "G" Badge with decorative dots */}
            <div className="relative flex items-center justify-center mb-4">
              {/* Decorative dots pattern (Google One-Tap Style) */}
              <div className="absolute flex gap-1 -left-2 top-1/2 -translate-y-1/2 opacity-40">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              </div>
              <div className="absolute flex gap-1 -right-2 top-1/2 -translate-y-1/2 opacity-40">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              </div>

              {/* Scalloped White Circle */}
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 ring-4 ring-gray-50">
                <svg viewBox="0 0 24 24" className="w-9 h-9">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-[19px] font-semibold text-gray-900 text-center tracking-tight leading-snug">
              Sign in to in.bookmyshow.com with google.com
            </h2>
            <p className="text-[13px] text-gray-600 text-center mt-1 mb-5">
              Choose an account to continue
            </p>

            {!showDifferentInput ? (
              <>
                {/* Account List with dividers */}
                <div className="border-t border-b border-gray-200 divide-y divide-gray-200 mb-5">
                  {/* Account 1: Ruthra K */}
                  <button
                    type="button"
                    onClick={() =>
                      onSelectAccount({
                        name: 'Ruthra K',
                        email: 'ragaruthra@gmail.com',
                        avatar: 'nature',
                      })
                    }
                    className="w-full flex items-center justify-between py-3.5 px-3 hover:bg-gray-50 transition-colors rounded-xl text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Nature Forest Avatar matching screenshot */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-emerald-800 relative shadow-sm border border-emerald-900/20 flex items-center justify-center">
                        {/* Forest trees illustration */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="50" fill="#2d6a4f" />
                          <circle cx="28" cy="70" r="22" fill="#40916c" />
                          <circle cx="68" cy="72" r="26" fill="#1b4332" />
                          <circle cx="50" cy="40" r="20" fill="#52b788" />
                          <circle cx="75" cy="45" r="14" fill="#74c69d" />
                          <circle cx="30" cy="38" r="15" fill="#1b4332" />
                          <path
                            d="M 50 100 L 50 55 M 35 100 L 35 65 M 65 100 L 65 60"
                            stroke="#854d0e"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-gray-900 truncate group-hover:text-black">
                          Ruthra K
                        </p>
                        <p className="text-[13px] text-gray-500 truncate">
                          ragaruthra@gmail.com
                        </p>
                      </div>
                    </div>

                    {/* Small Right Arrow / Chevron */}
                    <svg
                      className="w-3 h-3 text-gray-600 fill-current ml-2 flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                      viewBox="0 0 10 10"
                    >
                      <polygon points="0,0 10,5 0,10" />
                    </svg>
                  </button>

                  {/* Account 2: Rudhresh K */}
                  <button
                    type="button"
                    onClick={() =>
                      onSelectAccount({
                        name: 'Rudhresh K',
                        email: 'rudhreshk61@gmail.com',
                        avatar: 'teal',
                      })
                    }
                    className="w-full flex items-center justify-between py-3.5 px-3 hover:bg-gray-50 transition-colors rounded-xl text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Teal Circle Avatar with letter 'R' */}
                      <div className="w-10 h-10 rounded-full bg-[#00897b] text-white font-medium flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                        R
                      </div>

                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-gray-900 truncate group-hover:text-black">
                          Rudhresh K
                        </p>
                        <p className="text-[13px] text-gray-500 truncate">
                          rudhreshk61@gmail.com
                        </p>
                      </div>
                    </div>

                    {/* Small Right Arrow / Chevron */}
                    <svg
                      className="w-3 h-3 text-gray-600 fill-current ml-2 flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                      viewBox="0 0 10 10"
                    >
                      <polygon points="0,0 10,5 0,10" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDifferentInput(true)}
                    className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-[13px] font-medium transition cursor-pointer"
                  >
                    Use a different account
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-[13px] font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              /* Custom Account Input Form */
              <form onSubmit={handleCustomSubmit} className="space-y-4 pt-1 pb-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Google Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDifferentInput(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
                  >
                    Back to Accounts
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
