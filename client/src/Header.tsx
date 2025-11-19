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
        className="navbar navbar-expand-lg bg-primary-subtle justify-content-evenly fixed-top mb-5">
        <Link to="/" className="navbar-brand text-black">
          <h2>A Gift from Duncan</h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-evenly"
          id="navbarSupportedContent">
          {/* <div className="navbar-nav"> */}
          <Link to="Favorites" className="nav-link text-blue">
            <h3>Favorites</h3>
          </Link>
          <Link to="Create" className="nav-link text-blue">
            <h3>Create</h3>
          </Link>
          <div className="nav-link">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleSignOut();
                navigate('/');
              }}>
              Sign Out
            </button>
            {/* </div> */}
            {/*  */}
          </div>
        </div>
      </nav>

      <div style={{ height: navHeight }} />

      {<Outlet />}
    </div>
  );
}
