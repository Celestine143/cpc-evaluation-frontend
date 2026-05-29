"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    id_number: '', 
    password: '', 
    role: 'teacher', 
    course: '', 
    subject: ''
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teachers', { 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json' 
          } 
      });
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) { 
        console.error("Error fetching data: ", err); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { 
      fetchData(); 
  }, []);

  const deleteTeacher = async (id: number) => {
    if (!confirm("Remove this instructor from student view?")) return;
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
        alert('Instructor removed successfully!');
        await fetchData();
      } else {
        alert('Error removing instructor.');
      }
    } catch (err) { 
      console.error(err); 
      alert('Error removing instructor.'); 
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const res = await fetch('http://127.0.0.1:8000/api/admin/add-instructor', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Instructor created successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', id_number: '', password: '', role: 'teacher', course: '', subject: '' });
      await fetchData();
    } else {
      const errorData = await res.json();
      console.error(errorData);
      alert('Error creating instructor. Please check your inputs and database.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans p-6 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#445cf5] rounded-full flex items-center justify-center text-white font-bold text-lg">CPC</div>
          <div>
            <h1 className="text-2xl font-bold text-[#445cf5]">CPC Admin Portal</h1>
            <p className="text-sm text-slate-500">Faculty Management Dashboard</p>
          </div>
        </div>
        <button 
            onClick={() => { localStorage.clear(); router.replace('/login'); }} 
            className="bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold text-sm transition-all hover:bg-red-100 hover:shadow-md"
        >
          Sign Out
        </button>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Faculty</h2>
          <p className="text-sm text-slate-500">{staff.length} instructor{staff.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-[#445cf5] text-white px-8 py-3 rounded-full font-bold shadow-md transition-all hover:bg-[#3249d9] hover:shadow-lg w-full md:w-auto"
        >
            + Create Teacher Account
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((s: any) => (
              <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-[#445cf5]/20">
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
                      <p className="text-xs text-slate-400 mt-2">
                        {s.is_hidden ? 'Hidden from students' : 'Visible to students'}
                      </p>
                  </div>
                  <button 
                    onClick={() => deleteTeacher(s.id)} 
                    className="mt-5 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl transition-all hover:bg-red-100 self-start"
                  >
                    Remove
                  </button>
              </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleStaffSubmit} className="bg-white p-8 rounded-[32px] w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">New Teacher Account</h2>
            <p className="text-sm text-slate-500 mb-4">Fill in the details to create a new faculty account</p>
            
            <input 
                value={formData.name} 
                placeholder="Full Name" 
                className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
            />
            
            <input 
                value={formData.id_number} 
                placeholder="ID Number" 
                className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
                onChange={e => setFormData({...formData, id_number: e.target.value})} 
                required
            />
            
            <input 
                value={formData.password} 
                type="password" 
                placeholder="Password" 
                className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required
            />
            
            <input 
                value={formData.subject} 
                placeholder="Subject Taught" 
                className="border border-slate-200 p-4 rounded-2xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition-all" 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                required 
            />
            
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
                    className="bg-[#445cf5] text-white py-4 rounded-2xl font-bold hover:bg-[#3249d9] transition-all shadow-md hover:shadow-lg"
                >
                    Create Account
                </button>
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}