const express = require('express');
const morgan = require('morgan');
const {Category} = require('./models/index');
require('dotenv').config();

//Initializacion

    const app = express();

//Settings

    // app.set('PORT', process.env.PORT || 3000);

//Middlewares

    app.use(morgan('dev'));
    app.use(express.json());

//Routes

    app.get('/', async(req, res) => {
        try {
            const categories = await Category.findAll();
                res.json({categories: categories});
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    });

//Public Files


//Run Server

    app.listen(process.env.PORT, () => {
         console.log(`🚀 ${process.env.APP_NAME} iniciado en modo ${process.env.NODE_ENV} - escuchando en http://localhost:${process.env.PORT}`);
    });