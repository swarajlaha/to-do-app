/*
    Create a server that listens for incoming requests, using Express framework.
    Steps:
        1. Run 'npm init', in terminal/cmd - It creates 'package.json' file in the current directory.
        2. Run 'npm install express' - Creates 'node modules' folder.
        3. Run 'npm run watch' to see changes in browser.
*/

// import following.
let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')

let app = express()
let db

// heroku port.
let port = process.env.PORT
if(port == null || port == "") {
  port = 3000
}

// use contents of the folder 'public'.
app.use(express.static('public'))

// open a connection with the db.
// 'connect(<connectionString-where or what we want to connect to>,  , <function that connect method calls, after opening up connection with db>) '.
// connect string from mongo db.
let connectionString = process.env.MONGODB 
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    // selects mongodb db.
    db = client.db()
    // tell app to listen for incoming requests, port.
    app.listen(port)
})

// take submitted form data for asynchronous req.
app.use(express.json())
// tell express add all form values to body object and then add that body object the req object.
app.use(express.urlencoded({extended: false}))

// add password protection.
function passwordProtected(req, res, next) {
    // prompt user to enter user name and password.
    res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
    console.log(req.headers.authorization)
    // only if credentials match.
    if(req.headers.authorization == process.env.BASIC_AUTH) {
        // next function to run, only IF is true.
        next()
    } else {
        res.status(401).send("Authentication required")
    }
}

// function to add passwordProtected to all urls.
app.use(passwordProtected)

// if it receives an incoming GET req to the home page url.
app.get('/', function(req, res) {
    db.collection('items').find().toArray(function(err, items) {
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
              <form id="create-form" action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" placeholder="Type here...">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>

            <ul id="item-list" class="list-group pb-5"></ul>
          </div>
          <script>
            let items = ${JSON.stringify(items)} 
          </script>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>  
          <script src="/browser.js"></script>
        </body>
        </html>`)
    })
    
})

// when web browser sends a POST req to the '/create-item' url, in reponse, run the function.
app.post('/create-item', function(req, res) {

    // sanitize html, add allowed elements.
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})

    // create a new doc in mongodb.
    // 'insertOne({<object>, function})'.
    // perform CREATE operation.
    db.collection('items').insertOne({text: safeText}, function(err, info) {
        res.json(info.ops[0])
    })
})

// send user upated value to 'browser.js'.
app.post('/update-item', function(req, res) {
    
    // sanitize html, update allowed elements.
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})

    // connect with db.
    // 'findOneAndUpdate(<which doc to update>, <what to update>, <function that gets called, when db action is complete>)'.
    // perform UPDATE opeartion.
    db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
        res.send("Success")
    })
})

// tell express server what to do when it receives a delete-item url.
app.post('/delete-item', function(req, res) {

    // perform DELETE operation.
    // deleteOne(<select doc to be deleted>, <function that runs, once db changes are complete>).
    db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
        res.send("Success")
    })
})
