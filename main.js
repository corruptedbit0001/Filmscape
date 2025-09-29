
//const path = require('path');
//const {app, BrowserWindow} = require('electron');
//const { ElectronBlocker } = require('@ghostery/adblocker-electron');
//const fetch = require('cross-fetch'); // required 'fetch'
import path from 'path';
import {app, BrowserWindow, ipcMain, session } from 'electron';
import { ElectronBlocker } from '@ghostery/adblocker-electron';
import { readFileSync, writeFileSync } from 'fs';
import fs from 'fs';
import fetch from 'cross-fetch';
const ipc = ipcMain;
const appFolderPath = path.join(app.getPath("userData"),'UserData');
const filePath = path.join(app.getPath("userData"),'UserData','bookmarks.json');
const watchFilePath = path.join(app.getPath("userData"),'UserData','watched.json');
const colorFilePath = path.join(app.getPath("userData"),'UserData','userConfig.json');
let bookmarks;
let watched;
let colors;
// ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
//   blocker.enableBlockingInSession(session.defaultSession);
// });
function ReadBookmarks(){
  if (fs.existsSync(filePath)) {
      console.log("reading bookmarks.json from: "+filePath);
      const data = fs.readFileSync(filePath, 'utf8');
      const jsondata = JSON.parse(data);
      bookmarks = jsondata;
      mainWindow.webContents.send('update-bookmarks', bookmarks)
  }
}
function ReadWatched(){
  if (fs.existsSync(watchFilePath)) {
      console.log("reading watched.json from: "+watchFilePath);
      const data = fs.readFileSync(watchFilePath, 'utf8');
      const jsondata = JSON.parse(data);
      watched = jsondata;
      mainWindow.webContents.send('update-watched', watched)
  }
}
function ReadColors(){
   if (fs.existsSync(colorFilePath)) {
      console.log("reading userConfig.json from: "+colorFilePath);
      const data = fs.readFileSync(colorFilePath, 'utf8');
      const jsondata = JSON.parse(data);
      colors = jsondata;
      mainWindow.webContents.send('update-colors', colors)
  }
}
function RemoveWatched(id,type){
    const data = fs.readFileSync(watchFilePath, 'utf8');
    const jsondata = JSON.parse(data);
    let has = false;
    for (let i = 0; i < jsondata.length; i++) {
      if(jsondata[i].id == id && jsondata[i].type == type){
        jsondata.splice(i,1);
        break;
      }
    }
    watched = jsondata;
    const jsonData = JSON.stringify(jsondata, null, 2);
    fs.writeFileSync(watchFilePath, jsonData, 'utf8');
    mainWindow.webContents.send('update-watched', watched);
}
function WriteToFile(id,type,season,ep){
   let today = new Date();
    let dataToWrite = {
        
    };
    console.log(filePath );
    if(!fs.existsSync(appFolderPath)){
      fs.mkdirSync(appFolderPath,{recursive:true});
    }
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const jsondata = JSON.parse(data);
      let has = false;
      if(type == "movie"){
        if(jsondata.hasOwnProperty('movies_id')){
          for (let i = 0; i < jsondata.movies_id.length; i++) {
            if(jsondata.movies_id[i] == id){
              has = true;
              jsondata.movies_id.splice(i,1);
              break;
            }
          }
          if(!has)
          jsondata.movies_id.push({
            "id" : id,
            "last_update": ""+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
          });
          dataToWrite = jsondata;
        }else{
          if(jsondata.hasOwnProperty('tv_id')){
            dataToWrite = jsondata;
          }
          dataToWrite.movies_id = [{
            "id" : id,
            "last_update": ""+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
          }];
        }
        

      }else{
        if(jsondata.hasOwnProperty('tv_id')){
          for (let i = 0; i < jsondata.tv_id.length; i++) {
            if(jsondata.tv_id[i].id == id){
              has = true;
              jsondata.tv_id.splice(i,1);
              break;
            }
          }
          if(!has)
          jsondata.tv_id.push({
            "id" : id,
            "season": season,
            "episode" : ep,
            "last_update": ""+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
          });
          dataToWrite = jsondata;
        }else{
          if(jsondata.hasOwnProperty('movies_id')){
            dataToWrite = jsondata;
          }
          dataToWrite.tv_id = [{
            "id" : id,
            "season": season,
            "episode" : ep,
            "last_update": ""+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
          }];
        }
        
      }
      
    }else{
      if(type == "movie"){
        dataToWrite.movies_id = [{
            "id" : id,
            "last_update": ""+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
          }];
      }else{
        dataToWrite.tv_id = [{
            "id" : id,
            "season": season,
            "episode" : ep,
            "last_update": ""+today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
          }];
      }
    }
    //console.log(dataToWrite);
    bookmarks = dataToWrite;
    const jsonData = JSON.stringify(dataToWrite, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    mainWindow.webContents.send('update-bookmarks', bookmarks)
}
function UpdateNewEpisodes(episodes){
  if(!fs.existsSync(appFolderPath)){
      fs.mkdirSync(appFolderPath,{recursive:true});
    }
    const jsonData = JSON.stringify(episodes, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
}
function WriteToWatchFile(id,type,title,season,episode,poster){
    let dataToWrite = [];

    if(!fs.existsSync(appFolderPath)){
      fs.mkdirSync(appFolderPath,{recursive:true});
    }
    if (fs.existsSync(watchFilePath)) {
      const data = fs.readFileSync(watchFilePath, 'utf8');
      const jsondata = JSON.parse(data);
      let has = false;
      for (let i = 0; i < jsondata.length; i++) {
        if(jsondata[i].id == id && jsondata[i].type == type){
          jsondata.splice(i,1);
          jsondata.unshift({
            "id": id,
            "type": type,
            "title": title,
            "season": season,
            "episode": episode,
            "poster": poster
          });
          has = true;
          break;
        }
      }
      if(!has){
        jsondata.unshift({ 
          "id": id,
          "type": type,
          "title": title,
          "season": season,
          "episode": episode,
          "poster": poster
        });
      }
      dataToWrite = jsondata;
      
    }else{
      dataToWrite.push({ 
        "id": id,
        "type": type,
        "title": title,
        "season": season,
        "episode": episode,
        "poster": poster
      });
    }
    watched = dataToWrite;
    const jsonData = JSON.stringify(dataToWrite, null, 2);
    fs.writeFileSync(watchFilePath, jsonData, 'utf8');
    mainWindow.webContents.send('update-watched', watched)
}

function WriteColors(maincol,maintextcol,sectextcol,backcol){
    let dataToWrite = [];

    if(!fs.existsSync(appFolderPath)){
      fs.mkdirSync(appFolderPath,{recursive:true});
    }
   
    dataToWrite.push({ 
      "maincol": maincol,
      "maintextcol": maintextcol,
      "sectextcol": sectextcol,
      "backcol": backcol        
    });
    
    watched = dataToWrite;
    const jsonData = JSON.stringify(dataToWrite, null, 2);
    fs.writeFileSync(colorFilePath, jsonData, 'utf8');
    
}

let mainWindow = null;

async function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: "Home Movies",
        height: 720,
        width: 1240,
        transparent:true,
        frame: false,
        webPreferences:{
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(app.getAppPath(), 'preload.js')

        }
    });

    
    

  mainWindow.loadFile(path.join(app.getAppPath(),'./rendered/index.html'));

  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
            blocker.enableBlockingInSession(session.defaultSession);
            // You can also enable blocking for specific sessions if you have multiple
            // session.fromPartition('some-partition').then((partitionSession) => {
            //     blocker.enableBlockingInSession(partitionSession);
            // });
            console.error('Initialized ad blocker:');
        }).catch((err) => {
            console.error('Failed to initialize ad blocker:', err);
        });
  
    session.defaultSession.webRequest.onBeforeRequest((details,callback)=>{
      callback({cancle:true})
      //console.error('Blocking request:'+details.url);
    })
      
  mainWindow.webContents.setWindowOpenHandler((details) => {
    console.log("Blocking "+details.url);
    return { action: 'deny' };
  });
  ipc.on("closeApp",()=>{
    mainWindow.close();
  });
  ipc.on("minimizeApp",()=>{
    mainWindow.minimize();
  });
  ipc.on("maxApp",()=>{
    if(mainWindow.isMaximized()){
      mainWindow.restore();
    }else{
      mainWindow.maximize();
    }
  });
  ipc.on("addbookmark",(event,id,type,season,ep)=>{
    
    WriteToFile(id,type,season,ep);
  });
  ipc.on("update-colrs",(event,maincol,maintextcol,sectextcol,backcol)=>{
    WriteColors(maincol,maintextcol,sectextcol,backcol);
  });

  ipc.on("addwatched",(event,id,type,title,season,episode,poster)=>{
    WriteToWatchFile(id,type,title,season,episode,poster);
  });
  ipc.on("update-new-episodes",(event,episodes)=>{
    UpdateNewEpisodes(episodes);
  });
  ipc.on("request-bookmarks",()=>{
    ReadBookmarks();
  });
  ipc.on("request-watched",()=>{
    ReadWatched();
  });
  ipc.on("request-colors",()=>{
    ReadColors();
  });
  ipc.on("remove-watched",(eveent,id,type)=>{
    RemoveWatched(id,type);
  });
  ipc.handle("get-app-version",()=>{
     return app.getVersion();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
}


app.on('ready',()=>{
    createMainWindow();
});
app.on('window-all-closed', ()=>{
  if(process.platform != 'darwin'){
    app.quit();
  }
});

console.log("in main js");