"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function EvaluationFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const teacherId = searchParams.get('teacher_id');
  const teacherName = searchParams.get('name') || "your instructor";

  const [submitting, setSubmitting] = useState(false);
  const [ratings, setRatings] = useState({ clarity: 5, participation: 5, respect: 5, feedback: 5, motivation: 5 });
  const [formData, setFormData] = useState({ manages_time: "", approachable: "", like_most: "", improvement: "", recommend: "Yes" });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUser(JSON.parse(storedData));
    }
  }, []);

  const handleStarClick = (category: string, value: number) => setRatings(prev => ({ ...prev, [category]: value }));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/evaluations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          type: 'student',
          ...ratings,
          ...formData,
          evaluator_name: user?.name || 'Anonymous'
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Submission failed");
      }

      alert("Evaluation submitted successfully!");
      router.push('/student-dash-eval');
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (category: string, label: string) => (
    <div key={category} className="space-y-3">
      <label className="block font-bold text-sm text-slate-700">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(category, star)}
            className="text-4xl transition-all hover:scale-110"
          >
            <span className={star <= ratings[category as keyof typeof ratings] ? "text-yellow-400" : "text-slate-200"}>★</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2ff] p-4 md:p-8 font-sans flex justify-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-[#445cf5] font-bold text-sm flex items-center gap-2 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] shadow-xl border-t-8 border-[#445cf5] p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
              Evaluating {teacherName}
            </h2>
            <p className="text-slate-500">
              Please provide honest feedback to help improve our teaching quality.
            </p>
          </div>

          <div className="space-y-6">
            {renderStars('clarity', 'Clarity of Instruction')}
            {renderStars('participation', 'Encourages Student Participation')}
            {renderStars('respect', 'Respects Students')}
            {renderStars('feedback', 'Provides Useful Feedback')}
            {renderStars('motivation', 'Motivates Students')}
          </div>

          <div className="space-y-4 mt-8">
            <div>
              <label className="block font-bold text-sm text-slate-700 mb-2">
                Manages Time Well? (e.g., Yes, No, Sometimes)
              </label>
              <input
                name="manages_time"
                placeholder="Enter your answer"
                value={formData.manages_time}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-2">
                Is the Instructor Approachable?
              </label>
              <input
                name="approachable"
                placeholder="Enter your answer"
                value={formData.approachable}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-2">
                What Did You Like Most?
              </label>
              <textarea
                name="like_most"
                placeholder="Share your thoughts"
                value={formData.like_most}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-2">
                Areas for Improvement
              </label>
              <textarea
                name="improvement"
                placeholder="Share your suggestions"
                value={formData.improvement}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#445cf5] focus:border-transparent transition"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm text-slate-700 mb-3">
                Would You Recommend This Instructor?
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
                      checked={formData.recommend === option}
                      onChange={handleInputChange}
                      className="text-[#445cf5] focus:ring-[#445cf5]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 mt-8 bg-gradient-to-r from-[#445cf5] to-[#6366f1] text-white rounded-2xl font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-70 transition-all"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StudentEvaluationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0f2ff] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#445cf5] border-t-transparent"></div>
      </div>
    }>
      <EvaluationFormContent />
    </Suspense>
  );
}
