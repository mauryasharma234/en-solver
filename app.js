
require('dotenv').config({ path: `${process.cwd()}/.env` });

const express = require("express");

const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json());
const formulaRouter = require('./route/formulaRoute')


// app.get("/", (req, res) => {
//     res.send("Hi there");
// })

app.use('/api/v1/test', formulaRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
})