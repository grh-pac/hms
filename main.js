require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('view engine', "ejs");
app.use("", require("./routes/routes"));

app.get('/', (req, res)=>{
    res.render('index');
});


app.listen(PORT, ()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
});

