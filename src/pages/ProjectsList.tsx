import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { Plus, FolderOpen } from 'lucide-react';
import { getProjects, createProject } from '../api/projects';
import type { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import AppNavbar from '../components/AppNavbar';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProjects();

      // Ensure list is array in case of null values
      const list = Array.isArray(data?.projects) ? data.projects : [];
      setProjects(list);
    } catch {
      setError('Failed to load projects.');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      setCreateError('Project name is required.');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await createProject({
        name: newName,
        description: newDescription,
      });

      setShowModal(false);
      setNewName('');
      setNewDescription('');
      fetchProjects();
    } catch {
      setCreateError('Failed to create project.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <AppNavbar />

      <Container className="pt-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="mb-0">My Projects</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} className="me-1" /> New Project
          </Button>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : !Array.isArray(projects) || projects.length === 0 ? (
          <div className="text-center">
            <FolderOpen size={40} />
            <p>No projects yet</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {projects.map((p) => (
              <Col key={p.id}>
                <ProjectCard project={p} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleCreateProject}>
          <Modal.Header closeButton>
            <Modal.Title>Create Project</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}

            <Form.Control
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <Form.Control
              className="mt-2"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectsList;