import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getReviews, createReview, updateReview, deleteReview } from '../../services/db';
import { Review } from '../../types';

export const AdminReviewsList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => setReviews(await getReviews());
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await deleteReview(id);
    load();
  };

  const handleToggleFeature = async (r: Review) => {
    await updateReview(r.id, { featured: !r.featured });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-primary-dark">Reviews</h1>
        <Link to="/admin/reviews/new" className="px-4 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium">+ Add Review</Link>
      </div>
      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      <div className="space-y-2">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="font-medium text-primary-dark">{r.author} {r.isPlaceholder && <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-1">Placeholder</span>}</p>
                <p className="text-xs text-gray-400 mt-0.5">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} · {r.source} · {r.date}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.text?.en}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => handleToggleFeature(r)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                  {r.featured ? 'Unfeature' : 'Feature'}
                </button>
                <Link to={`/admin/reviews/${r.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-center">Edit</Link>
                <button onClick={() => handleDelete(r.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const emptyReview = (): Partial<Review> => ({
  author: '',
  rating: 5,
  text: { en: '', es: '' },
  date: new Date().toISOString().slice(0, 10),
  source: 'Google',
  isPlaceholder: false,
  featured: false,
});

export const AdminReviewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Review>>(emptyReview());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const all = await getReviews();
      const found = all.find((r) => r.id === id);
      if (found) setForm(found);
      setLoading(false);
    })();
  }, [id, isNew]);

  const update = (path: string, value: any) => {
    setForm((prev) => {
      const next: any = { ...prev };
      if (path.includes('.')) {
        const [a, b] = path.split('.');
        next[a] = { ...(next[a] || {}), [b]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await createReview(form);
      else if (id) await updateReview(id, form);
      navigate('/admin/reviews');
    } catch (err) {
      console.error(err);
      alert('Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/reviews" className="text-sm text-secondary mb-4 inline-block">&larr; Back to Reviews</Link>
      <h1 className="font-serif text-2xl text-primary-dark mb-6">{isNew ? 'Add Review' : 'Edit Review'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input required value={form.author || ''} onChange={(e) => update('author', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select value={form.rating} onChange={(e) => update('rating', Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review (EN)</label>
            <textarea value={form.text?.en || ''} onChange={(e) => update('text.en', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review (ES)</label>
            <textarea value={form.text?.es || ''} onChange={(e) => update('text.es', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input value={form.source || ''} onChange={(e) => update('source', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" placeholder="Google" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={form.date || ''} onChange={(e) => update('date', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="placeholder" type="checkbox" checked={form.isPlaceholder ?? false} onChange={(e) => update('isPlaceholder', e.target.checked)} />
          <label htmlFor="placeholder" className="text-sm text-gray-700">Mark as placeholder (not a real review)</label>
        </div>
        <button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-secondary text-white text-sm font-medium disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Review'}
        </button>
      </form>
    </div>
  );
};
