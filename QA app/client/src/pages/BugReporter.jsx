import { useState, useEffect, useRef } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const STATUSES = ['all', 'open', 'fixed', 'verified', 'reopened'];

const EMPTY_FORM = {
  title: '', severity: 'high', build_id: '',
  steps: '', actual_result: '', expected_result: '',
  browser_info: navigator.userAgent.split(') ')[0].split('(')[1] || '',
  screenshot: null,
};

export default function BugReporter() {
  const [bugs, setBugs] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [viewBug, setViewBug] = useState(null);
  const fileRef = useRef();

  useEffect(() => { loadBugs(); loadBuilds(); }, [filter]);

  async function loadBugs() {
    const data = await api.getBugs(filter === 'all' ? '' : filter).catch(() => []);
    setBugs(data);
  }

  async function loadBuilds() {
    const data = await api.getBuilds().catch(() => []);
    setBuilds(data);
  }

  function openForm() {
    setForm({ ...EMPTY_FORM, browser_info: navigator.userAgent.split(') ')[0].split('(')[1] || '' });
    setPreview(null);
    setShowForm(true);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, screenshot: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function submit() {
    if (!form.title.trim() || !form.actual_result.trim()) return;
    setSaving(true);
    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('severity', form.severity);
    fd.append('steps', form.steps.trim());
    fd.append('actual_result', form.actual_result.trim());
    fd.append('expected_result', form.expected_result.trim());
    fd.append('browser_info', form.browser_info);
    if (form.build_id) fd.append('build_id', form.build_id);
    if (form.screenshot) fd.append('screenshot', form.screenshot);
    await api.createBug(fd);
    setSaving(false);
    setShowForm(false);
    loadBugs();
  }

  async function updateStatus(id, status) {
    await api.updateBugStatus(id, status);
    loadBugs();
  }

  async function deleteBug(id) {
    if (!confirm('Delete this bug report?')) return;
    await api.deleteBug(id);
    loadBugs();
  }

  const severityColor = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Bug Reports</h1>
          <p>{bugs.length} bug{bugs.length !== 1 ? 's' : ''} {filter !== 'all' ? `(${filter})` : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={api.exportUrl()} download className="btn btn-secondary">Export CSV</a>
          <button className="btn btn-primary" onClick={openForm}>+ Report Bug</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-tabs">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {bugs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <h3>{filter === 'all' ? 'No bugs reported' : `No ${filter} bugs`}</h3>
            <p>{filter === 'all' ? 'Great! Report bugs as you find them.' : 'Try a different filter.'}</p>
          </div>
        </div>
      ) : (
        bugs.map(bug => (
          <div key={bug.id} className="bug-card">
            <div className="bug-card-left">
              <div className="bug-meta" style={{ marginBottom: 4 }}>
                <span className={`badge badge-${severityColor[bug.severity]}`}>{bug.severity}</span>
                <span className={`badge badge-${bug.status}`}>{bug.status}</span>
                <span className="bug-id">#{bug.id}</span>
                {bug.build_name && <span className="bug-id">· {bug.build_name}</span>}
                <span className="bug-id">· {new Date(bug.created_at).toLocaleDateString()}</span>
              </div>
              <div className="bug-title">{bug.title}</div>
              {bug.actual_result && (
                <div className="text-muted" style={{ marginTop: 4, fontSize: 12 }}>
                  Actual: {bug.actual_result.length > 120 ? bug.actual_result.slice(0, 120) + '...' : bug.actual_result}
                </div>
              )}
            </div>
            <div className="bug-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setViewBug(bug)}>View</button>
              {bug.status === 'open' && (
                <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(bug.id, 'fixed')}>
                  Mark Fixed
                </button>
              )}
              {bug.status === 'verified' && (
                <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(bug.id, 'reopened')}>
                  Reopen
                </button>
              )}
              <button className="btn btn-danger btn-sm" onClick={() => deleteBug(bug.id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      {/* Report Bug Modal */}
      {showForm && (
        <Modal
          title="Report Bug"
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={submit}
                disabled={saving || !form.title.trim() || !form.actual_result.trim()}
              >
                {saving ? 'Saving...' : 'Report Bug'}
              </button>
            </>
          }
        >
          <div className="form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Short description of the bug"
                autoFocus
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Severity</label>
              <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                {SEVERITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label>Build</label>
            <select value={form.build_id} onChange={e => setForm(f => ({ ...f, build_id: e.target.value }))}>
              <option value="">— Select build (optional) —</option>
              {builds.map(b => <option key={b.id} value={b.id}>{b.name}{b.version ? ` v${b.version}` : ''}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Steps to Reproduce</label>
            <textarea
              value={form.steps}
              onChange={e => setForm(f => ({ ...f, steps: e.target.value }))}
              placeholder="1. Navigate to...&#10;2. Click on...&#10;3. Observe..."
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label>Actual Result *</label>
              <textarea
                value={form.actual_result}
                onChange={e => setForm(f => ({ ...f, actual_result: e.target.value }))}
                placeholder="What actually happened?"
                style={{ minHeight: 70 }}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Expected Result</label>
              <textarea
                value={form.expected_result}
                onChange={e => setForm(f => ({ ...f, expected_result: e.target.value }))}
                placeholder="What should have happened?"
                style={{ minHeight: 70 }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Browser / Environment</label>
            <input
              type="text"
              value={form.browser_info}
              onChange={e => setForm(f => ({ ...f, browser_info: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Screenshot (optional)</label>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} />
            {preview && (
              <img src={preview} alt="preview" className="screenshot-preview" />
            )}
          </div>
        </Modal>
      )}

      {/* View Bug Modal */}
      {viewBug && (
        <Modal
          title={`Bug #${viewBug.id}`}
          onClose={() => setViewBug(null)}
          footer={
            <button className="btn btn-secondary" onClick={() => setViewBug(null)}>Close</button>
          }
        >
          <div style={{ marginBottom: 12 }}>
            <div className="bug-meta" style={{ marginBottom: 8 }}>
              <span className={`badge badge-${severityColor[viewBug.severity]}`}>{viewBug.severity}</span>
              <span className={`badge badge-${viewBug.status}`}>{viewBug.status}</span>
              {viewBug.build_name && <span className="text-muted">Build: {viewBug.build_name}</span>}
            </div>
            <h3 style={{ fontSize: 16 }}>{viewBug.title}</h3>
          </div>
          {viewBug.steps && (
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <p style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{viewBug.steps}</p>
            </div>
          )}
          <div className="form-row">
            <div>
              <label className="section-title">Actual Result</label>
              <p style={{ fontSize: 13 }}>{viewBug.actual_result}</p>
            </div>
            {viewBug.expected_result && (
              <div>
                <label className="section-title">Expected Result</label>
                <p style={{ fontSize: 13 }}>{viewBug.expected_result}</p>
              </div>
            )}
          </div>
          {viewBug.browser_info && (
            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Browser / Environment</label>
              <p className="text-muted" style={{ fontSize: 12 }}>{viewBug.browser_info}</p>
            </div>
          )}
          {viewBug.screenshot_path && (
            <div className="form-group">
              <label>Screenshot</label>
              <img
                src={viewBug.screenshot_path}
                alt="screenshot"
                className="screenshot-preview"
                style={{ maxHeight: 300 }}
                onClick={() => window.open(viewBug.screenshot_path, '_blank')}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
