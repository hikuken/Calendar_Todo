import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAppContext();

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
      >
        {isSidebarOpen ? '←' : '→'}
      </button>
      
      <h2 className="sidebar-title">カレンダー＆Todo</h2>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              ホーム
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>
              カレンダー
            </NavLink>
          </li>
          <li>
            <NavLink to="/todo" className={({ isActive }) => isActive ? 'active' : ''}>
              Todo
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;