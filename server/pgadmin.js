const express = require('express');
const cors = require('cors');
const app = express();
const port = 3083;
app.use(express.json());
app.use(cors());
const db = require('./pgdb');









app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });