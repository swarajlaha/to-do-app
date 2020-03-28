/*
    Create a server that listens for incoming requests, using Express framework.
    Steps:
        1. Run 'npm init', in terminal/cmd - It creates 'package.json' file in the current directory.
        2. Run 'npm install express' - Creates 'node modules' folder.
*/

let express = require('express')

let app = express()

// if it receives an incoming GET req to the home page url.
app.get('/', function(req, res) {
    res.send("Hello, welcome to our app.")
})

// tell app to listen for incoming requests, port:3000.
app.listen(3000)