'use client';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#e8e8ff] flex items-center justify-center p-4 sm:p-6 font-sans text-black relative overflow-hidden">
            
            {/* Background Blur Decoration */}
            <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-[#4453f5] rounded-full blur-[80px] md:blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-[#4453f5] rounded-full blur-[80px] md:blur-[120px] opacity-20 translate-x-1/2 translate-y-1/2"></div>
            
            {/* Main Card Container */}
            <div className="max-w-[1000px] w-full bg-white rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white z-10">
                
                {/* Left/Top Visual Side */}
                <div className="bg-[#4453f5] md:w-5/12 p-8 md:p-12 flex flex-col items-center justify-center text-white text-center">
                    <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center p-1 mb-6 shadow-2xl border-4 border-white/20 transform transition-transform hover:scale-105">
    <img 
                            src="https://simplecpc.wordpress.com/wp-content/uploads/2015/02/me.png" 
                           alt="CPC Logo" 
        className="w-full h-full rounded-full object-cover"/>
</div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight">
                        Cordova Public College
                    </h1>
                    <div className="w-12 h-1 bg-white/30 my-4 rounded-full mx-auto"></div>
                    <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">
                        Academic Excellence & <br className="hidden md:block" /> Community Service
                    </p>
                </div>

                {/* Right/Bottom Selection Side */}
                <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-8 md:mb-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#4453f5] mb-4 tracking-tight">
                            Teacher Evaluation
                        </h2>
                        <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
                            Welcome back, CPCians! Access your dashboard to manage or participate in the evaluation process.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <Link 
                            href="/login" 
                            className="w-full bg-[#4453f5] text-white text-center font-bold py-4 md:py-5 rounded-2xl text-lg md:text-xl hover:bg-[#3543d6] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200"
                        >
                            Sign In
                        </Link>
                        
                        <div className="flex items-center gap-4 py-2">
                            <hr className="flex-1 border-gray-100" />
                            <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">Account Required</span>
                            <hr className="flex-1 border-gray-100" />
                        </div>

                        <Link 
                            href="/register" 
                            className="w-full bg-white text-[#4453f5] border-2 border-[#e8e8ff] text-center font-bold py-4 md:py-5 rounded-2xl text-lg md:text-xl hover:border-[#4453f5] hover:bg-[#f8f9ff] transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Create Student Account
                        </Link>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-10 pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
                        <p>© 2026 CPC Portal</p>
                      
                    </div>
                </div>
            </div>
        </div>
    );
}