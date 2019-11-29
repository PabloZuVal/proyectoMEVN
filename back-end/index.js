import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
// import mongoose from 'mongoose';
import router from './routes';


//inicializaciones 
const app = express();
require('./database');

//settings
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api',router);
app.set('port', process.env.PORT || 3000);

//middlewares
app.get('/hola', (req, res) => {
    res.send('Hello world!');
})

//starting server
app.listen(app.get('port'),()=>{
    console.log('server on port :', app.get('port'));
});

