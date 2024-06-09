import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
  res.send('home');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
