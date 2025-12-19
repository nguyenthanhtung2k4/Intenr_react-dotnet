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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}
    >
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={logo}
              className="w-12 h-12 object-contain relative z-10 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300"
              alt="Bowling League"
            />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-tighter leading-none">
              Bowling
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { path: '/fixtures', label: 'Fixtures' },
            { path: '/standings', label: 'Standings' },
            { path: '/stats', label: 'Stats' },
            { path: '/teams', label: 'Teams' },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="font-bold text-sm uppercase tracking-wide text-slate-700 hover:text-pink-600 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all group-hover:w-full"></span>
            </Link>
          ))}

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/bowlers"
                className="font-bold text-sm uppercase text-slate-900 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="btn-sports btn-outline px-6 py-2 text-xs border-2 hover:bg-slate-900 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-sports btn-gradient px-8 py-2.5 text-xs shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button (Placeholder) */}
        <button className="md:hidden p-2 text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
