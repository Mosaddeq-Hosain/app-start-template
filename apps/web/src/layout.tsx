import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="shell">
      <header>
        <NavLink className="wordmark" to="/">Field Notes</NavLink>
        <nav aria-label="Main navigation">
          <NavLink to="/">Notes</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
