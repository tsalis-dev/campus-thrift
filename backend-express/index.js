const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Serve static images in uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main API routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
  res.send('API Campus Thrift Backend running smoothly with Express & Prisma!');
});

app.listen(port, () => {
  console.log(`Server Campus Thrift is running on http://localhost:${port}`);
});
