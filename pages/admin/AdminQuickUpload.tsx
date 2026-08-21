import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createJobDraft, uploadJobDraftFile, updateJobDraft } from '../../services/db';
import { INITIAL_SERVICES } from '../../constants';

export const AdminQuickUpload: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [notes, setNotes] = useState('');
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a job/project name.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      setProgressLabel('Saving job…');
      const service = INITIAL_SERVICES.find((s) => s.id === serviceId);
      const draftId = await createJobDraft({
        name,
        location,
        serviceId,
        serviceLabel: service?.title.en,
        beforePhotos: [],
        afterPhotos: [],
        notes,
      });

      const beforeUrls: string[] = [];
      for (let i = 0; i < beforeFiles.length; i++) {
        setProgressLabel(`Uploading before photo ${i + 1}/${beforeFiles.length}…`);
        beforeUrls.push(await uploadJobDraftFile(draftId, beforeFiles[i], 'before'));
      }
      const afterUrls: string[] = [];
      for (let i = 0; i < afterFiles.length; i++) {
        setProgressLabel(`Uploading after photo ${i + 1}/${afterFiles.length}…`);
        afterUrls.push(await uploadJobDraftFile(draftId, afterFiles[i], 'after'));
      }
      let videoUrl: string | undefined;
      if (videoFile) {
        setProgressLabel('Uploading video…');
        videoUrl = await uploadJobDraftFile(draftId, videoFile, 'video');
      }

      await updateJobDraft(draftId, { beforePhotos: beforeUrls, afterPhotos: afterUrls, videoUrl });

      navigate('/admin/quick-upload/saved');
    } catch (err) {
      console.error(err);
      setError('Something went wrong saving this job. Your draft may be partially saved — please check and retry any missing photos.');
    } finally {
      setSaving(false);
      setProgressLabel('');
    }
  };

  const FileButton: React.FC<{
    label: string;
    files: File[] | File | null;
    multiple?: boolean;
    accept: string;
    onChange: (files: FileList | null) => void;
  }> = ({ label, files, multiple, accept, onChange }) => {
    const count = Array.isArray(files) ? files.length : files ? 1 : 0;
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
        <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm cursor-pointer active:bg-gray-50">
          <span>📷</span>
          <span>{count > 0 ? `${count} file${count > 1 ? 's' : ''} selected` : 'Tap to upload'}</span>
          <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => onChange(e.target.files)} />
        </label>
      </div>
    );
  };

  return (
    <div className="max-w-lg">
      <Link to="/admin" className="text-sm text-secondary mb-4 inline-block">&larr; Back to Dashboard</Link>
      <h1 className="font-serif text-2xl text-primary-dark mb-1">Quick Job Upload</h1>
      <p className="text-sm text-gray-500 mb-6">Add a completed job in under 2 minutes. You can polish it into a full project later.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project / Job Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base" placeholder="e.g. Smith Ceiling Repair" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base" placeholder="City, State" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service</label>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base">
            <option value="">Select a service…</option>
            {INITIAL_SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title.en}</option>)}
          </select>
        </div>

        <FileButton label="BEFORE PHOTOS" files={beforeFiles} multiple accept="image/*" onChange={(f) => setBeforeFiles(f ? Array.from(f) : [])} />
        <FileButton label="AFTER PHOTOS" files={afterFiles} multiple accept="image/*" onChange={(f) => setAfterFiles(f ? Array.from(f) : [])} />
        <FileButton label="OPTIONAL VIDEO" files={videoFile} accept="video/*" onChange={(f) => setVideoFile(f && f[0] ? f[0] : null)} />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base" placeholder="Anything worth remembering about this job…" />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
        {saving && progressLabel && <p className="text-sm text-secondary">{progressLabel}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl bg-secondary text-white font-semibold text-base disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'SAVE DRAFT'}
        </button>
      </div>
    </div>
  );
};

export const AdminQuickUploadSaved: React.FC = () => (
  <div className="max-w-md text-center py-16">
    <div className="text-5xl mb-4">✅</div>
    <h1 className="font-serif text-2xl text-primary-dark mb-2">Job Saved</h1>
    <p className="text-sm text-gray-500 mb-8">This job is saved as a draft. Convert it into a polished, published project any time from Project Management.</p>
    <div className="flex flex-col gap-3">
      <Link to="/admin/quick-upload" className="py-3 rounded-xl bg-secondary text-white font-semibold">Upload Another Job</Link>
      <Link to="/admin" className="py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold">Back to Dashboard</Link>
    </div>
  </div>
);
