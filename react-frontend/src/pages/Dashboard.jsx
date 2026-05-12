import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import TaskModal from '../components/TaskModal';
import { Plus, LogOut, Trash2, Edit2, AlertCircle, Search } from 'lucide-react';

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
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskData);
      } else {
        await taskService.create(taskData);
      }
      fetchTasks();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        fetchTasks();
      } catch (err) {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return 'var(--color-text-muted)';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'var(--color-primary)';
      case 'in_progress': return '#8b5cf6';
      default: return 'var(--color-text-muted)';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);
  });

  return (
    <div className="dashboard-container">
      <header className="d-flex justify-between align-center mb-3 glass-panel dashboard-header">
        <h1 className="text-primary" style={{ fontSize: '1.5rem', margin: 0 }}>Tasker</h1>
        <div className="d-flex align-center" style={{ gap: '1.5rem' }}>
          <span className="text-muted">Welcome, <strong className="text-primary">{user?.username}</strong></span>
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="d-flex justify-between align-center mb-3 tasks-header">
        <h2>Your Tasks</h2>
        <button onClick={openNewTaskModal} className="btn btn-primary">
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="mb-4" style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          className="form-control"
          style={{ paddingLeft: '2.5rem', width: '100%', maxWidth: '400px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="d-flex align-center glass-panel mb-3" style={{ padding: '1rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center text-muted" style={{ padding: '4rem' }}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
          <h3 className="text-muted mb-1">No tasks yet</h3>
          <p className="text-muted mb-3">Create your first task to get started.</p>
          <button onClick={openNewTaskModal} className="btn btn-primary">
            <Plus size={18} /> Create Task
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
          <h3 className="text-muted mb-1">No tasks found</h3>
          <p className="text-muted">We couldn't find any tasks matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <div key={task.id} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div className="d-flex justify-between align-center mb-1">
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: getPriorityColor(task.priority), padding: '0.2rem 0.6rem', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  {task.priority?.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: getStatusColor(task.status) }}>
                  {task.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <h3 style={{ margin: '0.5rem 0', wordBreak: 'break-word' }}>{task.title}</h3>

              <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem', wordBreak: 'break-word' }}>
                {task.description || 'No description provided.'}
              </p>

              <div className="d-flex justify-between align-center" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
                <div className="d-flex" style={{ gap: '0.5rem' }}>
                  <button className="btn-icon" onClick={() => openEditModal(task)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(task.id)} style={{ color: 'var(--color-danger)' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </div>
  );
}
