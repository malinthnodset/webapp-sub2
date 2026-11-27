// Layout — the frame around every page (React version of _Layout.cshtml in Subapp 1).
// <Outlet /> is where the current page is drawn, like @RenderBody() in Razor.

import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); //read the login state from AuthContext

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header>
        <nav className="navbar pixel-nav px-3">
          <NavLink to="/" className="navbar-brand">
            Study Buddy
          </NavLink>

          <div className="d-flex gap-3 align-items-center">
            <NavLink to="/courses" className="nav-link">
              Courses
            </NavLink>

            {/* Conditional rendering: show Log out OR Log in depending on state */}
            {user ? (
              <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
            )}
          </div>
        </nav>
      </header>

      <main className="pixel-main" id="main">
        <div className="pixel-panel">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Layout;
