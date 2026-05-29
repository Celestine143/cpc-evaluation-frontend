"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTeachers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teachers', { 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json' 
          } 
      });
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      }
    } catch (err) { 
      console.error("Error fetching teachers: ", err); 
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/students', { 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json' 
          } 
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) { 
      console.error("Error fetching students: ", err); 
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchTeachers(), fetchStudents()]);
    setLoading(false);
  };

  useEffect(() => { 
      fetchAll(); 
  }, []);

  const toggleTeacherVisibility = async (id: number) => {
    if (!confirm("Toggle instructor visibility?")) return;
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/teachers/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        } 
      });

      if (res.ok) {
        alert('Instructor visibility updated!');
        await fetchTeachers();
      } else {
        alert('Error updating visibility.');
      }
    } catch (err) { 
      console.error(err); 
      alert('Error updating visibility.'); 
    }
  };

  const deleteStudent = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        } 
      });

      if (res.ok) {
        alert('Student deleted successfully!');
        await fetchStudents();
      } else {
        alert('Error deleting student.');
      }
    } catch (err) { 
      console.error(err); 
      alert('Error deleting student.'); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans p-6 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-[32px] shadow-md border border-slate-100">
        <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center overflow-hidden shadow-md">
                        <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#445cf5]">CPC Admin Portal</h1>
                        <p className="text-sm text-slate-500">Faculty &amp; Student Management System</p>
                    </div>
                </div>
        <button 
            onClick={() => { localStorage.clear(); router.replace('/login'); }} 
            className="bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold text-sm transition-all hover:bg-red-100 hover:shadow-md"
        >
          Sign Out
        </button>
      </header>

      <div className="bg-white p-2 rounded-2xl w-fit border shadow-md mb-8">
        {(['teachers', 'students'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsModalOpen(false);
            }}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all capitalize ${
              activeTab === tab 
                ? 'bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab === 'teachers' ? 'Manage Faculty' : 'Manage Students'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
        </div>
      ) : activeTab === 'teachers' ? (
        <TeachersTab 
          teachers={teachers} 
          onAddClick={() => setIsModalOpen(true)} 
          onToggleVisibility={toggleTeacherVisibility}
        />
      ) : (
        <StudentsTab 
          students={students} 
          onAddClick={() => setIsModalOpen(true)} 
          onDelete={deleteStudent}
        />
      )}

      {isModalOpen && (
        <Modal 
          type={activeTab} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchAll(); }}
        />
      )}
    </div>
  );
}

function TeachersTab({ 
  teachers, 
  onAddClick, 
  onToggleVisibility 
}: { 
  teachers: any[], 
  onAddClick: () => void, 
  onToggleVisibility: (id: number) => void 
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Management</h2>
          <p className="text-sm text-slate-500">{teachers.length} faculty member{teachers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button 
            onClick={onAddClick} 
            className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white px-8 py-3 rounded-full font-bold shadow-md transition-all hover:from-[#3249d9] hover:to-[#5457e0] hover:shadow-lg w-full md:w-auto"
        >
          + Create Faculty Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:border-[#445cf5]/20">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{s.name}</h3>
                        <p className="text-xs text-[#445cf5] font-bold uppercase">{s.course}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium"><span className="text-slate-400">Subject:</span> {s.subject}</p>
                    <p className="text-sm text-slate-600 font-medium mt-1"><span className="text-slate-400">ID:</span> {s.id_number}</p>
                    <p className={`text-xs font-bold mt-2 ${s.is_hidden ? 'text-amber-600' : 'text-green-600'}`}>
                      {s.is_hidden ? 'Hidden from Students' : 'Visible to Students'}
                    </p>
                </div>
                <button 
                  onClick={() => onToggleVisibility(s.id)} 
                  className={`mt-5 text-sm px-4 py-2 rounded-xl transition-all self-start font-bold ${s.is_hidden ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                >
                  {s.is_hidden ? 'Show to Students' : 'Hide from Students'}
                </button>
            </div>
        ))}
      </div>
    </>
  );
}

function StudentsTab({ 
  students, 
  onAddClick, 
  onDelete 
}: { 
  students: any[], 
  onAddClick: () => void, 
  onDelete: (id: number) => void 
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Management</h2>
          <p className="text-sm text-slate-500">{students.length} student{students.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button 
            onClick={onAddClick} 
            className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white px-8 py-3 rounded-full font-bold shadow-md transition-all hover:from-[#3249d9] hover:to-[#5457e0] hover:shadow-lg w-full md:w-auto"
        >
          + Create Student Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:border-[#445cf5]/20">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#818cf8] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{s.name}</h3>
                        <p className="text-xs text-[#445cf5] font-bold uppercase">{s.course}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium"><span className="text-slate-400">Year &amp; Section:</span> {s.year_level} - {s.section}</p>
                    <p className="text-sm text-slate-600 font-medium mt-1"><span className="text-slate-400">ID:</span> {s.id_number}</p>
                </div>
                <button 
                  onClick={() => onDelete(s.id)} 
                  className="mt-5 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl transition-all hover:bg-red-100 self-start"
                >
                  Delete Account
                </button>
            </div>
        ))}
      </div>
    </>
  );
}

function Modal({ 
  type, 
  onClose, 
  onSuccess 
}: { 
  type: 'teachers' | 'students', 
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState<any>(
    type === 'teachers' 
      ? { name: '', id_number: '', password: '', course: '', subject: '' }
      : { name: '', id_number: '', password: '', course: '', year_level: '', section: '' }
  );
  const [loading, setLoading] = useState(false);

  // Reset form when type changes
  useEffect(() => {
    setFormData(
      type === 'teachers' 
        ? { name: '', id_number: '', password: '', course: '', subject: '' }
        : { name: '', id_number: '', password: '', course: '', year_level: '', section: '' }
    );
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const url = type === 'teachers' 
      ? 'http://127.0.0.1:8000/api/admin/add-instructor' 
      : 'http://127.0.0.1:8000/api/admin/add-student';
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert(`${type === 'teachers' ? 'Faculty' : 'Student'} account created successfully!`);
      onSuccess();
    } else {
      const errorData = await res.json();
      console.error(errorData);
      alert(`Error creating account. Please check your inputs.`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] w-full max-w-md flex flex-col gap-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Create New {type === 'teachers' ? 'Faculty' : 'Student'} Account
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Fill in the required details to create a new account
        </p>
        
        <input 
            value={formData.name} 
            placeholder="Full Name" 
            className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
        />
        
        <input 
            value={formData.id_number} 
            placeholder="Identification Number" 
            className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
            onChange={e => setFormData({...formData, id_number: e.target.value})} 
            required
        />
        
        <input 
            value={formData.password} 
            type="password" 
            placeholder="Secure Password" 
            className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required
        />
        
        {type === 'teachers' ? (
          <input 
              value={(formData as any).subject} 
              placeholder="Subject Taught" 
              className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
              onChange={e => setFormData({...formData, subject: e.target.value})} 
              required 
          />
        ) : (
          <>
            <input 
                value={(formData as any).year_level} 
                placeholder="Year Level (e.g., 1st Year)" 
                className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
                onChange={e => setFormData({...formData, year_level: e.target.value})} 
                required 
            />
            <input 
                value={(formData as any).section} 
                placeholder="Section (e.g., A)" 
                className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
                onChange={e => setFormData({...formData, section: e.target.value})} 
                required 
            />
          </>
        )}
        
        <select 
            value={formData.course} 
            className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
            onChange={e => setFormData({...formData, course: e.target.value})} 
            required
        >
          <option value="">Select Department</option>
          <option value="Bachelor of Science in Information Technology">BSIT</option>
          <option value="Hospitality Management">Hospitality Management</option>
          <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
        </select>
        
        <div className="flex flex-col gap-3 mt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white py-4 rounded-2xl font-bold hover:from-[#3249d9] hover:to-[#5457e0] transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </button>
            <button 
                type="button" 
                onClick={onClose} 
                className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
        </div>
      </form>
    </div>
  );
}
