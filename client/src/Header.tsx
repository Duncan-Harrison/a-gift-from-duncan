import { Outlet, Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <div className="fixed-top">
      <nav className="navbar navbar-expand-lg bg-primary-subtle">
        <ul className="list-group list-group-horizontal bg-primary-subtle">
          <li className="list-group-item bg-primary-subtle">
            <Link to="/" className="text-black">
              A Gift From Duncan
            </Link>
          </li>
          <li className="list-group-item bg-primary-subtle">
            <Link to="Create" className="text-blue">
              Create
            </Link>
          </li>
        </ul>
      </nav>
      {<Outlet />}
    </div>
  );
}
