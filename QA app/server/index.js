const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use('/uploads', express.static(uploadsDir));

// ── TEST CASES ──────────────────────────────────────────────────────────────
app.get('/api/test-cases', (req, res) => {
  const cases = db.all('test_cases').reverse();
  res.json(cases.map(c => ({ ...c, steps: typeof c.steps === 'string' ? JSON.parse(c.steps) : c.steps })));
});

app.post('/api/test-cases', (req, res) => {
  const { title, module, steps, expected_result } = req.body;
  const row = db.insert('test_cases', { title, module: module || '', steps: steps || [], expected_result: expected_result || '' });
  res.json({ id: row.id });
});

app.put('/api/test-cases/:id', (req, res) => {
  const { title, module, steps, expected_result } = req.body;
  db.update('test_cases', req.params.id, { title, module: module || '', steps: steps || [], expected_result: expected_result || '' });
  res.json({ success: true });
});

app.delete('/api/test-cases/:id', (req, res) => {
  db.delete('test_cases', req.params.id);
  res.json({ success: true });
});

// ── BUILDS ──────────────────────────────────────────────────────────────────
app.get('/api/builds', (req, res) => {
  res.json(db.all('builds').reverse());
});

app.post('/api/builds', (req, res) => {
  const { name, version, notes } = req.body;
  const row = db.insert('builds', { name, version: version || '', notes: notes || '' });
  res.json(row);
});

// ── TEST RUNS ────────────────────────────────────────────────────────────────
app.get('/api/runs', (req, res) => {
  const runs = db.all('test_runs').reverse();
  const builds = db.all('builds');
  const results = db.all('run_results');

  const enriched = runs.map(r => {
    const build = builds.find(b => b.id === r.build_id) || {};
    const rr = results.filter(x => x.run_id === r.id);
    return {
      ...r,
      build_name: build.name || null,
      version: build.version || null,
      total_cases: rr.length,
      passed:  rr.filter(x => x.status === 'pass').length,
      failed:  rr.filter(x => x.status === 'fail').length,
      skipped: rr.filter(x => x.status === 'skip').length,
      pending: rr.filter(x => x.status === 'pending').length,
    };
  });
  res.json(enriched);
});

app.post('/api/runs', (req, res) => {
  const { build_id, test_case_ids } = req.body;
  const run = db.insert('test_runs', { build_id: build_id || null, status: 'in_progress' });
  for (const tcId of test_case_ids) {
    db.insert('run_results', { run_id: run.id, test_case_id: tcId, status: 'pending', notes: '' });
  }
  res.json({ id: run.id });
});

app.get('/api/runs/:id', (req, res) => {
  const runId = Number(req.params.id);
  const run = db.get('test_runs', { id: runId });
  if (!run) return res.status(404).json({ error: 'Not found' });
  const build = db.get('builds', { id: run.build_id }) || {};
  const rr = db.all('run_results', { run_id: runId });
  const testCases = db.all('test_cases');
  const results = rr.map(r => {
    const tc = testCases.find(c => c.id === r.test_case_id) || {};
    return {
      ...r,
      title: tc.title || '',
      module: tc.module || '',
      steps: tc.steps || [],
      expected_result: tc.expected_result || '',
    };
  });
  res.json({ ...run, build_name: build.name || null, version: build.version || null, results });
});

app.put('/api/runs/:runId/results/:resultId', (req, res) => {
  const { status, notes } = req.body;
  db.update('run_results', req.params.resultId, { status, notes: notes || '' });
  res.json({ success: true });
});

app.put('/api/runs/:id/complete', (req, res) => {
  db.update('test_runs', req.params.id, { status: 'completed' });
  res.json({ success: true });
});

// ── BUGS ─────────────────────────────────────────────────────────────────────
app.get('/api/bugs/export', (req, res) => {
  const bugs = db.all('bugs').reverse();
  const builds = db.all('builds');
  const header = ['ID', 'Title', 'Severity', 'Status', 'Build', 'Steps', 'Actual Result', 'Expected Result', 'Browser', 'Created'];
  const rows = bugs.map(b => {
    const build = builds.find(x => x.id === b.build_id) || {};
    return [b.id, b.title, b.severity, b.status, build.name || '', b.steps, b.actual_result, b.expected_result, b.browser_info, b.created_at];
  });
  const csv = [header, ...rows]
    .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bugs-export.csv"');
  res.send(csv);
});

app.get('/api/bugs', (req, res) => {
  const { status } = req.query;
  const builds = db.all('builds');
  let bugs = db.all('bugs').reverse();
  if (status) bugs = bugs.filter(b => b.status === status);
  const enriched = bugs.map(b => {
    const build = builds.find(x => x.id === b.build_id) || {};
    return { ...b, build_name: build.name || null, version: build.version || null };
  });
  res.json(enriched);
});

app.post('/api/bugs', upload.single('screenshot'), (req, res) => {
  const { build_id, run_id, test_case_id, title, severity, steps, actual_result, expected_result, browser_info } = req.body;
  const screenshot_path = req.file ? `/uploads/${req.file.filename}` : '';
  const row = db.insert('bugs', {
    build_id: build_id ? Number(build_id) : null,
    run_id: run_id ? Number(run_id) : null,
    test_case_id: test_case_id ? Number(test_case_id) : null,
    title, severity: severity || 'medium',
    steps: steps || '', actual_result: actual_result || '', expected_result: expected_result || '',
    screenshot_path, browser_info: browser_info || '', status: 'open',
  });
  res.json({ id: row.id });
});

app.put('/api/bugs/:id/status', (req, res) => {
  db.update('bugs', req.params.id, { status: req.body.status });
  res.json({ success: true });
});

app.put('/api/bugs/:id', (req, res) => {
  const { title, severity, steps, actual_result, expected_result, status } = req.body;
  db.update('bugs', req.params.id, { title, severity, steps, actual_result, expected_result, status });
  res.json({ success: true });
});

app.delete('/api/bugs/:id', (req, res) => {
  db.delete('bugs', req.params.id);
  res.json({ success: true });
});

// ── STATS ─────────────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const bugs = db.all('bugs');
  const runs = db.all('test_runs');
  const results = db.all('run_results');
  const builds = db.all('builds');

  const totalTestCases = db.all('test_cases').length;
  const openBugs     = bugs.filter(b => b.status === 'open').length;
  const retestQueue  = bugs.filter(b => b.status === 'fixed').length;
  const totalRuns    = runs.length;

  let recentRun = null;
  if (runs.length > 0) {
    const last = [...runs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    const build = builds.find(b => b.id === last.build_id) || {};
    const rr = results.filter(r => r.run_id === last.id);
    recentRun = {
      id: last.id,
      build_name: build.name || null,
      created_at: last.created_at,
      total: rr.length,
      passed:  rr.filter(r => r.status === 'pass').length,
      failed:  rr.filter(r => r.status === 'fail').length,
      skipped: rr.filter(r => r.status === 'skip').length,
    };
  }

  res.json({ totalTestCases, openBugs, retestQueue, totalRuns, recentRun });
});

// ── JOB BOARD ─────────────────────────────────────────────────────────────────

const jobCache = { data: null, ts: 0, sources: {}, TTL: 30 * 60 * 1000 };

function getJobConfig() {
  const data = db.raw();
  return data.job_config || { rapidapi_key: '', adzuna_app_id: '', adzuna_app_key: '', country: 'in' };
}

async function fetchRemotive() {
  const res = await fetch('https://remotive.com/api/remote-jobs?category=qa&limit=100');
  if (!res.ok) throw new Error(`Remotive ${res.status}`);
  const json = await res.json();
  return (json.jobs || []).map(j => ({
    id: `remotive-${j.id}`,
    source: 'Remotive',
    title: j.title,
    company: j.company_name,
    logo: j.company_logo || '',
    location: j.candidate_required_location || 'Remote',
    url: j.url,
    posted: j.publication_date,
    salary: j.salary || '',
    type: j.job_type || '',
    tags: (j.tags || []).slice(0, 6),
    remote: true,
    description: '',
  }));
}

function mapJSearchJob(j) {
  return {
    id: `jsearch-${j.job_id}`,
    source: j.job_publisher || 'JSearch',
    title: j.job_title,
    company: j.employer_name,
    logo: j.employer_logo || '',
    location: j.job_is_remote
      ? 'Remote'
      : [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', '),
    url: j.job_apply_link,
    posted: j.job_posted_at_datetime_utc,
    salary: j.job_min_salary
      ? `${j.job_salary_currency || ''}${Math.round(j.job_min_salary)}${j.job_max_salary ? ' – ' + Math.round(j.job_max_salary) : ''} ${j.job_salary_period || ''}`
      : '',
    type: j.job_employment_type || '',
    tags: (j.job_required_skills || []).slice(0, 6),
    remote: !!j.job_is_remote,
    description: j.job_description ? j.job_description.slice(0, 250).trimEnd() + '…' : '',
  };
}

async function jsearchQuery(q, key, pages = 2) {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(q)}&num_pages=${pages}&date_posted=month`;
  const res = await fetch(url, {
    headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
  });
  if (!res.ok) throw new Error(`JSearch ${res.status}`);
  const json = await res.json();
  return (json.data || []).map(mapJSearchJob);
}

async function fetchJSearch(key) {
  if (!key) return [];
  // Run two parallel queries: one India-specific, one global remote
  const [india, remote] = await Promise.allSettled([
    jsearchQuery('QA engineer quality assurance India', key, 2),
    jsearchQuery('QA engineer quality assurance remote', key, 2),
  ]);
  const seen = new Set();
  const results = [];
  for (const r of [india, remote]) {
    if (r.status === 'fulfilled') {
      for (const j of r.value) {
        if (!seen.has(j.id)) { seen.add(j.id); results.push(j); }
      }
    }
  }
  return results;
}

async function fetchAdzuna(query, appId, appKey, country) {
  if (!appId || !appKey) return [];
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(query)}&results_per_page=50&content-type=application/json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Adzuna ${res.status}`);
  const json = await res.json();
  return (json.results || []).map(j => ({
    id: `adzuna-${j.id}`,
    source: 'Adzuna',
    title: j.title,
    company: j.company?.display_name || '',
    logo: '',
    location: j.location?.display_name || '',
    url: j.redirect_url,
    posted: j.created,
    salary: j.salary_min ? `${Math.round(j.salary_min)}${j.salary_max ? ' – ' + Math.round(j.salary_max) : ''}` : '',
    type: j.contract_time || '',
    tags: j.category?.label ? [j.category.label] : [],
    remote: false,
    description: j.description ? j.description.slice(0, 250).trimEnd() + '…' : '',
  }));
}

app.get('/api/jobs', async (req, res) => {
  const { query = 'QA engineer quality assurance tester', refresh } = req.query;
  const config = getJobConfig();

  if (!refresh && jobCache.data && Date.now() - jobCache.ts < jobCache.TTL) {
    return res.json({ jobs: jobCache.data, cached: true, sources: jobCache.sources });
  }

  const [rem, jsearch, adz] = await Promise.allSettled([
    fetchRemotive(),
    fetchJSearch(config.rapidapi_key),
    fetchAdzuna(query, config.adzuna_app_id, config.adzuna_app_key, config.country || 'in'),
  ]);

  const jobs = [
    ...(rem.status === 'fulfilled' ? rem.value : []),
    ...(jsearch.status === 'fulfilled' ? jsearch.value : []),
    ...(adz.status === 'fulfilled' ? adz.value : []),
  ].sort((a, b) => new Date(b.posted) - new Date(a.posted));

  jobCache.data = jobs;
  jobCache.ts = Date.now();
  jobCache.sources = {
    Remotive: rem.status === 'fulfilled' ? { ok: true, count: rem.value.length } : { ok: false, error: rem.reason?.message },
    JSearch:  jsearch.status === 'fulfilled' ? { ok: true, count: jsearch.value.length } : { ok: false, error: jsearch.reason?.message },
    Adzuna:   adz.status === 'fulfilled' ? { ok: true, count: adz.value.length } : { ok: false, error: adz.reason?.message },
  };

  res.json({ jobs, cached: false, sources: jobCache.sources });
});

app.get('/api/jobs/config', (req, res) => res.json(getJobConfig()));

app.post('/api/jobs/config', (req, res) => {
  const data = db.raw();
  data.job_config = { ...getJobConfig(), ...req.body };
  db.saveRaw(data);
  jobCache.data = null;
  res.json({ success: true });
});

app.get('/api/jobs/saved', (req, res) => {
  const data = db.raw();
  res.json((data.saved_jobs || []).reverse());
});

app.post('/api/jobs/saved', (req, res) => {
  const data = db.raw();
  if (!data.saved_jobs) data.saved_jobs = [];
  const job = req.body;
  if (!data.saved_jobs.find(j => j.id === job.id)) {
    data.saved_jobs.push({ ...job, saved_at: new Date().toISOString() });
    db.saveRaw(data);
  }
  res.json({ success: true });
});

app.delete('/api/jobs/saved/:id', (req, res) => {
  const data = db.raw();
  data.saved_jobs = (data.saved_jobs || []).filter(j => j.id !== decodeURIComponent(req.params.id));
  db.saveRaw(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n  QA Assistant Server  →  http://localhost:${PORT}\n`);
});
