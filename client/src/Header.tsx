import { Outlet, Link } from 'react-router-dom';
import './Header.css';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

export function Header() {
  const { handleSignOut } = useUser();
  const navigate = useNavigate();

  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState<number>(0);
  useEffect(() => {
    const updateHeight = () => setNavHeight(navRef.current?.offsetHeight ?? 0);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="">
      <nav
        ref={navRef}
        className="navbar navbar-expand-lg bg-primary-subtle fixed-top justify-content-evenly mb-5">
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
      </nav>

      <div style={{ height: navHeight }} />

      {<Outlet />}
    </div>
  );
}
