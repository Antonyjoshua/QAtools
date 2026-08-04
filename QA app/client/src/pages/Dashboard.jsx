import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(() => setError('Could not connect to server. Make sure the server is running.'));
  }, []);

  if (error) return (
    <div>
      <div className="page-header"><div><h1>Dashboard</h1></div></div>
      <div className="error-msg">{error}</div>
    </div>
  );

  if (!stats) return <div className="loading">Loading dashboard...</div>;

  const run = stats.recentRun;
  const passRate = run && run.total > 0
    ? Math.round((run.passed / run.total) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your QA activity</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTestCases}</div>
          <div className="stat-label">Test Cases</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{stats.totalRuns}</div>
          <div className="stat-label">Test Runs</div>
        </div>
        <div className="stat-card warn">
          <div className="stat-value">{stats.openBugs}</div>
          <div className="stat-label">Open Bugs</div>
        </div>
        <div className="stat-card info">
          <div className="stat-value">{stats.retestQueue}</div>
          <div className="stat-label">Awaiting Retest</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-body">
            <div className="section-title">Latest Test Run</div>
            {run ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  {run.build_name}
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                  <span style={{ color: 'var(--pass)', fontWeight: 600 }}>Pass: {run.passed}</span>
                  <span style={{ color: 'var(--fail)', fontWeight: 600 }}>Fail: {run.failed}</span>
                  <span style={{ color: 'var(--skip)', fontWeight: 600 }}>Skip: {run.skipped || 0}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Total: {run.total}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-pass" style={{ width: `${(run.passed / run.total) * 100}%` }} />
                  <div className="progress-fail" style={{ width: `${(run.failed / run.total) * 100}%` }} />
                  <div className="progress-skip" style={{ width: `${((run.skipped || 0) / run.total) * 100}%` }} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Pass rate: <strong style={{ color: passRate >= 80 ? 'var(--pass)' : 'var(--fail)' }}>{passRate}%</strong>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>
                No test runs yet.{' '}
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('runs')}>
                  Start a run
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="section-title">Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => onNavigate('test-cases')}>
                + Add Test Case
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('runs')}>
                Start New Test Run
              </button>
              <button className="btn btn-danger" onClick={() => onNavigate('bugs')}>
                Report a Bug
              </button>
              {stats.retestQueue > 0 && (
                <button className="btn btn-ghost" onClick={() => onNavigate('retest')}>
                  {stats.retestQueue} bug{stats.retestQueue !== 1 ? 's' : ''} waiting for retest
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
