import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarScreen.css';
import { useAppContext, CalendarEvent } from '../context/AppContext';

const CalendarScreen = () => {
  const { events, addEvent, deleteEvent } = useAppContext();
  const [date, setDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [holidays, setHolidays] = useState<{[key: string]: string}>({});
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // 祝日データの読み込み
  useEffect(() => {
    // 祝日データの読み込み（実際のアプリでは外部APIを使用するか、より完全なデータを用意する）
    setHolidays({
      '2025-01-01': '元日',
      '2025-01-13': '成人の日',
      '2025-02-11': '建国記念日',
      '2025-02-23': '天皇誕生日',
      '2025-03-21': '春分の日',
      '2025-04-29': '昭和の日',
      '2025-05-03': '憲法記念日',
      '2025-05-04': 'みどりの日',
      '2025-05-05': 'こどもの日',
      '2025-07-21': '海の日',
      '2025-08-11': '山の日',
      '2025-09-15': '敬老の日',
      '2025-09-23': '秋分の日',
      '2025-10-13': 'スポーツの日',
      '2025-11-03': '文化の日',
      '2025-11-23': '勤労感謝の日'
    });
  }, []);

  // 日付が変更されたときの処理
  const handleDateChange = (value: any, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!value) return;
    
    const selectedDate = Array.isArray(value) ? value[0] : value;
    setDate(selectedDate);
    const dateStr = selectedDate.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setNewEvent(prev => ({ ...prev, date: dateStr }));
  };

  // 新しいイベントの入力処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // イベントの追加処理
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    addEvent(newEvent);
    
    setNewEvent({
      title: '',
      date: selectedDate,
      description: ''
    });
    setIsAddingEvent(false);
  };

  // イベントの削除処理
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  // 選択された日付のイベントを取得
  const selectedDateEvents = events.filter(event => event.date === selectedDate);

  // 日付に応じたクラス名を返す関数（祝日や今日の日付のスタイリング用）
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // 祝日かどうかをチェック
    if (holidays[dateStr]) {
      return 'holiday-tile';
    }
    
    // 今日の日付かどうかをチェック
    const today = new Date();
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return 'today-tile';
    }
    
    // イベントがある日付かどうかをチェック
    if (events.some(event => event.date === dateStr)) {
      return 'event-tile';
    }
    
    return null;
  };

  // 日付の内容をカスタマイズする関数（祝日名やイベント数の表示用）
  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const dateEvents = events.filter(event => event.date === dateStr);
    
    return (
      <div className="tile-content">
        {holidays[dateStr] && <div className="holiday-name">{holidays[dateStr]}</div>}
        {dateEvents.length > 0 && <div className="event-count">{dateEvents.length}件</div>}
      </div>
    );
  };

  return (
    <div className="calendar-screen">
      <h1>カレンダー</h1>
      
      <div className="calendar-container">
        <div className="calendar-wrapper">
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ja-JP"
            tileClassName={getTileClassName}
            tileContent={getTileContent}
            minDate={new Date(new Date().getFullYear() - 1, 0, 1)}
            maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
          />
        </div>
        
        <div className="events-panel">
          <div className="selected-date">
            <h2>
              {new Date(selectedDate).toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
              {holidays[selectedDate] && <span className="holiday-label">{holidays[selectedDate]}</span>}
            </h2>
            
            {!isAddingEvent ? (
              <button 
                className="add-event-button"
                onClick={() => setIsAddingEvent(true)}
              >
                予定を追加
              </button>
            ) : (
              <form className="event-form" onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label htmlFor="title">タイトル</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">詳細</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-button">保存</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsAddingEvent(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="events-list">
            <h3>予定一覧</h3>
            {selectedDateEvents.length > 0 ? (
              <ul>
                {selectedDateEvents.map(event => (
                  <li key={event.id} className="event-item">
                    <div className="event-header">
                      <h4>{event.title}</h4>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        削除
                      </button>
                    </div>
                    {event.description && <p>{event.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-events">予定はありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;