const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo")
const PORT = process.env.PORT || 3001;
require("console.table")


const db = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"19741974aA",
        database:"employeedb"
    },
    console.log("connected to database")
);

function init(){
    const logotext= logo({name:"employee tracker"}).render()
    console.log(logotext)
    inquirer.prompt([
        {
        type: "list",
        name: "openingMessage",
        message: "What would you like to do?",
        choices: [
          "viewAllEmployees",
          "viewAllDepartments",
          "viewAllRoles",
          "addADepartment",
          "addARole",
          "addAnEmployee",
          "updateAnEmployee",
          "quit",
        ],
    }
    ]).then((inquirerresponses)=>{
        let choices = inquirerresponses.openingMessage;
        switch(choices){
            case "viewAllEmployees":
            viewAllEmployees();
            break;
          case "viewAllDepartments":
            viewAllDepartments();
            break;
          case "viewAllRoles":
            viewAllRoles();
            break;
          case "addADepartment":
            addADepartment();
            break;
          case "addARole":
            addARole();
            break;
          case "addAnEmployee":
            addAnEmployee();
            break;
          case "updateAnEmployee":
            updateAnEmployee();
            break;
          case "quit":
            quit();
            break;
          default:
            console.log("somethings wrong with you");
            break;
        }
    })
}

function viewAllEmployees(){
    db.query(`
      SELECT 
        e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.department_name department,
        r.salary,
        concat(e2.first_name, " ",e2.last_name) manager
      FROM employee e 
      JOIN role r
      ON e.role_id=r.id
      JOIN department d
      ON r.department_id=d.id
      LEFT JOIN employee e2
      ON e.manager_id=e2.id
      `, function(err, results){
        (err) ? console.log(err) : console.table(results), init()
    })
}
function viewAllDepartments(){
    db.query("SELECT * FROM department", function(err, results){
        (err) ? console.log(err) : console.table(results), init()
    })
}
function viewAllRoles(){
    db.query(`
      SELECT
        r.id,
        r.title,
        r.salary,
        d.department_name department
      FROM role r
      JOIN department d
      ON r.department_id=d.id
    `, function(err, results){
        (err) ? console.log(err) : console.table(results), init()
    })
}

async function addADepartment(){
    inquirer.prompt([
      {
        type:"input",
        name:"department_name",
        message:"What is the department name?"
      }
    ]).then(({department_name})=>{
      db.query(`INSERT INTO department SET ?`, {department_name}, (err,data)=>{
          if(err) return console.log(err);
          init()

        }

      )
    })
}
async function addARole(){
  inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of this role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?"
      },
      {
        type: "input",
        name: "department_id",
        message: "What is the department ID for this role?"
      }
  ]).then(({title, salary, department_id})=>{
      db.query(`INSERT INTO role SET ?`, {title, salary, department_id}, (err,data)=>{
        if(err) return console.log(err);
        init();
      });
  });
}

async function addAnEmployee(){
  inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the first name of this employee?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of this employee?"
      },
      {
        type: "input",
        name: "role_id",
        message: "what will be your new employee's title?"
      },
      {
        type: "input",
        name: "manager_id",
        message: "What is this employee's manager ID?"
      },
  ]).then(({first_name, last_name, role_id, manager_id})=>{
      db.query(`INSERT INTO employee SET ?`, {first_name, last_name, role_id, manager_id}, (err,data)=>{
          if(err) {
              console.log(err);
          } 
          init();
      });
  });
}
function updateAnEmployee() {
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
          query = "UPDATE employee SET first_name = ? WHERE id = ?";
          break;
        case "Last Name":
          query = "UPDATE employee SET last_name = ? WHERE id = ?";
          break;
        case "Role ID":
          query = "UPDATE employee SET role_id = ? WHERE id = ?";
          break;
        case "Manager ID":
          query = "UPDATE employee SET manager_id = ? WHERE id = ?";
          break;
        default:
          break;
      }
      db.query(query, [value, id], (err) => {
        if (err) {
          console.error("Error updating employee:", err);
        } else {
          console.log("Employee updated successfully.");
        }
        init();
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      init();
    });
}

function quit(){
  console.log("Exiting the Employee Tracker...")
  process.exit();
}
init()