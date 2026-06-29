const URL = "http://10.100.120.111:3000/";

async function loadRooms() {
  try {
    let antwort = await fetch(URL + "rooms");
    if (!antwort.ok) {
      // Show Error message in DOM
      console.log("HTTP Error");
      return;
    }

    let daten = await antwort.json();

    if (antwort === "") {
      // Show Error message in DOM
      console.log("No Rooms");
    } else {
      // ToDo Load Rooms in DOM
      console.log(daten);
    }
  } catch (error) {
    console.log(error);
  }
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
try {
    let antwort = await fetch(URL + "rooms/"+roomID+"/messages");
    if (!antwort.ok) {
      // Show Error message in DOM
      console.log("HTTP Error");
      return;
    }

    let daten = await antwort.json();

    if (antwort === "") {
      // Show Error message in DOM
      console.log("No Rooms");
    } else {
      // ToDo Show Messages in DOM
      console.log(daten);
    }
  } catch (error) {
    console.log(error);
  }
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

loadRooms();
joinRoom(3);