import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="auth-glow-orb left" />
      <div className="auth-glow-orb right" />
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="not-found-icon mx-auto mb-4">
            <AlertTriangle size={48} />
          </div>
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-desc">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            className="btn-primary-custom mt-2"
            onClick={() => navigate('/projects')}
            id="btn-go-home"
          >
            <Home size={16} className="me-2" />
            Go to Projects
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
