const {
  app,
  BrowserWindow,
  BrowserView,
  session,
  ipcMain,
  WebContents,
} = require("electron");
const axios = require("axios").default;
// include the Node.js 'path' module at the top of your file
const path = require("path");

const baseURL = "https://www.xxxx.com";
var myCookie;
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosClient.interceptors.request.use(
  (config) => {
    if (myCookie !== undefined) {
      config.headers["Cookie"] = myCookie;
    }
    return config;
  },
  (error) => Promise.reject(error.request.data.err)
);

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.webContents.openDevTools();
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//ipcMain.on will receive the “btnclick” info from renderprocess
ipcMain.on("btnclick", function (event, arg) {
  var data = JSON.stringify({
    account: "xxx",
    password: "xxxx",
  });

  axiosClient
    .post("/api/user/userLogin", data)
    .then((res) => {
      myCookie = res.headers["set-cookie"][0].split(";")[0];
      console.log(myCookie);

      event.sender.send("login-task-finished", myCookie);
    })
    .catch((err) => console.log(err));
});

//ipcMain.on will receive the “btnclick” info from renderprocess
ipcMain.on("getTime", function (event, arg) {
  axiosClient
    .get("/api/common/getNow")
    .then((res) => {
      const data = res.data;
      console.log(data);
      event.sender.send("getTime-task-finished", data.data);
    })
    .catch((err) => console.log(err));
});
