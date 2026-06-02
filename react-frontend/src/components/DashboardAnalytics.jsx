import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { STATUS_META } from '../lib/taskMeta';

export default function DashboardAnalytics({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  const stats = [
    { key: 'total', label: 'Total', value: total, icon: ListTodo, color: 'var(--color-text)', soft: 'var(--color-surface-2)' },
    { key: 'todo', label: 'To Do', value: todo, icon: ListTodo, color: STATUS_META.todo.color, soft: STATUS_META.todo.soft },
    { key: 'in_progress', label: 'In Progress', value: inProgress, icon: Clock, color: STATUS_META.in_progress.color, soft: STATUS_META.in_progress.soft },
    { key: 'done', label: 'Done', value: done, icon: CheckCircle2, color: STATUS_META.done.color, soft: STATUS_META.done.soft },
  ];

  // segmented progress bar proportions
  const segments = [
    { value: done, color: STATUS_META.done.color },
    { value: inProgress, color: STATUS_META.in_progress.color },
    { value: todo, color: STATUS_META.todo.color },
  ];

  return (
    <div className="surface-card" style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-between align-center mb-3" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="d-flex align-center" style={{ gap: '0.55rem' }}>
          <span
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
              display: 'grid', placeItems: 'center',
            }}
          >
            <TrendingUp size={17} />
          </span>
          <div>
            <div className="mono-label">Productivity</div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>Overview</h3>
          </div>
        </div>
        <div className="d-flex align-center" style={{ gap: '0.4rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.6rem', color: 'var(--color-text)' }}>
            {progress}%
          </span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>completed</span>
        </div>
      </div>

      {/* Segmented progress bar */}
      <div
        style={{
          display: 'flex',
          height: 8,
          background: 'var(--color-surface-2)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          gap: total > 0 ? 2 : 0,
        }}
      >
        {total > 0 &&
          segments.map((seg, i) =>
            seg.value > 0 ? (
              <div
                key={i}
                style={{
                  width: `${(seg.value / total) * 100}%`,
                  background: seg.color,
                  transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            ) : null
          )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {stats.map((s) => (
          <div
            key={s.key}
            style={{
              padding: '0.875rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
            }}
          >
            <div className="d-flex align-center mb-1" style={{ gap: '0.4rem', color: s.color }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: s.soft }}>
                <s.icon size={13} />
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
