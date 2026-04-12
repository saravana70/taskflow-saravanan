import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerUser } from '../api/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ name: username, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      const data = axiosErr.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow-orb left" />
      <div className="auth-glow-orb right" />
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <div className="text-center mb-4">
              <div className="auth-logo-wrap mx-auto mb-3">
                <UserPlus size={28} />
              </div>
              <h1 className="auth-title">Create account</h1>
              <p className="auth-subtitle">Join TaskFlow and start managing your projects</p>
            </div>

            <Card className="auth-card">
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="auth-alert" onClose={() => setError(null)} dismissible>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="auth-alert">
                    Account created! Redirecting to login…
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="register-username">
                    <Form.Label className="form-label-custom">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="form-control-custom"
                      disabled={isLoading || success}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="register-email">
                    <Form.Label className="form-label-custom">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-control-custom"
                      disabled={isLoading || success}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="register-password">
                    <Form.Label className="form-label-custom">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="form-control-custom"
                      disabled={isLoading || success}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="register-confirm-password">
                    <Form.Label className="form-label-custom">Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="form-control-custom"
                      disabled={isLoading || success}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100"
                    disabled={isLoading || success}
                    id="btn-register-submit"
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Creating account…
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <p className="text-center mt-4 auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
