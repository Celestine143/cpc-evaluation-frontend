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

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userData', JSON.stringify(data.user));

            switch (data.user.role) {
                case 'admin': router.push('/admin-dashboard'); break;
                case 'teacher': router.push('/teacher-dash-eval'); break;
                case 'student': router.push('/student-dash-eval'); break;
                default: throw new Error('Role not recognized.');
            }
        } catch (err: any) { setError(err.message); } 
        finally { setLoading(false); }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = forgotStep === 1 ? 'http://127.0.0.1:8000/api/forgot-password' : 'http://127.0.0.1:8000/api/reset-password';
            const body = forgotStep === 1 ? { id_number: resetId } : { id_number: resetId, password: newPassword };
            
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error("Action failed. Please check your ID.");
            
            if (forgotStep === 1) setForgotStep(2);
            else { alert("Password reset successfully!"); setShowForgot(false); setForgotStep(1); }
        } catch (err: any) { alert(err.message); }
    };

    return (
        <div className="min-h-screen bg-[#f0f2ff] flex items-center justify-center font-sans p-4">
            <form onSubmit={handleLoginSubmit} className="bg-white p-8 rounded-[32px] shadow-md w-full max-w-md border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#445cf5] rounded-full flex items-center justify-center overflow-hidden p-0.5 shadow-sm">
                        <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#445cf5]">CPC Portal Login</h2>
                        <p className="text-slate-400 font-medium text-xs">Evaluation System Sign-In</p>
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm mb-4 border border-red-100 font-semibold">{error}</div>}

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-1">ID Number</label>
                        <input type="text" placeholder="e.g., 2026-0042" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#445cf5] transition text-[15px]" required />
                    </div>
                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-1">Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#445cf5] transition text-[15px]" required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#445cf5] text-white p-3.5 rounded-full font-bold hover:bg-opacity-90 shadow-md transition disabled:bg-slate-300 mt-6 text-[16px]">
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <button type="button" onClick={() => setShowForgot(true)} className="w-full text-center text-[#445cf5] text-xs font-bold mt-4 hover:underline">
                    Forgot Password?
                </button>
            </form>

            {showForgot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-[32px] w-full max-w-sm shadow-xl">
                        <h2 className="text-xl font-bold mb-4">{forgotStep === 1 ? 'Verify Identity' : 'Reset Password'}</h2>
                        <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                            {forgotStep === 1 ? (
                                <input placeholder="Enter ID Number" className="border border-slate-200 p-3 rounded-xl" onChange={e => setResetId(e.target.value)} required />
                            ) : (
                                <input type="password" placeholder="New Password" className="border border-slate-200 p-3 rounded-xl" onChange={e => setNewPassword(e.target.value)} required />
                            )}
                            <button className="bg-[#445cf5] text-white p-3 rounded-xl font-bold">Continue</button>
                            <button type="button" onClick={() => setShowForgot(false)} className="text-slate-400 text-sm">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}