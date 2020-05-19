BEGIN;

-- Trash the db and create it from scratch.
DROP DATABASE IF EXISTS employee_db;
-- Creating database
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT auto_increment NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE  roles(
    id INTEGER auto_increment NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES department(id)

)ENGINE=INNODB;
CREATE TABLE employees (
    id INTEGER auto_increment NOT NULL,
    first_name  VARCHAR(30) NOT NULL,
    last_name  VARCHAR(30) NOT NULL,
    roles_id INT ,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (roles_id)
    REFERENCES roles(id),
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
) ENGINE=INNODB;

COMMIT;
