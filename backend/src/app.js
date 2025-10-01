const express = require('express');
require('dotenv').config();

//Initializacion
    const app = express();

//Settings

    app.set('PORT', process.env.PORT || 3000);

//Middlewares

//Routes

    app.get('/', (req, res) => {
        res.send('Hola este la pagina principal');
    });

//Public Files


//Run Server

    app.listen(app.get('PORT'), () => {
         console.log(`🚀 ${process.env.APP_NAME} iniciado en modo ${process.env.NODE_ENV} - escuchando en http://localhost:${app.get('PORT')}`);
    });