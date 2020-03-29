document.addEventListener("click", function(e) {
    if(e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your desired text value")

        // send 'userInput' data to node server.
        // send on-the-fly POST req to server.
        // post(<url that we want to send a POST req to>, <JS obj-the data that'll be sent along to the url>).
        // 'axios.post' - returns a Promise(used when we're not sure how long an action is going to take).
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
            // do something
        }).catch(function() {
            console.log("Please try again later.")
        })
    }
})