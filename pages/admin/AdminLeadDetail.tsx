import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInquiryById, updateInquiryStatus, updateInquiryNotes } from '../../services/db';
import { Inquiry, InquiryStatus } from '../../types';
import { getTelUrl, getSmsUrl, getWhatsAppUrl } from '../../services/contactLinks';

const STATUS_OPTIONS = Object.values(InquiryStatus);

export const AdminLeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getInquiryById(id);
        setLead(data);
        setNotes(data?.internalNotes || '');
      } catch (err) {
        console.error(err);
        setError('Could not load this lead.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleStatusChange = async (status: InquiryStatus) => {
    if (!lead) return;
    setSavingStatus(true);
    try {
      await updateInquiryStatus(lead.id, status);
      setLead({ ...lead, status });
    } catch (err) {
      console.error(err);
      alert('Failed to update status. Please try again.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!lead) return;
    setSavingNotes(true);
    try {
      await updateInquiryNotes(lead.id, notes);
      setLead({ ...lead, internalNotes: notes });
    } catch (err) {
      console.error(err);
      alert('Failed to save notes. Please try again.');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading lead…</p>;
  if (error || !lead) return <p className="text-sm text-red-600">{error || 'Lead not found.'}</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/leads" className="text-sm text-secondary mb-4 inline-block">&larr; Back to Leads</Link>
      <h1 className="font-serif text-2xl text-primary-dark mb-1">{lead.customerName}</h1>
      <p className="text-sm text-gray-500 mb-6">Submitted {lead.submissionDate?.slice(0, 10)} · {lead.language?.toUpperCase()} · Source: {lead.source}</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <a href={getTelUrl(lead.phone)} className="text-center bg-primary-dark text-white py-3 rounded-lg text-sm font-medium">Call</a>
        <a href={getSmsUrl(lead.phone)} className="text-center bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium">Text</a>
        <a href={`mailto:${lead.email}`} className="text-center bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium">Email</a>
        <a href={getWhatsAppUrl(lead.phone)} target="_blank" rel="noopener noreferrer" className="text-center bg-green-600 text-white py-3 rounded-lg text-sm font-medium">WhatsApp</a>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-2 text-sm">
        <p><span className="text-gray-400">Phone:</span> {lead.phone}</p>
        <p><span className="text-gray-400">Email:</span> {lead.email}</p>
        <p><span className="text-gray-400">Preferred contact:</span> {lead.preferredContact}</p>
        {lead.bestTimeToContact && <p><span className="text-gray-400">Best time:</span> {lead.bestTimeToContact}</p>}
        <p><span className="text-gray-400">Service:</span> {lead.serviceLabel}</p>
        <p><span className="text-gray-400">Location:</span> {lead.city}, {lead.zip}</p>
        <p className="pt-2 border-t border-gray-100"><span className="text-gray-400 block mb-1">Description:</span> {lead.description}</p>
      </div>

      {lead.photos?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Uploaded Photos</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {lead.photos.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                <img src={p.url} alt={p.fileName} className="w-full aspect-square object-cover rounded-lg" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</h2>
        <select
          value={lead.status}
          disabled={savingStatus}
          onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Internal Notes</h2>
        <p className="text-xs text-gray-400 mb-2">Never shown to the customer.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm mb-2"
        />
        <button
          onClick={handleSaveNotes}
          disabled={savingNotes}
          className="px-4 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium disabled:opacity-60"
        >
          {savingNotes ? 'Saving…' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
};
