import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileBadge, Home, Info, Menu, Settings2, X } from 'lucide-react';

const navigation = [
  { to: '/', label: '首页', icon: Home },
  { to: '/generator', label: '印章生成器', icon: Settings2 },
  { to: '/about', label: '关于', icon: Info },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header">
    <div className="site-header-inner">
      <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark" aria-hidden="true"><FileBadge size={19} strokeWidth={2.2} /></span>
        <span className="brand-copy"><strong>印章生成器</strong><small>SEAL STUDIO</small></span>
      </NavLink>

      <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav id="site-navigation" className={`site-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="主导航">
        <div className="nav-links">
          {navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`} onClick={() => setMenuOpen(false)}>
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>)}
        </div>
        <NavLink className="nav-cta" to="/generator" onClick={() => setMenuOpen(false)}><span>开始制作</span><Settings2 size={15} aria-hidden="true" /></NavLink>
      </nav>
    </div>
  </header>;
}
