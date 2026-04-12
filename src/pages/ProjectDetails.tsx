import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Modal, Form, Badge } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import { getProject } from '../api/projects';
import { createTask, updateTask, deleteTask } from '../api/tasks';
import type { Project, Task, TaskStatus, TaskPriority, CreateTaskPayload } from '../types';
import TaskCard from '../components/TaskCard';
import AppNavbar from '../components/AppNavbar';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

const DEFAULT_TASK: CreateTaskPayload = {
  title: '',
  description: '',
  assignee_id: '',
  due_date: '',
};

import { MOCK_USERS } from '../utils/constants';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<CreateTaskPayload>(DEFAULT_TASK);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [assigneeFilter, setAssigneeFilter] = useState('');

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProject(id!);
      setProject(data);
      setTasks(data.tasks || []);
      setError(null);
    } catch {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData(DEFAULT_TASK);
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignee_id: task.assignee_id || '',
      due_date: task.due_date || '',
    });
    setModalError(null);
    setShowModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!formData.title.trim()) {
      setModalError('Task title is required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingTask && editingTask.id) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(id!, formData);
      }
      setShowModal(false);
      fetchProjectData(); // Refresh tasks
    } catch {
      setModalError('Failed to save task.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status && (assigneeFilter ? t.assignee_id === assigneeFilter : true));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      // Optimistic UI update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      try {
        await updateTask(taskId, { status: newStatus });
      } catch {
        setError('Failed to update task status.');
        fetchProjectData(); // Revert on failure
      }
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="pt-5 mt-5">
        {loading ? (
          <Spinner animation="border" className="d-block mx-auto mt-5" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-0">{project?.name}</h2>
                <p className="text-secondary mb-0 mt-1">{project?.description}</p>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <Form.Select 
                  size="sm" 
                  value={assigneeFilter} 
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="">All Assignees</option>
                  {MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Form.Select>
                <Button variant="primary" onClick={openCreateModal} className="text-nowrap d-flex align-items-center btn-primary-custom">
                  <Plus size={16} className="me-1" /> New Task
                </Button>
              </div>
            </div>

            <Row className="flex-nowrap overflow-auto pb-3">
              {COLUMNS.map((col, index) => (
                <Col 
                  key={col.status} 
                  className={`min-vw-25 ${index > 0 ? 'border-start px-4' : 'pe-4'}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  <h5 className="mb-4 text-uppercase text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                    {col.label} <Badge bg="secondary" pill className="ms-2">{getTasksByStatus(col.status).length}</Badge>
                  </h5>
                  {getTasksByStatus(col.status).length === 0 ? (
                    <div className="text-center p-4 border rounded border-dashed text-muted">
                      <p className="mb-0 small">No tasks</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {getTasksByStatus(col.status).map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSaveTask}>
          <Modal.Header closeButton>
            <Modal.Title>{editingTask ? 'Edit Task' : 'Create Task'}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {modalError && <Alert variant="danger">{modalError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                placeholder="Task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isSaving}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Task description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSaving}
              />
            </Form.Group>

            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    disabled={isSaving}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    disabled={isSaving}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                value={formData.assignee_id || ''}
                onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
                disabled={isSaving}
              >
                <option value="">Unassigned</option>
                {MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.due_date || ''}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                disabled={isSaving}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectDetails;