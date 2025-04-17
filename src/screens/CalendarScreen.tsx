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
    startDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '',
    description: '',
    color: '#3498db',
    relatedDates: []
  });
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [holidays, setHolidays] = useState<{[key: string]: string}>({});
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // イベントの追加処理
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    // 日をまたぐイベントの場合、関連する日付を計算
    const eventToAdd = { ...newEvent };
    
    if (eventToAdd.startDate && eventToAdd.endDate && eventToAdd.startDate !== eventToAdd.endDate) {
      const start = new Date(eventToAdd.startDate);
      const end = new Date(eventToAdd.endDate);
      const relatedDates: string[] = [];
      
      // 開始日から終了日までの全ての日付を計算
      const currentDate = new Date(start);
      while (currentDate <= end) {
        relatedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      eventToAdd.relatedDates = relatedDates;
    }

    addEvent(eventToAdd);
    
    setNewEvent({
      title: '',
      date: selectedDate,
      startDate: selectedDate,
      startTime: '',
      endDate: selectedDate,
      endTime: '',
      description: '',
      color: '#3498db',
      relatedDates: []
    });
    setIsAddingEvent(false);
  };

  // イベントの削除処理
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setSelectedEvent(null);
  };

  // イベントの選択処理
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  // 選択された日付のイベントを取得
  // 選択された日付のイベントを取得（関連する日付も含む）
  const selectedDateEvents = events.filter(event =>
    event.date === selectedDate ||
    (event.relatedDates && event.relatedDates.includes(selectedDate))
  );

  // 日付に応じたクラス名を返す関数（祝日や今日の日付のスタイリング用）
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    let classNames = [];
    
    // 祝日かどうかをチェック
    if (holidays[dateStr]) {
      classNames.push('holiday-tile');
    }
    
    // 土曜日かどうかをチェック
    if (date.getDay() === 6) {
      classNames.push('saturday-tile');
    }
    
    // 今日の日付かどうかをチェック
    const today = new Date();
    if (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()) {
      classNames.push('today-tile');
    }
    
    // イベントがある日付かどうかをチェック（関連する日付も含む）
    if (events.some(event =>
      event.date === dateStr ||
      (event.relatedDates && event.relatedDates.includes(dateStr))
    )) {
      classNames.push('event-tile');
    }
    
    return classNames.join(' ');
  };

  // 日付の内容をカスタマイズする関数（祝日名や予定のタイトル表示用）
  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const dateEvents = events.filter(event =>
      event.date === dateStr ||
      (event.relatedDates && event.relatedDates.includes(dateStr))
    );
    
    return (
      <div className="tile-content">
        {holidays[dateStr] && <div className="holiday-name">{holidays[dateStr]}</div>}
        {dateEvents.length > 0 && (
          <div className="event-list-preview">
            {dateEvents.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className="event-title"
                style={{ borderColor: event.color }}
              >
                {event.title.length > 10 ? `${event.title.substring(0, 10)}...` : event.title}
                {index === 1 && dateEvents.length > 2 && <span className="more-events">...</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-screen">
      <h1>カレンダー</h1>
      
      <div className={`calendar-container ${isAddingEvent ? 'form-active' : ''}`}>
        <div className="calendar-wrapper">
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ja-JP"
            calendarType="gregory"
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
            
            {!isAddingEvent && !selectedEvent ? (
              <button
                className="add-event-button"
                onClick={() => setIsAddingEvent(true)}
              >
                予定を追加
              </button>
            ) : isAddingEvent ? (
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
                  <label>開始日時</label>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={newEvent.startDate || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={newEvent.startTime || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>終了日時</label>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={newEvent.endDate || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={newEvent.endTime || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
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

                <div className="form-group">
                  <label htmlFor="color">色</label>
                  <select
                    id="color"
                    name="color"
                    value={newEvent.color}
                    onChange={handleInputChange}
                  >
                    <option value="#3498db">■ 青</option>
                    <option value="#e74c3c">■ 赤</option>
                    <option value="#2ecc71">■ 緑</option>
                    <option value="#f39c12">■ オレンジ</option>
                    <option value="#9b59b6">■ 紫</option>
                  </select>
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
            ) : selectedEvent && (
              <div className="event-detail">
                <h3 style={{ borderLeft: `4px solid ${selectedEvent.color}`, paddingLeft: '10px' }}>
                  {selectedEvent.title}
                  {selectedEvent.startDate && selectedEvent.startTime && selectedEvent.endDate && selectedEvent.endTime && (
                    <span className="event-time">
                      {selectedEvent.startDate === selectedEvent.endDate
                        ? `${selectedEvent.startTime}～${selectedEvent.endTime}`
                        : `${selectedEvent.startDate} ${selectedEvent.startTime}～${selectedEvent.endDate} ${selectedEvent.endTime}`}
                    </span>
                  )}
                </h3>
                <p className="event-description">{selectedEvent.description}</p>
                <div className="event-detail-actions">
                  <button
                    className="back-button"
                    onClick={() => setSelectedEvent(null)}
                  >
                    戻る
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="events-list">
            <h3>予定一覧</h3>
            {selectedDateEvents.length > 0 ? (
              <ul>
                {selectedDateEvents.map(event => (
                  <li
                    key={event.id}
                    className="event-item"
                    style={{ borderLeft: `4px solid ${event.color}` }}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="event-header">
                      <h4>
                        {event.title}
                        {event.startDate && event.startTime && event.endDate && event.endTime && (
                          <span className="event-time">
                            {event.startDate === event.endDate
                              ? `${event.startTime}～${event.endTime}`
                              : `${event.startDate} ${event.startTime}～${event.endDate} ${event.endTime}`}
                          </span>
                        )}
                      </h4>
                    </div>
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