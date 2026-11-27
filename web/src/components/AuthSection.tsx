// AuthSection — the right side of the navbar (Demo 10: AuthSection.tsx).
// Logged in:  a dropdown with "Hello, name" and Log out.   Logged out: Log in and Register links.

import { Link, useNavigate } from 'react-router';
import { Nav, Dropdown, Badge } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/useAuth';

export default function AuthSection() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    queryClient.clear(); // forget cached data, so the next user on this computer can't see it
    navigate('/');
  };

  return (
    <Nav className="align-items-lg-center">
      {user ? (
        <Dropdown align="end">
          <Dropdown.Toggle as={Nav.Link} id="dropdown-user">
            Hello, {user.name}{' '}
            <Badge bg={user.role === 'TEACHER' ? 'warning' : 'info'} text="dark">
              {user.role === 'TEACHER' ? 'Teacher' : 'Student'}
            </Badge>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <>
          <Nav.Link as={Link} to="/login">Log in</Nav.Link>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
        </>
      )}
    </Nav>
  );
}