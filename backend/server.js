const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const puppiesRoutes = require('./routes/puppiesRoutes');
const port = process.env.PORT || 8010;
const app = express();
const mysql = require('mysql2');
require('dotenv').config();



app.use(express.json());
app.use(cors());
app.use('/api/puppies', puppiesRoutes);

app.use((req, res, next) => {

    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self';"
    );
  

    app.options('*', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.sendStatus(200); 
    });
  

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200); 
    }
  
    next();
  });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.post('/puppies', async (req, res) => {
    try {
        console.log("Request Body:", req.body);  // Log request data
        const { name, breed, age_est, current_kennel_number } = req.body;
        const newPuppy = await prisma.puppies.create({
            data: { name, breed, age_est, current_kennel_number },
        });
        console.log("Created Puppy:", newPuppy);  // Log created puppy data
        res.json(newPuppy);
    } catch (error) {
        console.error("Error creating puppy:", error); // Log error
        res.status(500).json({ error: error.message });
    }
});
