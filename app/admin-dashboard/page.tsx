'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        if (!token || role?.toLowerCase() !== 'admin') {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#e8e8ff] text-[#4453f5] font-bold">Loading Admin Panel...</div>;

    return (
        <div className="flex min-h-screen bg-[#e8e8ff] font-sans text-black">
            {/* Sidebar */}
            <div className="w-64 bg-[#4453f5] text-white p-6 flex flex-col">
                <h2 className="font-black text-xl mb-10 border-b border-white/20 pb-4">CPC ADMIN</h2>
                <nav className="space-y-4 flex-1">
                    <div className="bg-white/20 p-3 rounded-xl cursor-pointer font-bold">Dashboard</div>
                    <div className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition">Manage Teachers</div>
                    <div className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition">Manage Students</div>
                    <div className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition">Evaluation Reports</div>
                </nav>
                <button onClick={handleLogout} className="mt-auto bg-red-500 p-3 rounded-xl font-bold hover:bg-red-600 transition">Logout</button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-black text-[#4453f5]">System Overview</h1>
                    <div className="bg-white px-6 py-2 rounded-full shadow-sm font-bold border border-[#86b7fe]">Admin Session Active</div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stats Cards */}
                    <div className="bg-white p-8 rounded-[30px] shadow-sm border-l-8 border-blue-500">
                        <h4 className="text-gray-500 font-bold uppercase text-xs mb-2">Total Teachers</h4>
                        <p className="text-4xl font-black text-[#4453f5]">24</p>
                    </div>
                    <div className="bg-white p-8 rounded-[30px] shadow-sm border-l-8 border-green-500">
                        <h4 className="text-gray-500 font-bold uppercase text-xs mb-2">Evaluations Done</h4>
                        <p className="text-4xl font-black text-[#4453f5]">1,204</p>
                    </div>
                    <div className="bg-white p-8 rounded-[30px] shadow-sm border-l-8 border-orange-500">
                        <h4 className="text-gray-500 font-bold uppercase text-xs mb-2">Pending Students</h4>
                        <p className="text-4xl font-black text-[#4453f5]">156</p>
                    </div>
                </div>

                <div className="mt-10 bg-white p-8 rounded-[30px] shadow-sm min-h-[300px]">
                    <h3 className="text-xl font-bold mb-4 text-[#4453f5]">Recent Activities</h3>
                    <p className="text-gray-400">All systems are operational. No new issues reported.</p>
                </div>
            </div>
        </div>
    );
}