'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); 
    const [resetId, setResetId] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const router = useRouter();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ id_number: idNumber, password: password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed.');

            // 1. SAVE DATA CORRECTLY
            localStorage.setItem('token', data.token);
            // We store the full user object to ensure year_level/section are included
            localStorage.setItem('userData', JSON.stringify(data.user));

            // 2. REDIRECT BASED ON ROLE
            switch (data.user.role) {
                case 'admin': router.push('/admin-dashboard'); break;
                case 'teacher': router.push('/teacher-dash-eval'); break;
                case 'student': router.push('/student-dash-eval'); break;
                default: throw new Error('Role not recognized.');
            }
        } catch (err: any) { 
            setError(err.message); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (forgotStep === 1) {
                // Verify ID existence
                const res = await fetch('http://127.0.0.1:8000/api/forgot-password', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id_number: resetId })
                });
                if (!res.ok) throw new Error("ID not found.");
                setForgotStep(2);
            } else {
                // Perform Reset
                const res = await fetch('http://127.0.0.1:8000/api/reset-password', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id_number: resetId, password: newPassword })
                });
                if (!res.ok) throw new Error("Reset failed.");
                alert("Password reset successfully!");
                setShowForgot(false);
                setForgotStep(1);
            }
        } catch (err: any) { alert(err.message); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center font-sans p-4">
            <form onSubmit={handleLoginSubmit} className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center overflow-hidden shadow-md">
                        <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#445cf5]">CPC Portal</h2>
                        <p className="text-slate-400 font-medium text-sm">Faculty &amp; Student Evaluation System</p>
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>}

                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Identification Number</label>
                        <input type="text" placeholder="Enter your ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                    </div>
                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white p-4 rounded-full font-bold hover:from-[#3249d9] hover:to-[#5457e0] shadow-md transition-all disabled:opacity-70 mt-8 text-[16px]">
                    {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Authenticating Credentials...
                    </div>
                    ) : 'Sign In to Portal'}
                </button>

                <div className="flex items-center justify-between w-full mt-4">
                    <button type="button" onClick={() => setShowForgot(true)} className="text-[#445cf5] text-sm font-bold hover:underline">
                        Forgot your password?
                    </button>
                    <button type="button" onClick={() => router.push('/register')} className="text-[#445cf5] text-sm font-bold hover:underline">
                        Create account
                    </button>
                </div>
            </form>

            {/* Forgot Modal */}
            {showForgot && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-[32px] w-full max-w-sm shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2 text-slate-800">{forgotStep === 1 ? 'Verify Your Identity' : 'Set New Password'}</h2>
                        <p className="text-sm text-slate-500 mb-6">{forgotStep === 1 ? 'Enter your ID number to verify your identity' : 'Create a new secure password for your account'}</p>
                        <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                            {forgotStep === 1 ? (
                                <input placeholder="Identification Number" className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition" onChange={e => setResetId(e.target.value)} required />
                            ) : (
                                <input type="password" placeholder="New secure password" className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition" onChange={e => setNewPassword(e.target.value)} required />
                            )}
                            <button className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white p-4 rounded-2xl font-bold hover:from-[#3249d9] hover:to-[#5457e0] transition-all shadow-md">
                                {forgotStep === 1 ? 'Verify Identity' : 'Reset Password'}
                            </button>
                            <button type="button" onClick={() => setShowForgot(false)} className="text-slate-400 text-sm font-medium hover:text-slate-600 transition">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
