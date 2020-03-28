/*
    Create a server that listens for incoming requests, using Express framework.
    Steps:
        1. Run 'npm init', in terminal/cmd - It creates 'package.json' file in the current directory.
        2. Run 'npm install express' - Creates 'node modules' folder.
*/

// import following.
let express = require('express')
let mongodb = require('mongodb')

let app = express()
let db

// open a connection with the db.
// 'connect(<connectionString-where or what we want to connect to>,  , <function that connect method calls, after opening up connection with db>) '.
// connect string from mongo db.
let connectionString = 'mongodb+srv://todoAppUser:todoapp@cluster0-dxgk9.mongodb.net/TodoApp?retryWrites=true&w=majority' 
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    // selects mongodb db.
    db = client.db()
    // tell app to listen for incoming requests, port:3000.
    app.listen(3000)
})

// tell express add all form values to body object and then add that body object the req object.
app.use(express.urlencoded({extended: false}))

// if it receives an incoming GET req to the home page url.
app.get('/', function(req, res) {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
        <!-- from action -->
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">Fake example item #1</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">Fake example item #2</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">Fake example item #3</span>
            <div>
              <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        </ul>
        
      </div>
      
    </body>
    </html>`)
})

// when web browser sends a POST req to the '/create-item' url, in reponse, run the function.
app.post('/create-item', function(req, res) {
    // create a new doc in mongodb.
    // 'insertOne({<object>, function})'.
    db.collection('items').insertOne({text: req.body.item}, function() {
        res.send("Thanks for submitting the form")
    })
})

