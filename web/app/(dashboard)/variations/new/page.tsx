'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  color: '#0f172a',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  fontFamily: "'DM Sans', sans-serif",
  marginBottom: 6,
};

export default function NewVariationPage() {
  const router = useRouter();
  const { projects, addVariation } = useAppStore();

  const [form, setForm] = useState({
    projectId: projects[0]?.id ?? '',
    title: '',
    description: '',
    value: '',
    status: 'Captured' as 'Captured' | 'Submitted' | 'Approved' | 'Paid' | 'Disputed',
    instructionSource: '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.projectId)    e.projectId = 'Select a project';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.value || isNaN(parseFloat(form.value)) || parseFloat(form.value) < 0)
      e.value = 'Enter a valid dollar amount';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    addVariation({
      projectId:        form.projectId,
      title:            form.title.trim(),
      description:      form.description.trim(),
      value:            Math.round(parseFloat(form.value) * 100),
      status:           form.status,
      instructionSource: form.instructionSource.trim() || 'Not specified',
      evidenceCount:    0,
    });
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ─── Fixed Header ─── */}
      <header style={{
        position: 'fixed', top: 0, left: 220, right: 0, zIndex: 100,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              padding: '6px 10px', borderRadius: 6,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#3b82f6')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <span style={{ color: '#e2e8f0' }}>/</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 17,
            letterSpacing: '-0.02em', color: '#0f172a',
          }}>
            New Variation
          </span>
        </div>
      </header>

      {/* ─── Content ─── */}
      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: '48px 40px', maxWidth: 720 }}>

          <div className="label-tag">Capture Variation</div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {/* Gradient top border */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />

            <div style={{ padding: '32px' }}>

              {/* Project */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Project <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={form.projectId}
                  onChange={e => set('projectId', e.target.value)}
                  style={{ ...inputStyle, color: form.projectId ? '#0f172a' : '#94a3b8' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  <option value="" disabled>Select a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.projectId && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{errors.projectId}</div>}
              </div>

              {/* Title */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Variation Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Additional drainage works — Zone C"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.title ? '#ef4444' : '#e2e8f0' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.title ? '#ef4444' : '#e2e8f0')}
                />
                {errors.title && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{errors.title}</div>}
              </div>

              {/* Description */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  placeholder="Describe the scope of work or change that this variation covers…"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                />
              </div>

              {/* Value + Status row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Value ($) <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    }}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.value}
                      onChange={e => set('value', e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 28, borderColor: errors.value ? '#ef4444' : '#e2e8f0' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                      onBlur={e => (e.currentTarget.style.borderColor = errors.value ? '#ef4444' : '#e2e8f0')}
                    />
                  </div>
                  {errors.value && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{errors.value}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => set('status', e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  >
                    <option value="Captured">Draft (Captured)</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Disputed">Disputed</option>
                  </select>
                </div>
              </div>

              {/* Instruction source */}
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Instruction Source</label>
                <input
                  type="text"
                  placeholder="e.g. Site instruction SI-047, email from J. Smith on 18 Feb"
                  value={form.instructionSource}
                  onChange={e => set('instructionSource', e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => router.back()}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: 14,
                    color: '#64748b', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  style={{
                    padding: '10px 24px',
                    background: saving ? '#93c5fd' : '#3b82f6',
                    border: 'none',
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: 14,
                    color: '#ffffff', cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#2563eb'; }}
                  onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#3b82f6'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {saving ? 'Saving…' : 'Save Variation'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
