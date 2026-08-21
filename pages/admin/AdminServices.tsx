import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getServices, createService, updateService, deleteService } from '../../services/db';
import { Service, ServiceCategory } from '../../types';

export const AdminServicesList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => setServices(await getServices());

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    await deleteService(id);
    load();
  };

  const handleToggleActive = async (s: Service) => {
    await updateService(s.id, { active: !(s.active ?? true) });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-primary-dark">Services</h1>
        <Link to="/admin/services/new" className="px-4 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium">+ Add Service</Link>
      </div>
      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center gap-3">
            <div className="min-w-0">
              <p className="font-medium text-primary-dark truncate">{s.title?.en}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {s.category} {(s.active ?? true) ? '' : '· Inactive'} {!s.title?.es && '· Missing ES translation'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleToggleActive(s)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                {(s.active ?? true) ? 'Deactivate' : 'Activate'}
              </button>
              <Link to={`/admin/services/${s.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">Edit</Link>
              <button onClick={() => handleDelete(s.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const emptyService = (): Partial<Service> => ({
  slug: '',
  title: { en: '', es: '' },
  shortDescription: { en: '', es: '' },
  description: { en: '', es: '' },
  category: ServiceCategory.RESIDENTIAL,
  imageUrl: '',
  active: true,
  order: 0,
  seoTitle: '',
  seoDescription: '',
});

export const AdminServiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Service>>(emptyService());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const all = await getServices();
      const found = all.find((s) => s.id === id);
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
      if (isNew) {
        await createService(form);
      } else if (id) {
        await updateService(id, form);
      }
      navigate('/admin/services');
    } catch (err) {
      console.error(err);
      alert('Failed to save service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/services" className="text-sm text-secondary mb-4 inline-block">&larr; Back to Services</Link>
      <h1 className="font-serif text-2xl text-primary-dark mb-6">{isNew ? 'Add Service' : 'Edit Service'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
            <input required value={form.title?.en || ''} onChange={(e) => update('title.en', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (ES)</label>
            <input value={form.title?.es || ''} onChange={(e) => update('title.es', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input required value={form.slug || ''} onChange={(e) => update('slug', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" placeholder="plaster-repair" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (EN)</label>
            <textarea value={form.shortDescription?.en || ''} onChange={(e) => update('shortDescription.en', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (ES)</label>
            <textarea value={form.shortDescription?.es || ''} onChange={(e) => update('shortDescription.es', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (EN)</label>
            <textarea value={form.description?.en || ''} onChange={(e) => update('description.en', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (ES)</label>
            <textarea value={form.description?.es || ''} onChange={(e) => update('description.es', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
              {Object.values(ServiceCategory).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={form.imageUrl || ''} onChange={(e) => update('imageUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input type="number" value={form.order ?? 0} onChange={(e) => update('order', Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input id="active" type="checkbox" checked={form.active ?? true} onChange={(e) => update('active', e.target.checked)} />
            <label htmlFor="active" className="text-sm text-gray-700">Active</label>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input value={form.seoTitle || ''} onChange={(e) => update('seoTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <input value={form.seoDescription || ''} onChange={(e) => update('seoDescription', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-secondary text-white text-sm font-medium disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Service'}
        </button>
      </form>
    </div>
  );
};
