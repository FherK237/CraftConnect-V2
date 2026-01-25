
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');

const http = require('http');
const { Server } = require("socket.io");


const { Category } = require('./models/index');
const path = require('path');
require('dotenv').config();


//Initializacion
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//servidor nativo http
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

//Middlewares

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

    const api = require('./routes/index.routes');
    app.use('/api', api);
    
    app.get('/dashboard-user', (req, res) => {
        res.send('Bienvenido usuario :)');
    });

    app.get('/dashboard-professional', (req, res) => {
        res.send('Bienvenido professional :)');
    });

    app.get('/', async(req, res) => {
        try {
            const categories = await Category.findAll();
                res.json({categories: categories});
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    });

    

//Public Files


// ======================
// LOGICA DEL CHAT: CONEXION DE SOCKET.IO
// ================
const socketManager = require('./utils/socketManager');
socketManager(io)
//Run Server

    server.listen(process.env.PORT, () => {
        console.log(`🚀 ${process.env.APP_NAME} iniciado en modo ${process.env.NODE_ENV} - escuchando en http://localhost:${process.env.PORT}`);
    });