import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2 } from 'lucide-react';

export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }) {
  const columns = {
    todo: {
      name: 'To Do',
      items: tasks.filter(t => t.status === 'todo'),
      color: '#3b82f6' // Blue
    },
    in_progress: {
      name: 'In Progress',
      items: tasks.filter(t => t.status === 'in_progress'),
      color: '#f59e0b' // Yellow
    },
    done: {
      name: 'Done',
      items: tasks.filter(t => t.status === 'done'),
      color: '#00ff66' // Green
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return 'var(--color-text-muted)';
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;
    
    // Only trigger update if it was dropped in a different column
    if (sourceStatus !== destStatus) {
      onStatusChange(result.draggableId, destStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div 
        className="kanban-board custom-scrollbar" 
        style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          overflowX: 'auto', 
          paddingBottom: '1rem',
          minHeight: '60vh',
          alignItems: 'flex-start'
        }}
      >
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="kanban-column" style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Column Header */}
            <div className="d-flex align-center justify-between mb-3 glass-panel" style={{ padding: '1rem', borderTop: `4px solid ${column.color}` }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{column.name}</h3>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {column.items.length}
              </span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.03)' : 'transparent',
                    borderRadius: 'var(--radius-lg)',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'background 0.2s ease',
                    padding: '0.5rem'
                  }}
                >
                  {column.items.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="glass-panel"
                          style={{
                            ...provided.draggableProps.style,
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            transform: snapshot.isDragging ? `${provided.draggableProps.style.transform} scale(1.02)` : provided.draggableProps.style.transform,
                            cursor: 'grab',
                            boxShadow: snapshot.isDragging ? '0 15px 30px rgba(0,0,0,0.5)' : 'var(--shadow-surface)',
                            border: snapshot.isDragging ? `1px solid ${column.color}` : '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div className="d-flex justify-between align-center mb-1">
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: getPriorityColor(task.priority), padding: '0.2rem 0.6rem', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                              {task.priority?.toUpperCase()}
                            </span>
                          </div>
                          
                          <h4 style={{ margin: '0.5rem 0 0.5rem 0', wordBreak: 'break-word', fontSize: '1.1rem' }}>{task.title}</h4>
                          <div 
                            className="text-muted kanban-description" 
                            style={{ fontSize: '0.85rem', marginBottom: '1.25rem', flex: 1, wordBreak: 'break-word' }}
                            dangerouslySetInnerHTML={{ __html: task.description || 'No description provided.' }}
                          />
                          
                          <div className="d-flex justify-between align-center" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="d-flex flex-column" style={{ gap: '0.2rem' }}>
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                Created: {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                              {task.dueDate && (
                                <span style={{ fontSize: '0.75rem', color: new Date(task.dueDate) < new Date() ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                              <button className="btn-icon" onClick={() => onEdit(task)} title="Edit" style={{ padding: '0.4rem' }}>
                                <Edit2 size={16} />
                              </button>
                              <button className="btn-icon" onClick={() => onDelete(task.id)} style={{ color: 'var(--color-danger)', padding: '0.4rem' }} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
