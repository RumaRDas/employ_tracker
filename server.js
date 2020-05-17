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

// This is where everything happens.
async function main(){
    await connect();
    console.log("connected!", connection.threadId);

// Forever! Keep asking questions, or at least until we ask to 'exit'.
while(true){ 
    const {employee_tracker} = await inquirer.prompt({
        name: 'employee_tracker',
        type:'list',
        message: 'What would you like to do ?',
        choices: ['Add','View', 'Update','Delete'],

    });
    if(employee_tracker === 'Add'){
        const addEmployee = await inquirer.prompt({
            name: 'addEmployee',
            type: 'list',
            message:'What would you like to add?',
            cooices:['Department', 'roles', 'employees'],
        }),
    }
    
}
}
// Start the app.
main().catch(err=> console.log(err));