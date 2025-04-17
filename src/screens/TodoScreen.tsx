import { useState, useEffect } from 'react';
import '../styles/TodoScreen.css';
import { useAppContext, TodoItem } from '../context/AppContext';

const TodoScreen = () => {
  const { todos, addTodo, updateTodo, deleteTodo } = useAppContext();
  const [filteredTodos, setFilteredTodos] = useState<{
    todo: TodoItem[];
    today: TodoItem[];
    inProgress: TodoItem[];
    completed: TodoItem[];
  }>({
    todo: [],
    today: [],
    inProgress: [],
    completed: []
  });
  
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, 'id'>>({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '',
    description: '',
    priority: 'medium',
    assignee: '',
    status: 'todo'
  });

  // Todoが変更されたらフィルタリングを更新
  useEffect(() => {
    filterTodos();
  }, [todos]);

  // Todoをステータスごとにフィルタリングする
  const filterTodos = () => {
    const filtered = {
      todo: todos.filter(todo => todo.status === 'todo'),
      today: todos.filter(todo => todo.status === 'today'),
      inProgress: todos.filter(todo => todo.status === 'inProgress'),
      completed: todos.filter(todo => todo.status === 'completed')
    };
    setFilteredTodos(filtered);
  };

  // 入力フォームの変更を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingTodo) {
      setEditingTodo({ ...editingTodo, [name]: value });
    } else {
      setNewTodo({ ...newTodo, [name]: value });
    }
  };

  // Todoの追加処理
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodo.title.trim()) return;
    
    if (editingTodo) {
      // 既存のTodoを更新
      updateTodo(editingTodo.id, editingTodo);
      setEditingTodo(null);
    } else {
      // 新しいTodoを追加
      addTodo(newTodo);
    }
    
    // フォームをリセット
    setNewTodo({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      startTime: '',
      endDate: new Date().toISOString().split('T')[0],
      endTime: '',
      description: '',
      priority: 'medium',
      assignee: '',
      status: 'todo'
    });
    setIsAddingTodo(false);
  };

  // Todoの編集を開始
  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setIsAddingTodo(true);
  };

  // Todoの削除処理
  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  // Todoのステータス変更処理
  const handleStatusChange = (id: string, newStatus: TodoItem['status']) => {
    updateTodo(id, { status: newStatus });
  };

  // 優先度に応じたラベルとクラス名を取得
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: '高', className: 'priority-high' };
      case 'medium':
        return { label: '中', className: 'priority-medium' };
      case 'low':
        return { label: '低', className: 'priority-low' };
      default:
        return { label: '', className: '' };
    }
  };

  // ステータスに応じたラベルを取得
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'Todo';
      case 'today': return '今日のTodo';
      case 'inProgress': return '進行中';
      case 'completed': return '完了';
      default: return '';
    }
  };

  return (
    <div className="todo-screen">
      <h1>Todo管理</h1>
      
      <div className="todo-actions">
        {!isAddingTodo ? (
          <button 
            className="add-todo-button"
            onClick={() => {
              setIsAddingTodo(true);
              setEditingTodo(null);
            }}
          >
            新しいTodoを追加
          </button>
        ) : (
          <form className="todo-form" onSubmit={handleAddTodo}>
            <h2>{editingTodo ? 'Todoを編集' : '新しいTodoを追加'}</h2>
            
            <div className="form-group">
              <label htmlFor="title">タイトル</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingTodo ? editingTodo.title : newTodo.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dueDate">期限</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={editingTodo ? editingTodo.dueDate : newTodo.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">優先度</label>
                <select
                  id="priority"
                  name="priority"
                  value={editingTodo ? editingTodo.priority : newTodo.priority}
                  onChange={handleInputChange}
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>開始日時</label>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={editingTodo ? editingTodo.startDate || '' : newTodo.startDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={editingTodo ? editingTodo.startTime || '' : newTodo.startTime || ''}
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
                    value={editingTodo ? editingTodo.endDate || '' : newTodo.endDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={editingTodo ? editingTodo.endTime || '' : newTodo.endTime || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="assignee">担当者</label>
                <input
                  type="text"
                  id="assignee"
                  name="assignee"
                  value={editingTodo ? editingTodo.assignee : newTodo.assignee}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">ステータス</label>
                <select
                  id="status"
                  name="status"
                  value={editingTodo ? editingTodo.status : newTodo.status}
                  onChange={handleInputChange}
                >
                  <option value="todo">Todo</option>
                  <option value="today">今日のTodo</option>
                  <option value="inProgress">進行中</option>
                  <option value="completed">完了</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">説明</label>
              <textarea
                id="description"
                name="description"
                value={editingTodo ? editingTodo.description : newTodo.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">
                {editingTodo ? '更新' : '追加'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setIsAddingTodo(false);
                  setEditingTodo(null);
                }}
              >
                キャンセル
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="todo-lists">
        {/* Todo */}
        <div className="todo-column">
          <h2 className="column-title">Todo</h2>
          <div className="todo-items">
            {filteredTodos.todo.length > 0 ? (
              filteredTodos.todo.map(todo => (
                <div key={todo.id} className={`todo-item ${getPriorityInfo(todo.priority).className}`}>
                  <div className="todo-header">
                    <h3>{todo.title}</h3>
                    <div className="todo-actions-menu">
                      <button onClick={() => handleEditTodo(todo)}>編集</button>
                      <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
                    </div>
                  </div>
                  
                  <div className="todo-details">
                    {todo.dueDate && (
                      <div className="todo-due-date">
                        期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                        {todo.startDate && todo.startTime && todo.endDate && todo.endTime && (
                          <span className="todo-time">
                            {todo.startDate === todo.endDate
                              ? `${todo.startTime}～${todo.endTime}`
                              : `${todo.startDate} ${todo.startTime}～${todo.endDate} ${todo.endTime}`}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="todo-meta">
                      <span className={`todo-priority ${getPriorityInfo(todo.priority).className}`}>
                        {getPriorityInfo(todo.priority).label}
                      </span>
                      
                      {todo.assignee && (
                        <span className="todo-assignee">担当: {todo.assignee}</span>
                      )}
                    </div>
                    
                    {todo.description && (
                      <div className="todo-description">{todo.description}</div>
                    )}
                  </div>
                  
                  <div className="todo-status-actions">
                    <button onClick={() => handleStatusChange(todo.id, 'today')}>
                      今日のTodoに移動
                    </button>
                    <button onClick={() => handleStatusChange(todo.id, 'inProgress')}>
                      進行中に移動
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-todos">Todoはありません</p>
            )}
          </div>
        </div>
        
        {/* 今日のTodo */}
        <div className="todo-column">
          <h2 className="column-title">今日のTodo</h2>
          <div className="todo-items">
            {filteredTodos.today.length > 0 ? (
              filteredTodos.today.map(todo => (
                <div key={todo.id} className={`todo-item ${getPriorityInfo(todo.priority).className}`}>
                  <div className="todo-header">
                    <h3>{todo.title}</h3>
                    <div className="todo-actions-menu">
                      <button onClick={() => handleEditTodo(todo)}>編集</button>
                      <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
                    </div>
                  </div>
                  
                  <div className="todo-details">
                    {todo.dueDate && (
                      <div className="todo-due-date">
                        期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                        {todo.startDate && todo.startTime && todo.endDate && todo.endTime && (
                          <span className="todo-time">
                            {todo.startDate === todo.endDate
                              ? `${todo.startTime}～${todo.endTime}`
                              : `${todo.startDate} ${todo.startTime}～${todo.endDate} ${todo.endTime}`}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="todo-meta">
                      <span className={`todo-priority ${getPriorityInfo(todo.priority).className}`}>
                        {getPriorityInfo(todo.priority).label}
                      </span>
                      
                      {todo.assignee && (
                        <span className="todo-assignee">担当: {todo.assignee}</span>
                      )}
                    </div>
                    
                    {todo.description && (
                      <div className="todo-description">{todo.description}</div>
                    )}
                  </div>
                  
                  <div className="todo-status-actions">
                    <button onClick={() => handleStatusChange(todo.id, 'todo')}>
                      Todoに戻す
                    </button>
                    <button onClick={() => handleStatusChange(todo.id, 'inProgress')}>
                      進行中に移動
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-todos">今日のTodoはありません</p>
            )}
          </div>
        </div>
        
        {/* 進行中 */}
        <div className="todo-column">
          <h2 className="column-title">進行中</h2>
          <div className="todo-items">
            {filteredTodos.inProgress.length > 0 ? (
              filteredTodos.inProgress.map(todo => (
                <div key={todo.id} className={`todo-item ${getPriorityInfo(todo.priority).className}`}>
                  <div className="todo-header">
                    <h3>{todo.title}</h3>
                    <div className="todo-actions-menu">
                      <button onClick={() => handleEditTodo(todo)}>編集</button>
                      <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
                    </div>
                  </div>
                  
                  <div className="todo-details">
                    {todo.dueDate && (
                      <div className="todo-due-date">
                        期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                        {todo.startDate && todo.startTime && todo.endDate && todo.endTime && (
                          <span className="todo-time">
                            {todo.startDate === todo.endDate
                              ? `${todo.startTime}～${todo.endTime}`
                              : `${todo.startDate} ${todo.startTime}～${todo.endDate} ${todo.endTime}`}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="todo-meta">
                      <span className={`todo-priority ${getPriorityInfo(todo.priority).className}`}>
                        {getPriorityInfo(todo.priority).label}
                      </span>
                      
                      {todo.assignee && (
                        <span className="todo-assignee">担当: {todo.assignee}</span>
                      )}
                    </div>
                    
                    {todo.description && (
                      <div className="todo-description">{todo.description}</div>
                    )}
                  </div>
                  
                  <div className="todo-status-actions">
                    <button onClick={() => handleStatusChange(todo.id, 'today')}>
                      今日のTodoに戻す
                    </button>
                    <button onClick={() => handleStatusChange(todo.id, 'completed')}>
                      完了に移動
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-todos">進行中のTodoはありません</p>
            )}
          </div>
        </div>
        
        {/* 完了 */}
        <div className="todo-column">
          <h2 className="column-title">完了</h2>
          <div className="todo-items">
            {filteredTodos.completed.length > 0 ? (
              filteredTodos.completed.map(todo => (
                <div key={todo.id} className={`todo-item ${getPriorityInfo(todo.priority).className}`}>
                  <div className="todo-header">
                    <h3>{todo.title}</h3>
                    <div className="todo-actions-menu">
                      <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
                    </div>
                  </div>
                  
                  <div className="todo-details">
                    {todo.dueDate && (
                      <div className="todo-due-date">
                        期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                        {todo.startDate && todo.startTime && todo.endDate && todo.endTime && (
                          <span className="todo-time">
                            {todo.startDate === todo.endDate
                              ? `${todo.startTime}～${todo.endTime}`
                              : `${todo.startDate} ${todo.startTime}～${todo.endDate} ${todo.endTime}`}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="todo-meta">
                      <span className={`todo-priority ${getPriorityInfo(todo.priority).className}`}>
                        {getPriorityInfo(todo.priority).label}
                      </span>
                      
                      {todo.assignee && (
                        <span className="todo-assignee">担当: {todo.assignee}</span>
                      )}
                    </div>
                    
                    {todo.description && (
                      <div className="todo-description">{todo.description}</div>
                    )}
                  </div>
                  
                  <div className="todo-status-actions">
                    <button onClick={() => handleStatusChange(todo.id, 'inProgress')}>
                      進行中に戻す
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-todos">完了したTodoはありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoScreen;