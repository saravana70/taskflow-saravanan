import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Pencil, Trash2, Flag, Clock, GripVertical, User } from 'lucide-react';
import { MOCK_USERS } from '../utils/constants';

import type { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div 
      draggable 
      onDragStart={handleDragStart} 
      style={{ cursor: 'grab' }}
      onDragEnd={(e) => { e.currentTarget.style.opacity = '1'; }}
      onDrag={(e) => { e.currentTarget.style.opacity = '0.5'; }}
    >
      <Card className="shadow-sm border-0 h-100 task-card h-hover-float bg-body-tertiary">
      <Card.Body className="d-flex flex-column p-3">
        {/* HEADER: BADGES & DATE */}
        <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
          <Badge bg={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning text-dark' : 'success'}>
            <Flag size={12} className="me-1" />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          {task.due_date && (
            <small className="text-muted d-flex align-items-center">
              <Clock size={12} className="me-1" />
              {task.due_date}
            </small>
          )}
        </div>

        {/* TITLE AND DESC */}
        <Card.Title className="h6 mb-2 fw-semibold lh-base d-flex align-items-start gap-2">
          <GripVertical size={16} className="text-muted mt-1 flex-shrink-0" />
          {task.title}
        </Card.Title>
        <Card.Text className="small text-secondary flex-grow-1 mb-3 ps-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description || <span className="fst-italic text-muted">No description</span>}
        </Card.Text>

        <div className="ps-4 mb-3">
          {task.assignee_id ? (
            <Badge bg="secondary" text="light" className="d-inline-flex align-items-center">
              <User size={12} className="me-1" />
              {MOCK_USERS.find(u => u.id === task.assignee_id)?.name || 'Unknown User'}
            </Badge>
          ) : (
            <Badge bg="light" text="dark" className="border d-inline-flex align-items-center">
              Unassigned
            </Badge>
          )}
        </div>

        {/* FOOTER: ACTIONS */}
        <div className="d-flex justify-content-end gap-2 mt-auto border-top pt-3">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="d-flex align-items-center px-3 rounded-pill"
          >
            <Pencil size={14} className="me-1" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="d-flex align-items-center px-3 rounded-pill"
          >
            <Trash2 size={14} className="me-1" /> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
    </div>
  );
};

export default TaskCard;