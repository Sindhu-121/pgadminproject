const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3083;
const db= require("./pgdb")
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const pgexamRouter = require('./pgadmin/Pgaddexam');
app.use('/Pgaddexam', pgexamRouter); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
