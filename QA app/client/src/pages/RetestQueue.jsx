import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function RetestQueue() {
  const [bugs, setBugs] = useState([]);
  const [viewBug, setViewBug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.getBugs('fixed').catch(() => []);
    setBugs(data);
    setLoading(false);
  }

  async function verify(id) {
    await api.updateBugStatus(id, 'verified');
    load();
  }

  async function reopen(id) {
    await api.updateBugStatus(id, 'reopened');
    load();
  }

  const severityColor = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Retest Queue</h1>
          <p>
            {bugs.length === 0
              ? 'No bugs waiting for retest'
              : `${bugs.length} bug${bugs.length !== 1 ? 's' : ''} marked fixed — verify them`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : bugs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">@</div>
            <h3>Retest queue is empty</h3>
            <p>When a developer marks a bug as fixed, it will appear here for you to verify.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16, padding: '12px 16px', background: '#fef3c7', borderColor: '#fde68a' }}>
            <p style={{ fontSize: 13, color: '#92400e' }}>
              <strong>How to retest:</strong> Review each bug, reproduce the original scenario, then mark it
              <strong> Verified</strong> (fixed) or <strong>Reopen</strong> (still broken).
            </p>
          </div>

          {bugs.map(bug => (
            <div key={bug.id} className="bug-card" style={{ borderLeft: '4px solid var(--pending)' }}>
              <div className="bug-card-left">
                <div className="bug-meta" style={{ marginBottom: 4 }}>
                  <span className={`badge badge-${severityColor[bug.severity]}`}>{bug.severity}</span>
                  <span className="badge badge-fixed">Fixed — Needs Retest</span>
                  <span className="bug-id">#{bug.id}</span>
                  {bug.build_name && (
                    <span className="bug-id">· {bug.build_name}{bug.version ? ` v${bug.version}` : ''}</span>
                  )}
                  <span className="bug-id">· Reported {new Date(bug.created_at).toLocaleDateString()}</span>
                </div>
                <div className="bug-title">{bug.title}</div>
                {bug.actual_result && (
                  <div className="text-muted" style={{ marginTop: 4, fontSize: 12 }}>
                    Was: {bug.actual_result.length > 100 ? bug.actual_result.slice(0, 100) + '...' : bug.actual_result}
                  </div>
                )}
              </div>
              <div className="bug-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setViewBug(bug)}>View Details</button>
                <button
                  className="btn btn-pass btn-sm"
                  onClick={() => verify(bug.id)}
                  title="Mark as verified — bug is fixed"
                >
                  Verified
                </button>
                <button
                  className="btn btn-fail btn-sm"
                  onClick={() => reopen(bug.id)}
                  title="Reopen — bug still exists"
                >
                  Reopen
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {viewBug && (
        <Modal
          title={`Retest: Bug #${viewBug.id}`}
          onClose={() => setViewBug(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', width: '100%' }}>
              <button className="btn btn-secondary" onClick={() => setViewBug(null)}>Close</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-fail" onClick={() => { reopen(viewBug.id); setViewBug(null); }}>
                  Reopen
                </button>
                <button className="btn btn-pass" onClick={() => { verify(viewBug.id); setViewBug(null); }}>
                  Mark Verified
                </button>
              </div>
            </div>
          }
        >
          <div style={{ marginBottom: 14 }}>
            <div className="bug-meta" style={{ marginBottom: 8 }}>
              <span className={`badge badge-${severityColor[viewBug.severity]}`}>{viewBug.severity}</span>
              {viewBug.build_name && <span className="text-muted">Build: {viewBug.build_name}</span>}
            </div>
            <h3 style={{ fontSize: 16 }}>{viewBug.title}</h3>
          </div>

          {viewBug.steps && (
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <p style={{ fontSize: 13, whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                {viewBug.steps}
              </p>
            </div>
          )}

          <div className="form-row">
            <div>
              <p className="section-title">Original Actual Result</p>
              <p style={{ fontSize: 13, color: 'var(--fail)' }}>{viewBug.actual_result}</p>
            </div>
            {viewBug.expected_result && (
              <div>
                <p className="section-title">Expected Result</p>
                <p style={{ fontSize: 13, color: 'var(--pass)' }}>{viewBug.expected_result}</p>
              </div>
            )}
          </div>

          {viewBug.browser_info && (
            <div style={{ marginTop: 12 }}>
              <p className="section-title">Environment</p>
              <p className="text-muted" style={{ fontSize: 12 }}>{viewBug.browser_info}</p>
            </div>
          )}

          {viewBug.screenshot_path && (
            <div style={{ marginTop: 12 }}>
              <p className="section-title">Screenshot</p>
              <img
                src={viewBug.screenshot_path}
                alt="bug screenshot"
                className="screenshot-preview"
                onClick={() => window.open(viewBug.screenshot_path, '_blank')}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
