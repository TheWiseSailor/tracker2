-- Create departments table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  profits DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);