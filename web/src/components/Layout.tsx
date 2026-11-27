// Layout — the frame around every page (React version of _Layout.cshtml in Subapp 1).
// Same order as Subapp 1: skip link, the navbar, then the page. (Step 11 adds the pixel room.)
// <Outlet /> is where the current page is drawn, like @RenderBody() in Razor.

import { Outlet } from 'react-router';
import NavMenu from './NavMenu';

export default function Layout() {
  return (
    <>
      <a className="visually-hidden-focusable" href="#main">
        Skip to content
      </a>

      <header>
        <NavMenu />
      </header>

      <main className="pixel-main" id="main">
        <div className="pixel-panel">
          <Outlet />
        </div>
      </main>
    </>
  );
}