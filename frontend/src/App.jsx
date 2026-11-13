import React from "react";
import { useState, useEffect } from "react";

const API_URL =
    import.meta.env.VITE_API_URL || "https://tasks-backend-w18k.onrender.com/api/tasks";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setTasks(data);
            setError("");
        } catch (err) {
            setError("Не вдалося підключитися до Backend мікросервісу");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (res.ok) {
                setTitle("");
                fetchTasks();
            }
        } catch (err) {
            setError("Помилка при створенні задачі");
        }
    };

    const toggleTask = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "PATCH" });
            fetchTasks();
        } catch (err) {
            setError("Помилка оновлення статусу");
        }
    };

    return (
        <div
            style={{
                maxWidth: "520px",
                margin: "40px auto",
                fontFamily: "sans-serif",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ marginBottom: "4px" }}>Мікросервісний Трекер Задач</h2>
            <p style={{ color: "#666", fontSize: "14px", marginTop: 0 }}>
                Frontend (React) + Backend API (Node.js) у Docker
            </p>

            {error && (
                <div
                    style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                    }}
                >
                    {error}
                </div>
            )}

            <form
                onSubmit={addTask}
                style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
            >
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Нова задача..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px 16px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Додати
                </button>
            </form>

            <ul
                style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        style={{
                            padding: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            textDecoration: task.completed
                                ? "line-through"
                                : "none",
                            color: task.completed ? "#94a3b8" : "#0f172a",
                        }}
                    >
                        <span>{task.title}</span>
                        <span>{task.completed ? "✅" : "⏳"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
