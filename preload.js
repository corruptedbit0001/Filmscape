const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('closeApp', title),
  minimizeApp: (title) => ipcRenderer.send('minimizeApp',title),
  maxApp: (title)=> ipcRenderer.send("maxApp",title),
  AddToBookmark: (id,type,season,ep) => ipcRenderer.send("addbookmark",id,type,season,ep),
  AddWatched: (id,type,title,season,episode,poster) => ipcRenderer.send("addwatched",id,type,title,season,episode,poster),
  onUpdateBookmarks: (callback) => ipcRenderer.on('update-bookmarks', (_event, value) => callback(value)),
  onUpdateWatched: (callback) => ipcRenderer.on('update-watched', (_event, value) => callback(value)),
  requestBookmarks:() => ipcRenderer.send("request-bookmarks"),
  requestWatched:() => ipcRenderer.send("request-watched"),
  removeWatched:(id,type) => ipcRenderer.send("remove-watched", id, type),
  AddColors: (maincol,maintextcol,sectextcol,backcol) => ipcRenderer.send("update-colrs",maincol,maintextcol,sectextcol,backcol),
  requestColors : () => ipcRenderer.send("request-colors"),
  onUpdateColors : (callback) => ipcRenderer.on('update-colors', (_event, value) => callback(value)),
  AddNewEpisodes : (episodes) => ipcRenderer.send("update-new-episodes",episodes),
  getAppVersion : () => ipcRenderer.invoke("get-app-version"),
})