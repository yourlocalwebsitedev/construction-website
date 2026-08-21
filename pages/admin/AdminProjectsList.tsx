import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, updateProject, deleteProject } from '../../services/db';
import { Project } from '../../types';

export const AdminProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => setProjects(await getProjects());
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await deleteProject(id);
    load();
  };

  const handleTogglePublish = async (p: Project) => {
    await updateProject(p.id, { published: !(p.published !== false) });
    load();
  };

  const handleToggleFeature = async (p: Project) => {
    await updateProject(p.id, { featured: !p.featured });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-primary-dark">Projects</h1>
        <Link to="/admin/projects/new" className="px-4 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium">+ Add Project</Link>
      </div>
      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      <div className="space-y-2">
        {projects.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-primary-dark truncate">{p.title?.en}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {p.location} · {p.category} · {p.published === false ? 'Draft' : 'Published'} {p.featured && '· Featured'}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button onClick={() => handleTogglePublish(p)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                  {p.published === false ? 'Publish' : 'Unpublish'}
                </button>
                <button onClick={() => handleToggleFeature(p)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                  {p.featured ? 'Unfeature' : 'Feature'}
                </button>
                <Link to={`/admin/projects/${p.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
