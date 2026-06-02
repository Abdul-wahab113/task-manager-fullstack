import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function TaskModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setStatus(initialData.status || 'todo');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = { title, description, priority, status };
      if (dueDate) {
        payload.dueDate = new Date(dueDate).toISOString();
      }
      await onSave(payload);
      onClose();
    } catch (err) {
      if (err.fieldErrors) {
        setError(err.fieldErrors);
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 24, 27, 0.4)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="surface-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '1.75rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div className="d-flex justify-between align-center mb-3">
          <div>
            <div className="mono-label">{initialData ? 'Edit task' : 'New task'}</div>
            <h2 style={{ margin: '0.15rem 0 0', fontSize: '1.3rem' }}>
              {initialData ? 'Update details' : 'Create a task'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {typeof error === 'string' && (
          <div
            className="d-flex align-center mb-3"
            style={{
              padding: '0.7rem 0.875rem',
              background: 'var(--color-danger-soft)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
            {error?.title && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                {error.title[0]}
              </div>
            )}
          </div>

          <div className="form-group quill-dark">
            <label className="form-label" htmlFor="description">Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Add more details… (bold, italics, lists, links)"
            />
            {error?.description && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                {error.description[0]}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.875rem',
              marginBottom: '1.75rem',
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="priority">Priority</label>
              <select id="priority" className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="status">Status</label>
              <select id="status" className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="dueDate">Due date</label>
              <input type="date" id="dueDate" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="d-flex justify-between" style={{ gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving…' : initialData ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
