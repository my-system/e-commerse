"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  const router = useRouter();

  useEffect(() => {
    // Get pending user data from sessionStorage
    const userData = sessionStorage.getItem('pendingUser');
    if (!userData) {
      router.push('/register');
      return;
    }
    
    try {
      setPendingUser(JSON.parse(userData));
    } catch (error) {
      router.push('/register');
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').slice(0, 6);
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!pendingUser) {
      setError('User data not found. Please register again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pendingUser.email,
          name: pendingUser.name,
          password: pendingUser.password,
          otp: otpString
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        sessionStorage.removeItem('pendingUser');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!pendingUser) return;

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: pendingUser.email }),
      });

      const data = await response.json();

      if (data.success) {
        setTimeLeft(600); // Reset timer
        setOtp(['', '', '', '', '', '']);
        setError('');
        
        if (data.otp) {
          alert(`Development Mode - New OTP: ${data.otp}`);
        }
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend code');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center max-w-md w-full">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Account Verified!</h2>
          <p className="text-white/80 mb-6">Your account has been successfully created and activated.</p>
          <p className="text-white/60">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="mb-8">
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Register
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Verify Email</h1>
            </div>
            <p className="text-white/70">
              We've sent a 6-digit verification code to {pendingUser?.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <label className="block text-white/80 text-sm font-medium">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl text-center text-white font-bold text-lg focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all"
                  />
                ))}
              </div>
              {timeLeft > 0 ? (
                <p className="text-center text-white/60 text-sm">
                  Code expires in {formatTime(timeLeft)}
                </p>
              ) : (
                <p className="text-center text-red-400 text-sm">
                  Code expired. Please request a new one.
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join('').length !== 6 || timeLeft === 0}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Verify Account'
              )}
            </button>

            {/* Resend Code */}
            <button
              type="button"
              onClick={handleResend}
              disabled={isSubmitting}
              className="w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Resend Code'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Didn't receive the code? Check your spam folder or{' '}
              <button
                onClick={handleResend}
                className="text-purple-400 hover:text-purple-300 font-medium"
                disabled={isSubmitting}
              >
                request a new one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
