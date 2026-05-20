'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [teacherName, setTeacherName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');

        if (!token || role?.toLowerCase() !== 'teacher') {
            router.push('/login');
        } else {
            setTeacherName(name || 'Teacher');
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#e8e8ff] text-[#4453f5] font-bold">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#e8e8ff] p-6 sm:p-10 font-sans text-black">
            <div className="max-w-[1100px] mx-auto">
                <div className="bg-[#4453f5] rounded-[40px] p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Hello, Prof. {teacherName}!</h1>
                        <p className="text-lg opacity-80 font-medium">Your current evaluation period performance.</p>
                    </div>
                    <button onClick={handleLogout} className="mt-6 md:mt-0 bg-white text-[#4453f5] px-8 py-3 rounded-full font-black hover:bg-opacity-90 transition">
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Performance Card */}
                    <div className="bg-white p-8 rounded-[40px] shadow-lg">
                        <h3 className="text-[#4453f5] font-bold text-xl mb-6">Average Rating</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-7xl font-black text-[#4453f5]">4.8</span>
                            <span className="text-2xl font-bold text-gray-400 mb-2">/ 5.0</span>
                        </div>
                        <p className="mt-4 text-green-500 font-bold">↑ 0.2 from last semester</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white p-6 rounded-[30px] shadow-md flex justify-between items-center">
                            <span className="font-bold">Students Evaluated</span>
                            <span className="bg-[#e8e8ff] text-[#4453f5] px-4 py-1 rounded-full font-black">142</span>
                        </div>
                        <div className="bg-white p-6 rounded-[30px] shadow-md flex justify-between items-center">
                            <span className="font-bold">Peer Evaluation</span>
                            <span className="bg-[#e8e8ff] text-[#4453f5] px-4 py-1 rounded-full font-black">4.5</span>
                        </div>
                        <div className="bg-white p-6 rounded-[30px] shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                            <span className="font-bold text-[#4453f5]">View Detailed Feedback</span>
                            <span className="text-xl">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}