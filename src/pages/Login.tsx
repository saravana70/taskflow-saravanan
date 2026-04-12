import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });

      // Save in context + localStorage
      login(data.token, data.user);

      navigate('/projects');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };

      const msg =
        axiosErr.response?.data?.error ||
        'Invalid credentials. Please try again.';

      setError(msg);
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
                <LogIn size={28} />
              </div>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to your TaskFlow account</p>
            </div>

            <Card className="auth-card">
              <Card.Body className="p-4">
                {error && (
                  <Alert
                    variant="danger"
                    className="auth-alert"
                    onClose={() => setError(null)}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  {/* EMAIL */}
                  <Form.Group className="mb-3" controlId="login-email">
                    <Form.Label className="form-label-custom">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-control-custom"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-4" controlId="login-password">
                    <Form.Label className="form-label-custom">Password</Form.Label>

                    <div className="password-input-wrap">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="form-control-custom"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Form.Group>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    className="btn-primary-custom w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Signing in…
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <p className="text-center mt-4 auth-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;