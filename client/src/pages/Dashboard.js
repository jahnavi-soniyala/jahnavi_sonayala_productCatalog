import React, { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../services/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getTasks().then(res => setTasks(res.data));
    }, []);

    const addTask = async () => {
        const res = await createTask({ title });
        setTasks([...tasks, res.data]);
        setTitle('');
    };

    const removeTask = async (id) => {
        await deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.title} - {task.status}
                        <button onClick={() => removeTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
