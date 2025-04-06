import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import TodoScreen from './screens/TodoScreen';
import { AppProvider, useAppContext } from './context/AppContext';
import './App.css';

// アプリのメインコンテンツ
const AppContent = () => {
  const { isSidebarOpen } = useAppContext();
  
  return (
    <div className="app-container">
      <Sidebar />
      <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/calendar" element={<CalendarScreen />} />
          <Route path="/todo" element={<TodoScreen />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
