import mysql from 'mysql';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let con;

// Endpoint to connect to the database
app.post('/connect', function (req, res) {
  const { server, user, password } = req.body;
  con = mysql.createConnection({
    host: server,
    database: 'nursery',
    user: user,
    password: password
  });

  con.connect(function(err) {
    if (err) {
      if(err.code === 'ER_ACCESS_DENIED_ERROR'){
        res.status(401).send({ message: 'Invalid user or password. Please try again.' });
      } else {
        console.log('Connection failed: ', err.message);
        res.status(500).send({ message: 'Connection failed. Please try again.' });
      }
    } else {
      res.status(200).send({ message: 'Connected successfully!' });
    }
  });
});

// Function to search plants in the database
function searchInventory(query) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        plantId,
        name,
        type,
        description,
        FORMAT(price,2) AS price,
        quantity,
        image_url
      FROM 
        plants 
      WHERE 
        name LIKE ? OR description LIKE ? OR type LIKE ? 
      ORDER BY 
        name, description
    `;
    const values = [`%${query}%`, `%${query}%`, `%${query}%`];
    con.query(sql, values, function (err, result) {
      if (err) {
        console.error('Error fetching plants: ', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Add to Cart
const cart = [];

app.post('/cart/add', (req, res) => {
  const { name, quantity } = req.body;
  const item = cart.find(plant => plant.name === name);
  if(item) {
    item.quantity += quantity;
  } else {
    cart.push({ name, quantity });
  }
  res.status(200).send({ message: 'Item added to cart.', cart });
});

// View cart
app.get('/cart', (req, res) => {
  res.status(200).send({ cart });
});

// Function to update inventory in the database
function updateInventory(plant) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO plants (name, description, type, quantity, price, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        description = VALUES(description),
        type = VALUES(type),
        price = VALUES(price),
        quantity = VALUES(quantity),
        image_url = VALUES(image_url)
    `;
    const values = [plant.name, plant.description, plant.type, plant.quantity, plant.price, plant.image_url ];
    con.query(sql, values, function (err, result) {
      if (err) {
        console.error('Error updating inventory: ', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Function to delete a plant from the inventory
function deletePlant(plantId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM plants WHERE id = ?`;
    con.query(sql, [plantId], function (err, result) {
      if (err) {
        console.error('Error deleting plant: ', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Function to get low-stock plants
function getLowStockPlants() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM plants WHERE quantity < 5 ORDER BY quantity ASC`;
    con.query(sql, function (err, result) {
      if (err) {
        console.error('Error fetching low-stock plants: ', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Endpoint to get plants based on search query
app.get('/plants', async function (req, res) {
  try {
    const query = req.query.query || ''; // Default to an empty string if query is undefined
    let plants = await searchInventory(query);
    res.status(200).send({ response: plants });
  } catch (err) {
    console.error('Error in /plants route: ', err.message);
    res.status(500).send({ message: 'Error fetching plants. Please try again!' });
  }
});


// Endpoint to update inventory
app.post('/updateInventory', async function (req, res) {
  try {
    let result = await updateInventory(req.body);
    res.status(200).send({ message: 'Inventory updated successfully!' });
  } catch (err) {
    console.error('Error in /updateInventory route: ', err.message);
    res.status(500).send({ message: 'Error updating inventory. Please try again!' });
  }
});

// Endpoint to delete a plant
app.post('/deletePlant', async function (req, res) {
  try {
    const plantId = req.body.plantId;
    let result = await deletePlant(plantId);
    res.status(200).send({ message: 'Plant deleted successfully!' });
  } catch (err) {
    console.error('Error in /deletePlant route: ', err.message);
    res.status(500).send({ message: 'Error deleting plant. Please try again!' });
  }
});

// Endpoint to get low-stock plants
app.get('/lowStock', async function (req, res) {
  try {
    let plants = await getLowStockPlants();
    res.status(200).send({ response: plants });
  } catch (err) {
    console.error('Error in /lowStock route: ', err.message);
    res.status(500).send({ message: 'Error fetching low-stock plants. Please try again!' });
  }
});

// Start the server
app.listen(5501, function () {
  console.log('App listening on port 5501!');
});