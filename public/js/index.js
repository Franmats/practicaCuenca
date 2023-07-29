let user = ""
const chatbox = document.getElementById("chatbox")
const socket = io()

Swal.fire({
    title:"Auth",
    input:"text",
    text:"Set username",
    inputValidator: value => {
        return !value.trim() && "Please whrite a usernmae"
    },
    allowOutsideClick:false
}).then(result => {
    user= result.value
    document.getElementById("username").innerHTML=user
    socket.emit("new", user)
})

chatbox.addEventListener("keyup", event => {
    if (event.key === "Enter") {
        let txt = chatbox.value.trim()
        if(txt.length>0) {
            socket.emit("message", {
                user,
                txt
            })

            chatbox.value = ""
        }
    }
})

socket.on("logs", data => {
    const divLogs = document.getElementById("logs")
    let messages = divLogs.innerHTML

    data.forEach(men => {
        messages +=`<p><i>${men.user}</i>: ${men.txt}</p>`
    })

    divLogs.innerHTML = messages
})



