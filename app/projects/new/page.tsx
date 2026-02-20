'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

const CONTRACT_TYPES = [
  'Lump Sum',
  'Schedule of Rates',
  'Cost Plus',
  'Design & Construct',
  'EPC',
];

export default function NewProjectPage() {
  const router = useRouter();
  const { addProject } = useAppStore();

  const [form, setForm] = useState({
    name: '',
    client: '',
    referenceNumber: '',
    contractType: 'Lump Sum',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Project name is required';
    if (!form.client.trim()) e.client = 'Client is required';
    return e;
  }

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const project = addProject({
      name: form.name.trim(),
      client: form.client.trim(),
      contractType: form.contractType,
      referenceNumber: form.referenceNumber.trim() || undefined,
      description: form.description.trim() || undefined,
    });
    router.push(`/projects/${project.id}`);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/projects" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#64748b', textDecoration: 'none', fontSize: 13,
          marginBottom: 16,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Projects
        </Link>
        <div className="label-tag" style={{ marginBottom: 4 }}>New Project</div>
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#0f172a',
        }}>
          Create Project
        </h1>
      </div>

      {/* Form Card */}
      <div style={{
        maxWidth: 640,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gradient top border */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
        }} />

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Project Name */}
            <div>
              <label className="vc-label">Project Name *</label>
              <input
                className="vc-input"
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Westgate Tunnel Section 4B"
              />
              {errors.name && (
                <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.name}</div>
              )}
            </div>

            {/* Client */}
            <div>
              <label className="vc-label">Client / Head Contractor *</label>
              <input
                className="vc-input"
                type="text"
                value={form.client}
                onChange={e => handleChange('client', e.target.value)}
                placeholder="e.g. West Gate Tunnel Authority"
              />
              {errors.client && (
                <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.client}</div>
              )}
            </div>

            {/* Reference Number + Contract Type in a row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="vc-label">Reference Number</label>
                <input
                  className="vc-input"
                  type="text"
                  value={form.referenceNumber}
                  onChange={e => handleChange('referenceNumber', e.target.value)}
                  placeholder="e.g. PRJ-2024-001"
                />
              </div>
              <div>
                <label className="vc-label">Contract Type</label>
                <select
                  className="vc-input"
                  value={form.contractType}
                  onChange={e => handleChange('contractType', e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {CONTRACT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="vc-label">Description</label>
              <textarea
                className="vc-input"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Brief project description (optional)"
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Link
                href="/projects"
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  display: 'inline-block',
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 24px',
                  background: submitting ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget.style.background = '#2563eb'); }}
                onMouseLeave={e => { if (!submitting) (e.currentTarget.style.background = '#3b82f6'); }}
              >
                {submitting ? 'Creating…' : 'Create Project'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
