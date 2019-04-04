const socket = io();

function initialize() {
  let notice = document.getElementById("notice");
  notice.addEventListener("click", showNotice);

  let screensaver = document.getElementById("screensaver");
  screensaver.addEventListener("click", screensaverEnable);

  let shutDown = document.getElementById("turnOff");
  shutDown.addEventListener("click", turnPcOff);

  socket.on("connect", () => {
    console.log("you connected to socket" + socket.id);
  });

  document.addEventListener("mousemove", e => {
    let mousePosition = {
      x: e.clientX,
      y: e.clientY
    };
    socket.emit("mouseMoved", mousePosition);
  });

  document.addEventListener("click", e => {
    let mousePosition = {
      x: e.clientX,
      y: e.clientY
    };
    socket.emit("mouseClick", mousePosition);
  });

  socket.on("electronUserOnline", () => {
    let onlineBar = document.querySelectorAll(".online");
    onlineBar.forEach(el => {
      el.setAttribute("style", "background-color:green");
    });
    let response = document.getElementById("response");
    response.setAttribute("style", "background-color:green");
  });

  socket.on("electronUserOffline", () => {
    let onlineBar = document.querySelectorAll(".online");
    onlineBar.forEach(el => {
      el.setAttribute("style", "background-color:red");
    });
    let response = document.getElementById("response");
    response.setAttribute("style", "background-color:red");
    response.innerHTML = "";
  });

  socket.on("noticeResponse", response => {
    let answer = document.getElementById("response");
    console.log(response);
    answer.innerHTML = response;
  });

  socket.on("disconnect", () => {
    console.log("you disconnected");
  });
}

function showNotice() {
  socket.emit("notice");
  console.log("notice");
}

function screensaverEnable() {
  socket.emit("screensaver");
}

function turnPcOff() {
  console.log("turnPcOff");
  socket.emit("turnoff");
}
