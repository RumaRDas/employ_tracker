use employee_db;
-- Insert a set of records.
INSERT INTO department(name) VALUES('Sales');
INSERT INTO department(name) VALUES('Engineering');

INSERT INTO roles(title, salary, department_id)VALUES ('Sales Lead', 100000, 1);
INSERT INTO roles(title, salary, department_id)VALUES ('Salesperson', 80000, 1);
INSERT INTO roles(title, salary, department_id)VALUES ('Lead Engineer', 150000, 2);

INSERT INTO employees(first_name, last_name, roles_id, manager_id)VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employees(first_name, last_name, roles_id, manager_id)VALUES ('Ashley', 'Rodriguez', 3, NULL);
INSERT INTO employees(first_name, last_name, roles_id, manager_id)VALUES ('Mike', 'Chan', 2, 1);
 
select *from employees;