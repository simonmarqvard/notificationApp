const socket = require("socket.io-client")("http://smj470.itp.io:8081");
const robot = require("robotjs");
const osxScreensaver = require("osx-screensaver");
const { dialog } = require("electron").remote;
const shell = require("shelljs");

console.log("renderer");
console.log(process.version);

socket.on("connect", () => {
  console.log("connected through node socket" + socket.id);
});

socket.emit("electronUserOnline");

socket.on("userMousePosition", data => {
  console.log(data);
  robot.moveMouse(data.x, data.y);
});

socket.on("mouseclickpos", data => {
  console.log("click", data);
  // robot.moveMouse(data.x, data.y);
});

socket.on("notice", () => {
  const dialogOptions = {
    type: "question",
    buttons: ["Sure", "Not Happening"],
    message:
      "Hey Simon you are still awake. You should turn your computer off?",
    alwaysOnTop: true,
    icon: "./images/sleep.png"
  };
  dialog.showMessageBox(dialogOptions, i => {
    let response = dialogOptions.buttons[i];
    console.log(dialogOptions.buttons[i]);
    socket.emit("noticeResponse", response);
  });
});

socket.on("screensave", () => {
  shell.exec(
    "/System/Library/CoreServices/ScreenSaverEngine.app/Contents/MacOS/ScreenSaverEngine",
    { silent: true, async: true }
  );
});

socket.on("turnoff", () => {
  shell.exec("sudo shutdown -h now", { silent: true, async: true });
  shell.echo("sim");
});

socket.on("disconnect", () => {
  socket.emit("electronUserOffline");
  console.log("you disconnected");
});
