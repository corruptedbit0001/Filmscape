let loadedColors = false;

function ShowTooltip(item){
  item.addEventListener('mouseover', (event) => {
  const rect = item.parentNode.getBoundingClientRect();

  const xPosition = rect.left; // X-coordinate relative to the viewport
  const yPosition = rect.top;
  const width = rect.width;
  const height = rect.height;
  tooltip.style.display = "block";
  tooltip.style.height = "auto";
  tooltip.style.top = yPosition+"px";
  tooltip.style.left = xPosition+width+300 < window.innerWidth ? xPosition+width+"px" : xPosition-300+"px";
  const  url = 'https://api.themoviedb.org/3/'+item.dataset.type+'/'+item.dataset.id+'?language=en-US';
            
  fetch(url,options)
  .then(res => res.json())
  .then(data => {
    tooltip_title.innerText = data.hasOwnProperty("title")? data.title : data.name;
    tooltip_year.innerText = data.hasOwnProperty("title")?  data.release_date.split("-")[0] : data.first_air_date.split("-")[0];
    tooltip_rating.innerText = data.vote_average;
    tooltip_desc.innerText = data.overview;
    tooltip_country.innerText = data.origin_country;
    tooltip_genre.innerText = "";
    data.genres.forEach(element => {
                  tooltip_genre.innerText += element.name+",";
                });
  });
  
  });
  item.addEventListener('mouseleave', function() {
    tooltip.style.display = "none";
    tooltip.style.height = "0px";
  });
}
function AddOnClickEvent($class,gotolatest){
  document.querySelectorAll($class).forEach((item,index)=>{
  item.addEventListener("click",function(){
    const path = item.getAttribute("value");
    
    movie_id = index;
    ismovie = item.dataset.type;
    titleName = item.dataset.title;
    posterPath = item.dataset.poster;
    isTrend = true;
    tmdb_id = item.dataset.id;
    imdb_id = item.dataset.imdbid;
    if(gotolatest){
      ep = item.dataset.ep;
      season = item.dataset.season;
    } 
    apiUrl = "https://api.2embed.cc/trending?time_window=day&page=1";
    tooltip.style.display = "none";
    LoadPage(path,tmdb_id);
    //console.log("Movie ind: "+data['results'][index].title);

    });
    ShowTooltip(item);
  });
              
}
function AddOnClickBookmarkEvent(bookclass,tv){
  document.querySelectorAll(bookclass).forEach((item,index)=>{
  item.addEventListener("click",function(){
    console.log("Adding removing bookmarks");
    alerte.style.display = "block";
    if(item.innerText == "bookmark_add")
    alerte.innerText = "Added to bookmarks";
    else
      alerte.innerText = "Removed from bookmarks";
    setTimeout(function(){
      alerte.style.display = "none";
    },2000);
    AddToBookmarks(item.dataset.id,item,tv,item.dataset.season,item.dataset.ep);
  });
  
    CheckForBookmarks(bookclass,item);
  
});
}

function DisplayMovieTvItem(id,tv, poster,year,season,ep,title,aclass,quality,bookmark,imdb_id = 1){
  return `<div class="item-block" >
                  <div class="quality">`+quality+`</div>                  
                  <a data-title="`+title+`" data-poster="`+poster+`" data-season="`+(season.split(" ")[1])+`" data-ep="`+ep.split(" ")[1]+`" data-imdbid="`+imdb_id+`" data-id="`+id+`" data-type="`+tv+`"  class="link-item `+aclass+`" value="watchpage" >
                  <img width="190px" height="255px" value="watchpage" src="`+poster+`">
                  </a>
                  <span data-id="`+id+`" data-season="`+(season.split(" ")[1])+`" data-ep="`+ep.split(" ")[1]+`" class="`+bookmark+` material-symbols-outlined">bookmark</span>
                   <div style="width:190px;height:40px;">
                  
                  <div id="meta">
                    <span>`+year+`</span>
                    <span class="type">`+season+`</span>
                    <span class="epid" style="text-align: right">`+ep+`</span>
                  <div>
                  <p style="width:180px;height:40px;margin: 0px;">`+title+`</p></div> </div>`;
}

function AddToBookmarks(id,item,type,season,ep){
  if(id == "undefined"){
    console.log("Undefined ID");
    return;
  }
  console.log("Adding removing bookmarks "+id);
              
  item.innerText = "bookmark_added";
  window.electronAPI.AddToBookmark(id,type,season,ep);
  
}
function SetBookmarked(){

}
async function DisplayLatestItems(data){
  for (let i = 0; i < 10; i++) {
               const  url2 = 'https://api.themoviedb.org/3/'+data[i].type+'/'+data[i].tmdbid+'?language=en-US';
            
                await fetch(url2,options)
                .then(res => res.json())
                .then(data2 => {
                    let ls = (data2.last_episode_to_air ? data2.last_episode_to_air.season_number : 1);
                    let le = (data2.last_episode_to_air ? data2.last_episode_to_air.episode_number : 1);
                    latestlist.innerHTML += `<a data-title="`+data[i].orig_title+`" data-poster="https://image.tmdb.org/t/p/w600_and_h900_bestv2/`+data2.poster_path+`" value="watchpage" data-ep="`+(data2.hasOwnProperty("last_episode_to_air") ?le:1)+`" 
                    data-season="`+(data2.hasOwnProperty("last_episode_to_air") ?ls:1)+`" 
                    data-type="`+data[i].type+`" data-id="`+data[i].tmdbid+`" class="last-upload"><li>
                    <img width="40" height="50" style="position:relative;float:left;" src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/`+data2.poster_path+`">
                    <span>`+(data[i].type == "tv" ? "TV":"Movie")+` / </span>
                    <span>`+(data2.hasOwnProperty("last_episode_to_air") ? "SS "+ls : data2.release_date.split("-")[0])+` / </span>
                    <span>`+(data2.hasOwnProperty("last_episode_to_air") ? "EP "+le : data2.runtime+" min")+`</span>
                    <p>`+data[i].orig_title+`</p></li></a>`;
                });
                
                
              }
              document.querySelectorAll(".last-upload").forEach((item,index)=>{
                  
              item.addEventListener("click",function(){
                const path = item.getAttribute("value");
                console.log("Latest Upload click");
                movie_id = index;
                ismovie = item.dataset.type;
                vidsrc = "tv";
                isTrend = true;
                tmdb_id = item.dataset.id;
                titleName = item.dataset.title;
                posterPath = item.dataset.poster;
                ep = item.dataset.ep;
                season = item.dataset.season;
                apiUrl = "https://api.2embed.cc/trending?time_window=day&page=1";
                LoadPage(path,tmdb_id);
                //console.log("Movie ind: "+data['results'][index].title);

                });
              });
}

function DisplayLatestUpload(){
  const url = "https://moviesapi.to/api/discover/tv?direction=desc&page=1&ordering=last_upload_date";
  fetch(url,options)
            .then(res => res.json())
            .then(data => {
              const url2 = "https://moviesapi.to/api/discover/movie?direction=desc&page=1&ordering=last_upload_date";
              fetch(url2,options)
                .then(res => res.json())
                .then(data2 => {
                  let data3 = [];
                  
                  data3 = data['data'].concat(data2['data']);
                  data3.sort((a, b)=>{ return  b.last_update.localeCompare(a.last_update) });
                  DisplayLatestItems(data3);
                });
                
            }).then(function(){
              
            });
            
}
function LoadQualitydata() {
  console.log("loading Quality data");
  document.querySelectorAll(".link-item").forEach((item,index)=>{
  const url2 = "https://moviesapi.to/api/discover/movie?direction=desc&page=1&imdb_id="+item.dataset.imdbid;
                fetch(url2)
                .then(res => res.json())
                .then(data3 => {
                  if(data3){
                    if(data3.result){
                      item.parentElement.firstElementChild.innerHTML = data3.data[0]?.quality?.split("|")[0];
                      //console.log(item.parentElement.firstElementChild.innerHTML);
                    }
                  }
                  //console.log((data3.result ?data3.data[0].quality :"not found"));
                  
                });
  });
}

async function DisplayTrendingMovies(data){
  for(let i= 0; i < data['results'].length;i++){
            url = 'https://api.themoviedb.org/3/movie/'+data['results'][i].id+'?language=en-US';
            
            await  fetch(url,options)
            .then(res => res.json())
            .then(data2 => {
              
              if(data2){
                trendingMovies.innerHTML += DisplayMovieTvItem(
                    data['results'][i].id,
                    (data['results'][i].hasOwnProperty('name') ? "tv":"movie"),
                    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+data['results'][i]?.poster_path,
                    data2.release_date?.split('-')[0],
                    "Movie",
                    data2.runtime+" min",
                    data2.title,
                    "",
                    "HD",//(data3.result ? data3.data[0].quality.split("|")[0] : "HD"),
                    "bookmark",
                    data2.imdb_id
                  );
                
                  
              }
            })
          }
          AddOnClickEvent(".link-item");
          AddOnClickBookmarkEvent(".bookmark","movie")
          LoadQualitydata();
}
async function DisplayTrendingTVShows(data) {
  for(let i= 0; i < data['results'].length;i++){
            url = 'https://api.themoviedb.org/3/tv/'+data['results'][i].id+'?language=en-US';
            await fetch(url,options)
            .then(res => res.json())
            .then(data2 => {
              
              if(data2){ 
               trendingTV.innerHTML += DisplayMovieTvItem(
                    data['results'][i].id,
                    (data['results'][i].hasOwnProperty('name') ? "tv":"movie"),
                    (data['results'][i].poster_path == null? "./images/error-img.png" :'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+data['results'][i].poster_path),
                    data2.first_air_date.split('-')[0],
                    (data2.last_episode_to_air ? 'SS '+data2.last_episode_to_air?.season_number :"SS "+1),
                    (data2.last_episode_to_air ?'EP '+data2.last_episode_to_air?.episode_number :"EP "+0),
                    data['results'][i].name,
                    "link-tv",
                    "TV",
                    "bookmarktv"
                  );
             
                }
            }).then(()=>{
                
                  
                }
            );
          }
          
          AddOnClickEvent(".link-tv");
          AddOnClickBookmarkEvent(".bookmarktv","tv");
}

function DisplayHome(){
  if(!loadedColors)
    window.electronAPI.requestColors();
  if(!bookmarkes)
    window.electronAPI.requestBookmarks();
  if(!watched)
    window.electronAPI.requestWatched();
  else
    DisplayWatched();
  
  mainbody.scrollTo(0, 0)
  apiUrl = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
  fetch(apiUrl,options)
      .then(res => res.json())
      .then(data => {
        if (data) {
          console.log("Displaying homepage");
          DisplayTrendingMovies(data);
          
          }
      });
      apiUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
      let dt;

      fetch(apiUrl,options)
      .then(res => res.json())
      .then(data => {
        if (data) {
          dt = data;
          console.log("Displaying homepage");
          DisplayTrendingTVShows(data);
          
          }
      })
      
      DisplayLatestUpload();
      GetAppVersion();
}