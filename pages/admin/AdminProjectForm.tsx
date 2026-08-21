import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getProjects,
  createProject,
  updateProject,
  getProjectMedia,
  uploadProjectMedia,
  deleteProjectMedia,
} from '../../services/db';
import { Project, ProjectMedia, ProjectMediaType, ServiceCategory } from '../../types';
import { generateProjectContent } from '../../services/geminiService';

const emptyProject = (): Partial<Project> => ({
  title: { en: '', es: '' },
  shortDescription: { en: '', es: '' },
  description: { en: '', es: '' },
  problem: { en: '', es: '' },
  solution: { en: '', es: '' },
  images: [],
  category: ServiceCategory.RESIDENTIAL,
  featured: false,
  published: false,
  displayOrder: 0,
  completionDate: new Date().toISOString().slice(0, 10),
  location: '',
  services: [],
  seoTitle: '',
  seoDescription: '',
});

const MEDIA_TYPES: { type: ProjectMediaType; label: string }[] = [
  { type: 'before', label: 'Before Photos' },
  { type: 'during', label: 'During Photos' },
  { type: 'after', label: 'After Photos' },
  { type: 'general', label: 'General Photos' },
  { type: 'video', label: 'Video' },
  { type: 'video_thumbnail', label: 'Video Thumbnail' },
];

export const AdminProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Project>>(emptyProject());
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [aiInputs, setAiInputs] = useState({ projectType: '', workPerformed: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>(isNew ? undefined : id);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const all = await getProjects();
      const found = all.find((p) => p.id === id);
      if (found) setForm(found);
      if (id) setMedia(await getProjectMedia(id));
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

  // Projects must exist in Firestore before media can be attached, so on
  // "new" we save a draft first the moment the admin tries to upload media.
  const ensureProjectSaved = async (): Promise<string> => {
    if (projectId) return projectId;
    const newId = await createProject(form);
    setProjectId(newId);
    return newId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (projectId) {
        await updateProject(projectId, form);
      } else {
        const newId = await createProject(form);
        setProjectId(newId);
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (files: FileList | null, type: ProjectMediaType) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    try {
      const pid = await ensureProjectSaved();
      for (const file of Array.from(files)) {
        if (file.size > 15 * 1024 * 1024) {
          setUploadError(`${file.name} is larger than 15MB and was skipped.`);
          continue;
        }
        const key = `${type}_${file.name}_${Date.now()}`;
        setUploadProgress((p) => ({ ...p, [key]: 0 }));
        try {
          const uploaded = await uploadProjectMedia(pid, file, type, (pct) => {
            setUploadProgress((p) => ({ ...p, [key]: pct }));
          });
          setMedia((prev) => [...prev, uploaded]);
          if (type !== 'video' && type !== 'video_thumbnail') {
            setForm((prev) => ({ ...prev, images: [...(prev.images || []), uploaded.url] }));
          }
          if (type === 'video') {
            setForm((prev) => ({ ...prev, videoUrl: uploaded.url }));
          }
        } finally {
          setUploadProgress((p) => {
            const next = { ...p };
            delete next[key];
            return next;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Please check your connection and try again.');
    }
  };

  const handleDeleteMedia = async (m: ProjectMedia) => {
    if (!confirm('Delete this media file?')) return;
    await deleteProjectMedia(m.id, m.storagePath);
    setMedia((prev) => prev.filter((x) => x.id !== m.id));
    setForm((prev) => ({ ...prev, images: (prev.images || []).filter((url) => url !== m.url) }));
  };

  const handleAiAssist = async () => {
    setAiLoading(true);
    try {
      const draft = await generateProjectContent({
        projectType: aiInputs.projectType,
        service: form.services?.[0]?.en || '',
        location: form.location || '',
        problem: form.problem?.en || '',
        workPerformed: aiInputs.workPerformed,
        language: 'en',
      });
      setForm((prev) => ({
        ...prev,
        shortDescription: { ...(prev.shortDescription || { en: '', es: '' }), en: draft.shortDescription },
        description: { ...(prev.description || { en: '', es: '' }), en: draft.fullDescription },
        problem: { ...(prev.problem || { en: '', es: '' }), en: draft.problemSection },
        solution: { ...(prev.solution || { en: '', es: '' }), en: draft.solutionSection },
      }));
    } catch (err) {
      console.error(err);
      alert('AI generation failed. Please write the description manually.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/projects" className="text-sm text-secondary mb-4 inline-block">&larr; Back to Projects</Link>
      <h1 className="font-serif text-2xl text-primary-dark mb-6">{isNew ? 'Add Project' : 'Edit Project'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
            <input required value={form.title?.en || ''} onChange={(e) => update('title.en', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (ES)</label>
            <input value={form.title?.es || ''} onChange={(e) => update('title.es', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={form.slug || ''} onChange={(e) => update('slug', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" placeholder="ceiling-repair-anytown" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
              {Object.values(ServiceCategory).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input value={form.location || ''} onChange={(e) => update('location', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
            <input type="date" value={form.completionDate || ''} onChange={(e) => update('completionDate', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>

        {/* AI Assist */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">✨ AI Description Assist (draft only — review before publishing)</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input placeholder="Project type (e.g. Ceiling repair)" value={aiInputs.projectType} onChange={(e) => setAiInputs((p) => ({ ...p, projectType: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            <input placeholder="Work performed" value={aiInputs.workPerformed} onChange={(e) => setAiInputs((p) => ({ ...p, workPerformed: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-300 text-sm" />
          </div>
          <button type="button" onClick={handleAiAssist} disabled={aiLoading} className="text-sm px-4 py-2 rounded-lg bg-primary-dark text-white disabled:opacity-60">
            {aiLoading ? 'Generating…' : 'Generate Draft'}
          </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">The Problem (EN)</label>
            <textarea value={form.problem?.en || ''} onChange={(e) => update('problem.en', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Our Solution (EN)</label>
            <textarea value={form.solution?.en || ''} onChange={(e) => update('solution.en', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input type="number" value={form.displayOrder ?? 0} onChange={(e) => update('displayOrder', Number(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input id="featured" type="checkbox" checked={form.featured ?? false} onChange={(e) => update('featured', e.target.checked)} />
            <label htmlFor="featured" className="text-sm text-gray-700">Featured</label>
          </div>
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={form.published ?? false} onChange={(e) => update('published', e.target.checked)} />
            <label htmlFor="published" className="text-sm text-gray-700">Published</label>
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
          {saving ? 'Saving…' : 'Save Project'}
        </button>
      </form>

      {/* Media Management */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Project Media</h2>
        {isNew && !projectId && (
          <p className="text-xs text-gray-400 mb-3">Uploading a photo will save this project as a draft first.</p>
        )}
        {uploadError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{uploadError}</p>}

        {Object.entries(uploadProgress).map(([key, pct]) => (
          <div key={key} className="mb-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-secondary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}

        {MEDIA_TYPES.map(({ type, label }) => (
          <div key={type} className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">{label}</h3>
              <label className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 cursor-pointer">
                Upload
                <input
                  type="file"
                  accept={type === 'video' ? 'video/*' : 'image/*'}
                  multiple={type !== 'video' && type !== 'video_thumbnail'}
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files, type)}
                />
              </label>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {media.filter((m) => m.type === type).map((m) => (
                <div key={m.id} className="relative group">
                  {type === 'video' ? (
                    <video src={m.url} className="w-full aspect-square object-cover rounded-lg bg-black" />
                  ) : (
                    <img src={m.url} alt="" className="w-full aspect-square object-cover rounded-lg" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(m)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
