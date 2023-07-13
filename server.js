//importing the required dependencies over
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql2");
//port made
const PORT = process.env.PORT;
//sql connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
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
    .prompt({
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
            console.err("Error adding department:", err);
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

//make a function to add the employee

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
        validate: (input) => {
          if (input.trim() !== "") {
            return true;
          } else {
            return "Please enter the first name.";
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
        validate: (input) => {
          if (input.trim() !== "") {
            return true;
          } else {
            return "Please enter the last name.";
          }
        },
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the employee's role ID:",
        validate: (input) => {
          if (input.trim() !== "" && !isNaN(input)) {
            return true;
          } else {
            return "Please enter a valid role ID.";
          }
        },
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the employee's manager ID:",
        validate: (input) => {
          if (input.trim() !== "" && !isNaN(input)) {
            return true;
          } else {
            return "Please enter a valid manager ID.";
          }
        },
      },
    ])
    .then((answers) => {
      const { firstName, lastName, roleId, managerId } = answers;
      connection.query(
        "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [firstName, lastName, roleId, managerId],
        (err) => {
          if (err) {
            console.error("Error adding employee:", err);
          } else {
            console.log("Employee added successfully.");
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
//function to updateemployee record
function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the ID of the employee you want to update:",
        validate: (input) => {
          if (input.trim() !== "" && !isNaN(input)) {
            return true;
          } else {
            return "Please enter a valid ID.";
          }
        },
      },
      {
        type: "list",
        name: "field",
        message: "which field woud you like to update?",
        choices: ["First Name", "Last Name", "Role ID", "Manager ID"],
      },
      {
        type: "input",
        name: "value",
        message: "Enter the new value:",
        validate: (input) => {
          if (input.trim() !== "") {
            return true;
          } else {
            return "Please enter a new value.";
          }
        },
      },
    ])
    .then((answers) => {
      const { id, field, value } = answers;
      let query;
      switch (field) {
        case "First Name":
          query = "UPDATE employees SET first_name = ? WHERE id = ?";
          break;
        case "Last Name":
          query = "UPDATE employees SET last_name = ? WHERE id = ?";
          break;
        case "Role ID":
          query = "UPDATE employees SET role_id = ? WHERE id = ?";
          break;
        case "Manager ID":
          query = "UPDATE employees SET manager_id = ? WHERE id = ?";
          break;
        default:
          break;
      }
      connection.query(query, [value, id], (err) => {
        if (err) {
          console.error("Error updating employee:", err);
        } else {
          console.log("Employee updated successfully.");
        }
        startApp();
      });
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
