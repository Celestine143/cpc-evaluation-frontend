'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
    name: string;
    role: string;
    studentId: string;
    course: string;
    yearLevel: string;
    section: string;
    profile_photo_url?: string;
}

interface Instructor {
    id: number;
    name: string;
    subject: string;
    course: string;
}

export default function StudentDashboard() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedData = localStorage.getItem('userData');

        if (!token || !storedData) {
            router.push('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(storedData);
            setUser(parsedUser);

            // Fetch dynamic instructor list filtered by the backend
            fetch(`http://127.0.0.1:8000/api/instructors`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                setInstructors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch instructors:", err);
                setLoading(false);
            });
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    const handleLogOut = () => {
        localStorage.clear();
        router.push('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-[#f0f2ff] flex items-center justify-center font-bold text-[#445cf5]">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f0f2ff] text-slate-800 font-sans antialiased">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#445cf5] rounded-full flex items-center justify-center text-white font-bold">CPC</div>
                    <div>
                        <h1 className="text-xl font-bold text-[#445cf5] tracking-wide">CPC Evaluation Portal</h1>
                        <p className="text-xs text-slate-400 font-medium">Student Dashboard</p>
                    </div>
                </div>
                <button onClick={handleLogOut} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition">
                    Sign Out
                </button>
            </nav>

            <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white border border-slate-100 shadow-md rounded-[32px] p-6 flex flex-col items-center text-center">
                    <div className="w-44 h-44 bg-[#e8e8ff] border border-slate-200 shadow-inner mb-4 rounded-2xl flex items-center justify-center">
                        <svg className="w-20 h-20 text-[#445cf5]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
                    <p className="text-xs text-[#445cf5] uppercase font-bold tracking-wider mt-1 px-3 py-1 bg-[#eeeeff] rounded-full">{user?.role}</p>
                    <div className="w-full border-t border-slate-100 my-4"></div>
                    <div className="w-full flex flex-col gap-3 text-left">
                        <div><span className="text-xs font-bold text-slate-400 uppercase">Student ID</span><p className="text-sm font-semibold">{user?.studentId}</p></div>
                        <div><span className="text-xs font-bold text-slate-400 uppercase">Program</span><p className="text-sm font-semibold">{user?.course}</p></div>
                        <div className="grid grid-cols-2 gap-2">
                            <div><span className="text-xs font-bold text-slate-400 uppercase">Year</span><p className="text-sm font-semibold">{user?.yearLevel}</p></div>
                            <div><span className="text-xs font-bold text-slate-400 uppercase">Section</span><p className="text-sm font-semibold">{user?.section}</p></div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-[32px] p-6 text-white shadow-md">
                        <h2 className="text-2xl font-bold">Mabuhay, {user?.name.split(' ')[0]}!</h2>
                        <p className="text-white/80 text-sm">Please evaluate your instructors for the current semester.</p>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-md rounded-[32px] p-6 flex flex-col gap-4">
                        <h4 className="font-bold text-lg text-slate-800 border-b pb-3">Department Faculty ({user?.course})</h4>
                        {instructors.length > 0 ? instructors.map((inst) => (
                            <div key={inst.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#445cf5]/10 text-[#445cf5] rounded-xl flex items-center justify-center font-bold">
                                        {inst.subject.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm">{inst.subject}</h5>
                                        <p className="text-xs text-slate-400 font-medium">Instructor: {inst.name}</p>
                                    </div>
                                </div>
                                <button className="bg-[#445cf5] text-white text-sm px-5 py-2 rounded-xl hover:bg-opacity-90">Start</button>
                            </div>
                        )) : <p className="text-center text-slate-400 py-4">No instructors found for your department.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
}