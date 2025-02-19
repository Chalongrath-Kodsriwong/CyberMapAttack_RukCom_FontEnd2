const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

const users = []; // In-memory users for demonstration purposes
const SECRET_KEY = 'your_secret_key'; // Replace with an environment variable in production

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Protected data', user: decoded });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});

app.listen(8000, () => console.log('Server running on http://localhost:8000'));
