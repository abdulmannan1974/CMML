import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Droplets } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/disease/cmml', label: 'CMML' },
  { to: '/diagnostic', label: 'Diagnostic' },
  { to: '/cases', label: 'Cases' },
  { to: '/reference', label: 'Reference' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-white/80 backdrop-blur-sm py-4',
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-med-red rounded flex items-center justify-center text-white font-serif font-bold shadow-sm">
            B
          </div>
          <div className="flex items-center gap-1 font-serif font-bold text-lg tracking-tight">
            <span className="text-slate-900">Blood</span>
            <Droplets size={18} className="text-red-600 fill-red-600" />
            <span className="text-red-700">Doctor</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'text-[10px] font-black tracking-widest uppercase transition-colors',
                location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                  ? 'text-med-red'
                  : 'text-slate-500 hover:text-slate-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="lg:hidden text-slate-900 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-4">
          <div className="container mx-auto px-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  'text-xs font-bold uppercase tracking-widest py-2',
                  location.pathname === link.to
                    ? 'text-med-red'
                    : 'text-slate-500',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
