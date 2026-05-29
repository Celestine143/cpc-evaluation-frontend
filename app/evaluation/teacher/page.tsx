'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TeacherEvaluationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const teacherId = searchParams.get('teacher_id') || searchParams.get('id');
  const teacherName = searchParams.get('name');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [ratings, setRatings] = useState({ respect: 5, communication: 5, leadership: 5 });
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [recommend, setRecommend] = useState('Yes');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedData = localStorage.getItem('userData');
    
    if (!token || !storedData) {
      router.push('/login');
      return;
    }
    
    try {
      setCurrentUser(JSON.parse(storedData));
    } catch (e) {
      console.error('Error parsing user data', e);
    }
    setLoading(false);
  }, [router]);

  const handleRatingChange = (criterion: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [criterion]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          type: 'teacher',
          respect: ratings.respect,
          communication: ratings.communication,
          leadership: ratings.leadership,
          strengths: strengths,
          improvement: improvements,
          recommend: recommend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend Validation Failed:", data);
        throw new Error(data.message || 'Validation failed.');
      }

      alert('Evaluation submitted successfully!');
      router.push('/teacher-dash-eval');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center font-sans">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center font-sans text-slate-800">
      <div className="bg-white max-w-2xl w-full p-6 md:p-8 rounded-[32px] shadow-xl border border-slate-100">
        <button
          onClick={() => router.back()}
          className="mb-6 text-[#445cf5] font-bold text-sm flex items-center gap-2 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <header className="mb-8 border-b pb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#445cf5] to-[#6366f1] rounded-full flex items-center justify-center overflow-hidden shadow-md">
            <img src="/images/CPC.jpg" alt="CPC Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
              Teacher Evaluation Form
            </h2>
            <p className="text-sm text-slate-500">
              Evaluating: <span className="text-[#445cf5] font-bold">{decodeURIComponent(teacherName || '')}</span>
            </p>
          </div>
        </header>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl text-sm mb-6 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {(['respect', 'communication', 'leadership'] as const).map((criterion) => (
            <div key={criterion} className="space-y-3">
              <label className="block font-bold capitalize text-base tracking-wide text-slate-700">
                {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(criterion, star)}
                    className="text-4xl transition-all hover:scale-110"
                  >
                    <span className={star <= ratings[criterion] ? "text-yellow-400" : "text-slate-200"}>★</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-3 pt-2">
            <label className="block font-bold text-base text-slate-700">
              What are their primary strengths?
            </label>
            <textarea
              required
              rows={4}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className="w-full border border-slate-200 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent bg-slate-50 transition"
              placeholder="Describe strengths..."
            />
          </div>

          <div className="space-y-3">
            <label className="block font-bold text-base text-slate-700">
              Areas for Growth / Improvement?
            </label>
            <textarea
              required
              rows={4}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="w-full border border-slate-200 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent bg-slate-50 transition"
              placeholder="Describe areas of growth..."
            />
          </div>

          <div className="space-y-3">
            <label className="block font-bold text-base text-slate-700">
              Would you recommend them?
            </label>
            <div className="flex gap-4">
              {['Yes', 'No', 'Maybe'].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 transition hover:bg-slate-100"
                >
                  <input
                    type="radio"
                    name="recommend"
                    value={option}
                    checked={recommend === option}
                    onChange={(e) => setRecommend(e.target.value)}
                    className="text-[#445cf5] focus:ring-[#445cf5]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#445cf5] to-[#6366f1] hover:from-[#3249d9] hover:to-[#5457e0] text-white font-bold py-4 px-4 rounded-2xl shadow-md hover:shadow-lg disabled:opacity-70 transition-all mt-4"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Evaluation...
              </div>
            ) : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TeacherEvaluationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
      </div>
    }>
      <TeacherEvaluationFormContent />
    </Suspense>
  );
}
