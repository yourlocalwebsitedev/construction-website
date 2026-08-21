import React, { useEffect, useState } from 'react';
import { getBusinessSettings, updateBusinessSettings, getServiceAreas, createServiceArea, updateServiceArea, deleteServiceArea } from '../../services/db';
import { BusinessSettings, ServiceArea } from '../../types';

export const AdminSettings: React.FC = () => {
  const [form, setForm] = useState<BusinessSettings | null>(null);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [newArea, setNewArea] = useState({ city: '', state: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const [settings, serviceAreas] = await Promise.all([getBusinessSettings(), getServiceAreas()]);
      setForm(settings);
      setAreas(serviceAreas);
      setLoading(false);
    })();
  }, []);

  const update = (key: keyof BusinessSettings, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateBusinessSettings(form);
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddArea = async () => {
    if (!newArea.city.trim()) return;
    const id = await createServiceArea(newArea);
    setAreas((prev) => [...prev, { id, ...newArea }]);
    setNewArea({ city: '', state: '' });
  };

  const handleRemoveArea = async (id?: string) => {
    if (!id) return;
    await deleteServiceArea(id);
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading || !form) return <p className="text-sm text-gray-400">Loading…</p>;

  const field = (label: string, key: keyof BusinessSettings, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        value={(form[key] as string) ?? ''}
        onChange={(e) => update(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
      />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl md:text-3xl text-primary-dark mb-6">Business Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Business Info</h2>
          {field('Business Name', 'name')}
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Phone', 'phone', '+15551234567')}
            {field('Phone (display)', 'phoneDisplay', '(555) 123-4567')}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('WhatsApp Number', 'whatsapp')}
            {field('Email', 'email')}
          </div>
          {field('Address', 'address')}
          {field('Primary City', 'primaryCity')}
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Hours (EN)', 'hoursEn')}
            {field('Hours (ES)', 'hoursEs')}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Trust Settings</h2>
          <p className="text-xs text-gray-400">Leave blank until verified — never auto-populated with placeholder claims.</p>
          {field('License Number', 'licenseNumber')}
          {field('Insurance Info', 'insuranceInfo')}
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Warranty Years', 'warrantyYears')}
            {field('Warranty Info', 'warrantyInfo')}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Google Rating', 'googleRating')}
            {field('Google Review Count', 'googleReviewCount')}
          </div>
          {field('Google Review URL', 'googleReviewUrl')}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Social & Logo</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Instagram', 'instagram')}
            {field('Facebook', 'facebook')}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('YouTube', 'youtube')}
            {field('TikTok', 'tiktok')}
          </div>
          {field('Logo URL', 'logoUrl')}
        </section>

        <button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-secondary text-white text-sm font-medium disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && <span className="ml-3 text-sm text-green-600">Saved.</span>}
      </form>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Service Areas</h2>
        <div className="space-y-2 mb-4">
          {areas.map((a) => (
            <div key={a.id} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5">
              <span className="text-sm text-gray-700">{a.city}{a.state ? `, ${a.state}` : ''}</span>
              <button onClick={() => handleRemoveArea(a.id)} className="text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newArea.city} onChange={(e) => setNewArea((p) => ({ ...p, city: e.target.value }))} placeholder="City" className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          <input value={newArea.state} onChange={(e) => setNewArea((p) => ({ ...p, state: e.target.value }))} placeholder="State" className="w-24 px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
          <button onClick={handleAddArea} type="button" className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">Add</button>
        </div>
      </section>
    </div>
  );
};
