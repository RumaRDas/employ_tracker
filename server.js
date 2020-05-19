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

//Wrap connection.connect() in a promise!
async function connect() {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) reject(err); //Connection Failed
            else resolve(); //Connection Succeseed
        });
    });
}

// Wrap connection.query() in a promise!
async function query(command, values) {
    return new Promise((resolve, reject) => {
        connection.query(command, values, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

});



// connection.query("SELECT * FROM roles", function (err, res) {
//     if (err) throw err;
//     listRoles = res.map(role => ({ name: role.title, value: role.id }));
//     // console.log("Roles")
//     // console.table(listRoles);
// });

// connection.query("SELECT * FROM employees", function (err, res) {
//     if (err) throw err;
//     listEmployee = res.map(emp => ({
//         name: `${emp.first_name}${emp.last_name}`,
//         value: emp.id
//     }));
    // console.log("Employee")
    // console.table(listEmployee);
// });
const roleList =  async function(){
    const roleresults = await query(`SELECT  * from department `);
    const choices =  roleresults.map(roles => {
        //For each department returned from the SQL query this will create an object that will act as a choice for inquirer
        return {
                 name: roles.title,
                 value: roles.id
                } 
    })
    return choices;
}

const departmentList =  async function(){
    const departmentresults = await query(`SELECT  * from department `);
    const choices =  departmentresults.map(department => {
        //For each department returned from the SQL query this will create an object that will act as a choice for inquirer
        return {
                 name: department.name,
                 value: department.id
                } 
    })
    return choices;
}
// This is where everything happens.
async function main() {

    console.log("connected!", connection.threadId);

    // Forever! Keep asking questions, or at least until we ask to 'exit'.
    while (true) {
        const { employee_tracker } = await inquirer.prompt({
            name: 'employee_tracker',
            type: 'list',
            message: 'What would you like to do ?',
            choices: ['Add', 'View', 'Update', 'Delete','Exit'],

        });
        if (employee_tracker === 'Add') {
            const { addEmployee } = await inquirer.prompt({
                name: 'addEmployee',
                type: 'list',
                message: 'What would you like to add?',
                choices: ['Department', 'Role', 'Employee'],
            });
            if (addEmployee === 'Department') {
                const answer = await inquirer.prompt({
                    name: 'name',
                    type: 'input',
                    message: 'Department name You want to add?'
                });
                await query(`INSERT INTO department(name) VALUES(?)`,
                    [answer.name]
                );
                console.log("Great, it's now on Department database.\n");
            }
            else if (addEmployee === 'Role') {
                const answer = await inquirer.prompt([{
                    name: 'title',
                    type: 'input',
                    message: 'Whats Roles You want to add?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Whats the salary of that role?'

                },
                {
                    name: 'department_id',
                    type: 'list',
                    message: 'Whats the id of that role?',
                    choices: departmentList

                }
            ]);
                await query(`INSERT INTO roles(title, salary, department_id)VALUES(?,?,?)`,
                    [answer.title, answer.salary, answer.department_id]
                );
                console.log("Great, it's now on auction.\n");
            }
            else if (addEmployee === 'Employee') {
                const answer = await inquirer.prompt([{
                    name: 'title',
                    type: 'input',
                    message: 'Whats Roles You want to add?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Whats the salary of that role?'

                },
                {
                    name: 'department_id',
                    type: 'list',
                    message: 'Whats the id of that role?',
                    choices: departmentList

                }
            ]);
                await query(`INSERT INTO roles(title, salary, department_id)VALUES(?,?,?)`,
                    [answer.title, answer.salary, answer.department_id]
                );
                console.log("Great, it's now on auction.\n");
            }
        }

        else if(employee_tracker === 'View'){
            const { viewEmployee } = await inquirer.prompt({
                name: 'viewEmployee',
                type: 'list',
                message: 'What would you like to View?',
                choices: ['Department', 'Roles', 'Employees'],
            });
            if (viewEmployee === 'Department') {
                const department = await query(`SELECT  * from department`);
                console.table(department);
            }
            else  if (viewEmployee === 'Roles') {
                const roles = await query(`SELECT roles.id, roles.title, roles.salary, department.name from roles  inner join department on roles.department_id = department.id `);
                console.table(roles);
            }
            else  if (viewEmployee === 'Employees') {
                const employees = await query(`SELECT  * from employees`);
                console.table(employees);
            }
                   
            
                
        }
       
    }
}
// Start the app.
main().catch(err => console.log(err));