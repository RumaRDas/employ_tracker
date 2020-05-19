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

// Wrap connection.connect() in a promise!
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






// This is where everything happens.
async function main() {
    await connect();
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
                choices: ['Department', 'Roles', 'Employees'],
            });
            if (addEmployee === 'Department') {
                const answer = await inquirer.prompt({
                    name: 'name',
                    type: 'input',
                    message: 'Department name You want to add?'
                });
                await query(`
             INSERT INTO department(name)
             VALUES(?)`,
                    [answer.name]
                );
                console.log("Great, it's now on Department database.\n");
            }
            else if (addEmployee === 'Roles') {
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
                    type: 'input',
                    message: 'Whats the id of that role?'

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
                const roles = await query(`SELECT  * from roles`);
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