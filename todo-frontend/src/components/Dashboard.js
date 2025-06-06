import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  
  const fetchTodos =useCallback(async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data);
    } catch (error) {
      if (error.response.status === 401) navigate('/login')
    }
  }, [navigate]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async () => {
    if (title.trim() === '') return alert('Todo tidak boleh kosong');
    try {
      await api.post('/todos', { title });
      setTitle('');
      fetchTodos();
    } catch (error) {
      alert('Gagal tambah todo');
    }
  }

  const deleteTodo = async (id) => {
    try{
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch(error){
      alert('Gagal hapus todo');
    }
  }

  const toggleComplete = async (id, status) => {
    try{
      await api.put(`/todos/${id}`, {completed: status});
      fetchTodos();
    } catch(error) {
      alert('Failed to update todo status');
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <h2 style={styles.title}>Dashboard</h2>
          <button onClick={logout} style={styles.logoutButton}>Logout</button>
        </div>

        <h3 style={{ marginTop: '20px' }}>Todos</h3>
        <ul style={styles.todoList}>
          {todos.length === 0 ? (
            <li style={styles.emptyText}>No todos yet, add one!</li>
          ) :
            (todos.map(todo => (
              <li key={todo.ID} onClick={() => toggleComplete(todo.ID, !todo.completed)} style={{
                ...styles.todoItem, 
                textDecoration: todo.completed ? 'line-through' : 'none',
                backgroundColor: todo.completed ? '#dfe6e9' : '#ecf0f1'
              }}>
                <div style={{display:'flex', alignItems: 'center', gap:'10px' }}>
                  <input 
                    type="checkbox"
                    checked={todo.completed}
                  />
                  <span>[{new Date(todo.CreatedAt).toLocaleString()}] {todo.title}</span>
                </div>
                <button onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo.ID)
                    }}
                  style={styles.deleteButton}>❌</button>
              </li>
            ))
          )}
        </ul>

        <div style={styles.inputGroup}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTodo();
              }
            }}
            placeholder="Add new todo..."
            style={styles.input}
          />
          <button onClick={addTodo} style={styles.addButton}>Add</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  card: {
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    width: '420px'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '20px'
  },
  logoutButton: {
    padding: '8px 12px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  todoList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#ccc transparent'
  },
  todoItem: {
    backgroundColor: '#ecf0f1',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputGroup: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  deleteButton: {
    border: 'none',
    padding: '5px 8px',
    cursor: 'pointer'
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    padding: '10px 0'
  },
  completeButton: {
    padding: '6px 10px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '6px'
  },

};
