const express = require("express");
const morgan = require('morgan');

const apiRoute = require("./routes/routes");
const inventaryRoute = require("./routes/inventary.route");
const userRoute = require("./routes/client.route");
const kanbanRoute = require("./routes/kanban.route");

const cors = require('cors');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');

//Initialize
require('./database');
require("dotenv").config();

const app = express();
//Settings

app.set('Port', 3001);
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());

app.use("/whatsapp", apiRoute);
app.use("/whatsapp", inventaryRoute);
app.use("/whatsapp", userRoute);
app.use("/whatsapp", kanbanRoute);

app.listen(app.get('Port'), () => {
    console.log(`server on port 1337 `);
  });
