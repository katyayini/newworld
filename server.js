const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

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

let exitQues = false;

const questions=[ //Array of questions presented to user
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'I want to exit the application']
    }    
  ];


const question1=[
  {
   type: 'input',
   name: 'deptName',
   message: 'Enter department name:'
  }
  ];

  const question2=[
    {
     type: 'input',
     name: 'title',
     message: 'Enter title:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter salary:'
     },
     {
      type: 'input',
      name: 'deptID',
      message: 'Enter department ID:'
     }
    ];


async function promptUser() { 
 await app.listen(PORT);
  
 while (exitQues===false)
 {inquirer.prompt(questions).then((data)=>{ //Using inquirer to ask user what they would like to do
       if(data.choice==='View all departments')
      
       db.query('SELECT * FROM department', function (err, results) {
        console.log(results);
      });
      
     else if(data.choice==='View all roles')
      
      db.query('SELECT * FROM role', function (err, results) {
       console.log(results);
     });

    else if(data.choice==='View all employees')
      
     db.query('SELECT * FROM employee', function (err, results) {
      console.log(results);
    });

    else if(data.choice==='Add a department')
    {inquirer.prompt(question1).then((answer)=>{
      db.query(`INSERT INTO department (name)
     VALUES (?)`, answer.deptName, function () {
       console.log(`${answer.deptName} added.`);
     }) ;
    
    })}

    else if(data.choice==='Add a role')
    {inquirer.prompt(question2).then((answer)=>{
    db.query(`INSERT INTO role (title)
     VALUES (?)`, answer.title);
     db.query(`INSERT INTO role (salary)
     VALUES (?)`, answer.salary);
     db.query(`INSERT INTO role (department_id)
     VALUES (?)`, answer.deptID);
     console.log(`${answer.title} added`);
     })    
    .catch((err)=>{
      console.log("Role could not be added.")
    })}
    
    else if(data.choice==='I want to exit the application'){
      exitQues=true;
    }




    
} 
)}}

promptUser();
