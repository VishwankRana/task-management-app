import express from 'express';
import cors from 'cors';
import connectDB from './config.js';
import router from './taskController.js'
import ProjectsRouter from './projectsController.js'

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(ProjectsRouter);

app.get('/', (req, res) => {
    res.json({ message: "Hola from backend" });
})

app.use((req, res) => {
    res.status(404).json({ error: "Route Not found" })
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
})

app.listen(3000, () => {
    console.log("Listening on Port 3000");
})