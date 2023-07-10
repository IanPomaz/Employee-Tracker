USE employeedb 

INSERT INTO department
(department_name)
VALUES
("IT"),
("Laminating"),
("Front desk"),
("Security"),
("Cooks");

INSERT INTO role 
(title, salary, department_id)
VALUES
("Cybersecurity", 55000, 1),
("Head laminator", 55000, 2),
("Phone lady", 55000, 3),
("Bouncer", 55000, 1),
("Head Chef", 55000, 1);


INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
    ( "Jean-Luc", "Picard", 4, 1),
    ( "William", "Riker", 4, 2),
    ( "Worf", "worst", 4,1),
    ( "Data", "dood", 2, NULL),
    ( "Geordi", "La Forge", 2, 3),
    ( "Deanna", "Troi", 1, 6),
    ( "Beverly", "Crusher", 3, NULL);