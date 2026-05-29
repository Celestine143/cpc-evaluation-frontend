'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const stored = localStorage.getItem('userData');
        if (token && stored) {
            try {
                const { role } = JSON.parse(stored);
                if (role === 'admin') router.push('/admin-dashboard');
                else if (role === 'teacher') router.push('/teacher-dash-eval');
                else if (role === 'student') router.push('/student-dash-eval');
            } catch {}
        }
    }, [router]);

    // FIX: use id_number throughout — system has no email column
    const [idNumber, setIdNumber] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');

    // FIX: Step 1 actually calls the API now
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_number: idNumber }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'ID number not found.');
            }
            setIsVerified(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        try {
            const res = await fetch('http://127.0.0.1:8000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_number:    idNumber,
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Reset failed.');
            alert('Password updated successfully!');
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const EyeIcon = ({ visible }: { visible: boolean }) => (
        visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    );

    return (
        <div className="min-h-screen bg-[#e8e8ff] flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-[500px] w-full p-10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#4453f5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#4453f5]">
                        {isVerified ? 'New Password' : 'Verification'}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 font-medium">
                        {error}
                    </div>
                )}

                {!isVerified ? (
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* FIX: ID Number field instead of Email */}
                        <div>
                            <label className="block text-[#4453f5] font-bold mb-2 ml-1 text-sm">ID Number</label>
                            <input type="text" required placeholder="e.g. 2026-0042"
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]"
                                onChange={e => setIdNumber(e.target.value)} />
                        </div>
                        <div className="relative">
                            <label className="block text-[#4453f5] font-bold mb-2 ml-1 text-sm">Current Password</label>
                            <input type={showOld ? 'text' : 'password'} required placeholder="••••••••"
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]"
                                onChange={e => setOldPassword(e.target.value)} />
                            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-5 bottom-4 text-[#4453f5]">
                                <EyeIcon visible={showOld} />
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-[#4453f5] text-white font-black py-4 rounded-full text-lg hover:bg-[#3543d6] transition shadow-md">
                            Verify Identity
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="relative">
                            <label className="block text-[#4453f5] font-bold mb-2 ml-1 text-sm">New Password</label>
                            <input type={showNew ? 'text' : 'password'} required placeholder="••••••••"
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]"
                                onChange={e => setNewPassword(e.target.value)} />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-5 bottom-4 text-[#4453f5]">
                                <EyeIcon visible={showNew} />
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-[#4453f5] font-bold mb-2 ml-1 text-sm">Confirm Password</label>
                            <input type={showConfirm ? 'text' : 'password'} required placeholder="••••••••"
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]"
                                onChange={e => setConfirmPassword(e.target.value)} />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 bottom-4 text-[#4453f5]">
                                <EyeIcon visible={showConfirm} />
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-[#4453f5] text-white font-black py-4 rounded-full text-lg hover:bg-[#3543d6] transition shadow-md">
                            Update Password
                        </button>
                        <button type="button" onClick={() => { setIsVerified(false); setError(''); }}
                            className="w-full text-gray-500 font-semibold mt-2 hover:underline">
                            ← Go Back
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-[#4453f5] font-bold hover:underline flex items-center justify-center gap-2">
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}