import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getProjects, getReviews } from '../../services/db';
import { getInquiries } from '../../services/db';
import { InquiryStatus, Inquiry, Project } from '../../types';

interface Stats {
  newLeads: number;
  totalLeads: number;
  totalProjects: number;
  publishedProjects: number;
  services: number;
  reviews: number;
  videos: number;
}

export const AdminDashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Inquiry[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [services, projects, reviews, inquiries] = await Promise.all([
          getServices(),
          getProjects(),
          getReviews(),
          getInquiries().catch(() => [] as Inquiry[]),
        ]);
        setStats({
          newLeads: inquiries.filter((i) => i.status === InquiryStatus.NEW).length,
          totalLeads: inquiries.length,
          totalProjects: projects.length,
          publishedProjects: projects.filter((p) => p.published !== false).length,
          services: services.length,
          reviews: reviews.length,
          videos: projects.filter((p) => !!p.videoUrl).length,
        });
        setRecentLeads(inquiries.slice(0, 5));
        setRecentProjects(projects.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError('Could not load dashboard data. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = stats
    ? [
        { label: 'New Leads', value: stats.newLeads, to: '/admin/leads', highlight: stats.newLeads > 0 },
        { label: 'Total Leads', value: stats.totalLeads, to: '/admin/leads' },
        { label: 'Total Projects', value: stats.totalProjects, to: '/admin/projects' },
        { label: 'Published Projects', value: stats.publishedProjects, to: '/admin/projects' },
        { label: 'Services', value: stats.services, to: '/admin/services' },
        { label: 'Reviews', value: stats.reviews, to: '/admin/reviews' },
        { label: 'Videos', value: stats.videos, to: '/admin/projects' },
      ]
    : [];

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-primary-dark mb-6">Dashboard</h1>

      {loading && <p className="text-gray-400 text-sm">Loading dashboard…</p>}
      {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {cards.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className={`rounded-xl border p-4 hover:shadow-md transition bg-white ${
                  c.highlight ? 'border-secondary ring-1 ring-secondary/30' : 'border-gray-200'
                }`}
              >
                <p className="text-2xl font-bold text-primary-dark">{c.value}</p>
                <p className="text-xs text-gray-500 mt-1">{c.label}</p>
              </Link>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/projects/new" className="px-4 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium">+ Add Project</Link>
              <Link to="/admin/quick-upload" className="px-4 py-2.5 rounded-lg bg-primary-dark text-white text-sm font-medium">+ Quick Job Upload</Link>
              <Link to="/admin/leads" className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">View Leads</Link>
              <Link to="/admin/services/new" className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">Add Service</Link>
              <Link to="/admin/reviews/new" className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">Add Review</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Leads</h2>
              {recentLeads.length === 0 && <p className="text-sm text-gray-400">No leads yet.</p>}
              <div className="space-y-2">
                {recentLeads.map((lead) => (
                  <Link key={lead.id} to={`/admin/leads/${lead.id}`} className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-primary-dark text-sm">{lead.customerName}</p>
                      <span className="text-[10px] uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded text-gray-500">{lead.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{lead.serviceLabel} · {lead.city}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Projects</h2>
              {recentProjects.length === 0 && <p className="text-sm text-gray-400">No projects yet.</p>}
              <div className="space-y-2">
                {recentProjects.map((p) => (
                  <Link key={p.id} to={`/admin/projects/${p.id}`} className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm">
                    <p className="font-medium text-primary-dark text-sm">{p.title?.en}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.location} · {p.published === false ? 'Draft' : 'Published'}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
