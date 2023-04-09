require("dotenv").config({ path: "./config/.env" })

const express = require('express')
const app = express()
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const connectDatabase = require("./config/database")
connectDatabase()



// Routes
const emiRoutes = require('./routes/emiRoutes')
app.use("/", emiRoutes)


// App Starts from this route
app.get("/", function (req, res) {
    res.render('pages/index')
})

app.get("/getEMIDetails", function (req, res) {
    res.render('pages/singleEMI')
})

app.get("/payEMI", function (req, res) {
    res.render('pages/payEMI')
})

app.get("/addEMI", function (req, res) {
    res.render('pages/addEMI')
})

// Connection with the server
const server = app.listen(process.env.PORT, function () {
    console.log(`Server is working.`)
})