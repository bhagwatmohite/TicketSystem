const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/userModel')
const routes = require('./routes/route.js');
const cors = require('cors');
require("dotenv").config({
  path: path.join(__dirname, "./.env")
});

const app = express();


const PORT = process.env.PORT || 3002;


// mongoose.connect('mongodb+srv://shubhamwaykar:shubhamwaykar@test.spzmduu.mongodb.net/test', { useNewUrlParser: true }).then(() => {
//   console.log('Connected to the Database successfully')
// });

// Allow requests from http://localhost:3000
app.use(cors());

mongoose.connect('mongodb+srv://ashishgaiwad:Ashish@cluster0.twe0ca8.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() => {
  console.log('Connected to the Database successfully')
});




app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    try {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one"
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
cors()
app.use('/favicon.ico', (req, res) => {
  res.status(204).end();
});


app.use('/', routes);

app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})