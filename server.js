const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo")
const PORT = process.env.PORT || 3001;
const app = express();
require("console.table")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());