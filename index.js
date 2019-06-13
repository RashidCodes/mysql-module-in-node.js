const mysql = require('mysql')
const express = require('express')

var app = express();

const bodyparser = require('body-parser')


// configure express  server
app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user : "root",
    password: 'sheed721',
    database: "EmployeeDb",
    multipleStatements: true
})

// connect to the database
mysqlConnection.connect((err) => {
    if(!err){
        console.log("DB connection succeeded")
    } else {
        console.log("DB connection failed \n Error: "+ JSON.stringify(err, undefined, 2))
    }

})

// listen on port 3000
app.listen(3000, (err) => {
    console.log('Express server is running at port no:  3000')
})


// route /employees 
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if(!err){
            console.log(rows);
            res.send(rows);
        }
        else {
            console.log(err.message)
        }
    })
})

// get employees/1
app.get('/employees/:id', (req, res) => {
    const sqlQuery = `
    SELECT * 
    FROM Employee
    WHERE EmpID = ?
    `
    mysqlConnection.query(sqlQuery, [req.params.id], (err, rows, fields) => {
        if(!err){
            console.log(rows);
            res.send(rows);
        }
        else {
            console.log(err.message)
        }
    })
})


// get employees/1
app.delete('/employees/:id', (req, res) => {
    const sqlQuery = `
    DELETE FROM Employee
    WHERE EmpID = ?
    `
    mysqlConnection.query(sqlQuery, [req.params.id], (err, rows, fields) => {
        if(!err){
            res.send("Deleted successfully")
        }
        else {
            console.log(err.message)
        }
    })
})




// here, we have to call the stored procedure that we have created
app.post('/employees', (req, res) => {
    let emp = req.body;
    const sql = `
    SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; 
    CALL EmployeeAddOrEdit(@EmpId, @Name, @EmpCode, @Salary);
    `
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if(!err){
            rows.forEach(element => {
                if(element.constructor == Array){
                    res.send('Inserted employee id: '+ element[0].EmpID)
                }
            })
        }
        else {
            console.log(err.message)
        }
    })
})


// update an employee
app.put('/employees', (req, res) => {
    let emp = req.body;
    const sql = `
    SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; 
    CALL EmployeeAddOrEdit(@EmpId, @Name, @EmpCode, @Salary);
    `
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if(!err){
            res.send("updated successfully")
        }
        else {
            console.log(err.message)
        }
    })
})