import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Todoアイテムの型定義
export interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  status: 'todo' | 'today' | 'inProgress' | 'completed';
}

// カレンダーイベントの型定義
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}

// コンテキストの型定義
interface AppContextType {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  addTodo: (todo: Omit<TodoItem, 'id'>) => void;
  updateTodo: (id: string, updatedTodo: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updatedEvent: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
}

// コンテキストの作成
export const AppContext = createContext<AppContextType | undefined>(undefined);

// コンテキストプロバイダーコンポーネント
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Todoの状態
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
  // カレンダーイベントの状態
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // サイドバーの状態
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // サイドバーの開閉を切り替える関数
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // 初期化時にLocalStorageからデータを読み込む
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }

    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Todoが変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // イベントが変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Todoを追加する関数
  const addTodo = (todo: Omit<TodoItem, 'id'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString(),
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  // Todoを更新する関数
  const updateTodo = (id: string, updatedTodo: Partial<TodoItem>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      )
    );
  };

  // Todoを削除する関数
  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // イベントを追加する関数
  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  // イベントを更新する関数
  const updateEvent = (id: string, updatedEvent: Partial<CalendarEvent>) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  // イベントを削除する関数
  const deleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  // コンテキスト値
  const contextValue: AppContextType = {
    todos,
    setTodos,
    events,
    setEvents,
    isSidebarOpen,
    toggleSidebar,
    addTodo,
    updateTodo,
    deleteTodo,
    addEvent,
    updateEvent,
    deleteEvent,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// カスタムフック
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};