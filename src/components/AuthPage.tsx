/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Building2, Globe, FileText, ArrowRight, CheckCircle2, Inbox, ShieldCheck, Check } from 'lucide-react';
import { api } from '../api.js';

interface AuthPageProps {
  initialTab: 'login' | 'register';
  setView: (view: string) => void;
  onLoginSuccess: (token: string, user: any) => void;
}

export function AuthPage({ initialTab, setView, onLoginSuccess }: AuthPageProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Registration specific role
  const [role, setRole] = useState<'student' | 'job_seeker' | 'employer'>('student');

  // Employer company properties
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');

  // UI Status control
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Email verification mock display state
  const [successEmailData, setSuccessEmailData] = useState<{
    email: string;
    message: string;
    token: string;
    user: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');

    try {
      if (tab === 'login') {
        const data = await api.login({ email, password });
        onLoginSuccess(data.token, data.user);
        setView('dashboard');
      } else {
        const payload = {
          email,
          password,
          name,
          role,
          ...(role === 'employer' ? {
            companyName,
            industry,
            website,
            description: companyDesc
          } : {})
        };
        const data = await api.register(payload);
        if (data.emailSent) {
          setSuccessEmailData({
            email,
            message: data.emailVerificationMessage,
            token: data.token,
            user: data.user
          });
        } else {
          onLoginSuccess(data.token, data.user);
          setView('dashboard');
        }
      }
    } catch (err: any) {
      setErrorText(err.message || 'Credentials error. Please check values and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successEmailData) {
    return (
      <div className="bg-transparent flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in" id="auth-email-verification-simulation">
        <div className="w-full max-w-xl space-y-6">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-display flex items-center justify-center gap-2">
              <Inbox className="h-8 w-8 text-indigo-405 animate-bounce" />
              Simulated Inbox Confirmed
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Welcome message automatically dispatched to your registered address!
            </p>
          </div>

          <div className="bg-[#0E0E14]/95 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            
            <div className="bg-[#064E3B]/30 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-400 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-slate-200">Security Verification Succeeded!</strong>
                A personalized welcome verification email was successfully routed back to <span className="font-mono underline font-medium text-slate-300">{successEmailData.email}</span>.
              </div>
            </div>

            {/* Virtual Mail Client Layout */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              {/* Mail client toolbar bar */}
              <div className="bg-white/[0.04] p-3 px-4 border-b border-white/5 flex items-center justify-between text-slate-405 text-[10.5px] font-mono">
                <span className="flex items-center gap-1.5 font-sans font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="ml-1.5">Incoming Secure Mail (1)</span>
                </span>
                <span>Active Link: Secure TLSv1.3</span>
              </div>

              {/* Mail details header */}
              <div className="p-4 border-b border-white/5 space-y-1 text-xs">
                <p className="text-slate-500 font-mono"><strong className="text-slate-350">From:</strong> noreply@attachme.com &lt;System Verification&gt;</p>
                <p className="text-slate-500 font-mono"><strong className="text-slate-350">To:</strong> {successEmailData.email}</p>
                <p className="text-slate-300 font-medium"><strong className="text-slate-355">Subject:</strong> Welcome to AttachME - Account Registration Confirmation!</p>
              </div>

              {/* Mail message body content */}
              <div className="p-5 text-xs text-slate-305 leading-relaxed bg-[#0E0E14]/30">
                <div 
                  className="space-y-3 prose prose-invert max-w-none text-slate-200" 
                  dangerouslySetInnerHTML={{ __html: successEmailData.message }} 
                />
              </div>
            </div>

            {/* Virtual click option actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(successEmailData.token, successEmailData.user);
                  setView('dashboard');
                }}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-505 active:scale-[0.98] cursor-pointer py-3.5 text-xs uppercase tracking-wider font-bold text-white shadow-lg shadow-indigo-600/20 transition-all font-display"
              >
                <Check className="h-4 w-4" />
                Proceed & Verify Account Dashboard
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="auth-view">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Card Frame Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            {tab === 'login' ? 'Welcome Back' : 'Create AttachME Account'}
          </h2>
          <p className="mt-2 text-xs text-slate-450">
            {tab === 'login' 
              ? 'Enter email credentials to access your placements & dashboards.' 
              : 'Join as a student, general job seeker, or recruitment supervisor.'}
          </p>
        </div>

        {/* Core Auth Panel Card */}
        <div className="bg-[#0E0E14]/90 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Tabs Selector */}
          <div className="flex border-b border-white/5 mb-6" id="auth-tabs">
            <button
              onClick={() => { setTab('login'); setErrorText(''); }}
              className={`w-1/2 pb-3 text-center text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                tab === 'login' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In Account
            </button>
            <button
              onClick={() => { setTab('register'); setErrorText(''); }}
              className={`w-1/2 pb-3 text-center text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer ${
                tab === 'register' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Feedbacks */}
          {errorText && (
            <div className="mb-6 rounded-xl bg-red-950/20 border border-red-500/20 p-4 text-xs font-semibold text-rose-300">
              {errorText}
            </div>
          )}

          {/* Form wrapper */}
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form-submit">
            {tab === 'register' && (
              <>
                {/* 1. Name input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Full Name</label>
                  <div className="relative mt-1">
                    <UserIcon className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* 2. Role Selector Grid boxes */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">Select Your Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`text-center p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        role === 'student' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-600/10' : 'border-white/10 text-slate-450 hover:bg-white/5'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('job_seeker')}
                      className={`text-center p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        role === 'job_seeker' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-md' : 'border-white/10 text-slate-450 hover:bg-white/5'
                      }`}
                    >
                      Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('employer')}
                      className={`text-center p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        role === 'employer' ? 'border-violet-500 bg-violet-500/10 text-violet-400 shadow-md' : 'border-white/10 text-slate-450 hover:bg-white/5'
                      }`}
                    >
                      Employer
                    </button>
                  </div>

                  {/* Helpers hints based on role choices */}
                  <div className="mt-2.5 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-[11px] text-slate-400 flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {role === 'student' && 'Apply for educational attachments, document log requirements, & notify university coordinators.'}
                      {role === 'job_seeker' && 'Build interactive resume profiles, apply for entry/mid-level positions & track status changes.'}
                      {role === 'employer' && 'Create institutional profiles, publish available jobs/internship spaces, & view candidate CVs.'}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Email Field info */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* REGISTER-ONLY: Employer Specific company fields */}
            {tab === 'register' && role === 'employer' && (
              <div className="border-t border-white/5 pt-5 mt-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center font-display">
                  <Building2 className="h-4 w-4 mr-1 text-slate-500" />
                  Company Profiles Setup
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Microsoft Kenya Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-white/[0.04] py-3 px-4 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Industry Sector</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fintech, Cybersecurity, Tech"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-white/10 bg-white/[0.04] py-3 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Website</label>
                    <input
                      type="url"
                      placeholder="https://microsoft.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-white/10 bg-white/[0.04] py-3 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none animate-pulse"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Short Bio / Slogan</label>
                  <textarea
                    placeholder="Empower every person and every organization on the planet..."
                    rows={2}
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Trigger Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] cursor-pointer disabled:bg-slate-800 py-3 text-xs uppercase tracking-wider font-bold text-white shadow-lg shadow-indigo-600/10 transition-all font-display"
              >
                {tab === 'login' ? 'Sign In Now' : 'Create Placements Account'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </form>

          {/* Bottom redirection toggle */}
          <div className="mt-6 text-center text-xs text-slate-450 border-t border-white/5 pt-5">
            {tab === 'login' ? (
              <p>
                Not registered with AttachME?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('register'); setErrorText(''); }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Join for Free
                </button>
              </p>
            ) : (
              <p>
                Already have an AttachME account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('login'); setErrorText(''); }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
            
            {/* Quick Demo Preloaded logins showcase */}
            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.01] p-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 font-mono">Sandbox Test Accounts</span>
              <div className="space-y-1.5 text-[10.5px] text-slate-400">
                <div className="flex justify-between">
                  <span>🎓 Student: <strong className="text-slate-100 font-medium">student@harvard.edu</strong></span>
                  <span className="text-slate-650 font-mono">password123</span>
                </div>
                <div className="flex justify-between">
                  <span>💼 Recruiter: <strong className="text-slate-100 font-medium">recruiter@microsoft.com</strong></span>
                  <span className="text-slate-650 font-mono">password123</span>
                </div>
                <div className="flex justify-between">
                  <span>🛡️ Chief Admin: <strong className="text-slate-100 font-medium">admin@attachme.com</strong></span>
                  <span className="text-slate-650 font-mono">admin123</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
