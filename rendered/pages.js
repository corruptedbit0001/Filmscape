
let movie_id = 0;
let tmdb_id = 0;
let imdb_id = 0;
let ismovie = "movie";
let vidsrc = "movies";
let isTrend = true; 
let searchname = "";
let ep = 1;
let season = 1;
let titleName = "";
let posterPath = "";
let selectedServer = "videasy";
let history = ["homepage"];
let currenth = 0;
let data;
let currentpage = "";

let apiUrl = 'https://vidsrc.xyz/movies/latest/page-1.json'; 
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGJkYjYyN2YzZDhhOWExMTIwNzNiZWJmYzYyOGJjNCIsIm5iZiI6MTc1Njk5MTkwMS45MzEsInN1YiI6IjY4Yjk5MTlkNDUzZjI4OThhNjFiYjc0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KkMM9_Qcctl6xEGyfJfVlmk-obz8ruxmrUtZJxf2Hw8'
  }
};
      
window.addEventListener('mousedown', function(event) {
    if (event.button === 3) {
        console.log('Browser Back button clicked!');
        if(history.length > 1){
          currenth = (currenth-1) <0 ? 0 : currenth-1;
          LoadPage(history[currenth],"",true);
          console.log(history);
          console.log("onbck "+currenth);
        }
    }
    if (event.button === 4) {
        console.log('Browser Fwrd button clicked!');
        if(history.length > 1){
          currenth = (currenth+1) > history.length-1 ? history.length-1 : currenth+1;
          LoadPage(history[currenth],"",true);
          console.log(history);
        }
    }
});


function AddToHistory($path){
  for (let i = currenth+1; i < history.length; i++) {
      history.pop();
    }
  if(history.length >= 1 && history[history.length-1] != $path ){
    
    history.push($path);
    currenth++;
  }
  
}

console.log('main pages');
LoadPage("homepage");
search.addEventListener("keypress", function(event) {
      if(event.key === "Enter"){
        event.preventDefault();
        LoadPage("searchpage");
        searchname = search.value;
        console.log("enter pressed!");
      }
  });

document.querySelectorAll(".menu-item").forEach((item,index)=>{
  if(index == 0 || index == 5)
    return;
  item.addEventListener("click",function(){
    const path = item.getAttribute("value");
    LoadPage(path);

  });
});
function LoadPage($path,emburl,fromh = false){
    console.log("loading "+$path);
    currentpage = $path;
    if(!fromh)
    AddToHistory($path);
  const container = document.getElementById("content");
  const request = new XMLHttpRequest();
  request.open("GET","pages/"+$path+".html");
  request.send();
  request.onload = function(){
    if(request.status == 200){
      container.innerHTML = request.responseText;
      if($path == "moviespage"){
        page = 1;
        ep = 1;
        season = 1;
        tvlistener = false;
        DisplayMoviesGrid();
      }else if($path == "tvshowspage"){
        page = 1;
        ep = 1;
        season = 1;
        tvlistener = false;
        DisplayTvGrid();
      }else if($path == "homepage"){
        ep = 1;
        season = 1;
        DisplayHome();
      }else if($path =="watchpage"){
        dropdownBtn.addEventListener("click",function(){
          if(dropdown.style.display == "none"){
            dropdown.style.display = "block";
          }else{
            dropdown.style.display = "none";
          }
        });
        play.addEventListener("click",function(){
          this.style.display = "none";
          frame.style.display = "block";
          OnWatch(tmdb_id,ismovie,titleName,season,ep,posterPath);
          SelectedServer(tmdb_id,selectedServer,season,ep);
        });
        // ep = 1;
        // season = 1;
        CheckIsBookmarkedPage(tmdb_id,ismovie);
        conectedEp = false;
        DisplayData(emburl);
      }else if($path == "searchpage"){
        page = 1;
        ep = 1;
        season = 1;
        DisplaySearch();
      }else if($path == "bookmarkpage"){
        ep = 1;
        season = 1;
        DisplayBookmarks();
      }
    
    }
  }
}




async function fetchAndParseJson(url) {
  try {
    const response = await fetch(url); // Make the HTTP request
    if (!response.ok) { // Check if the request was successful (status code 200-299)
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json(); // Parse the JSON data from the response
    return jsonData;
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
    return null; // Handle errors gracefully
  }
}




