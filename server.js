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

