// const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";
// open the database
export const db = new sqlite3.Database("drawings.db");
// db.serialize(() => {
//   db.each(
//     `SELECT PlaylistId as id,
//                   Name as name
//            FROM playlists`,
//     (err, row) => {
//       if (err) {
//         console.error(err.message);
//       }
//       console.log(row.id + "\t" + row.name);
//     }
//   );
// });

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Close the database connection.");
// });
