import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInquiries } from '../../services/db';
import { Inquiry, InquiryStatus } from '../../types';

const STATUS_FILTERS: { label: string; value: InquiryStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'New', value: InquiryStatus.NEW },
  { label: 'Contacted', value: InquiryStatus.CONTACTED },
  { label: 'Estimate Scheduled', value: InquiryStatus.ESTIMATE_SCHEDULED },
  { label: 'Estimate Sent', value: InquiryStatus.ESTIMATE_SENT },
  { label: 'Won', value: InquiryStatus.WON },
  { label: 'Lost', value: InquiryStatus.LOST },
];

const statusColor = (status: InquiryStatus) => {
  switch (status) {
    case InquiryStatus.NEW: return 'bg-secondary/10 text-secondary';
    case InquiryStatus.WON: return 'bg-green-100 text-green-700';
    case InquiryStatus.LOST: return 'bg-gray-200 text-gray-500';
    default: return 'bg-blue-100 text-blue-700';
  }
};

export const AdminLeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<InquiryStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLeads(await getInquiries());
      } catch (err) {
        console.error(err);
        setError('Could not load leads.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter !== 'ALL' && l.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          l.customerName?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, filter, search]);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-primary-dark mb-4">Leads</h1>

      <input
        type="text"
        placeholder="Search by name, phone, email, or location…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-secondary"
      />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${
              filter === f.value ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-gray-400">Loading leads…</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-gray-400">No leads match this filter.</p>
      )}

      <div className="space-y-2">
        {filtered.map((lead) => (
          <Link
            key={lead.id}
            to={`/admin/leads/${lead.id}`}
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-primary-dark">{lead.customerName}</p>
                <p className="text-sm text-gray-500 mt-0.5">{lead.serviceLabel}</p>
                <p className="text-xs text-gray-400 mt-1">{lead.city} {lead.zip} · {lead.submissionDate?.slice(0, 10)}</p>
              </div>
              <span className={`text-[10px] uppercase font-semibold tracking-wide px-2 py-1 rounded-full whitespace-nowrap ${statusColor(lead.status)}`}>
                {lead.status.replace(/_/g, ' ')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
