const mysql2 = require('mysql2');

//pool connection
const pool = mysql2.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10         // Set the maximum number of connections in the pool
})





//view users
exports.view = (req, res) =>{
    //res.render('home');

//Connect to DB
pool.getConnection((err, connection) =>{
    if(err) throw err;
    //console.log('useController Connection successfull' + connection.threadId);
    //making a query 
    connection.query('SELECT * FROM users', (err, rows) =>{
        // when done the connention, release it
        connection.release();

        if(!err){
            res.render('home', {rows})
        }else{
            console.log(err)
        }
        //console.log('data from the table user table: \n', rows)
    } )
});
}

//search for the user
exports.find = (req, res) =>{
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('useController Connection successfull' + connection.threadId);
        
        let searchTerm = req.body.search;
        console.log("search term: " + searchTerm)

        //making a query 
        connection.query('SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) =>{
            // when done the connention, release it
            connection.release();
    
            if(!err){
                res.render('home', {rows})
            }else{
                console.log(err)
            }
            //console.log('data from the table user table: \n', rows)
        } )
    });
}

// render form
exports.form = (req, res)=>{
    res.render('adduser')
}


//add user
exports.create = (req, res) =>{
    const { first_name, last_name, email, phone, comment } = req.body


    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('useController Connection successfull' + connection.threadId);

        //making a query 
        connection.query('INSERT INTO users (first_name, last_name, email, phone, comment) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, email, phone, comment], (err, rows) =>{
            // when done the connention, release it
            connection.release();
    
            if(!err){
                res.render('adduser', {alert: 'User added successfully'})
            }else{
                console.log(err)
            }
            //console.log('data from the table user table: \n', rows)
        } )
    });
}

//edit user
exports.edit = (req, res) =>{
    //res.render('edituser')
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('useController Connection successfull' + connection.threadId)

        //making a query 
        connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) =>{
            // when done the connention, release it
            connection.release();
    
            if(!err){
                res.render('edituser', {rows})
            }else{
                console.log(err)
            }
            //console.log('data from the table user table: \n', rows)
        } )
    });
}

//edit single user
//edit user
exports.viewEdit = (req, res) =>{
    //res.render('edituser')
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('useController Connection successfull' + connection.threadId)

        //making a query 
        connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) =>{
            // when done the connention, release it
            connection.release();
    
            if(!err){
                res.render('edituser', {rows})
            }else{
                console.log(err)
            }
            //console.log('data from the table user table: \n', rows)
        } )
    });
}

//update user
exports.update = (req, res) =>{
    const { first_name, last_name, email, phone, comment } = req.body;

    pool.getConnection((err, connection) =>{
        if(err) throw err;
  
        connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ? WHERE id = ?', 
            [first_name, last_name, email, phone, comment, req.params.id], (err, rows) =>{
            // when done the connention, release it
            connection.release();
    
            if(!err){
                pool.getConnection((err, connection) =>{
                    if(err) throw err;

                    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) =>{
                        // when done the connention, release it
                        connection.release();
                
                        if(!err){
                            res.render('edituser', {rows, alert: `${first_name} has been updated.`})
                        }else{
                            console.log(err)
                        }
                        //console.log('data from the table user table: \n', rows)
                    } )
                });
            }else{
                console.log(err)
            }
            //console.log('data from the table user table: \n', rows)
        } )
    });
}

//delete user
exports.delete = (req, res) =>{
    const userId = req.params.id;

     // Ensure ID is a number
     if (isNaN(userId)) {
        return res.status(400).send("Invalid user ID");
    }

    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('useController Connection successfull' + connection.threadId)

        //making a query 
        connection.query('DELETE FROM users WHERE id = ?', [userId], (err, rows) =>{
            // when done the connention, release it
            connection.release();
    
            if(!err){
                res.redirect('/');
            }else{
                console.log(err)
            }
            //console.log('data from the table user table: \n', rows)
        } )
    });
}

//view users
exports.viewuser = (req, res) =>{
    const userId = req.params.id;

     // Ensure ID is a number
     if (isNaN(userId)) {
        return res.status(400).send("Invalid user ID");
    }

//Connect to DB
pool.getConnection((err, connection) =>{
    if(err) throw err;

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) =>{
        // when done the connention, release it
        connection.release();

        if(!err){
            res.render('viewuser', {rows})
        }else{
            console.log(err)
        }
        //console.log('data from the table user table: \n', rows)
    } )
});
}
