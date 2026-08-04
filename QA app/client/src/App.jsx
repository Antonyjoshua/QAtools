import { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import TestCases from './pages/TestCases.jsx';
import TestRuns from './pages/TestRuns.jsx';
import BugReporter from './pages/BugReporter.jsx';
import RetestQueue from './pages/RetestQueue.jsx';
import Jobs from './pages/Jobs.jsx';

const PAGES = [
  { id: 'dashboard',  label: 'Dashboard',    icon: '#' },
  { id: 'test-cases', label: 'Test Cases',   icon: '=' },
  { id: 'runs',       label: 'Test Runs',    icon: '>' },
  { id: 'bugs',       label: 'Bug Reports',  icon: '!' },
  { id: 'retest',     label: 'Retest Queue', icon: '@' },
  { id: 'jobs',       label: 'Job Board',    icon: '*' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>QA Assistant</h2>
          <p>Testing made faster</p>
        </div>
        <nav>
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`nav-item ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)}
            >
              <span className="nav-icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {page === 'dashboard'  && <Dashboard onNavigate={setPage} />}
        {page === 'test-cases' && <TestCases />}
        {page === 'runs'       && <TestRuns />}
        {page === 'bugs'       && <BugReporter />}
        {page === 'retest'     && <RetestQueue />}
        {page === 'jobs'       && <Jobs />}
      </main>
    </div>
  );
}
