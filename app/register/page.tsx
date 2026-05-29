'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [course, setCourse] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [section, setSection] = useState('');
    const [subject, setSubject] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const requestBody: any = {
                name,
                id_number: idNumber,
                password,
                role,
                course,
            };

            if (role === 'student') {
                requestBody.year_level = yearLevel;
                requestBody.section = section;
            } else if (role === 'teacher') {
                requestBody.subject = subject;
            }

            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed.');

            alert('Account created successfully! Please sign in.');
            router.push('/login');
        } catch (err: any) { 
            setError(err.message); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center font-sans p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center overflow-hidden shadow-md">
                        <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#445cf5]">Create Account</h2>
                        <p className="text-slate-400 font-medium text-sm">Join the CPC Evaluation System</p>
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
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Full Name</label>
                        <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                    </div>

                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Identification Number</label>
                        <input type="text" placeholder="Enter your ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                    </div>

                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Password</label>
                        <input type="password" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                    </div>

                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Role</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 transition hover:bg-slate-100">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={role === 'student'}
                                    onChange={() => setRole('student')}
                                    className="text-[#445cf5] focus:ring-[#445cf5]"
                                />
                                Student
                            </label>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 transition hover:bg-slate-100">
                                <input
                                    type="radio"
                                    name="role"
                                    value="teacher"
                                    checked={role === 'teacher'}
                                    onChange={() => setRole('teacher')}
                                    className="text-[#445cf5] focus:ring-[#445cf5]"
                                />
                                Teacher
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Program / Department</label>
                        <select 
                            value={course} 
                            onChange={(e) => setCourse(e.target.value)} 
                            className="w-full border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition"
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="BSIT">BSIT - Bachelor of Science in Information Technology</option>
                            <option value="HM">HM - Hospitality Management</option>
                            <option value="BSED">BSED - Bachelor of Secondary Education</option>
                            <option value="BEED">BEED - Bachelor of Elementary Education</option>
                        </select>
                    </div>

                    {role === 'student' && (
                        <>
                            <div>
                                <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Year Level</label>
                                <input type="text" placeholder="e.g., 1st Year" value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                            </div>

                            <div>
                                <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Section</label>
                                <input type="text" placeholder="e.g., A" value={section} onChange={(e) => setSection(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                            </div>
                        </>
                    )}

                    {role === 'teacher' && (
                        <div>
                            <label className="block text-slate-600 font-bold text-xs uppercase tracking-wide mb-2">Subject Taught</label>
                            <input type="text" placeholder="e.g., Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-[#445cf5] transition text-[16px]" required />
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white p-4 rounded-full font-bold hover:from-[#3249d9] hover:to-[#5457e0] shadow-md transition-all disabled:opacity-70 mt-8 text-[16px]">
                    {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                    </div>
                    ) : 'Create Account'}
                </button>

                <button type="button" onClick={() => router.push('/login')} className="w-full text-center text-slate-500 text-sm font-bold mt-4 hover:underline">
                    Already have an account? Sign in
                </button>
            </form>
        </div>
    );
}
