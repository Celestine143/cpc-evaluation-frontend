'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState<string>('');
    const [idNumber, setIdNumber] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [yearLevel, setYearLevel] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const router = useRouter();

    // State to hold the dynamic sections array
    const [availableSections, setAvailableSections] = useState<string[]>(['A', 'B', 'C', 'D']);

    // Watch the selected course to update allowed section dropdown choices dynamically
    useEffect(() => {
        if (course === 'Bachelor of Science in Hospitality Management') {
            // BSHM gets Sections A through I
            setAvailableSections(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
        } else {
            // Default baseline configuration for BSIT, BSED, and BEED
            setAvailableSections(['A', 'B', 'C', 'D']);
        }

        // Reset the chosen section value if it falls out of bounds when shifting course tracks
        setSection('');
    }, [course]);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    id_number: idNumber,
                    course: course,
                    year_level: yearLevel,
                    section: `Section ${section}`, // Submits formatted string e.g., "Section E"
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            // 1. Save credentials to localStorage for automatic login session persistence
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userName', data.user.name);
            
            // Store dynamic fields so the profile displays data instantly without loading blank
            localStorage.setItem('userData', JSON.stringify({
                name: data.user.name,
                role: data.user.role,
                studentId: data.user.id_number,
                course: data.user.course,
                yearLevel: data.user.year_level,
                section: data.user.section
            }));

            // 2. Alert success and route directly to the active student dashboard
            alert('Registration successful! Redirecting to your dashboard...'); 
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
                
                {/* Header Branding */}
                <div className="flex flex-col items-center gap-2 mb-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-0.5">
                        <img 
                            src="/images/CPC.jpg" 
                            alt="CPC Logo" 
                            className="w-full h-full object-contain rounded-full"
                        />
                    </div>
                    <h2 className="text-[#445cf5] text-2xl font-bold tracking-wide">CPC Portal Registration</h2>
                    <p className="text-slate-500 text-sm">Create your student profile account</p>
                </div>

                {/* Error Banner Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 font-medium">
                        {error}
                    </div>
                )}

                {/* Registration Data Form */}
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    
                    {/* Full Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition duration-150 text-slate-800"
                        />
                    </div>

                    {/* Student ID Number */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Student ID Number</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. 2026-0042"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition duration-150 text-slate-800"
                        />
                    </div>

                    {/* Course Program Dropdown Selection */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Course Program</label>
                        <select 
                            required
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition duration-150 text-slate-800"
                        >
                            <option value="">Select your course</option>
                            <option value="Bachelor of Science in Hospitality Management">BS in Hospitality Management (BSHM)</option>
                            <option value="Bachelor of Science in Information Technology">BS in Information Technology (BSIT)</option>
                            <option value="Bachelor of Elementary Education">Bachelor of Elementary Education (BEED)</option>
                            <option value="Bachelor of Secondary Education">Bachelor of Secondary Education (BSED)</option>
                        </select>
                    </div>

                    {/* Year Level & Dynamic Section Selection Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Year Level</label>
                            <select 
                                required
                                value={yearLevel}
                                onChange={(e) => setYearLevel(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition duration-150 text-slate-800"
                            >
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>

                        {/* Dynamic Section Dropdown Element */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Section</label>
                            <select 
                                required
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition duration-150 text-slate-800"
                            >
                                <option value="">Select Section</option>
                                {availableSections.map((letter) => (
                                    <option key={letter} value={letter}>
                                        Section {letter}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#445cf5] font-bold text-xs uppercase tracking-wider">Account Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#445cf5] transition duration-150 text-slate-800"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#445cf5] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-opacity-95 active:scale-[0.99] transition duration-150 disabled:opacity-50 mt-2 text-center"
                    >
                        {loading ? 'Setting up session...' : 'Register & Log In'}
                    </button>
                </form>

                {/* Return Link */}
                <div className="text-center mt-6 text-sm text-slate-500">
                    Already have an account?{' '}
                    <button 
                        onClick={() => router.push('/login')}
                        className="text-[#445cf5] font-semibold underline hover:text-opacity-80"
                    >
                        Sign In here
                    </button>
                </div>

            </div>
        </div>
    );
}