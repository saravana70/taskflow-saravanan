import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="mb-3 shadow-sm border-0 bg-body-tertiary h-100 h-hover-float"
      style={{ cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.classList.add('shadow'); } }
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow'); } }
    >
      <Card.Body>

        <Card.Title>{project.name}</Card.Title>

        <Card.Text>
          {project.description || 'No description'}
        </Card.Text>

        <small className="text-muted">
          Created: {new Date(project.created_at).toLocaleDateString()}
        </small>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;