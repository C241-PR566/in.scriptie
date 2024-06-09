import mysql from "mysql";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inscriptie",
});

export default conn;