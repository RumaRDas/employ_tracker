const mysql = require('mysql');
const inquirer = require('inquirer');
const utils = require('util');
//const cTable = require('console.table');

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

const employeeList = async function () {
    const employeeresults = await query(`SELECT  * from employees `);
    const choices = employeeresults.map(emp => {
        return {
            name: `${emp.first_name}${emp.last_name}`,
            value: emp.id
        }
    })
    return choices;
}
const roleList = async function () {
    const roleresults = await query(`SELECT  * from roles `);
    const choices = roleresults.map(roles => {
        return {
            name: roles.title,
            value: roles.id
        }
    })
    return choices;
}

const departmentList = async function () {
    const departmentresults = await query(`SELECT  * from department `);
    const choices = departmentresults.map(department => {
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
            choices: ['Add', 'View', 'Update', 'Delete', 'Exit'],

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
                console.log("-----Department added!-----\n");
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
                    message: 'Which Department you want add ?',
                    choices: departmentList
                },
                ]);
                await query(`INSERT INTO roles(title, salary, department_id)VALUES(?,?,?)`,
                    [answer.title, answer.salary, answer.department_id]
                );
                console.log("-----Role added!-----\n");//


            }
            else if (addEmployee === 'Employee') {
                const answer = await inquirer.prompt([{
                    name: 'first_name',
                    type: 'input',
                    message: 'First Name of employee'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Last Name of employee'
                },
                {
                    name: 'roles',
                    type: 'list',
                    message: 'Which Roles you want add ?',
                    choices: roleList
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Which Department you want add ?',
                    choices: employeeList
                },

                ]);
                await query(`INSERT INTO employees(first_name, last_name, roles_id, manager_id)VALUES(?,?,?,?)`,
                    [answer.first_name, answer.last_name, answer.roles_id, answer.manager_id]
                );
                console.log("-----Employee added!-----\n");
            }
        }
        else if (employee_tracker === 'View') {
            const { viewOption } = await inquirer.prompt({
                name: 'viewOption',
                type: 'list',
                message: 'What would you like to View?',
                choices: ['Department', 'Roles', 'Employees'],
            });
            if (viewOption === 'Department') {
                const department = await query(`SELECT  * from department`);
                console.table(department);
            }
            else if (viewOption === 'Roles') {
                const roles = await query(`SELECT roles.id, roles.title, roles.salary, department.name FROM roles  inner join department on roles.department_id = department.id `);
                console.table(roles);
            }
            else if (viewOption === 'Employees') {
                const employees = await query(
                    `SELECT first_name, last_name, title, salary, name FROM employees e join roles r ON e.manager_id = r.id join department d ON r.id = d.id`);
                console.table(employees);
            }

        }
        else if (employee_tracker === 'Update') {
            const { updateOption } = await inquirer.prompt({
                name: 'updateOption',
                type: 'list',
                message: 'What Do you Want to Update?',
                choices: ['Department', 'Roles', 'Employees'],
            });

            if (updateOption === 'Department') {
                const answer = await inquirer.prompt([
                    {
                        name: 'id',
                        type: 'list',
                        message: 'Which Department you want update ?',
                        choices: departmentList
                    },
                    {
                        name: 'newName',
                        type: 'input',
                        message: 'Whats the new name ?',
                    }
                ]);
                await query(`UPDATE department SET name=? WHERE id=?`, [answer.newName, answer.id]);

                console.log("-----Department UPDATED!-----\n");
            }
        }
        else if (employee_tracker === 'Delete') {
            const { deleteOption } = await inquirer.prompt({
                name: 'deleteOption',
                type: 'list',
                message: 'What Do you Want to Delete?',
                choices: ['Department', 'Roles', 'Employees']
            });

            if (deleteOption === 'Department') {
                const answer = await inquirer.prompt(
                    {
                        name: 'id',
                        type: 'list',
                        message: 'Which Department you want Delete?',
                        choices: departmentList
                    }
                );
                await query(`DELETE FROM department WHERE id=?`, answer.id);
                console.log("-----Department DELETED!-----\n");
            }
        }
        else if (employee_tracker === 'Exit') {
            console.log("----------All done!------------------");
            connection.end();
            process.exit();



        }

    }
}
// Start the app.
main().catch(err => console.log(err));