import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Modal from '../components/Modal.jsx';

const EMPTY_FORM = { title: '', module: '', steps: [''], expected_result: '' };

export default function TestCases() {
  const [cases, setCases] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | { ...editCase }
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await api.getTestCases().catch(() => []);
    setCases(data);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setModal('add');
  }

  function openEdit(tc) {
    setForm({
      title: tc.title,
      module: tc.module || '',
      steps: tc.steps.length ? tc.steps : [''],
      expected_result: tc.expected_result,
    });
    setModal(tc);
  }

  function closeModal() { setModal(null); }

  function setStep(i, val) {
    setForm(f => {
      const steps = [...f.steps];
      steps[i] = val;
      return { ...f, steps };
    });
  }

  function addStep() {
    setForm(f => ({ ...f, steps: [...f.steps, ''] }));
  }

  function removeStep(i) {
    setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    const data = {
      title: form.title.trim(),
      module: form.module.trim(),
      steps: form.steps.filter(s => s.trim()),
      expected_result: form.expected_result.trim(),
    };
    if (modal === 'add') {
      await api.createTestCase(data);
    } else {
      await api.updateTestCase(modal.id, data);
    }
    setSaving(false);
    closeModal();
    load();
  }

  async function del(id) {
    if (!confirm('Delete this test case?')) return;
    await api.deleteTestCase(id);
    load();
  }

  const filtered = cases.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.module || '').toLowerCase().includes(search.toLowerCase())
  );

  const modules = [...new Set(cases.map(c => c.module).filter(Boolean))];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Test Cases</h1>
          <p>{cases.length} test case{cases.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Test Case</button>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title or module..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">=</div>
            <h3>No test cases yet</h3>
            <p>Add your first test case to get started</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Module</th>
                  <th>Steps</th>
                  <th>Expected Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tc, i) => (
                  <tr key={tc.id}>
                    <td className="text-muted">{tc.id}</td>
                    <td style={{ fontWeight: 500 }}>{tc.title}</td>
                    <td>
                      {tc.module ? (
                        <span className="badge badge-fixed">{tc.module}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="text-muted">{tc.steps.length} step{tc.steps.length !== 1 ? 's' : ''}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tc.expected_result}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(tc)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(tc.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Add Test Case' : 'Edit Test Case'}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || !form.title.trim()}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Verify login with valid credentials"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Module / Feature area</label>
            <input
              type="text"
              value={form.module}
              onChange={e => setForm(f => ({ ...f, module: e.target.value }))}
              placeholder="e.g. Authentication, Checkout, Dashboard"
              list="module-list"
            />
            <datalist id="module-list">
              {modules.map(m => <option key={m} value={m} />)}
            </datalist>
          </div>
          <div className="form-group">
            <label>Steps to Execute</label>
            <div className="steps-list">
              {form.steps.map((s, i) => (
                <div className="step-item" key={i}>
                  <span className="step-num">{i + 1}</span>
                  <input
                    type="text"
                    value={s}
                    onChange={e => setStep(i, e.target.value)}
                    placeholder={`Step ${i + 1}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); addStep(); }
                    }}
                  />
                  {form.steps.length > 1 && (
                    <button className="btn-icon" onClick={() => removeStep(i)} title="Remove step">&#x2212;</button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={addStep}>+ Add step</button>
          </div>
          <div className="form-group">
            <label>Expected Result *</label>
            <textarea
              value={form.expected_result}
              onChange={e => setForm(f => ({ ...f, expected_result: e.target.value }))}
              placeholder="What should happen when all steps are executed correctly?"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
