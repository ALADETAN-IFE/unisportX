import { useEffect, useState } from 'react';

// Type definitions
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Helper functions
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const isInStandaloneMode = () =>
  'standalone' in window.navigator && window.navigator.standalone;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    if (isIos() && !isInStandaloneMode()) {
      setTimeout(() => {
        setShowIosPrompt(true);
        setTimeout(() => {
          setShowIosPrompt(false);
        }, 6000);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: { outcome: 'accepted' | 'dismissed' }) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setTimeout(() => {
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 4000);
          }, 6000);
        } else {
          console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleCloseIosPrompt = () => {
    setShowIosPrompt(false);
  };

  return (
    <div>
      {showPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#061220] rounded-lg flex items-center justify-center">
                  <img src="/card-logo.png" alt="UnisportX Logo" className="rounded-lg"/>
                  {/* <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg> */}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Install UniSportX</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get the app for a better experience</p>
                </div>
              </div>
              <button
                onClick={handleClosePrompt}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
                className="flex-1 bg-[#061220] hover:bg-[#061220d3] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                // className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Install
              </button>
              <button
                onClick={handleClosePrompt}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium transition-colors duration-200"
              >
                Later
        </button>
            </div>
          </div>
        </div>
      )}

      {showIosPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#061220] rounded-lg flex items-center justify-center">
                {/* <div className="w-10 h-10 bg-yellow-500 bg-[#061220] rounded-lg flex items-center justify-center"> */}
                  {/* <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg> */}
                  <img src="/card-logo.png" alt="UnisportX Logo" className="rounded-lg"/>
                  {/* <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg> */}
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Install on iOS</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Add to Home Screen</p>
                </div>
              </div>
              <button
                onClick={handleCloseIosPrompt}
                className="text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-200 transition-colors"
        >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <p>1. Tap the <strong>Share</strong> button</p>
              <p>2. Choose <strong>"Add to Home Screen"</strong></p>
              <p>3. Tap <strong>"Add"</strong> to install</p>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-20 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">App installed successfully!</span>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in-out {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
          }
          
          .animate-fade-in-out {
            animation: fade-in-out 4s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default InstallPrompt;