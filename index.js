const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const serviceRoutes = require("./routes/service");
const serviceRequestRoutes = require("./routes/serviceRequest");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    res.header(
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

app.use("/user", userRoutes, bodyParser);
app.use("/service", serviceRoutes, bodyParser);
app.use("/serviceRequest", serviceRequestRoutes, bodyParser);

mongoose.connect(
    "mongodb+srv://srAdrover:1234@cluster0.wlvhj.mongodb.net/eventcoin?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Base de datos connectada");
    app.listen(process.env.PORT || 8080);
}).catch((err) => console.error(err));