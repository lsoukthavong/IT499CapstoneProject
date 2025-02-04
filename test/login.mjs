import mysql from 'mysql';

let con;

export function connectToDatabase({ server, user, password }) {
  return new Promise((resolve, reject) => {
    console.log('Attempting to connect to the database...');
    con = mysql.createConnection({
      host: 'localhost',
      database: 'nursery',
      user: user,
      password: password
    });

    con.connect(function(err) {
      if (err) {
        // Enhanced error handling with console logging
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
          console.error('Error: Invalid user or password.');
          return reject(new Error('Invalid user or password. Please try again.'));
        } else if (err.code === 'ENOTFOUND') {
          console.error('Error: Database server not found.');
          return reject(new Error('Database server not found. Please check the server address.'));
        } else if (err.code === 'ECONNREFUSED') {
          console.error('Error: Connection refused.');
          return reject(new Error('Connection refused. Please ensure the database server is running.'));
        } else {
          console.error(`Error: Connection failed: ${err.message}`);
          return reject(new Error(`Connection failed: ${err.message}`));
        }
      }
      console.log('Connected to the database successfully!');
      resolve(con);
    });
  });
}

export function getConnection() {
  return con;
}