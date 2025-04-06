import { useState, useEffect } from 'react';
import '../styles/HomeScreen.css';
import { useAppContext, TodoItem, CalendarEvent } from '../context/AppContext';

const HomeScreen = () => {
  const { todos, events } = useAppContext();
  const [todayTodos, setTodayTodos] = useState<TodoItem[]>([]);
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  
  // 現在の日付を取得
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // コンテキストからデータを取得してフィルタリング
  useEffect(() => {
    // 今日のTodoをフィルタリング
    const todayStr = today.toISOString().split('T')[0];
    const todayItems = todos.filter(todo =>
      (todo.status === 'today' ||
      (todo.dueDate === todayStr && todo.status !== 'completed'))
    );
    setTodayTodos(todayItems);

    // 今日のイベントをフィルタリング
    const todayEvts = events.filter(event => event.date === todayStr);
    setTodayEvents(todayEvts);
  }, [todos, events]);

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1>ホーム</h1>
        <div className="today-date">{formattedDate}</div>
      </div>

      <div className="home-content">
        <section className="today-events">
          <h2>本日の予定</h2>
          {todayEvents.length > 0 ? (
            <ul className="event-list">
              {todayEvents.map(event => (
                <li key={event.id} className="event-item">
                  <div className="event-title">{event.title}</div>
                  <div className="event-description">{event.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-items">本日の予定はありません</p>
          )}
        </section>

        <section className="today-todos">
          <h2>今日のTodo</h2>
          {todayTodos.length > 0 ? (
            <ul className="todo-list">
              {todayTodos.map(todo => (
                <li key={todo.id} className={`todo-item priority-${todo.priority}`}>
                  <div className="todo-title">{todo.title}</div>
                  <div className="todo-details">
                    <span className="todo-priority">{getPriorityLabel(todo.priority)}</span>
                    <span className="todo-assignee">{todo.assignee}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-items">今日のTodoはありません</p>
          )}
        </section>
      </div>
    </div>
  );
};

// 優先度のラベルを日本語で返す関数
function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'high': return '高';
    case 'medium': return '中';
    case 'low': return '低';
    default: return '';
  }
}

export default HomeScreen;