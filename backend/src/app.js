const express = require('express');
const morgan = require('morgan');
const { Category } = require('./models/index');
const path = require('path');
require('dotenv').config();

//Initializacion

    const app = express();

//Settings

    // app.set('PORT', process.env.PORT || 3000);

//Middlewares

    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

//Routes

    app.get('/dashboard-user', (req, res) => {
        res.send('Bienvenido usuario :)');
    });

    app.get('/dashboard-professional', (req, res) => {
        res.send('Bienvenido professional :)');
    });

    app.get('/', async(req, res) => {
        try {
            // const categories = await Category.findAll();
            //     res.json({categories: categories});
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    });

    const api = require('./routes/index.routes');
    app.use('/api', api);

//Public Files


//Run Server

    app.listen(process.env.PORT, () => {
         console.log(`🚀 ${process.env.APP_NAME} iniciado en modo ${process.env.NODE_ENV} - escuchando en http://localhost:${process.env.PORT}`);
    });