import { CheckCircle, Clock, ListTodo, Activity } from 'lucide-react';

export default function DashboardAnalytics({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;

  const progressPercentage = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="glass-panel mb-4" style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-between align-center mb-3">
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} className="text-primary" />
          Productivity Overview
        </h3>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
          {progressPercentage}% Completed
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${progressPercentage}%`, 
            background: 'var(--color-primary)', 
            transition: 'width 0.5s ease-out',
            boxShadow: 'var(--shadow-glow)'
          }} 
        />
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        
        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: 'none' }}>
          <div className="d-flex align-center mb-1" style={{ color: 'var(--color-text-muted)', gap: '0.5rem' }}>
            <ListTodo size={16} /> Total Tasks
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{total}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: 'none', borderLeft: '3px solid #00ff66' }}>
          <div className="d-flex align-center mb-1" style={{ color: '#00ff66', gap: '0.5rem' }}>
            <CheckCircle size={16} /> Done
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{done}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: 'none', borderLeft: '3px solid #f59e0b' }}>
          <div className="d-flex align-center mb-1" style={{ color: '#f59e0b', gap: '0.5rem' }}>
            <Clock size={16} /> In Progress
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{inProgress}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: 'none', borderLeft: '3px solid #3b82f6' }}>
          <div className="d-flex align-center mb-1" style={{ color: '#3b82f6', gap: '0.5rem' }}>
            <ListTodo size={16} /> To Do
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{todo}</div>
        </div>

      </div>
    </div>
  );
}
