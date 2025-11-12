import { Outlet, Link } from 'react-router-dom';
import './Header.css';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <div className="mb5">
      <nav className="navbar navbar-expand-lg bg-primary-subtle fixed-top justify-content-evenly mb-5">
        <Link to="/" className="text-black">
          <h1>A Gift from Duncan</h1>
        </Link>
        <Link to="Favorites" className="text-blue">
          <h3>Favorites</h3>
        </Link>
        <Link to="Create" className="text-blue">
          <h3>Create</h3>
        </Link>
        <button
          className="btn btn-primary"
          onClick={() => {
            handleSignOut();
            navigate('/');
          }}>
          Sign Out
        </button>
        {/* <ul className="list-group list-group-horizontal bg-primary-subtle">
          <li className="list-group-item flex-fill bg-primary-subtle"></li>
          <li className="list-group-item flex-fill bg-primary-subtle"></li>
          <li className="list-group-item flex-fill bg-primary-subtle"></li>
        </ul> */}
      </nav>
      {<Outlet />}
    </div>
  );
}
