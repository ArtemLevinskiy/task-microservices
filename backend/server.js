const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Імітація бази даних у пам'яті мікросервісу
let tasks = [
    { id: 1, title: "Розбити додаток на мікросервіси", completed: true },
    { id: 2, title: "Налаштувати Docker-контейнери", completed: true },
    { id: 3, title: "Задеплоїти проєкт у хмару", completed: false },
];

// Отримати всі задачі
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Створити нову задачу
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "Назва задачі обовʼязкова" });
    }
    const newTask = {
        id: Date.now(),
        title: title.trim(),
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Перемкнути статус виконання задачі
app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Задачу не знайдено" });
    }
    task.completed = !task.completed;
    res.json(task);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend мікросервіс запущено на порту ${PORT}`);
});
