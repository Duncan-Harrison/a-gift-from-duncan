import { Outlet, Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <div className="top">
      <nav className="header-text text-white bg-gray-900">
        <ul className="flexor">
          <li className="inline-block py-2 px-4">
            <Link to="/" className="text-black">
              A Gift From Duncan
            </Link>
          </li>
          <li className="inline-block py-2 px-4">
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
