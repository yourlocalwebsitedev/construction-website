import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { adminSignOut } from '../../services/auth';
import { useAdminAuth } from './AdminAuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '🏠' },
  { to: '/admin/leads', label: 'Leads', icon: '📋' },
  { to: '/admin/projects', label: 'Projects', icon: '🖼️' },
  { to: '/admin/quick-upload', label: 'Quick Upload', icon: '⚡' },
  { to: '/admin/services', label: 'Services', icon: '🛠️' },
  { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export const AdminShell: React.FC = () => {
  const { user } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminSignOut();
    navigate('/admin');
  };

  const navLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-primary-dark text-white flex items-center justify-between px-4 h-14">
        <span className="font-serif text-lg">K&amp;L Admin</span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="p-2 -mr-2"
        >
          <span className="text-2xl leading-none">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Sidebar (desktop) / dropdown (mobile) */}
      <nav
        className={`${menuOpen ? 'block' : 'hidden'} md:block bg-white md:w-64 md:min-h-screen md:border-r border-gray-200 p-3 md:p-4`}
      >
        <div className="hidden md:block mb-6 px-2">
          <span className="font-serif text-xl text-primary-dark">K&amp;L Admin</span>
          {user?.email && <p className="text-xs text-gray-400 mt-1 truncate">{user.email}</p>}
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
        <a
          href="#/"
          className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
        >
          <span>🌐</span>
          <span>View Public Site</span>
        </a>
      </nav>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
