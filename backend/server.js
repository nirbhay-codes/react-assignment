const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000; // You can change this port if needed
const USERS_FILE = 'users.json'; // This file will store user data

app.use(cors()); // TODO - check usage
app.use(bodyParser.json());// TODO - check usage

// Read users from JSON file
const readUsersFromFile = () => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
  }
  return [];
};

// Write users to JSON file
const writeUsersToFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Signup route
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Add new user
  const newUser = { email, password };
  users.push(newUser);
  writeUsersToFile(users);

  return res.status(201).json(newUser);
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();

  const existingUser = users.find(
    (user) => user.email === email && user.password === password
  );
  if (existingUser) {
    return res.status(200).json(existingUser);
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
