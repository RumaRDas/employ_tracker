const mysql = require('mysql');
const inquirer = require('inquirer');
const utils = require('util');

// DB connection for this session.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2020',
    database: 'employee_db'

});

// Wrap connection.connect() in a promise!
async function connect(){
    return new Promise((resolve, reject)=>{
        connection.connect(err =>{
            if (err) reject(err); //Connection Failed
            else resolve(); //Connection Succeseed
        });
    });
}

// Wrap connection.query() in a promise!
async function query(command, values){
    return new Promise((resolve, reject)=>{
        connection.query(command,values,(err, res)=>{
            if(err) reject(err);
            else resolve(res);
        });
    });
}

