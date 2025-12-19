import { useState, useEffect } from 'react';
import logo from './BLE-logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

interface HeaderProps {
  title: string;
  description: string;
}

function Header(props: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''
        }`}
      style={{
        backgroundColor: scrolled
          ? 'var(--color-bg)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'
          }`,
      }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="focus:outline-none transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={logo}
              className="w-12 h-12 object-contain"
              alt="Bowling League Logo"
            />
          </Link>

          <div className="hidden md:block">
            <h1
              className="text-xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {props.title}
            </h1>
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {props.description}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 rounded-md font-medium transition-colors text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Home
          </Link>
          <Link
            to="/fixtures"
            className="px-4 py-2 rounded-md font-medium transition-colors text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Fixtures
          </Link>
          <Link
            to="/standings"
            className="px-4 py-2 rounded-md font-medium transition-colors text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Standings
          </Link>
          <Link
            to="/stats"
            className="px-4 py-2 rounded-md font-medium transition-colors text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Players
          </Link>
          <Link
            to="/teams"
            className="px-4 py-2 rounded-md font-medium transition-colors text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Teams
          </Link>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-4">
              <Link
                to="/bowlers"
                className="px-4 py-2 rounded-md font-medium transition-colors text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-bg-secondary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                Admin
              </Link>
              <button onClick={logout} className="btn btn-outline text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-sm ml-4">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
