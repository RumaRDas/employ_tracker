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
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

});

let listDepartment;
let listRoles;
let listEmployee;

connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    listRoles = res.map(role => ({ name: role.title, value: role.id }));
    // console.log("Roles")
    // console.table(listRoles);
});
connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    listDepartment = res.map(dep => ({ name: dep.name, value: dep.id }));
    // console.log("Department")
    // console.table(listDepartment);
});

connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    listEmployee = res.map(emp => ({
        name: `${emp.first_name}${emp.last_name}`,
        value: emp.id
    }));
    // console.log("Employee")
    // console.table(listEmployee);
});
//Question will ask in the begaining to choose option

const startQuestion = {
    name: 'employee_tracker',
    type: 'list',
    message: 'What would you like to do ?',
    choices: ['ADD', 'VIEW', 'UPDATE', 'DELETE', 'EXIT']
}

const addQuestion = {

}
main();
//function for ask question
function main() {
    inquirer.prompt([startQuestion])
        .then(function (res) {
            console.log(res);
            switch (res.role) {
                case "ADD":
                    selectAdd();
                    break;
                case "VIEW":
                    selectView();
                    break;
                case "UPDATE":
                    selectUpdate();
                    break;
                case "DELETE":
                    selectDelete();
                    break;
                default:
                    endApp();
            }

        });
}

function selectAdd() {

inquirer.prompt({
                name: 'name',
                type: 'input',
                message: 'Department name You want to add?'
            }).then.query(`INSERT INTO department SET ?`,
                       {name: answer.name}
                   );
                   console.log("Great, it's now on Department database.\n");
                   console.table(listDepartment);     
        }
            

function endApp() {
    console.log(" THANK YOU");
    connection.end();
    process.exit();
}
