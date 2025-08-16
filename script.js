const firebaseConfig = {
  apiKey: "AIzaSyB5PXKlgcYp6ko8Ege7LswXU5PAZvACDtU",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app-default-rtdb.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "xxxx",
  appId: "xxxx"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Generate random userID
function generateUserID() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// index.html function
function enterChat() {
    const name = document.getElementById('nameInput').value.trim();
    if(name === '') { alert("Enter Name"); return; }

    const userID = generateUserID();
    localStorage.setItem("userID", userID);
    localStorage.setItem("userName", name);

    db.ref('users/' + userID).set({ name: name, online: true });

    window.location.href = "users.html";
}

// users.html functions
const userID = localStorage.getItem("userID");
const userName = localStorage.getItem("userName");
const usersListDiv = document.getElementById("usersList");

if(usersListDiv){
    db.ref('users').on('value', snapshot => {
        usersListDiv.innerHTML = '';
        snapshot.forEach(snap => {
            const uID = snap.key;
            const uData = snap.val();
            if(uID !== userID){
                const div = document.createElement('div');
                div.innerHTML = `${uData.name} <button onclick="sendRequest('${uID}')">Send Request</button>`;
                usersListDiv.appendChild(div);
            }
        });
    });
}

function sendRequest(toID) {
    db.ref('friendRequests/' + toID + '/' + userID).set({ status: 'pending', fromName: userName });
    alert("Request Sent!");
}

// chat.html functions
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const chatID = localStorage.getItem("chatID") || "testChat";

function sendMessage() {
    const msg = messageInput.value.trim();
    if(msg === '') return;
    db.ref('chats/' + chatID).push({ from: userName, message: msg, timestamp: Date.now() });
    messageInput.value = '';
}

if(chatBox){
    db.ref('chats/' + chatID).on('child_added', snap => {
        const data = snap.val();
        const div = document.createElement('div');
        div.textContent = `${data.from}: ${data.message}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
