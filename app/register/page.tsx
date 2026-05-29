'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [course, setCourse] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [section, setSection] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [availableSections, setAvailableSections] = useState(['A', 'B', 'C', 'D']);
    const router = useRouter();

    useEffect(() => {
        if (course === 'Bachelor of Science in Hospitality Management') {
            setAvailableSections(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
        } else {
            setAvailableSections(['A', 'B', 'C', 'D']);
        }
        setSection('');
    }, [course]);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name,
                    id_number: idNumber,
                    course,
                    year_level: yearLevel,
                    section: `Section ${section}`,
                    password,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed.');

            // FIX: use data.token (not data.access_token) to match AuthController response
            localStorage.setItem('token', data.token);

            // FIX: include id_number so StudentDashboard can read it correctly
            localStorage.setItem('userData', JSON.stringify({
                id:        data.user.id,
                name:      data.user.name,
                role:      data.user.role,
                id_number: data.user.id_number,
                studentId: data.user.id_number,
                course:    data.user.course,
                yearLevel: data.user.year_level,
                year_level:data.user.year_level,
                section:   data.user.section,
            }));

            router.push('/student-dash-eval');
        } catch (err: any) {
            setError(err.message || 'Something went wrong during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2ff] flex items-center justify-center font-sans antialiased text-slate-800 p-4">
            <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-md border border-slate-100 flex flex-col">
                <div className="flex flex-col items-center gap-2 mb-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-0.5">
                        <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <h2 className="text-[#445cf5] text-2xl font-bold tracking-wide">CPC Portal Registration</h2>
                    <p className="text-slate-500 text-sm">Create your student profile account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Full Name</label>
                        <input type="text" required placeholder="e.g. Juan Dela Cruz" value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Student ID Number</label>
                        <input type="text" required placeholder="e.g. 2026-0042" value={idNumber}
                            onChange={e => setIdNumber(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Course Program</label>
                        <select required value={course} onChange={e => setCourse(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition">
                            <option value="">Select your course</option>
                            <option value="Bachelor of Science in Hospitality Management">BS in Hospitality Management (BSHM)</option>
                            <option value="Bachelor of Science in Information Technology">BS in Information Technology (BSIT)</option>
                            <option value="Bachelor of Elementary Education">Bachelor of Elementary Education (BEED)</option>
                            <option value="Bachelor of Secondary Education">Bachelor of Secondary Education (BSED)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Year Level</label>
                            <select required value={yearLevel} onChange={e => setYearLevel(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition">
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Section</label>
                            <select required value={section} onChange={e => setSection(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition">
                                <option value="">Select Section</option>
                                {availableSections.map(letter => (
                                    <option key={letter} value={letter}>Section {letter}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Account Password</label>
                        <input type="password" required placeholder="Minimum 6 characters" value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-[#445cf5] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-opacity-95 transition disabled:opacity-50 mt-2">
                        {loading ? 'Setting up session...' : 'Register & Log In'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-slate-500">
                    Already have an account?{' '}
                    <button onClick={() => router.push('/login')} className="text-[#445cf5] font-semibold underline">
                        Sign In here
                    </button>
                </div>
            </div>
        </div>
    );
}