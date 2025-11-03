let bookmarkes;
let watched = null;
let countries;
let conectedEp = false;
let maxep = 0;
let expanded = false;
let watched_pag = 1;
let clear_watched_open = false;

let maincol = "#417564";
let maintextcol = "#e3e3e3";
let sectextcol = "#717171";
let backcol = "#1c1c1c";
window.electronAPI.onUpdateBookmarks((value) => {
  bookmarkes = value;
  //console.log(bookmarkes);
      GetLatestEpisodes();
  
});
window.electronAPI.onUpdateCountries((value) => {
  countries = value;
  //console.log(countries);
});
window.electronAPI.requestCountries();
window.electronAPI.onUpdateColors((value) => {
  loadedColors = true;
  maincol = value[0].maincol;
  maintextcol = value[0].maintextcol;
  sectextcol = value[0].sectextcol;
  backcol = value[0].backcol;
  //console.log(value[0]);
  main_undo.style.display = colorPicker.value != maincol ? "inline-block":"none";
  colorPicker.value = maincol;
  main_text_undo.style.display = textcolorPicker.value != maintextcol ? "inline-block":"none";
  textcolorPicker.value = maintextcol;
  sec_text_undo.style.display = sectextcolorPicker.value != sectextcol ? "inline-block":"none";
  sectextcolorPicker.value = sectextcol;
  back_undo.style.display = backcolorPicker.value != backcol ? "inline-block":"none";
  backcolorPicker.value = backcol;
  document.documentElement.style.setProperty('--accentcol', maincol);
  document.documentElement.style.setProperty('--mainTextCol', maintextcol);
  document.documentElement.style.setProperty('--secTextCol', sectextcol);
  document.documentElement.style.setProperty('--backgroundCol', backcol);
 
});
settings.addEventListener("click",()=>{
  if(!expanded){
    expanded = true;
    settings_conteiner.style.width = "250px";
  }else{
    expanded = false;
    settings_conteiner.style.width = "0";
  }
});

colorPicker.addEventListener("input", (event)=>{
  document.documentElement.style.setProperty('--accentcol', event.target.value);
  main_undo.style.display = "inline-block";
  maincol = event.target.value;
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});
textcolorPicker.addEventListener("input", (event)=>{
  document.documentElement.style.setProperty('--mainTextCol', event.target.value);
  main_text_undo.style.display = "inline-block";
  maintextcol = event.target.value;
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});
sectextcolorPicker.addEventListener("input", (event)=>{
  document.documentElement.style.setProperty('--secTextCol', event.target.value);
   sec_text_undo.style.display = "inline-block";
   sectextcol = event.target.value;
   window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});
backcolorPicker.addEventListener("input", (event)=>{
  document.documentElement.style.setProperty('--backgroundCol', event.target.value);
  back_undo.style.display = "inline-block";
  backcol = event.target.value;
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});

main_undo.addEventListener("click",()=>{
  main_undo.style.display = "none";
  maincol =  "#417564";
  colorPicker.value = maincol;
  document.documentElement.style.setProperty('--accentcol', maincol);
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});
main_text_undo.addEventListener("click",()=>{
  main_text_undo.style.display = "none";
  maintextcol = "#e3e3e3";
  textcolorPicker.value = maintextcol;
  document.documentElement.style.setProperty('--mainTextCol', maintextcol);
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});
sec_text_undo.addEventListener("click",()=>{
  sec_text_undo.style.display = "none";
  sectextcol = "#717171";
  sectextcolorPicker.value = sectextcol;
  document.documentElement.style.setProperty('--secTextCol', sectextcol);
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});
back_undo.addEventListener("click",()=>{
  back_undo.style.display = "none";
  backcol = "#1c1c1c";
  backcolorPicker.value = backcol;
  document.documentElement.style.setProperty('--backgroundCol', backcol);
  window.electronAPI.AddColors(maincol,maintextcol,sectextcol,backcol);
});


function OnWatch(id,type,title,season,episode,poster){
    window.electronAPI.AddWatched(id,type,title,season,episode,poster);
}
function DisplayWatchedItem(id,tv, poster,year,season,ep,title,aclass,quality,bookmark,imdb_id = 1){
  return `<div class="item-block watched-block" >
                  <div class="quality">`+(tv == "tv" ? "TV Series":"Movie")+`</div> 
                  `+(tv == "tv" ? '<div class="atepisode">'+season+''+ep+'</div> ' : "")+`                 
                  <a data-season="`+(season.split(" ")[1])+`" data-ep="`+ep.split(" ")[1]+`" data-title="`+title+`" data-poster="`+poster+`" data-imdbid="`+imdb_id+`" data-id="`+id+`" data-type="`+tv+`"  class="`+aclass+`" value="watchpage" >
                  <div width="190px" height="150px" value="watchpage" 
                  style="width:190px;height:120px;background:url(`+poster+`);background-position:center 25%;background-size: cover;border-radius:7px;cursor:pointer;"></div>
                  </a>
                  <span data-type="`+tv+`" data-id="`+id+`" class="`+bookmark+` material-symbols-outlined">delete</span>
                   <div style="width:190px;height:40px;">
                  
                  
                  <p style="width:180px;height:40px;margin: 0px;">`+title+`</p></div> </div>`;
}
function AddPaginationWatched(length){
  let str = ``;
  var add = Number(watched_pag) + 3;
  const minnum = clamp(Number(watched_pag)-2,1,Math.ceil(length/8));
  const maxnum = clamp(Number(watched_pag)+2,1,Math.ceil(length/8));
  //console.log("Min page: "+minnum+" Max page: "+maxnum);
  if(minnum == maxnum)
    return;
  if(watched_pag > 1){
    str += `<a  data-page="1"  class="fisrtpag pag"> << </a>`
    str += `<a  data-page="`+(Number(watched_pag)-1)+`"  class="pag"> < </a>`
  }
  if(minnum > 1){
    str += `<span style='float:left'> ... </span>`
  }
  for (let index = minnum; index <= maxnum; index++) {
    str += `<a  data-page="`+index+`"  class="pag `+(index == watched_pag? 'active':"")+`">`+index+`</a>`;
  }
  
  if(maxnum*8 < length){
    str += `<span style='float:left'> ... </span>`
  }
  if(watched_pag*8 < length){
    str += `<a  data-page="`+(Number(watched_pag)+1)+`"  class="pag"> > </a>`
    str += `<a  data-page="`+Math.ceil(length/8)+`"  class="lastpag pag"> >> </a>`
  }
  paginationwat.innerHTML = str;
  paginationwat.querySelectorAll('.pag').forEach((item,index)=>{
    item.addEventListener("click",function(){
        watched_pag = item.dataset.page;
        watched_body.innerHTML = "";
        paginationwat.innerHTML = "";
        console.log(watched_pag);
        DisplayWatched();
      
    });
  });
}

function DisplayWatched(){
  if(watched == null || watched?.length <= 0){
    watchhistory.style.display = "none";
    //console.log("Nothing to display");
    return;
  }
  watchhistory.style.display = "flex";
  watched_body.innerHTML = "";
  for (let i = (watched_pag-1)*8; i < watched_pag*8; i++) {
    if(i>=watched.length)
      break;
    watched_body.innerHTML += DisplayWatchedItem(
      watched[i].id,
      watched[i].type,
      watched[i].poster,
      "2025",
      (watched[i].type == "movie" ? "Movie" : "S "+watched[i].season),
      "EP "+watched[i].episode,
      watched[i].title,
      "continue-item",
      "HD",
      "delete"
    );
    
  }
   document.querySelectorAll(".continue-item").forEach((item,index)=>{
      item.addEventListener("click",function(){
        const path = item.getAttribute("value");
        movie_id = index;
        ismovie = item.dataset.type;
        tmdb_id = item.dataset.id;
        titleName = item.dataset.title;
        posterPath = item.dataset.poster;
        ep = item.dataset.ep;
        season = item.dataset.season;
        //console.log(ep);
        tooltip.style.display = "none";
        LoadPage(path,tmdb_id);
        
      });
      ShowTooltip(item);
    });
  document.querySelectorAll(".delete").forEach((item,index)=>{
      item.addEventListener("click",function(){
        window.electronAPI.removeWatched(item.dataset.id,item.dataset.type);
      });
    });
    AddPaginationWatched(watched.length);
    clearall_watched.addEventListener("click",()=>{
      confirm_clear.style.backgroundColor = "var(--backgroundCol)";
      confirm_clear.style.border =  "2px solid var(--accentcol)";
      confirm_clear.style.width = "200px";
      confirm_clear.style.height = "100px";
      clear_watched_open = true;
      
    });
    yes_clear.addEventListener("click",()=>{
      window.electronAPI.clearWatched();
      confirm_clear.style.backgroundColor = "rgba(0,0,0,0)";
      confirm_clear.style.border =  "0px solid var(--accentcol)";
        confirm_clear.style.width = "0px";
        confirm_clear.style.height = "0px";
        clear_watched_open = false;
    });
    no_clear.addEventListener("click",()=>{
      confirm_clear.style.backgroundColor = "rgba(0,0,0,0)";
      confirm_clear.style.border =  "0px solid var(--accentcol)";
        confirm_clear.style.width = "0px";
        confirm_clear.style.height = "0px";
        clear_watched_open = false;
    });
}

window.electronAPI.onUpdateWatched((value) => {
  watched = value;
  //console.log(watched);
  DisplayWatched();
});
function NextPrevEpControls(type,seasons,maxseason,id){
  if(conectedEp){
    return;
  }
  
  conectedEp = true;
  prev_ep.addEventListener("click",()=>{
    console.log("S: "+season+" EP: "+ep);
     if(ep == 1){
      season = clamp(Number(season)-1,(seasons[0].name == "Specials" ? 1 : 1),maxseason);
      seasonind.innerText = "Season "+season;
      dropdown.style.display = "none";
      
      ep = 1;
      DisplayEpisodes(id,maxseason);
      ep = seasons[season].episode_count;
      console.log("After S: "+season+" EP: "+ep);

    }else{
      ep = clamp(Number(ep)-1,1,seasons[(seasons[0].name == "Specials" ? season : season-1)].episode_count);

    }
    SelectedServer(tmdb_id,selectedServer,season,ep);
    OnWatch(tmdb_id,ismovie,titleName,season,ep,posterPath);

    frame.style.display = "block";
    play.style.display = "none";
    var current = document.getElementsByClassName("epactive");        
    current[0].className = "eplink ";
    document.getElementsByClassName("eplink")[ep-1].className = "eplink epactive";

    //console.log("S: "+season+" EP: "+ep);
  });

  next_ep.addEventListener("click",()=>{
    console.log("S: "+season+" EP: "+ep);
    if(ep == seasons[(seasons[0].name == "Specials" ? season : season-1)].episode_count){
      season = clamp(Number(season)+1,(seasons[0].name == "Specials" ? 1 : 0),maxseason);
      seasonind.innerText = "Season "+season;
      
      dropdown.style.display = "none";
      
      ep = 1;
      DisplayEpisodes(id,maxseason);
      console.log("After S: "+season+" EP: "+ep);

    }else{
      ep = clamp(Number(ep)+1,1,seasons[(seasons[0].name == "Specials" ? season : season-1)].episode_count);
      
    }
    SelectedServer(tmdb_id,selectedServer,season,ep);
    OnWatch(tmdb_id,ismovie,titleName,season,ep,posterPath);

    frame.style.display = "block";
    play.style.display = "none";
    var current = document.getElementsByClassName("epactive");        
    current[0].className = "eplink ";
    document.getElementsByClassName("eplink")[ep-1].className = "eplink epactive";

    
    
  });
}

function CheckIsBookmarkedPage(id,type){
  
  if(type == "tv"){
    
      for (let i = 0; i < bookmarkes?.tv_id?.length; i++) {
        if(id== bookmarkes.tv_id[i].id){
          add_book.firstElementChild.innerText = "bookmark_remove"
          add_book.children[1].innerText = "Remove from bookmarks";
          break;
        }
      }
    
  }else{
    
      for (let i = 0; i < bookmarkes?.movies_id?.length; i++) {
        if(id== bookmarkes.movies_id[i].id){
          add_book.firstElementChild.innerText = "bookmark_remove"
          add_book.children[1].innerText = "Remove from bookmarks";
          break;
        }
      }
    
  }
  add_book.addEventListener("click",function(){
      console.log("adding to bookmarks");
      alerte.style.display = "block";
      if(add_book.children[1].innerText == "Add to bookmarks"){
        alerte.innerText = "Added to bookmarks";
        add_book.children[1].innerText = "Remove from bookmarks"
      }else{
        alerte.innerText = "Removed from bookmarks";
        add_book.children[1].innerText = "Add to bookmarks"
      }
      setTimeout(function(){
        alerte.style.display = "none";
      },2000);
      AddToBookmarks(tmdb_id,add_book.firstElementChild,ismovie,add_book.dataset.season,add_book.dataset.ep)
    });
}
function CheckForBookmarks(bookclass,item){
  
  //item.addEventListener('mouseenter', () => {
  if(bookclass == ".bookmark"){
    for (let i = 0; i < bookmarkes?.movies_id?.length; i++) {
      if(item.dataset.id == bookmarkes.movies_id[i].id){
        item.innerText = 'bookmark_remove'; 
        //console.log("Found movie");
        return;
      }
      
    }
  }else if(bookclass == ".bookmarktv"){
    for (let i = 0; i < bookmarkes?.tv_id?.length; i++) {
      if(item.dataset.id == bookmarkes.tv_id[i].id){
        item.innerText = 'bookmark_remove'; 
        //console.log("Found tv");
        return;
      }
      
    }
  }
  //console.log("Found nothing "+bookclass);
    item.innerText = 'bookmark_add'; 
//});
}