const express = require("express");
const morgan = require('morgan');

const apiRoute = require("./routes/routes");
const cors = require('cors');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');

//Initialize
require('./database');
require("dotenv").config();

const app = express();
//Settings

app.set('Port', 4000);
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());

//ROUTES
app.use("/whatsapp", apiRoute);

app.listen(app.get('Port'), () => {
    console.log(`server on port 1337 `);
  });
