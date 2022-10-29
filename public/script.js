socket = io()

let inpPass = document.getElementById('inpPass')
let inpToUser = document.getElementById('inpToUser')
let inpUsername = document.getElementById('inpUsername')
let btnStart = document.getElementById('btnStart')
let btnSendMsg = document.getElementById('btnSendMsg')
let inpNewMsg = document.getElementById('inpNewMsg')
let ulMsgs = document.getElementById('ulMsgs')

inpUsername.addEventListener('input', (event) => {
    let val = inpUsername.value
    valTrim = val.trim()
    if(valTrim) btnStart.removeAttribute('disabled')
    if(!event.target.value) btnStart.setAttribute('disabled', true)
})

btnStart.addEventListener('click', () => {
    socket.emit('login', {
        username: inpUsername.value,
        pass: inpPass.value
    })
})

btnSendMsg.addEventListener('click', () => {
    socket.emit('msg_send', {
        to: inpToUser.value,
        msg: inpNewMsg.value
    })
    inpNewMsg.value = ''
    inpToUser.value = ''
})

socket.on('msg_rcvd', (data) => {
    let newMsgElement = document.createElement('li')
    newMsgElement.setAttribute('class', 'list-group-item')
    newMsgElement.textContent = `[${data.from}]: ${data.msg}`
    ulMsgs.appendChild(newMsgElement)
})

socket.on('logged_in', () => {
    document.getElementById('loginBox').style.display = 'none'
    document.getElementById('chatBox').style.display = 'flex'
})

socket.on('login_failed', () => {
    alert('username or password incorrect')
})