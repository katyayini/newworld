const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');

let exit = false;

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));//middleware
app.use(express.json());

app.use((req, res) => { // Default response 
    res.status(404).end();
});

const db = mysql.createConnection( //connecting to database
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },

);

const questions = [ //Array of questions presented to user
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'I want to exit the application']
    }
];


const question1 = [
    {
        type: 'input',
        name: 'deptName',
        message: 'Enter department name:'
    }
];

const question2 = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter title:'
    },
    {
        type: 'number',
        name: 'salary',
        message: 'Enter salary:'
    },
    {
        type: 'input',
        name: 'deptname',
        message: 'Enter department name: '
    }
];

const question3=[
    {
        type: 'input',
        name: 'fname',
        message: 'Enter first name: '
    },
    {
        type: 'input',
        name: 'lname',
        message: 'Enter last name: '
    },
    {
        type: 'input',
        name: 'erole',
        message: 'Enter employee\'s role: ',
        
    },
    {
        type: 'input',
        name: 'emanager',
        message: 'Enter employee\'s manager: '
    }
];


const question4 = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter employee\'s name: '
    },
    {
        type: 'input',
        name: 'newrole',
        message: 'Enter new role: '
    },

];



async function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.log("\n");
        console.table(results);
    })

}


async function viewRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        console.log("\n");
        console.table(results);
    })

}

async function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.log("\n");
        console.table(results);
    });

}


async function addDepartment() {
    const answer = await inquirer.prompt(question1);
    db.query(`INSERT INTO department (name)
   VALUES (?)`, answer.deptName, function () {
        console.log(`${answer.deptName} added.`);
    });

}

async function addRole() {
    const answer = await inquirer.prompt(question2);

    db.query("SELECT id, name FROM department", function (err, results) {

        for (i = 0; i < results.length; i++) {
            if (answer.deptname === results[i].name)
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [answer.title, answer.salary, results[i].id], function () {
                    console.log(`${answer.title} added`);
                });

        }

    });
}


async function addEmployee() {

    const answer = await inquirer.prompt(question3);

    db.query('SELECT * FROM role', function (err, results) {
        for (i = 0; i < results.length; i++) {
            if(results[i].title===answer.erole)

             {  db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`, [answer.fname,answer.lname,results[i].id], function() {
                                    console.log(`${answer.fname} ${answer.lname} added`);
                                 } )
            }
        
        
        }
        
    
    });

    db.query('SELECT * FROM employee', function (err, res) {
        for (i = 0; i < res.length; i++) {
            if((res[i].first_name+" "+res[i].last_name)===answer.emanager)

             {  
                db.query(`UPDATE employee SET manager_id = ? WHERE first_name= ? and last_name = ?`,[res[i].id, answer.fname, answer.lname], function() {
                                    console.log(`${answer.fname} ${answer.lname} added`);
                                 } )
            }}}); 

}





async function updateEmployeeRole() {
    const answer = await inquirer.prompt(question4);

    db.query(`Select id from role WHERE title=?`,[answer.newrole], function (err,res) {
        var fullname= answer.name;
        var arr=fullname.split(" ");
       db.query('UPDATE employee SET role_id = ? WHERE first_name= ? and last_name = ?',[res[0].id, arr[0], arr[1]], function () {
       console.log("updated"); 
        });
        
    })

}

    
      
                                  
           


async function promptUser() {
    await app.listen(PORT);
    while (!exit) {
        const data = await inquirer.prompt(questions); //Using inquirer to ask user what they would like to do

        if (data.choice === 'View all departments') { await viewDepartments(); }


        else if (data.choice === 'View all roles') { await viewRoles(); }



        else if (data.choice === 'View all employees') { await viewEmployees(); }


        else if (data.choice === 'Add a department') { await addDepartment(); }

        else if (data.choice === 'Add a role') { await addRole(); }

        else if (data.choice === 'Add an employee') { await addEmployee(); }

        else if (data.choice === 'Update an employee role') { await updateEmployeeRole(); }

        else if (data.choice === 'I want to exit the application') {
            process.exit(0);
        }
    }
}

promptUser();

