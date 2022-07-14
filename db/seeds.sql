INSERT INTO department (name)
VALUES ("Product"),
       ("Marketing"),
       ("Engineering"),
       ("Implementation");

INSERT INTO role (title, salary, department_id) 
VALUES ("Analyst", 50000, 1),
       ("Developer", 100000, 3),
       ("Manager", 80000, 2),
       ("Executive", 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Riya", "Roy", 1, 3),
       ("Jenna", "Greengrass", 1, 3),
       ("Mike", "Hugh", 3, 2),
       ("Sheena", "Jackson", 2, 5),
       ("Miya", "Hamilton", 2, 5),
       ("Justin", "Milton", 4, 8),
       ("Frank", "Peters", 3, 8);
