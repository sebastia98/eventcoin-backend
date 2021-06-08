const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Acess-Controll-Allow-Origin', '*');
    res.setHeader(
      'Acess-Controll-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

app.use("/user", userRoutes, bodyParser);

mongoose.connect(
    "mongodb+srv://srAdrover:1234@cluster0.wlvhj.mongodb.net/eventcoin?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Base de datos connectada");
    app.listen(process.env.PORT || 8080);
}).catch((err) => console.error(err));