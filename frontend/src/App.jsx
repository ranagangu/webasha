import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState(null);

  const loadUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const submit = async () => {
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: "", email: "" });
    loadUsers();
  };

  const edit = (u) => {
    setForm(u);
    setEditId(u.id);
  };

  const remove = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>React + Neon CRUD</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <button onClick={submit}>
        {editId ? "Update" : "Add"}
      </button>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} - {u.email}
            <button onClick={() => edit(u)}>Edit</button>
            <button onClick={() => remove(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
