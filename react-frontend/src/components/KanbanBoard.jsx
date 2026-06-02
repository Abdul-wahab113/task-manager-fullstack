import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2, Calendar, GripVertical } from 'lucide-react';
import DOMPurify from 'dompurify';
import { priorityMeta, statusMeta, STATUS_ORDER, initials } from '../lib/taskMeta';

export default function KanbanBoard({ tasks, user, onEdit, onDelete, onStatusChange }) {
  const userInitials = initials(user?.username || '');

  const columns = STATUS_ORDER.map((status) => ({
    id: status,
    ...statusMeta(status),
    items: tasks.filter((t) => t.status === status),
  }));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;
    if (sourceStatus !== destStatus) {
      onStatusChange(result.draggableId, destStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="kanban-board custom-scrollbar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
          gap: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          minHeight: '60vh',
          alignItems: 'flex-start',
        }}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column"
            style={{ display: 'flex', flexDirection: 'column', minWidth: '300px' }}
          >
            {/* Column header */}
            <div
              className="d-flex align-center justify-between"
              style={{ padding: '0.25rem 0.5rem 0.875rem' }}
            >
              <div className="d-flex align-center" style={{ gap: '0.5rem' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: column.color,
                  }}
                />
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{column.label}</h3>
                <span
                  className="mono-label"
                  style={{
                    background: 'var(--color-surface-2)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {column.items.length}
                </span>
              </div>
            </div>

            {/* Droppable area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver
                      ? 'var(--color-surface-2)'
                      : 'transparent',
                    border: `1px solid ${
                      snapshot.isDraggingOver ? 'var(--color-border-strong)' : 'transparent'
                    }`,
                    borderRadius: 'var(--radius-lg)',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'background 0.18s ease, border-color 0.18s ease',
                    padding: '0.5rem',
                  }}
                >
                  {column.items.map((task, index) => {
                    const pr = priorityMeta(task.priority);
                    const overdue = task.dueDate && new Date(task.dueDate) < new Date();
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="surface-card"
                            style={{
                              ...provided.draggableProps.style,
                              padding: '0.875rem',
                              display: 'flex',
                              flexDirection: 'column',
                              cursor: 'grab',
                              boxShadow: snapshot.isDragging
                                ? 'var(--shadow-lg)'
                                : 'var(--shadow-sm)',
                              borderColor: snapshot.isDragging
                                ? 'var(--color-border-strong)'
                                : 'var(--color-border)',
                            }}
                          >
                            {/* top row: priority pill + grip */}
                            <div
                              className="d-flex justify-between align-center"
                              style={{ marginBottom: '0.5rem' }}
                            >
                              <span
                                className="mono-label"
                                style={{
                                  color: pr.color,
                                  background: pr.soft,
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.65rem',
                                }}
                              >
                                {pr.label}
                              </span>
                              <GripVertical
                                size={15}
                                style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                              />
                            </div>

                            <h4
                              style={{
                                margin: '0 0 0.4rem',
                                wordBreak: 'break-word',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                fontFamily: 'var(--font-sans)',
                                lineHeight: 1.4,
                              }}
                            >
                              {task.title}
                            </h4>

                            <div
                              className="text-muted kanban-description"
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-text-secondary)',
                                marginBottom: '0.875rem',
                                flex: 1,
                                wordBreak: 'break-word',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  task.description || 'No description provided.'
                                ),
                              }}
                            />

                            {/* footer */}
                            <div
                              className="d-flex justify-between align-center"
                              style={{
                                paddingTop: '0.75rem',
                                borderTop: '1px solid var(--color-border)',
                              }}
                            >
                              <div className="d-flex align-center" style={{ gap: '0.4rem' }}>
                                <span
                                  title={user?.username || 'You'}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: 500,
                                    display: 'grid',
                                    placeItems: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {userInitials}
                                </span>
                                {task.dueDate ? (
                                  <span
                                    className="d-inline-flex align-center"
                                    style={{
                                      gap: '0.3rem',
                                      fontSize: '0.72rem',
                                      color: overdue
                                        ? 'var(--color-danger)'
                                        : 'var(--color-text-muted)',
                                    }}
                                  >
                                    <Calendar size={12} />
                                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      color: 'var(--color-text-muted)',
                                    }}
                                  >
                                    No due date
                                  </span>
                                )}
                              </div>

                              <div className="d-flex" style={{ gap: '0.2rem' }}>
                                <button
                                  className="btn-icon"
                                  onClick={() => onEdit(task)}
                                  title="Edit"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  onClick={() => onDelete(task.id)}
                                  title="Delete"
                                  style={{ color: 'var(--color-text-muted)' }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = 'var(--color-danger)')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = 'var(--color-text-muted)')
                                  }
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}

                  {column.items.length === 0 && !snapshot.isDraggingOver && (
                    <div
                      style={{
                        border: '1px dashed var(--color-border-strong)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.5rem 1rem',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      Drop tasks here
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
