import express from 'express';
import router from './ContactRouter';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use(router);

export default app;