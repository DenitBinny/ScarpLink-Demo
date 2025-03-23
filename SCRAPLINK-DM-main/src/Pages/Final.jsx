import React, { useState } from 'react';
import { CheckCircle, Download, Loader2, Leaf } from 'lucide-react';

function App() {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('input');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStatus('loading');
      // Simulate API call
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF invoice
    alert('Downloading invoice...');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Professional sustainability background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1451847454245-089317b19b54?auto=format&fit=crop&q=80&w=1920")',
        }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 w-full max-w-md overflow-hidden border border-white/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-20"></div>
        
        {status === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-2">
                <Leaf className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Payment</h2>
              <p className="text-gray-600">
                Enter the 6-digit OTP sent to your device
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-4 text-center text-3xl tracking-[1em] border-2 border-gray-200 rounded-xl 
                           focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300
                           placeholder:text-gray-300 placeholder:tracking-[0.5em] placeholder:text-2xl"
                  maxLength={6}
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6}
                className="relative w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                         shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)]
                         after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-green-600/0 after:via-white/10 after:to-green-600/0
                         after:animate-[shine_3s_ease-in-out_infinite]"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        )}

        {status === 'loading' && (
          <div className="text-center py-12 animate-[fadeIn_0.3s_ease-out]">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-green-600 animate-spin mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent blur-sm"></div>
            </div>
            <div className="relative mt-8 space-y-2">
              <p className="text-xl text-gray-800 font-medium">Processing Payment</p>
              <p className="text-gray-500">Please wait while we verify your transaction</p>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-1/2 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
                <CheckCircle className="w-20 h-20 text-green-500 animate-[bounceIn_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-6">Payment Successful!</h2>
              <p className="text-gray-600 mt-2">Your transaction has been completed</p>
              
              <div className="w-full space-y-4 mt-8">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 py-4 rounded-xl font-semibold
                           hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>

                <button
                  onClick={() => {
                    setStatus('input');
                    setOtp('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  Make Another Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;