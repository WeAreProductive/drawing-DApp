/**
 * Query database
 * referrence https://www.sqlitetutorial.net/sqlite-nodejs
 * https://stackoverflow.com/questions/808499/does-it-matter-what-extension-is-used-for-sqlite-database-files
 * @TODO rename file to .sqlite and test
 */
import sqlite3 from "sqlite3";

export const insertDrawing = async (data) => {
  const { uuid, dimensions, date_created, owner, action, drawing_objects } =
    data;
  if (
    !uuid ||
    !dimensions ||
    !date_created ||
    !owner ||
    !action ||
    !drawing_objects
  ) {
    console.warn("Insert drawing: required data is missing ...");
  }
  // const query = `INSERT INTO drawings1 (uuid, dimensions, date_created, owner, action, drawing_objects )
  //   VALUES(${uuid}, ${dimensions},${date_created},${owner},${action},${drawing_objects})`;
  // const query = "SELECT * FROM drawings;";
  console.log("Insert drawing...");
  return await executeQuery();
};

const executeQuery = async (query) => {
  console.log("executing query");
  let db = new sqlite3.Database("drawings.db");

  // insert one row into the langs table, TODO modify for select queries
  // db.run("INSERT INTO test (name) VALUES ($string)", {
  //   $string: "foo",
  // });
  db.run(
    "INSERT INTO drawings1 (uuid, dimensions, date_created, owner, action, drawing_objects) VALUES('{uuid}', '{dimensions}','{date_created}','{owner}','{action}','{drawing_objects)')",
    [],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
  // db.all(query, [], (err, rows) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(rows);
  //   // rows.forEach((row) => {
  //   //   console.log(row.name);
  //   // });
  // });
  // close the database connection
  db.close();
};
