import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, History, ListTodo, Settings } from 'lucide-react';
import { useState } from 'react';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: '/dashboard', label: 'Dashboard Home', icon: <Home size={18} /> },
    { to: '/dashboard/quiz-history', label: 'Quiz History', icon: <History size={18} /> },
    { to: '/dashboard/organize-quiz', label: 'Organize Quiz', icon: <ListTodo size={18} /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];
  return (
    <>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)}></div>
      )}
      {/* Side Panel */}
      <aside
        className={`bg-base-200 shadow-lg flex flex-col gap-2 py-8 px-4 z-50
        fixed md:static top-0 left-0 h-full w-64 transition-transform duration-200
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minHeight: '100vh' }}
      >
        <nav className="flex flex-col gap-2 mt-8 md:mt-0">
          {links.map(link => (
            <button
              key={link.to}
              className={`btn btn-ghost justify-start text-left ${location.pathname === link.to ? 'btn-active bg-primary/10' : ''}`}
              onClick={() => { setMenuOpen(false); navigate(link.to); }}
            >
              <span className="mr-2">{link.icon}</span>{link.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;