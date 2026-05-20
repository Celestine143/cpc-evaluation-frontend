'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirm_password, 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Account created successfully');
        router.push('/login');
      } else {
        alert(data.message || 'Error: Cannot create account');
      }
    } catch (error) {
      alert("Server connection failed. Make sure Laravel is running!");
    }
  };

  return (
    <div className="min-h-screen bg-[#e8e8ff] flex items-center justify-center p-4 font-sans text-black">
      <div className="max-w-[550px] w-full bg-white rounded-[40px] shadow-xl p-10 sm:p-14 text-center">
        
        {/* Title matches the size and boldness of "Verification" and "Sign In" */}
        <h2 className="text-[32px] font-bold text-[#4453f5] mb-10">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="text-left space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-[#4453f5] text-lg font-semibold ml-4 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-full px-6 py-4 bg-[#e8e8ff] border border-[#86b7fe] outline-none focus:ring-2 ring-[#4453f5] transition text-base placeholder-gray-500"
              placeholder="Input your fullname here..."
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[#4453f5] text-lg font-semibold ml-4 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-full px-6 py-4 bg-[#e8e8ff] border border-[#86b7fe] outline-none focus:ring-2 ring-[#4453f5] transition text-base placeholder-gray-500"
              placeholder="Input your email address..."
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-[#4453f5] text-lg font-semibold ml-4 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-full px-6 py-4 bg-[#e8e8ff] border border-[#86b7fe] outline-none focus:ring-2 ring-[#4453f5] transition text-base placeholder-gray-500"
                placeholder="••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#4453f5]"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-[#4453f5] text-lg font-semibold ml-4 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                className="w-full rounded-full px-6 py-4 bg-[#e8e8ff] border border-[#86b7fe] outline-none focus:ring-2 ring-[#4453f5] transition text-base placeholder-gray-500"
                placeholder="••••••"
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#4453f5]"
              >
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-[#4453f5] text-white font-bold py-4 rounded-full text-xl hover:bg-[#3543d6] transition-all transform active:scale-95 shadow-lg">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-lg">
          Already have an account? <Link href="/login" className="text-[#4453f5] font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}