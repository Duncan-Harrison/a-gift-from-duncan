import { Outlet, Link } from 'react-router-dom';
import './Header.css';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <div>
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
          <li className="list-grou-item bg-primary-subtle">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleSignOut();
                navigate('/');
              }}>
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
      {<Outlet />}
    </div>
  );
}
