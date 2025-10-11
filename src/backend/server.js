import express from 'express';
import cors from 'cors';
const app = express();

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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