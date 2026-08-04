import { useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

export default function TestRuns() {
  const [runs, setRuns] = useState([]);
  const [activeRun, setActiveRun] = useState(null);
  const [showNew, setShowNew] = useState(false);

  // New run form state
  const [builds, setBuilds] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState('');
  const [newBuildName, setNewBuildName] = useState('');
  const [newBuildVer, setNewBuildVer] = useState('');
  const [selectedCases, setSelectedCases] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadRuns(); }, []);

  async function loadRuns() {
    const data = await api.getRuns().catch(() => []);
    setRuns(data);
  }

  async function openNew() {
    const [b, tc] = await Promise.all([api.getBuilds(), api.getTestCases()]);
    setBuilds(b);
    setTestCases(tc);
    setSelectedBuild('');
    setNewBuildName('');
    setNewBuildVer('');
    setSelectedCases(tc.map(c => c.id)); // select all by default
    setShowNew(true);
  }

  function toggleCase(id) {
    setSelectedCases(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function createRun() {
    if (selectedCases.length === 0) return;
    setCreating(true);
    let buildId = selectedBuild;
    if (!buildId && newBuildName.trim()) {
      const b = await api.createBuild({ name: newBuildName.trim(), version: newBuildVer.trim() });
      buildId = b.id;
    }
    const run = await api.createRun({ build_id: buildId || null, test_case_ids: selectedCases });
    setCreating(false);
    setShowNew(false);
    await loadRuns();
    openRun(run.id);
  }

  async function openRun(id) {
    const data = await api.getRun(id);
    setActiveRun(data);
  }

  async function markResult(runId, resultId, status, notes) {
    await api.updateResult(runId, resultId, { status, notes });
    const updated = await api.getRun(runId);
    setActiveRun(updated);
  }

  async function completeRun(id) {
    if (!confirm('Mark this run as completed?')) return;
    await api.completeRun(id);
    const updated = await api.getRun(id);
    setActiveRun(updated);
    loadRuns();
  }

  if (activeRun) return (
    <RunExecution
      run={activeRun}
      onMark={markResult}
      onComplete={completeRun}
      onBack={() => { setActiveRun(null); loadRuns(); }}
    />
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Test Runs</h1>
          <p>{runs.length} run{runs.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ New Test Run</button>
      </div>

      {runs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">&gt;</div>
            <h3>No test runs yet</h3>
            <p>Create a test run to start executing your test cases</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Run #</th>
                  <th>Build</th>
                  <th>Status</th>
                  <th>Pass</th>
                  <th>Fail</th>
                  <th>Skip</th>
                  <th>Total</th>
                  <th>Pass Rate</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {runs.map(r => {
                  const rate = r.total_cases > 0 ? Math.round((r.passed / r.total_cases) * 100) : 0;
                  return (
                    <tr key={r.id}>
                      <td className="text-muted">#{r.id}</td>
                      <td style={{ fontWeight: 500 }}>{r.build_name || '—'}{r.version ? ` v${r.version}` : ''}</td>
                      <td><span className={`badge badge-${r.status}`}>{r.status.replace('_', ' ')}</span></td>
                      <td style={{ color: 'var(--pass)', fontWeight: 600 }}>{r.passed}</td>
                      <td style={{ color: 'var(--fail)', fontWeight: 600 }}>{r.failed}</td>
                      <td style={{ color: 'var(--skip)' }}>{r.skipped}</td>
                      <td>{r.total_cases}</td>
                      <td>
                        <span style={{ color: rate >= 80 ? 'var(--pass)' : rate >= 50 ? 'var(--pending)' : 'var(--fail)', fontWeight: 600 }}>
                          {r.total_cases > 0 ? `${rate}%` : '—'}
                        </span>
                      </td>
                      <td className="text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => openRun(r.id)}>
                          {r.status === 'in_progress' ? 'Continue' : 'View'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNew && (
        <Modal
          title="New Test Run"
          onClose={() => setShowNew(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={createRun}
                disabled={creating || selectedCases.length === 0 || (!selectedBuild && !newBuildName.trim())}
              >
                {creating ? 'Creating...' : `Start Run (${selectedCases.length} cases)`}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Build / Version</label>
            {builds.length > 0 && (
              <select value={selectedBuild} onChange={e => setSelectedBuild(e.target.value)} style={{ marginBottom: 8 }}>
                <option value="">— Create new build —</option>
                {builds.map(b => (
                  <option key={b.id} value={b.id}>{b.name}{b.version ? ` v${b.version}` : ''}</option>
                ))}
              </select>
            )}
            {!selectedBuild && (
              <div className="form-row">
                <input type="text" placeholder="Build name *" value={newBuildName} onChange={e => setNewBuildName(e.target.value)} />
                <input type="text" placeholder="Version (optional)" value={newBuildVer} onChange={e => setNewBuildVer(e.target.value)} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Select Test Cases ({selectedCases.length} selected)</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCases(testCases.map(c => c.id))}>
                Select All
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCases([])}>
                Clear
              </button>
            </div>
            {testCases.length === 0 ? (
              <p className="text-muted">No test cases found. Add some first.</p>
            ) : (
              <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 0' }}>
                {testCases.map(tc => (
                  <label key={tc.id} className="checkbox-label" style={{ padding: '7px 12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedCases.includes(tc.id)}
                      onChange={() => toggleCase(tc.id)}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{tc.title}</div>
                      {tc.module && <div className="text-muted">{tc.module}</div>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function RunExecution({ run, onMark, onComplete, onBack }) {
  const [notes, setNotes] = useState({});
  const [expanded, setExpanded] = useState(null);

  const total = run.results?.length || 0;
  const passed = run.results?.filter(r => r.status === 'pass').length || 0;
  const failed = run.results?.filter(r => r.status === 'fail').length || 0;
  const skipped = run.results?.filter(r => r.status === 'skip').length || 0;
  const pending = run.results?.filter(r => r.status === 'pending').length || 0;
  const remaining = pending;

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 6 }}>
            &#8592; Back to Runs
          </button>
          <h1>Run #{run.id} — {run.build_name || 'No build'}{run.version ? ` v${run.version}` : ''}</h1>
          <p style={{ marginTop: 4 }}>
            <span style={{ color: 'var(--pass)' }}>Pass: {passed}</span>{'  '}
            <span style={{ color: 'var(--fail)' }}>Fail: {failed}</span>{'  '}
            <span style={{ color: 'var(--skip)' }}>Skip: {skipped}</span>{'  '}
            <span style={{ color: 'var(--pending)' }}>Pending: {pending}</span>
          </p>
        </div>
        {run.status === 'in_progress' && remaining === 0 && (
          <button className="btn btn-primary" onClick={() => onComplete(run.id)}>
            Complete Run
          </button>
        )}
        {run.status === 'completed' && (
          <span className="badge badge-completed">Completed</span>
        )}
      </div>

      <div className="progress-bar" style={{ marginBottom: 24, height: 10 }}>
        <div className="progress-pass" style={{ width: `${(passed / total) * 100}%` }} />
        <div className="progress-fail" style={{ width: `${(failed / total) * 100}%` }} />
        <div className="progress-skip" style={{ width: `${(skipped / total) * 100}%` }} />
      </div>

      {run.results?.map(result => (
        <div key={result.id} className={`run-case-card ${result.status}`}>
          <div className="run-case-header">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{result.title}</div>
              {result.module && <div className="text-muted" style={{ marginTop: 2 }}>{result.module}</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className={`badge badge-${result.status}`}>{result.status}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setExpanded(expanded === result.id ? null : result.id)}
              >
                {expanded === result.id ? 'Hide' : 'View steps'}
              </button>
            </div>
            {run.status === 'in_progress' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-pass btn-sm" onClick={() => onMark(run.id, result.id, 'pass', notes[result.id] || '')}>Pass</button>
                <button className="btn btn-fail btn-sm" onClick={() => onMark(run.id, result.id, 'fail', notes[result.id] || '')}>Fail</button>
                <button className="btn btn-skip btn-sm" onClick={() => onMark(run.id, result.id, 'skip', notes[result.id] || '')}>Skip</button>
              </div>
            )}
          </div>

          {expanded === result.id && (
            <div className="run-case-body">
              <div className="section-title" style={{ marginBottom: 8 }}>Steps</div>
              {result.steps?.length > 0 ? result.steps.map((step, i) => (
                <div key={i} className="step-display">
                  <span className="step-dot">{i + 1}</span>
                  <span style={{ fontSize: 13 }}>{step}</span>
                </div>
              )) : <p className="text-muted">No steps defined</p>}
              <div style={{ marginTop: 12 }}>
                <div className="section-title" style={{ marginBottom: 4 }}>Expected Result</div>
                <p style={{ fontSize: 13 }}>{result.expected_result}</p>
              </div>
              {run.status === 'in_progress' && (
                <div style={{ marginTop: 12 }}>
                  <div className="section-title" style={{ marginBottom: 4 }}>Notes (optional)</div>
                  <textarea
                    placeholder="Add notes about this test result..."
                    value={notes[result.id] || result.notes || ''}
                    onChange={e => setNotes(n => ({ ...n, [result.id]: e.target.value }))}
                    style={{ minHeight: 60 }}
                  />
                </div>
              )}
              {run.status === 'completed' && result.notes && (
                <div style={{ marginTop: 12 }}>
                  <div className="section-title" style={{ marginBottom: 4 }}>Notes</div>
                  <p style={{ fontSize: 13 }}>{result.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
