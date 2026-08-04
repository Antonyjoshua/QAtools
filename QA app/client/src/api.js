const BASE = '/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function json(method, data) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}

export const api = {
  // Stats
  getStats: () => req('/stats'),

  // Test Cases
  getTestCases: () => req('/test-cases'),
  createTestCase: (d) => req('/test-cases', json('POST', d)),
  updateTestCase: (id, d) => req(`/test-cases/${id}`, json('PUT', d)),
  deleteTestCase: (id) => req(`/test-cases/${id}`, { method: 'DELETE' }),

  // Builds
  getBuilds: () => req('/builds'),
  createBuild: (d) => req('/builds', json('POST', d)),

  // Runs
  getRuns: () => req('/runs'),
  createRun: (d) => req('/runs', json('POST', d)),
  getRun: (id) => req(`/runs/${id}`),
  updateResult: (runId, resultId, d) => req(`/runs/${runId}/results/${resultId}`, json('PUT', d)),
  completeRun: (id) => req(`/runs/${id}/complete`, { method: 'PUT' }),

  // Bugs
  getBugs: (status) => req(`/bugs${status ? `?status=${status}` : ''}`),
  createBug: (formData) => fetch(`${BASE}/bugs`, { method: 'POST', body: formData }).then(r => r.json()),
  updateBug: (id, d) => req(`/bugs/${id}`, json('PUT', d)),
  updateBugStatus: (id, status) => req(`/bugs/${id}/status`, json('PUT', { status })),
  deleteBug: (id) => req(`/bugs/${id}`, { method: 'DELETE' }),
  exportUrl: () => `${BASE}/bugs/export`,
};
