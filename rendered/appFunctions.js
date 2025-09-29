

const closeBtn = document.getElementById('closeBtn')



closeBtn.addEventListener("click",()=>{
    window.electronAPI.setTitle("closeApp")
});

minBtn.addEventListener("click",()=>{
    window.electronAPI.minimizeApp("minimizeApp")
});
maxBtn.addEventListener("click",()=>{
    window.electronAPI.maxApp("minimizeApp")
});


async function GetAppVersion() {
    const version = await window.electronAPI.getAppVersion();
    appVersion.innerText = "Filmscape v"+ version;
}