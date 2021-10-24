// include the ipc module to communicate with main process.
const ipcRenderer = require("electron").ipcRenderer;

const btnclick = document.getElementById("loadnewwindow");
btnclick.addEventListener("click", function () {
  var arg = "secondparam";

  //send the info to main process . we can pass any arguments as second param.
  ipcRenderer.send("btnclick", arg); // ipcRender.send will pass the information to main process
});

const getTimeclick = document.getElementById("get_time");
getTimeclick.addEventListener("click", function () {
  var arg = "gettime";

  //send the info to main process . we can pass any arguments as second param.
  ipcRenderer.send("getTime", arg); // ipcRender.send will pass the information to main process
});

ipcRenderer.on("login-task-finished", (event, param) => {
  var div = document.getElementById("session");
  div.innerHTML = param;
});
ipcRenderer.on("getTime-task-finished", (event, param) => {
  var div = document.getElementById("time");
  div.innerHTML = param;
});
