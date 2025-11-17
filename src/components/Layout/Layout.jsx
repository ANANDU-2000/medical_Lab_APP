import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Package,
  Bell,
  UserCircle
} from 'lucide-react';
import { useAuthStore } from '../../store';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'staff'] },
    { icon: Users, label: 'Patients', path: '/patients', roles: ['admin', 'staff'] },
    { icon: Package, label: 'Profiles', path: '/admin/profile-manager', roles: ['admin'] },
    { icon: DollarSign, label: 'Financial', path: '/financial', roles: ['admin'] },
    { icon: SettingsIcon, label: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Main Content - Full Width */}
      <div className="main-content full-width">
        {/* Compact Top Nav Header */}
        <header className="top-nav">
          {/* Left: Logo + App Name + Quick Nav */}
          <div className="nav-left">
            <div className="nav-logo">
              <span className="logo-icon">🧬</span>
              <span className="app-name">HEALit Med Lab</span>
            </div>
            
            {/* Quick Navigation */}
            <div className="quick-nav">
              {filteredMenu.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`quick-nav-btn ${location.pathname === item.path ? 'active' : ''}`}
                  title={item.label}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right: User Actions */}
          <div className="nav-right">
            <button className="nav-icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="notification-badge">3</span>
            </button>
            <button className="nav-icon-btn" onClick={() => navigate('/settings')} title="Settings">
              <SettingsIcon size={18} />
            </button>
            <button className="nav-icon-btn" title="Profile">
              <UserCircle size={18} />
            </button>
            <button className="nav-icon-btn logout" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
