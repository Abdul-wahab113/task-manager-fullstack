import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import TaskModal from '../components/TaskModal';
import KanbanBoard from '../components/KanbanBoard';
import DashboardAnalytics from '../components/DashboardAnalytics';
import LogoMark from '../components/LogoMark';
import { Plus, LogOut, AlertCircle, Search, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getAll();
      if (response.success) {
        setTasks(response.data || []);
      }
    } catch {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await taskService.update(editingTask.id, taskData);
    } else {
      await taskService.create(taskData);
    }
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        fetchTasks();
      } catch {
        alert('Failed to delete task');
      }
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await taskService.update(taskId, { status: newStatus });
    } catch {
      setTasks(originalTasks);
      alert('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Top navigation */}
      <header className="app-nav">
        <div className="app-nav-inner">
          <Link to="/" className="app-logo">
            <LogoMark />
            Tasker
          </Link>
          <div className="d-flex align-center" style={{ gap: '0.875rem' }}>
            <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
              Welcome,{' '}
              <strong style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                {user?.username}
              </strong>
            </span>
            <span
              title={user?.username}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--color-primary)', color: '#fff',
                fontSize: '0.75rem', fontWeight: 500,
                display: 'grid', placeItems: 'center',
              }}
            >
              {(user?.username || '?').slice(0, 2).toUpperCase()}
            </span>
            <button onClick={logout} className="btn btn-secondary" style={{ height: 36 }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Analytics */}
        {!loading && !error && tasks.length > 0 && (
          <div className="mb-4">
            <DashboardAnalytics tasks={tasks} />
          </div>
        )}

        {/* Section header */}
        <div
          className="d-flex justify-between align-center mb-3 tasks-header"
          style={{ gap: '1rem' }}
        >
          <div>
            <div className="mono-label">Your board</div>
            <h2 style={{ margin: '0.15rem 0 0', fontSize: '1.35rem' }}>Tasks</h2>
          </div>
          <button onClick={openNewTaskModal} className="btn btn-primary">
            <Plus size={17} /> New task
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.75rem', maxWidth: 420 }}>
          <Search
            size={16}
            style={{
              position: 'absolute', left: '0.85rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search tasks…"
            className="form-control"
            style={{ paddingLeft: '2.35rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {error && (
          <div
            className="d-flex align-center mb-3"
            style={{
              padding: '0.875rem 1rem',
              background: 'var(--color-danger-soft)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-muted text-center" style={{ padding: '4rem' }}>
            Loading tasks…
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            subtitle="Create your first task to get started."
            onAction={openNewTaskModal}
          />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            subtitle={`We couldn't find any tasks matching "${searchQuery}".`}
          />
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            user={user}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </>
  );
}

function EmptyState({ title, subtitle, onAction }) {
  return (
    <div
      className="surface-card text-center"
      style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <span
        style={{
          width: 48, height: 48, borderRadius: 'var(--radius-lg)',
          background: 'var(--color-surface-2)', color: 'var(--color-text-muted)',
          display: 'grid', placeItems: 'center', marginBottom: '1rem',
        }}
      >
        <ClipboardList size={22} />
      </span>
      <h3 style={{ marginBottom: '0.35rem', fontSize: '1.1rem', fontWeight: 500 }}>{title}</h3>
      <p className="text-muted" style={{ marginBottom: onAction ? '1.5rem' : 0, maxWidth: 360 }}>
        {subtitle}
      </p>
      {onAction && (
        <button onClick={onAction} className="btn btn-primary">
          <Plus size={17} /> Create task
        </button>
      )}
    </div>
  );
}
