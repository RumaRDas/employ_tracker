const mysql = require('mysql');
const inquirer = require('inquirer');
const utils = require('util');
const cTable = require('console.table');

// DB connection for this session.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2020',
    database: 'employee_db'

});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
 
  });

  let listDepartment;
  let listRoles;
  let listEmployee;
  
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err;
    listRoles = res.map(role => ({ name: role.title, value: role.id }));
    console.log("Roles")
    console.table(listRoles);
  });
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    listDepartment = res.map(dep => ({ name: dep.name, value: dep.id }));
    console.log("Department")
    console.table(listDepartment);
  });
  
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    listEmployee = res.map(emp => ({
      name: `${emp.first_name}${emp.last_name}`,
      value: emp.id
    }));
    console.log("Employee")
    console.table(listEmployee);
  });