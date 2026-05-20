'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const res = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // 1. Save critical data to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userName', data.user.name);

                // 2. Automatic Role-Based Redirection
                const role = data.user.role.toLowerCase(); // Ensure lowercase comparison

                if (role === 'admin') {
                    router.push('/admin-dashboard');
                } else if (role === 'teacher') {
                    router.push('/teacher-dash-eval');
                } else if (role === 'student') {
                    router.push('/student-dash-eval');
                } else {
                    alert("Unauthorized role. Please contact admin.");
                }
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (error) {
            alert("Connection error. Is Laravel running?");
        }
    };

    return (
        <div className="min-h-screen bg-[#e8e8ff] flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-[20px] overflow-hidden shadow-xl max-w-[1100px] w-full flex flex-col md:flex-row">
                
                {/* Left Panel */}
                <div className="bg-[#4453f5] text-white p-12 flex-1 flex flex-col justify-start items-center md:items-start">
                    <div className="flex items-center justify-center gap-4 mb-0 md:mb-12">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                            <img src="https://simplecpc.wordpress.com/wp-content/uploads/2015/02/me.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center hidden md:block">
                            <h2 className="font-black text-2xl uppercase leading-tight">Cordova Public College</h2>
                            <h6 className="font-semibold text-lg">Gabi, Cordova, Cebu</h6>
                        </div>
                    </div>
                    <div className="mt-16 hidden md:block">
                        <h3 className="font-black text-5xl mb-4">Welcome!</h3>
                        <p className="text-xl">Please fill out the Teacher Evaluation Form</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="p-12 flex-1">
                    <h2 className="text-3xl font-bold text-center mb-8 text-[#4453f5]">Sign In</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[#4453f5] font-semibold text-lg mb-2">Email</label>
                            <input 
                                type="email" 
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]"
                                placeholder="Input your email here...."
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-[#4453f5] font-semibold text-lg mb-2">Password</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-[#e8e8ff] border border-[#86b7fe] rounded-full px-6 py-4 outline-none focus:ring-2 ring-[#4453f5]"
                                placeholder="••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-[55px] text-[#4453f5] hover:text-[#3543d6] transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
            {showPassword ? (
                                    /* Simple Eye Off Icon */
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    /* Simple Eye Icon */
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}                    
                            </button>
                            <div className="text-right mt-2">
                                <a href="/forgot-password" className="text-[#4453f5] hover:underline">Forgot Password?</a>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#4453f5] text-white font-bold py-4 rounded-full text-xl hover:bg-[#3543d6] transition">
                            Sign In
                        </button>

                        <p className="text-center mt-6 text-lg">
                            Don't have an account? <a href="/register" className="text-[#4453f5] font-bold hover:underline">Sign Up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}