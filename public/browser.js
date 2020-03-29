//
function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

// create feature.
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", function(e) {
    
    // don't do default behaviour of web browser, of sending a traditional req to server.
    e.preventDefault()

    // take value entered by user and ask axios to send to server.
    axios.post('/create-item', {text: createField.value}).then(function(response) {

        // this body will run, once the axios req is complete and server responds.
        // create the html for a new item.
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))

        // show user blank input field, after submitting the prev item, or clear out the existing value.
        createField.value = ""

        // refocus user's cursor onto that field.
        createField.focus()

    }).catch(function() {
        console.log("Please try again later.")
    })
})

document.addEventListener("click", function(e) {

    // delete feature.
    if(e.target.classList.contains("delete-me")) {
        if(confirm("Confirm to DELETE!")) {

            // run axios, to have the browser send an async req to our node server.
            axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function() {

                // this body will run, once the axios req is complete.
                // manipulate html interface - delete the element.
                e.target.parentElement.parentElement.remove()
    
            }).catch(function() {
                console.log("Please try again later.")
            }) 
        }
    }

    // update feature.
    if(e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your desired text value", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)

        // send 'userInput' data to node server.
        // send on-the-fly POST req to server.
        // post(<url that we want to send a POST req to>, <JS obj-the data that'll be sent along to the url>).
        // 'axios.post' - returns a Promise(used when we're not sure how long an action is going to take).
        // IF 'userInput' is NOT blank, ONLY then edit; don't take NULL.
        if(userInput) {
            axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {

                // this body will run, once the axios req is complete.
                // manipulate html interface.
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
    
            }).catch(function() {
                console.log("Please try again later.")
            })
        }
    }
})