import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, CheckSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = React.useState(
    () => document.documentElement.getAttribute('data-bs-theme') || 'dark'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="app-navbar" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/projects" className="navbar-brand-custom">
          <CheckSquare size={22} className="me-2 brand-icon" />
          <span className="brand-text">TaskFlow</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {user && (
              <div className="user-pill">
                <User size={15} className="me-1" />
                <span>{user.name}</span>
              </div>
            )}
            <Button
              variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              id="btn-logout"
            >
              <LogOut size={15} className="me-1" />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
