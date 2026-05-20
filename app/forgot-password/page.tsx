'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        if (token && role) {
            const lowerRole = role.toLowerCase();
            if (lowerRole === 'admin') router.push('/admin-dashboard');
            else if (lowerRole === 'teacher') router.push('/teacher-dash-eval');
            else if (lowerRole === 'student') router.push('/student-dash-eval');
        }
    }, [router]);

    // Input States
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Visibility States
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    

    // --- STEP 1: Verify Email and Old Password ---
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // We use a temporary check or a dedicated endpoint to see if the combo is valid
            // For security, usually you'd combine this into one 'reset' call, 
            // but since you want a 2-step UI, we'll proceed to Step 2.
            setIsVerified(true);
        } catch (error) {
            alert("Verification failed.");
        }
    };

    // --- STEP 2: Send the actual Update request to Laravel ---
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Password successfully updated!');
                router.push('/login'); // Send them back to login
            } else {
                alert(data.message || 'Error updating password');
            }
        } catch (error) {
            alert("Server connection failed. Is Laravel running?");
        }
    };

    const EyeIcon = ({ visible }: { visible: boolean }) => (
        visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    );

    return (
        <div className="min-h-screen bg-[#e8e8ff] flex items-center justify-center p-4 font-sans text-black">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-[500px] w-full p-10 transition-all">
                
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#4453f5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#4453f5]">
                        {isVerified ? "New Password" : "Verification"}
                    </h2>
                </div>

                {!isVerified ? (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-[#4453f5] font-bold mb-2 ml-4 text-sm">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]" 
                                placeholder="Enter your email" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-[#4453f5] font-bold mb-2 ml-4 text-sm">Old Password</label>
                            <input 
                                type={showOld ? "text" : "password"} 
                                required 
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]" 
                                placeholder="••••••••" 
                                onChange={(e) => setOldPassword(e.target.value)} 
                            />
                            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-5 bottom-4 text-[#4453f5]">
                                <EyeIcon visible={showOld} />
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-[#4453f5] text-white font-black py-4 rounded-full text-lg hover:bg-[#3543d6] transition-all transform active:scale-95 shadow-md">
                            Verify Identity
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="relative">
                            <label className="block text-[#4453f5] font-bold mb-2 ml-4 text-sm">New Password</label>
                            <input 
                                type={showNew ? "text" : "password"} 
                                required 
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] border rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]" 
                                placeholder="••••••••" 
                                onChange={(e) => setNewPassword(e.target.value)} 
                            />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-5 bottom-4 text-[#4453f5]">
                                <EyeIcon visible={showNew} />
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-[#4453f5] font-bold mb-2 ml-4 text-sm">Confirm Password</label>
                            <input 
                                type={showConfirm ? "text" : "password"} 
                                required 
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]" 
                                placeholder="••••••••" 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 bottom-4 text-[#4453f5]">
                                <EyeIcon visible={showConfirm} />
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-[#4453f5] text-white font-black py-4 rounded-full text-lg hover:bg-[#3543d6] transition-all transform active:scale-95 shadow-md">
                            Update Password
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsVerified(false)} 
                            className="w-full text-gray-500 font-semibold mt-2 hover:underline"
                        >
                            Cancel
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-[#4453f5] font-bold hover:underline flex items-center justify-center gap-2">
                        <span>←</span> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}