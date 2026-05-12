import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
        <button 
          className="btn-icon" 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X size={20} />
        </button>
        
        <h2 className="mb-3">{initialData ? 'Edit Task' : 'New Task'}</h2>
        
        {typeof error === 'string' && (
          <div className="d-flex align-center glass-panel mb-2" style={{ padding: '0.75rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
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
            />
            {error?.title && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
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
              placeholder="Add more details... (Supports bold, italics, lists, etc.)"
            />
            {error?.description && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {error.description[0]}
              </div>
            )}
          </div>
          
          <div className="d-flex" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label" htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-between" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
