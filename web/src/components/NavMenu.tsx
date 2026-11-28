// NavMenu — the navigation bar at the top of every page (Demo 10: NavMenu.tsx).
// Which links you see depends on who you are (conditional rendering with &&).

import { Link } from 'react-router';
import { Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../context/useAuth';
import AuthSection from './AuthSection';

export default function NavMenu() {
  const { user, isTeacher } = useAuth();

  return (
    <Navbar expand="lg" className="pixel-nav px-3">
      <Navbar.Brand as={Link} to={user ? '/dashboard' : '/'}>Study Buddy</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {/* Only logged-in users have a dashboard */}
          {user && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
          {/* Only teachers can manage courses */}
          {isTeacher && <Nav.Link as={Link} to="/courses">Manage courses</Nav.Link>}
        </Nav>
        <AuthSection />
      </Navbar.Collapse>
    </Navbar>
  );
}