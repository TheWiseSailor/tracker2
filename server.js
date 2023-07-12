//importing the required dependencies over
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql2");
//port made
const PORT = process.env.PORT;
//sql connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "Jay",
  password: process.env.DB_PASSWORD,
  database: "employee_tracker",
});
//making connection to the db, also handles the err and if successful it will say connected
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database!");
  startApp();
});

//function start with promps of choices
function startApp() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "Exit",
      ],
    })
    .then((answer) => {
      // Perform actions based on user's choice
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee":
          updateEmployee();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Exit":
          exitApp();
          break;
        default:
          console.log("Invalid choice. Please try again.");
          startApp();
          break;
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}
//function to view all departments
function viewAllDepartments() {
  connection.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.error("Error retrieving departments: ", err);
      startApp();
      return;
    }
    console.table(results);
    startApp();
  });
}
//functyion to view all roles if availavble
function viewAllRoles() {
  const query = `
    SELECT roles.id, roles.name AS title, roles.profits, departments.name AS department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving roles: ", err);
      startApp();
      return;
    }
    //displays the roles ina  neat table
    console.table(results);
    startApp();
  });
}
//functuion to be able to view all employee(s)
function viewAllEmployees() {
  const query =
    "SELECT employees.id, employees.first_name, employees.last_name, roles.name AS title, departments.name AS department FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving employees: ", err);
      startApp();
      return;
    }
    // Display employees in a table
    console.table(results);
    startApp();
  });
}
//function toi start adding departments
function addDepartment() {
  inquirer
    .promp({
      type: "input",
      name: "departmentName",
      message: "Enter the name of the department",
      validate: (input) => {
        if (input.trim() !== "") {
          return true;
        } else {
          return "Please enter a department name.";
        }
      },
    })
    .then((answers) => {
      const departmentName = answers.departmentName;
      connection.query(
        "INSERT INTO departments (name) VALUES (?)",
        [departmentName],
        (err) => {
          if (err) {
            constole.err("Error adding department:", err);
          } else {
            console.log(" Department added succesfully.");
          }
          startApp();
        }
      );
    })
    .catch((error) => {
      console.error("Error:", error);
      startApp();
    });
}
//making a function to be able to exit the application
function exitApp() {
  console.log("Exiting application");
  connection.end();
}

// iniaition of the application
startApp();
