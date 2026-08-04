import { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';

const BASE = '/api';
async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}
async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}
async function apiDel(path) { await fetch(`${BASE}${path}`, { method: 'DELETE' }); }

// ── Location classifier ───────────────────────────────────────────────────────
const INDIA_KEYWORDS = [
  'india', 'bangalore', 'bengaluru', 'mumbai', 'hyderabad', 'chennai', 'pune',
  'delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'kolkata', 'ahmedabad',
  'kochi', 'coimbatore', 'jaipur', 'chandigarh', 'nagpur', 'visakhapatnam',
  'surat', 'vadodara', 'lucknow', 'indore', 'bhopal', 'bhubaneswar', 'mysore',
  'trivandrum', 'thiruvananthapuram', 'secunderabad', 'navi mumbai', 'thane',
];

function classifyJob(job) {
  const loc  = (job.location || '').toLowerCase();
  const tags = (job.tags || []).join(' ').toLowerCase();
  const title = (job.title || '').toLowerCase();

  const isRemote = job.remote
    || loc.includes('remote')
    || loc.includes('work from home')
    || loc.includes('wfh')
    || loc.includes('anywhere')
    || tags.includes('remote')
    || title.includes('remote');

  const isIndia = INDIA_KEYWORDS.some(k => loc.includes(k));

  // International = foreign country, may or may not be remote
  const isInternational = !isIndia;

  return { isRemote, isIndia, isInternational };
}

const ADZUNA_COUNTRIES = [
  { code: 'in', label: 'India' }, { code: 'gb', label: 'UK' },
  { code: 'us', label: 'USA' },  { code: 'au', label: 'Australia' },
  { code: 'ca', label: 'Canada' }, { code: 'de', label: 'Germany' },
  { code: 'sg', label: 'Singapore' },
];

const SOURCE_COLORS = {
  Remotive: '#7c3aed', LinkedIn: '#0077b5', Indeed: '#003087',
  Glassdoor: '#0caa41', ZipRecruiter: '#4f9cf9', Adzuna: '#e8412b', JSearch: '#ea580c',
};
function srcColor(s) { return SOURCE_COLORS[s] || '#64748b'; }

function timeAgo(d) {
  if (!d) return '';
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── Location badge ────────────────────────────────────────────────────────────
function LocationBadge({ job }) {
  const { isRemote, isIndia, isInternational } = classifyJob(job);
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {isIndia && (
        <span className="badge" style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc02' }}>
          India
        </span>
      )}
      {isRemote && (
        <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
          Remote / WFH
        </span>
      )}
      {isInternational && !isRemote && (
        <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>
          International
        </span>
      )}
      {isInternational && isRemote && (
        <span className="badge" style={{ background: '#ede9fe', color: '#5b21b6' }}>
          Foreign Remote
        </span>
      )}
    </span>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  {
    id: 'all',
    label: 'All Jobs',
    color: '#64748b',
    match: () => true,
    desc: 'All available QA job listings',
  },
  {
    id: 'india',
    label: 'India',
    color: '#e65100',
    match: (j) => classifyJob(j).isIndia,
    desc: 'Jobs physically located in Indian cities',
  },
  {
    id: 'remote',
    label: 'Remote / WFH',
    color: '#065f46',
    match: (j) => classifyJob(j).isRemote,
    desc: 'Fully remote or work-from-home positions (any country)',
  },
  {
    id: 'foreign-remote',
    label: 'Foreign Remote',
    color: '#5b21b6',
    match: (j) => { const c = classifyJob(j); return c.isInternational && c.isRemote; },
    desc: 'Remote jobs at foreign companies — work from India',
  },
  {
    id: 'international',
    label: 'International',
    color: '#1e40af',
    match: (j) => classifyJob(j).isInternational,
    desc: 'Jobs outside India (remote + onsite abroad)',
  },
  {
    id: 'saved',
    label: 'Saved',
    color: '#b45309',
    match: () => true, // handled separately
    desc: 'Your saved / bookmarked jobs',
  },
];

export default function Jobs() {
  const [jobs, setJobs]         = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [sources, setSources]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [cached, setCached]     = useState(false);
  const [error, setError]       = useState('');
  const [tab, setTab]           = useState('all');
  const [search, setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig]     = useState({ rapidapi_key: '', adzuna_app_id: '', adzuna_app_key: '', country: 'in' });
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => { loadConfig(); loadSaved(); fetchJobs(false); }, []);

  async function loadConfig() {
    const c = await apiGet('/jobs/config').catch(() => ({}));
    setConfig(c);
  }
  async function loadSaved() {
    const list = await apiGet('/jobs/saved').catch(() => []);
    setSavedJobs(list);
    setSavedIds(new Set(list.map(j => j.id)));
  }
  async function fetchJobs(refresh = false) {
    setLoading(true); setError('');
    try {
      const data = await apiGet(`/jobs${refresh ? '?refresh=1' : ''}`);
      setJobs(data.jobs || []);
      setSources(data.sources || {});
      setCached(!!data.cached);
    } catch {
      setError('Could not reach the server. Make sure the app is running.');
    }
    setLoading(false);
  }
  async function toggleSave(job) {
    if (savedIds.has(job.id)) {
      await apiDel(`/jobs/saved/${encodeURIComponent(job.id)}`);
    } else {
      await apiPost('/jobs/saved', job);
    }
    loadSaved();
  }
  async function saveConfig() {
    setSavingConfig(true);
    await apiPost('/jobs/config', config);
    setSavingConfig(false);
    setShowSettings(false);
    fetchJobs(true);
  }

  // ── Apply filters ─────────────────────────────────────────────────────────
  const activeTab = TABS.find(t => t.id === tab);
  const baseList = tab === 'saved' ? savedJobs : jobs;

  const counts = Object.fromEntries(
    TABS.map(t => [t.id, t.id === 'saved'
      ? savedJobs.length
      : jobs.filter(t.match).length
    ])
  );

  const displayJobs = baseList
    .filter(j => tab === 'saved' || activeTab.match(j))
    .filter(j => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (j.title || '').toLowerCase().includes(q) ||
        (j.company || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q) ||
        (j.tags || []).some(t => t.toLowerCase().includes(q))
      );
    })
    .filter(j => {
      if (typeFilter === 'all') return true;
      return (j.type || '').toLowerCase().includes(typeFilter);
    });

  const sourceStatus = Object.entries(sources);

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1>QA Job Board</h1>
          <p style={{ marginTop: 2 }}>
            {loading ? 'Fetching jobs…'
              : `${displayJobs.length} jobs shown · ${jobs.length} total${cached ? ' (cached 30 min)' : ''}`}
            {!loading && sourceStatus.length > 0 && (
              <span style={{ marginLeft: 8 }}>
                {sourceStatus.filter(([, s]) => s.ok).map(([name, s]) => (
                  <span key={name} style={{ marginRight: 5, fontSize: 11, background: srcColor(name), color: '#fff', padding: '1px 7px', borderRadius: 10 }}>
                    {name} {s.count}
                  </span>
                ))}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => fetchJobs(true)} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
            API Settings
          </button>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* ── Source warnings ── */}
      {!loading && sourceStatus.some(([, s]) => !s.ok) && (
        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>
          <strong>More sources available:</strong>{' '}
          {sourceStatus.filter(([, s]) => !s.ok).map(([name]) => (
            <span key={name} style={{ marginRight: 8 }}>
              {name !== 'Remotive' ? (
                <><strong>{name}</strong> — <button className="btn btn-ghost btn-sm" onClick={() => setShowSettings(true)}>add API key</button></>
              ) : null}
            </span>
          ))}
        </div>
      )}

      {/* ── Location filter tabs ── */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 8 }}>Filter by Location</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 20,
                border: `2px solid ${tab === t.id ? t.color : 'var(--border)'}`,
                background: tab === t.id ? t.color : '#fff',
                color: tab === t.id ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13,
                transition: 'all .15s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {t.label}
              <span style={{
                background: tab === t.id ? 'rgba(255,255,255,.25)' : t.color,
                color: '#fff',
                borderRadius: 10,
                padding: '0px 7px',
                fontSize: 11,
                fontWeight: 700,
              }}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
        {activeTab && (
          <p style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>{activeTab.desc}</p>
        )}
      </div>

      {/* ── Search + type filter ── */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search title, company, skill, location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 150 }}>
          <option value="all">All job types</option>
          <option value="full">Full-time</option>
          <option value="part">Part-time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
          <option value="intern">Internship</option>
        </select>
        <span className="text-muted" style={{ marginLeft: 'auto' }}>
          Showing {displayJobs.length} of {tab === 'saved' ? savedJobs.length : jobs.filter(activeTab?.match || (() => true)).length}
        </span>
      </div>

      {/* ── Job list ── */}
      {loading ? (
        <div className="loading" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#8635;</div>
          <div>Pulling QA jobs from multiple sources…</div>
          <div className="text-muted" style={{ marginTop: 6, fontSize: 12 }}>Remotive · JSearch · Adzuna</div>
        </div>
      ) : displayJobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">&#128269;</div>
            <h3>
              {tab === 'saved' ? 'No saved jobs' :
               tab === 'india' ? 'No India jobs found' :
               tab === 'remote' ? 'No remote jobs found' :
               tab === 'foreign-remote' ? 'No foreign remote jobs found' :
               'No jobs match your filters'}
            </h3>
            <p style={{ marginTop: 6 }}>
              {tab === 'saved'
                ? 'Save interesting jobs from other tabs — they appear here.'
                : tab === 'foreign-remote'
                ? 'Add JSearch (RapidAPI) key in settings to get remote jobs from LinkedIn/Indeed.'
                : 'Try adjusting your search or add more API sources in Settings.'}
            </p>
          </div>
        </div>
      ) : (
        displayJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            saved={savedIds.has(job.id)}
            onSave={() => toggleSave(job)}
          />
        ))
      )}

      {/* ── API Settings modal ── */}
      {showSettings && (
        <Modal
          title="Job Source Settings"
          onClose={() => setShowSettings(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveConfig} disabled={savingConfig}>
                {savingConfig ? 'Saving…' : 'Save & Refresh Jobs'}
              </button>
            </>
          }
        >
          <div className="success-msg" style={{ fontSize: 12, marginBottom: 16 }}>
            <strong>Remotive</strong> works out-of-the-box — no key needed. Add keys below to unlock
            LinkedIn, Indeed, Glassdoor, and India-specific jobs.
          </div>

          {/* JSearch */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ background: srcColor('JSearch'), color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                JSearch
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Aggregates LinkedIn · Indeed · Glassdoor · ZipRecruiter — 500 free calls/month
              </span>
            </div>
            <div className="form-group" style={{ marginBottom: 4 }}>
              <label>RapidAPI Key</label>
              <input
                type="password"
                value={config.rapidapi_key}
                onChange={e => setConfig(c => ({ ...c, rapidapi_key: e.target.value }))}
                placeholder="Paste your X-RapidAPI-Key"
              />
            </div>
            <div className="text-muted" style={{ fontSize: 11 }}>
              Register free → rapidapi.com → search "JSearch" → Subscribe to Basic (free) → copy key
            </div>
          </div>

          {/* Adzuna */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ background: srcColor('Adzuna'), color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                Adzuna
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Great India coverage · 250 free calls/day
              </span>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label>App ID</label>
                <input
                  type="text"
                  value={config.adzuna_app_id}
                  onChange={e => setConfig(c => ({ ...c, adzuna_app_id: e.target.value }))}
                  placeholder="adzuna app_id"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>App Key</label>
                <input
                  type="password"
                  value={config.adzuna_app_key}
                  onChange={e => setConfig(c => ({ ...c, adzuna_app_key: e.target.value }))}
                  placeholder="adzuna app_key"
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Country for Adzuna search</label>
              <select value={config.country} onChange={e => setConfig(c => ({ ...c, country: e.target.value }))}>
                {ADZUNA_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 4 }}>
              Register free → developer.adzuna.com → Create App → copy app_id and app_key
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave }) {
  const [expanded, setExpanded] = useState(false);
  const { isIndia, isRemote, isInternational } = classifyJob(job);

  return (
    <div
      className="card"
      style={{
        marginBottom: 10,
        borderLeft: `4px solid ${isIndia ? '#e65100' : isRemote ? '#10b981' : '#3730a3'}`,
      }}
    >
      <div className="card-body" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

          {/* Logo / initial */}
          {job.logo ? (
            <img
              src={job.logo} alt={job.company}
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 6, background: srcColor(job.source), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
              {(job.company || job.source || '?')[0].toUpperCase()}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <a
                href={job.url} target="_blank" rel="noopener noreferrer"
                style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent)', textDecoration: 'none' }}
                onMouseOver={e => e.target.style.textDecoration = 'underline'}
                onMouseOut={e => e.target.style.textDecoration = 'none'}
              >
                {job.title}
              </a>
              <LocationBadge job={job} />
            </div>

            <div style={{ marginTop: 5, fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{job.company}</span>
              {job.location && <span>&#128205; {job.location}</span>}
              {job.type && <span>&#128197; {job.type}</span>}
              {job.salary && (
                <span style={{ color: 'var(--pass)', fontWeight: 600 }}>
                  &#128178; {job.salary}
                </span>
              )}
              <span>&#128337; {timeAgo(job.posted)}</span>
            </div>

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {job.tags.slice(0, 6).map((t, i) => (
                  <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {job.description && expanded && (
              <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text)', background: '#f8fafc', padding: '10px 12px', borderRadius: 6, lineHeight: 1.6 }}>
                {job.description}
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
            <span style={{ fontSize: 11, background: srcColor(job.source), color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
              {job.source}
            </span>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {job.description && (
                <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(e => !e)}>
                  {expanded ? 'Less' : 'Preview'}
                </button>
              )}
              <button
                className={`btn btn-sm ${saved ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={onSave}
                style={saved ? {} : { borderColor: 'var(--accent)', color: 'var(--accent)' }}
                title={saved ? 'Remove from saved' : 'Save this job'}
              >
                {saved ? '&#10003; Saved' : 'Save'}
              </button>
              <a
                href={job.url} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                Apply &#8599;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
