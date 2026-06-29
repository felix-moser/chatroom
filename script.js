const URL = "http://10.100.120.111:3000/";
let roomsPollingId = null;
let isLoadingRooms = false;
let messagesPollingId = null;
let isLoadingMessages = false;
let currentRoomId = null;

async function loadRooms() {
  if (isLoadingRooms) {
    return;
  }

  isLoadingRooms = true;
  try {
    let antwort = await fetch(URL + "rooms");
    if (!antwort.ok) {
      // Show Error message in DOM
      console.log("HTTP Error");
      return;
    }

    let daten = await antwort.json();

    let sidebar = document.getElementById("roomsList");
    if (!sidebar) {
      return;
    }

    sidebar.querySelectorAll("#room-btn").forEach((button) => button.remove());

    if (!Array.isArray(daten) || daten.length === 0) {
      // Show Error message in DOM
      console.log("No Rooms");
    } else {
      // ToDo Load Rooms in DOM
      console.log(daten);
      for (const room of daten) {
        let newRoom = document.createElement("button");
        newRoom.id = "room-btn";
        newRoom.textContent = room.name;
        newRoom.onclick = () => joinRoom(room.id);
        sidebar.appendChild(newRoom);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingRooms = false;
  }
}

function startRoomsPolling() {
  if (roomsPollingId) {
    return;
  }

  loadRooms();
  roomsPollingId = setInterval(loadRooms, 5000);
}

function stopRoomsPolling() {
  if (!roomsPollingId) {
    return;
  }

  clearInterval(roomsPollingId);
  roomsPollingId = null;
}

async function addRoom(roomName) {
  if (roomName == "") {
    // show Error Message in DOM
    return;
  }

  let data = JSON.stringify({ name: roomName });

  try {
    let antwort = await fetch(URL + "rooms", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: data
    });
    if (!antwort.ok) {
      // Show Error message in DOM
      console.log("HTTP Error");
      return;
    }

    let daten = await antwort.json();
    if (antwort.status == 201) {
        // ToDo Show That room was Created
        console.log(daten);
    }
   
  } catch (error) {
    console.log(error);
  }
}

async function joinRoom(roomID){
  currentRoomId = roomID;
  startMessagesPolling(roomID);
}

async function loadMessages(roomID) {
  if (isLoadingMessages || !roomID) {
    return;
  }

  isLoadingMessages = true;

  try {
    let antwort = await fetch(URL + "rooms/" + roomID + "/messages");
    if (!antwort.ok) {
      // Show Error message in DOM
      console.log("HTTP Error");
      return;
    }

    let daten = await antwort.json();
    let chat = document.getElementById("chat");
    if (!chat) {
      return;
    }

    chat.innerHTML = "";

    if (antwort === "") {
      // Show Error message in DOM
      console.log("No Rooms");
    } else {
      for (const message of daten) {
        // Container for Message
        let messageDiv = document.createElement("div");
        messageDiv.id = "message";
        // Sendername of message
        let senderName = document.createElement("p");
        senderName.id = "username";
        senderName.textContent = message.author;
        // Send Text
        let messageText = document.createElement("p");
        messageText.textContent = message.text;
        messageText.id = "text_message";
        // Date and time of send message
        let messageTime = document.createElement("p");
        messageTime.textContent = new Date(message.createdAt).toLocaleTimeString();
        messageTime.id = "date";
        // Append all Elements to Div
        messageDiv.appendChild(senderName);
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(messageTime);
        // Append Div to Message
        chat.appendChild(messageDiv);
      }
      console.log(daten);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingMessages = false;
  }
}

function startMessagesPolling(roomID) {
  if (messagesPollingId) {
    clearInterval(messagesPollingId);
    messagesPollingId = null;
  }

  loadMessages(roomID);
  messagesPollingId = setInterval(() => loadMessages(currentRoomId), 5000);
}

function stopMessagesPolling() {
  if (!messagesPollingId) {
    return;
  }

  clearInterval(messagesPollingId);
  messagesPollingId = null;
}

async function sendMessage(author,roomID,message) {
  if (roomID == "") {
    // show Error Message in DOM
    return;
  }

  let data = JSON.stringify({ author: author, text: message});

  try {
    let antwort = await fetch(URL + "rooms/"+ roomID +"/messages", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: data
    });
    if (!antwort.ok) {
      // Show Error message in DOM
      console.log("HTTP Error");
      return;
    }

    let daten = await antwort.json();
    if (antwort.status == 201) {
        // ToDo Show message
        console.log(daten);
    }
   
  } catch (error) {
    console.log(error);
  }
}

startRoomsPolling();
window.addEventListener("beforeunload", stopRoomsPolling);
window.addEventListener("beforeunload", stopMessagesPolling);

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementsByClassName("openbtn")[0].style.visibility = "hidden";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementsByClassName("openbtn")[0].style.visibility = "visible";
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}