const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'qa-data.json');

const DEFAULT = {
  test_cases: [], builds: [], test_runs: [], run_results: [], bugs: [],
  _seq: { test_cases: 0, builds: 0, test_runs: 0, run_results: 0, bugs: 0 },
};

function load() {
  if (!fs.existsSync(DB_FILE)) return JSON.parse(JSON.stringify(DEFAULT));
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return JSON.parse(JSON.stringify(DEFAULT)); }
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function now() { return new Date().toISOString(); }

const db = {
  insert(table, obj) {
    const data = load();
    data._seq[table] = (data._seq[table] || 0) + 1;
    const row = { id: data._seq[table], created_at: now(), ...obj };
    data[table].push(row);
    save(data);
    return row;
  },

  all(table, where = {}) {
    const data = load();
    const rows = data[table] || [];
    return rows.filter(r => Object.entries(where).every(([k, v]) => r[k] === v));
  },

  get(table, where = {}) {
    return this.all(table, where)[0] || null;
  },

  update(table, id, patch) {
    const data = load();
    const idx = data[table].findIndex(r => r.id === Number(id));
    if (idx !== -1) data[table][idx] = { ...data[table][idx], ...patch, updated_at: now() };
    save(data);
    return idx !== -1;
  },

  delete(table, id) {
    const data = load();
    const before = data[table].length;
    data[table] = data[table].filter(r => r.id !== Number(id));
    save(data);
    return data[table].length < before;
  },

  raw() { return load(); },
  saveRaw(data) { save(data); },
};

module.exports = db;
