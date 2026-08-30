import { Outlet } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';

export function App() {
  return <div className="app-shell">
    <Navbar />
    <Outlet />
  </div>;
}
