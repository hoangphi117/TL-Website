import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from './libs/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

import router from './routes/index.js';
app.use("/", router);

app.set('query parser', 'extended');

app.get("/", (req, res) => {
  try {
    res.send("Welcome to Website eCommerce Team Liquid!");
  } catch (err) {
    res.status(500).send("Error connecting to server!");
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});