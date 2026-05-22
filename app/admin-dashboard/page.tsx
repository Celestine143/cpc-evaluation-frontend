"use client";
import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Teachers');
  
  const [formData, setFormData] = useState({ name: '', id_number: '', password: '', role: 'teacher' });
  const [instData, setInstData] = useState({ name: '', subject: '', course: '' });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://127.0.0.1:8000/api/teachers', { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        } 
    });
    if (res.ok) setTeachers(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/create-user', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Teacher Account Created!');
        setIsModalOpen(false);
        setFormData({ name: '', id_number: '', password: '', role: 'teacher' });
        fetchData();
      } else {
        alert(data.message || 'Failed to create user');
      }
    } catch (err) {
      alert('Network error. Check if Laravel is running.');
    }
  };

  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    await fetch('http://127.0.0.1:8000/api/admin/add-instructor', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(instData)
    });
    setIsModalOpen(false);
    alert('Instructor Added!');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-[#445cf5]">CPC Admin Portal</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-sm">Sign Out</button>
      </header>

      <div className="flex p-8 gap-8">
        <nav className="w-64 flex flex-col gap-4">
          {['Teachers', 'Instructors'].map((item) => (
            <button key={item} onClick={() => setActiveTab(item)} className={`${activeTab === item ? 'bg-[#354ac7]' : 'bg-[#445cf5]'} text-white p-4 rounded-2xl font-bold shadow-md transition`}>
              Manage {item}
            </button>
          ))}
        </nav>

        <main className="flex-1 flex flex-col gap-6">
          <div className="bg-[#445cf5] p-8 rounded-3xl text-white shadow-lg">
            <h2 className="text-2xl font-bold">Manage {activeTab}</h2>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#445cf5] text-white px-8 py-3 rounded-full font-bold self-start shadow-md">
            + Add {activeTab === 'Teachers' ? 'Teacher' : 'Instructor'}
          </button>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          {activeTab === 'Teachers' ? (
            <form onSubmit={handleTeacherSubmit} className="bg-white p-8 rounded-3xl w-full max-w-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold">Add Teacher Account</h2>
              <input placeholder="Name" className="border p-3 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input placeholder="ID Number" className="border p-3 rounded-xl" onChange={e => setFormData({...formData, id_number: e.target.value})} required />
              <input type="password" placeholder="Password" className="border p-3 rounded-xl" onChange={e => setFormData({...formData, password: e.target.value})} required />
              <button type="submit" className="bg-[#445cf5] text-white py-3 rounded-xl font-bold">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-100 py-3 rounded-xl font-bold">Cancel</button>
            </form>
          ) : (
            <form onSubmit={handleInstructorSubmit} className="bg-white p-8 rounded-3xl w-full max-w-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold">Add Instructor</h2>
              <input placeholder="Name" className="border p-3 rounded-xl" onChange={e => setInstData({...instData, name: e.target.value})} required />
              <input placeholder="Subject" className="border p-3 rounded-xl" onChange={e => setInstData({...instData, subject: e.target.value})} required />
              <select className="border p-3 rounded-xl" onChange={e => setInstData({...instData, course: e.target.value})} required>
                <option value="">Select Dept</option>
                <option value="Bachelor of Science in Information Technology">BSIT</option>
                <option value="Hospitality Management">HM</option>
              </select>
              <button type="submit" className="bg-[#445cf5] text-white py-3 rounded-xl font-bold">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-100 py-3 rounded-xl font-bold">Cancel</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}