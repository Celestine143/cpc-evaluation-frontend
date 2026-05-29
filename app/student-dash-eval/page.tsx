'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  role: string;
  studentId: string;
  id_number: string;
  course: string;
  yearLevel: string;
  section: string;
}

interface Instructor {
  id: number;
  id_number: string;
  name: string;
  course: string;
}

interface Evaluation {
  id: number;
  teacher_id: number;
  evaluator_id: string;
  rating: number;
  comments: string;
  created_at: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedData = localStorage.getItem('userData');

    if (!token || !storedData) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedData);
      setUser({
        name: parsedUser.name,
        role: parsedUser.role,
        studentId: parsedUser.studentId || parsedUser.id_number || 'N/A',
        id_number: parsedUser.id_number || parsedUser.studentId || 'N/A',
        course: parsedUser.course || 'N/A',
        yearLevel: parsedUser.yearLevel || parsedUser.year_level || 'N/A',
        section: parsedUser.section || 'N/A'
      });

      // Fetch instructors
      fetch(`http://127.0.0.1:8000/api/teachers`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        setAllInstructors(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching instructors: ", err));

      // Fetch evaluations submitted BY this student
      fetch(`http://127.0.0.1:8000/api/my-evaluations`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        setEvaluations(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching evaluations: ", err))
      .finally(() => setLoading(false));

    } catch (e) { 
      console.error("Error: ", e);
      router.replace('/login'); 
    }
  }, [router]);

  // Helper function to safely normalize abbreviations and full titles
  const normalizeCourse = (courseStr: string) => {
    const clean = (courseStr || '').toLowerCase().replace(/[\s\-_]/g, '');
    if (clean === 'bsit' || clean === 'bachelorofscienceininformationtechnology') return 'bsit';
    if (clean === 'hm' || clean === 'hospitalitymanagement') return 'hm';
    if (clean === 'bsed' || clean === 'bachelorofsecondaryeducation') return 'bsed';
    if (clean === 'beed' || clean === 'bachelorofelementaryeducation') return 'beed';
    return clean;
  };

  // Filter instructors by department and hidden status
  const filteredInstructors = useMemo(() => {
    if (!user || !user.course) return [];
    
    const normalizedStudentCourse = normalizeCourse(user.course);

    return allInstructors.filter((inst: any) => {
      const normalizedInstructorCourse = normalizeCourse(inst.course);
      const isMatch = normalizedStudentCourse === normalizedInstructorCourse;
      return isMatch && !inst.is_hidden;
    });
  }, [allInstructors, user]);

  // Map evaluations by teacher_id for quick lookup
  const evaluationMap = useMemo(() => {
    const map = new Map<number, Evaluation>();
    evaluations.forEach(evaluation => {
      map.set(evaluation.teacher_id, evaluation);
    });
    return map;
  }, [evaluations]);

  // Get evaluation for a specific instructor
  const getInstructorEvaluation = (instructorId: number) => {
    return evaluationMap.get(instructorId);
  };

  // Render star rating display
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center font-bold text-[#445cf5]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800 font-sans antialiased">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center overflow-hidden shadow-md">
            <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#445cf5] tracking-wide">CPC Evaluation Portal</h1>
            <p className="text-xs text-slate-500 font-medium">Student Dashboard</p>
          </div>
        </div>
        <button onClick={handleLogOut} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition">
          Sign Out
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Student Profile Card */}
        <div className="md:col-span-1 bg-white border border-slate-100 shadow-md rounded-[32px] p-6 flex flex-col items-center text-center">
          <div className="w-44 h-44 bg-[#e8e8ff] mb-4 rounded-2xl flex items-center justify-center text-[#445cf5] text-5xl">👤</div>
          <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
          <p className="text-xs text-[#445cf5] uppercase font-bold tracking-wider mt-1 px-3 py-1 bg-[#eeeeff] rounded-full">{user?.role}</p>
          <div className="w-full border-t border-slate-100 my-4"></div>
          <div className="w-full flex flex-col gap-3 text-left">
            <div><span className="text-xs font-bold text-slate-400 uppercase">Student ID</span><p className="text-sm font-semibold">{user?.studentId}</p></div>
            <div><span className="text-xs font-bold text-slate-400 uppercase">Program</span><p className="text-sm font-semibold">{user?.course}</p></div>
            <div><span className="text-xs font-bold text-slate-400 uppercase">Year &amp; Section</span><p className="text-sm font-semibold">{user?.yearLevel} - {user?.section}</p></div>
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-[32px] p-6 text-white shadow-md">
            <h2 className="text-2xl font-bold">Welcome, {user?.name.split(' ')[0]}!</h2>
            <p className="text-white/80 text-sm">Please evaluate your instructors for the current semester</p>
          </div>

          {/* Instructors List with Evaluation Status */}
          <div className="bg-white border border-slate-100 shadow-md rounded-[32px] p-6 flex flex-col gap-4">
            <h4 className="font-bold text-lg text-slate-800 border-b pb-3">
              Department Faculty ({user?.course})
              <span className="text-sm text-slate-500 font-normal ml-2">
                {filteredInstructors.length} instructor{filteredInstructors.length !== 1 ? 's' : ''}
              </span>
            </h4>

            {filteredInstructors.length > 0 ? (
              filteredInstructors.map((inst) => {
                const evaluation = getInstructorEvaluation(inst.id);
                const isEvaluated = !!evaluation;

                return (
                  <div 
                    key={inst.id} 
                    className={`flex items-center justify-between p-4 border rounded-2xl transition ${
                      isEvaluated 
                        ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                        : 'border-slate-100 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-800 text-sm">{inst.name}</h5>
                      <p className="text-xs text-slate-500 font-medium">ID: {inst.id_number}</p>
                      
                      {isEvaluated && (
                        <div className="mt-2 pt-2 border-t border-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-green-600 uppercase">Your Rating:</span>
                            <div className="flex gap-1">
                              {renderStars(Math.round(evaluation.rating))}
                            </div>
                            <span className="text-sm font-bold text-green-600">{evaluation.rating}/5</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Evaluated on {new Date(evaluation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
    onClick={() => router.push(`/evaluation/student?teacher_id=${inst.id}&name=${encodeURIComponent(inst.name)}`)}
    className={`text-white text-sm px-5 py-2 rounded-xl font-semibold transition whitespace-nowrap ml-4 ${
      isEvaluated
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-gradient-to-r from-[#445cf5] to-[#6366f1] hover:from-[#3249d9] hover:to-[#5457e0]'
    }`}
  >
    {isEvaluated ? 'Re-evaluate' : 'Start Evaluation'}
  </button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-500 py-8 text-sm">
                No instructors found for your department
              </p>
            )}

            {/* Summary Section */}
            {filteredInstructors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">
                    Evaluations Completed: <span className="font-bold text-[#445cf5]">{evaluations.length}</span> / {filteredInstructors.length}
                  </span>
                  {evaluations.length === filteredInstructors.length && (
                    <span className="text-green-600 font-bold text-xs uppercase">✓ All Complete</span>
                  )}
                </div>
                {evaluations.length < filteredInstructors.length && (
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] h-full transition-all"
                      style={{ width: `${(evaluations.length / filteredInstructors.length) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
