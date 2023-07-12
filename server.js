//importing the required dependencies over
const inquirer = require('inquirer');
const mysql = require('mysql2');
//port made
const PORT = process.env.PORT;
//sql connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'TheWiseSailor',
  password: 'Password',
  database: 'employee_tracker'
});
//making connection to the db, also handles the err and if successful it will say connected
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database!');
  startApp();
});

//function start with promps of choices 
function startApp() {
inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'Exit',
      ],
    })
    .then((answer) => {
      // Perform actions based on user's choice
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee':
          updateEmployee();
          break;
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'Exit':
          exitApp();
          break;
        default:
          console.log('Invalid choice. Please try again.');
          startApp();
          break;
      }
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
}
