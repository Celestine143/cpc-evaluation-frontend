'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Protect the route and load user data
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedData = localStorage.getItem('userData');
        
        if (!token) {
            router.push('/login');
        } else {
            setUser(storedData ? JSON.parse(storedData) : { name: 'Teacher' });
        }
    }, [router]);

    // Functional Logout
    const handleLogOut = () => {
        localStorage.clear();
        router.push('/login');
    };

    const navItems = [
        { name: 'DASHBOARD', icon: '📊' },
        { name: 'Manage Teachers', icon: '👥' },
        { name: 'View Evaluations', icon: '📋' },
        { name: 'History of Co-teacher', icon: '🕒' },
    ];

    return (
        <div className="min-h-screen bg-[#f0f2ff] flex text-slate-800 font-sans">
            {/* Side Panel */}
            <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#445cf5] rounded-xl flex items-center justify-center text-white font-bold">CPC</div>
                    <div>
                        <h1 className="font-bold text-[#445cf5]">CPC Portal</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Faculty Access</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-bold text-sm transition ${
                                activeTab === item.name 
                                ? 'bg-[#445cf5] text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <span>{item.icon}</span> {item.name}
                        </button>
                    ))}
                </nav>

                <button 
                    onClick={handleLogOut}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl font-bold text-red-500 text-sm hover:bg-red-50 transition"
                >
                    <span>🚪</span> Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Mabuhay, {user?.name.split(' ')[0]}!</h2>
                        <p className="text-slate-400 text-sm">Welcome back to your evaluation workstation.</p>
                    </div>
                    <div className="bg-white p-2 px-4 rounded-full shadow-sm border flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold">{user?.name}</p>
                            <p className="text-[10px] text-[#445cf5] font-bold uppercase">Faculty Profile</p>
                        </div>
                        <div className="w-10 h-10 bg-[#e8e8ff] rounded-full flex items-center justify-center text-[#445cf5] font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Rating Average</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-[#445cf5]">4.8</span>
                            <span className="text-xl font-bold text-slate-300">/ 5.0</span>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-6 border-b pb-4">Recent Student Feedback</h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                        <span>Anonymous Student</span>
                                        <span className="text-yellow-500">★★★★★</span>
                                    </div>
                                    <p className="text-sm text-slate-600 italic">"The instructor is very engaging and explains complex topics clearly."</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}