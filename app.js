const express = require('express');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

app.use('/static',express.static('public'));
app.use(express.urlencoded());

// Conexion con mysql
const conexion = mysql.createConnection({
    host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'prueba'
});

conexion.connect((error)=>{
    if(error) {
        throw error;
    }

    console.log('Conexion con la base de datos mysql establecida');
});


app.post('/receta', (req, res)=>{
    try {
        if (!req.body.nombre || !req.body.ingredientes || !req.body.pasos) {
            throw new Error('No mandaste todos los datos necesarios');
        }

        // Verifico que no exista otra receta con el mismo nombre
        let query = 'INSERT INTO receta (nombre, ingredientes, pasos) VALUES (?, ?, ?)';
        let respuesta = conexion.query(query, [req.body.nombre, req.body.ingredientes, req.body.pasos], (error, registros, campos)=>{
            if(error){
                throw new Error('No se pudo realizar el guardado');
            }

            res.send("Se guardo correctamente");
        });

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
});

app.get('/receta', (req, res)=>{
    try {
        let query = 'SELECT * FROM receta';
        let respuesta = conexion.query(query, (error, registros, campos)=>{
            if(error){
                throw new Error('No se pudo realizar el guardado');
            }
            console.log(registros, campos)
            res.send(registros);
        });

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
});


app.listen(port, ()=>{
    console.log('Servidor escuchando en el puerto ', port);
});