const express = require('express');
const bodyParser = require('body-parser');

const studentRoutes = require('./routes/students');
const cors = require('cors');


const app = express();
const PORT = 3000;
app.use(cors());

app.use(bodyParser.json());
app.use('/api', studentRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
