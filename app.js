const express = require('express');
const { engine } = require('express-handlebars');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');


require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//Midleware
//Parse application /x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application / json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

//templating engine
app.engine(
    'hbs',
    handlebars.engine({
      extname: '.hbs',
      helpers: {
        eq: function (a, b) {
          return a === b;
        },
      },
    })
  );
app.set('view engine', 'hbs');

//pool connection
const pool = mysql2.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10         // Set the maximum number of connections in the pool
})
//Connect to DB
pool.getConnection((err, connection) =>{
    if(err) throw err;
    //console.log('app db connection successfull' + connection.threadId)
});

//server routing
const routes = require('./server/routes/user');
app.use('/', routes)





app.listen(port, ()=>{console.log(`Listening on port http://localhost:${port}`);})