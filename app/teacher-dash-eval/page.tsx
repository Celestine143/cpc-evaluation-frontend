'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [filter, setFilter] = useState<'student' | 'teacher' | 'all'>('all');
  const [user, setUser] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [myEvaluations, setMyEvaluations] = useState<any[]>([]);
  const [teachersMap, setTeachersMap] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedData = localStorage.getItem('userData');

    if (!token) {
      router.push('/login');
      return;
    }

    if (storedData) {
      try {
        const parsedUser = JSON.parse(storedData);
        setUser(parsedUser);

        // Fetch evaluations received (for "View Evaluations")
        fetch('http://127.0.0.1:8000/api/my-teacher-evaluations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
        .then(res => res.json())
        .then(data => setEvaluations(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching evaluations: ", err));

        // Fetch evaluations submitted (for "Evaluation History")
        fetch('http://127.0.0.1:8000/api/my-evaluations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
        .then(res => res.json())
        .then(data => setMyEvaluations(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching my evaluations: ", err));

        // Fetch all teachers to build a map for names
        fetch('http://127.0.0.1:8000/api/teachers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
        .then(res => res.json())
        .then(data => {
          const map = new Map<number, any>();
          if (Array.isArray(data)) {
            data.forEach(teacher => {
              map.set(teacher.id, teacher);
            });
          }
          setTeachersMap(map);
        })
        .catch(err => console.error("Error fetching teachers: ", err))
        .finally(() => setLoading(false));
      } catch (e) {
        console.error("Failed to parse session: ", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  const filteredEvaluations = useMemo(() => {
    if (filter === 'all') return evaluations;
    return evaluations.filter(e => e.type === filter);
  }, [evaluations, filter]);

  const avgScore = filteredEvaluations.length > 0
    ? (filteredEvaluations.reduce((acc, curr) => acc + parseFloat(curr.rating || curr.average_score || 0), 0) / filteredEvaluations.length).toFixed(1)
    : '0.0';

  const handleLogOut = () => {
    localStorage.clear();
    router.push('/login');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={`text-lg ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
        ))}
      </div>
    );
  };

  const renderParsedComments = (commentString: string) => {
    if (!commentString) return null;
    return commentString.split(';').map((segment, idx) => {
      const trimmed = segment.trim();
      if (!trimmed) return null;
      if (trimmed.includes(':')) {
        const [title, ...rest] = trimmed.split(':');
        return (
          <div key={idx} className="mb-2 last:mb-0">
            <span className="font-bold text-xs text-slate-500 uppercase tracking-wider block">{title.trim()}:</span>
            <p className="text-slate-700 text-sm mt-0.5">{rest.join(':').trim()}</p>
          </div>
        );
      }
      return <p key={idx} className="text-slate-700 text-sm mb-1">{trimmed}</p>;
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center font-sans">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex text-slate-800 font-sans">
      <aside className="w-64 md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col shadow-md">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center overflow-hidden shadow-md">
            <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h1 className="font-bold text-[#445cf5] text-lg">CPC Portal</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Faculty Access</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {['Dashboard', 'Evaluate Teachers', 'View Evaluations', 'Evaluation History'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab ? 'bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab === 'Dashboard' ? '📊' : tab === 'Evaluate Teachers' ? '📝' : tab === 'View Evaluations' ? '📋' : '📜'} {tab}
            </button>
          ))}
        </nav>
        <button onClick={handleLogOut} className="flex items-center gap-4 py-3 px-4 rounded-2xl font-bold text-red-600 text-sm hover:bg-red-50 transition-all">
          🚪 Sign Out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'Dashboard' && (
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Welcome, {user?.name?.split(' ')[0]}!</h3>
                <p className="text-sm text-slate-500">{user?.course}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#f2f4ff] p-6 rounded-2xl border border-[#445cf5]/10">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Evaluations</p>
                <p className="text-3xl font-black text-[#445cf5]">{evaluations.length}</p>
              </div>
              <div className="bg-[#f2f4ff] p-6 rounded-2xl border border-[#445cf5]/10">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Student Evaluations</p>
                <p className="text-3xl font-black text-[#445cf5]">{evaluations.filter(e => e.type === 'student').length}</p>
              </div>
              <div className="bg-[#f2f4ff] p-6 rounded-2xl border border-[#445cf5]/10">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Teacher Evaluations</p>
                <p className="text-3xl font-black text-[#445cf5]">{evaluations.filter(e => e.type === 'teacher').length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Evaluate Teachers' && user && <EvaluateTeachersList currentUser={user} />}

        {activeTab === 'View Evaluations' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">Evaluation Results</h1>
              <p className="text-slate-500">View and analyze feedback from students and teachers</p>
            </div>

            <div className="flex bg-white p-2 rounded-2xl w-fit border shadow-md mb-6">
              {(['all', 'student', 'teacher'] as const).map((type) => (
                <button key={type} onClick={() => setFilter(type)}
                  className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === type ? 'bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {type === 'student' ? 'Student' : type === 'teacher' ? 'Teacher' : 'All'}
                </button>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md mb-8">
              <div className="text-center mb-8">
                <p className="text-sm text-slate-500 font-bold uppercase mb-2">Average Rating</p>
                <p className="text-6xl font-black text-[#5c6df5]">{avgScore} <span className="text-2xl text-slate-400">/5</span></p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] h-full transition-all duration-500"
                  style={{ width: `${(parseFloat(avgScore) / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {filteredEvaluations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200">
                <p className="text-slate-500 font-semibold">No evaluations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((ev, i) => (
                  <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg text-slate-800">Anonymously</p>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${ev.type === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {ev.type === 'student' ? 'Student' : 'Teacher'} Evaluation
                        </span>
                      </div>
                      {ev.created_at && (
                        <span className="text-xs text-slate-500">
                          {new Date(ev.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-600">Rating:</span>
                        {renderStars(parseFloat(ev.rating || ev.average_score || 0))}
                        <span className="text-sm font-bold text-[#445cf5]">{parseFloat(ev.rating || ev.average_score || 0).toFixed(1)}/5</span>
                      </div>
                    </div>

                    {renderParsedComments(ev.comments)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Evaluation History' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">Evaluation History</h1>
              <p className="text-slate-500">Evaluations you have submitted</p>
            </div>

            {myEvaluations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200">
                <p className="text-slate-500 font-semibold">No evaluations submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myEvaluations.map((ev, i) => {
                  const teacher = teachersMap.get(ev.teacher_id);
                  return (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg text-slate-800">{teacher?.name || 'Unknown Teacher'}</p>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${ev.type === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {ev.type === 'student' ? 'Student' : 'Teacher'} Evaluation
                          </span>
                        </div>
                        {ev.created_at && (
                          <span className="text-xs text-slate-500">
                            {new Date(ev.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-slate-600">Your Rating:</span>
                          {renderStars(parseFloat(ev.rating || ev.average_score || 0))}
                          <span className="text-sm font-bold text-[#445cf5]">{parseFloat(ev.rating || ev.average_score || 0).toFixed(1)}/5</span>
                        </div>
                      </div>

                      {renderParsedComments(ev.comments)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function EvaluateTeachersList({ currentUser }: { currentUser: any }) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const router = useRouter();

  // Helper function to normalize course names
  const normalizeCourse = (courseStr: string) => {
    const clean = (courseStr || '').toLowerCase().replace(/[\s\-_]/g, '');
    if (clean === 'bsit' || clean === 'bachelorofscienceininformationtechnology') return 'bsit';
    if (clean === 'hm' || clean === 'hospitalitymanagement') return 'hm';
    if (clean === 'bsed' || clean === 'bachelorofsecondaryeducation') return 'bsed';
    if (clean === 'beed' || clean === 'bachelorofelementaryeducation') return 'beed';
    return clean;
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/teachers', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
    .then(res => res.json())
    .then(data => {
      const normalizedCurrentUserCourse = normalizeCourse(currentUser.course);
      const filtered = Array.isArray(data) ? data.filter((t: any) =>
        String(t.id_number) !== String(currentUser.id_number) &&
        normalizeCourse(t.course) === normalizedCurrentUserCourse
      ) : [];
      setTeachers(filtered);
    })
    .catch(err => console.error("Error fetching teachers: ", err))
    .finally(() => setLoadingTeachers(false));
  }, [currentUser]);

  if (loadingTeachers) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#445cf5] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800 mb-2">Department Faculty</h3>
        <p className="text-sm text-slate-500">Provide feedback to your colleagues</p>
      </div>

      {teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map(teacher => (
            <div key={teacher.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md flex justify-between items-center transition-all hover:shadow-lg hover:border-[#445cf5]/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{teacher.name}</h3>
                  <p className="text-xs text-[#445cf5] font-bold uppercase">{teacher.course}</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/evaluation/teacher?teacher_id=${teacher.id_number}&name=${encodeURIComponent(teacher.name)}`)}
                className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] hover:from-[#3249d9] hover:to-[#5457e0] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all">
                Evaluate
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[32px] border border-dashed border-slate-200 text-center">
          <p className="text-slate-500 font-bold text-sm">No other faculty listed for your department</p>
        </div>
      )}
    </div>
  );
}
