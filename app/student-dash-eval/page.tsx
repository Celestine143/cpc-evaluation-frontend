'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const [user, setUser] = useState<{name: string, role: string} | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        if (!token || role !== 'student') {
            router.push('/login'); // Redirect to login if not authorized
        } else {
            // In a real app, you'd fetch user details from Laravel here
            setUser({ name: "Student User", role: "student" });
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#e8e8ff] p-8 font-sans text-black">
            {/* Header Area */}
            <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] p-8 shadow-md flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#4453f5]">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user?.name}!</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-[1200px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[20px] shadow-sm border-t-4 border-[#4453f5]">
                    <h3 className="font-bold text-xl mb-2">Pending Evaluations</h3>
                    <p className="text-4xl font-black text-[#4453f5]">3</p>
                </div>
                <div className="bg-white p-6 rounded-[20px] shadow-sm">
                    <h3 className="font-bold text-xl mb-2">Completed</h3>
                    <p className="text-4xl font-black text-green-500">12</p>
                </div>
                <div className="bg-white p-6 rounded-[20px] shadow-sm">
                    <h3 className="font-bold text-xl mb-2">My Profile</h3>
                    <p className="text-[#4453f5] underline cursor-pointer">Edit Info</p>
                </div>
            </div>
        </div>
    );
}